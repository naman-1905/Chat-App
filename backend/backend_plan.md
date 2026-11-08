# Backend API Plan

API contract proposal for a later backend implementation. The current frontend is mock-data only and does not call these endpoints. Use JSON over HTTPS under `/api/v1`; authenticate with short-lived access tokens and refresh-token rotation. Phone numbers must be verified through OTP before account creation or number change. Never return another user's phone number in ordinary profile, follow, chat, group, story, or event payloads.

## Conventions

- `Authorization: Bearer <access_token>` on authenticated endpoints.
- IDs are opaque strings. Timestamps use ISO 8601 UTC; clients provide IANA timezone IDs for event creation/display context.
- Paginated list response: `{ "items": [], "nextCursor": "opaque|null" }`.
- Error response: `{ "error": { "code": "STABLE_CODE", "message": "Human-readable summary", "details": {} } }`.
- Validate request bodies and enforce all authorization, follow, group-consent, and link-host rules server-side. Client validation is only convenience.
- Mutations that clients may retry accept an `Idempotency-Key` header.
- Resource updates return canonical resource state and may emit real-time events through the future WebSocket/SSE channel.

## Authentication and accounts

### `POST /auth/phone/otp`

Request `{ "phoneNumber": "+14155550123" }`. Normalize to E.164, rate-limit by IP/number/device, and return `{ "challengeId": "...", "expiresAt": "...", "retryAfterSeconds": 30 }`. Do not reveal whether an account already exists.

### `POST /auth/phone/verify`

Request `{ "challengeId": "...", "code": "123456", "username": "jordanlee", "displayName": "Jordan Lee" }`. For first registration, username and display name are required. For login, omit account fields. Return `{ "accessToken": "...", "expiresAt": "...", "refreshToken": "...", "user": { ...publicProfile, "phoneVerified": true } }`. Enforce username syntax/uniqueness and one-time challenge use.

### `POST /auth/refresh`, `POST /auth/logout`

Refresh rotates tokens and invalidates the used refresh token. Logout revokes the active refresh-token family. Both require appropriate refresh/session credentials.

### `GET /users/me`, `PATCH /users/me`

Read or update `{ "username": "...", "displayName": "...", "about": "..." }`. Phone change uses OTP flow; do not allow setting an unverified number. No profile picture field in the initial version.

### `GET /users/search?username=...`

Exact/prefix username search, authenticated, paginated and rate-limited. Return only `{ id, username, displayName, initials, about, followState }`; never expose phone numbers.

### `GET /users/:userId`

Return public profile fields and follow state, honoring block and profile visibility rules. Return 404 for inaccessible/unknown users to avoid enumeration.

## Following and direct-message eligibility

### `POST /users/:userId/follow`, `DELETE /users/:userId/follow`

Create/remove current user's follow edge. Following is distinct from mutual follow; either direction changing away from mutual immediately prevents new direct messages. Return `{ "followState": "following|mutual|not_following", "canMessage": true }`.

### `GET /users/me/follow-requests`

Reserved if the product later makes follows private. Initial requested design has direct follows; mutuality is required before messaging. If private follow requests are enabled, add `POST /users/me/follow-requests/:requestId/accept` and `/decline`.

### `GET /users/me/following`, `GET /users/me/followers`

Paginated lists with minimal public profile data and current relationship state.

## Direct conversations and messages

### `GET /conversations`

List direct conversations only; group conversations are never included. Support `?cursor=&limit=&unreadOnly=`. Return conversation id, peer profile summary, latest message summary, unread count, and update timestamp.

### `POST /conversations`

Request `{ "peerUserId": "..." }`. Require the peer and caller to mutually follow, neither blocked, and neither account restricted. Return existing or newly created direct conversation. Otherwise return `403 MUTUAL_FOLLOW_REQUIRED` or an appropriately privacy-preserving `404`.

### `GET /conversations/:conversationId/messages`

Require membership; cursor-paginated newest/older messages. A message representation includes `{ id, senderId, body, linkHosts, createdAt, editedAt, reactions, deletedForEveryone, clientMessageId }`. Filter messages deleted for current user.

### `POST /conversations/:conversationId/messages`

Request `{ "clientMessageId": "uuid", "body": "..." }`. Require mutual follow at send time, validate Unicode text length and extract links. Reject links whose normalized hostname is not an exact allowed domain or its subdomain: `x.com`, `twitter.com`, `youtu.be`, `youtube.com`, `google.com`, `google.co.in`, `facebook.com`, `instagram.com`, `threads.net`, `whatsapp.com`, `meta.com`. Reject `javascript:`, credentials, malformed URLs, and lookalike domains. Do not fetch/preview URLs synchronously; a future safe preview worker must defend against SSRF. Return canonical message and delivery status.

### `DELETE /conversations/:conversationId/messages/:messageId`

Request `{ "scope": "me" | "everyone" }`. `me` creates a per-user tombstone; `everyone` deletes/tombstones for all participants, validates sender/role and a product-defined time window, and emits deletion event. Idempotent. Return `{ "messageId": "...", "scope": "...", "deletedAt": "..." }`. The frontend presents both scopes only for the current user's own messages; backend remains authoritative.

### `PUT /conversations/:conversationId/messages/:messageId/reactions/:emoji`, `DELETE .../reactions/:emoji`

Add/remove one current-user reaction per emoji/message. Validate emoji against Unicode emoji policy; require conversation membership and a live message. Return updated reaction summary.

## Groups and explicit consent

### `GET /groups`

List groups the current user has joined only. Does not include direct conversations. If account preference disables groups, return an empty list and `groupsEnabled: false`.

### `POST /groups`

Request `{ "name": "...", "about": "..." }`; creator becomes first member/admin. Initial creation does not silently add invitees.

### `GET /groups/:groupId`, `GET /groups/:groupId/messages`

Require active membership. Return group profile/member summaries and cursor-paginated messages.

### `POST /groups/:groupId/invitations`

Admin request `{ "userIds": ["..."] }`. Create pending join requests for each eligible user; never directly add them. Respect each recipient's disabled-groups preference, block settings, and rate limits. Return per-recipient status without leaking sensitive information.

### `GET /groups/me/requests`

Return incoming pending requests sorted newest first, for the top-of-Groups request area. Include request id, group summary, inviter summary, createdAt, and expiryAt. If groups are disabled, return no actionable requests (with disabled state in `/users/me/preferences`).

### `POST /groups/me/requests/:requestId/accept`, `POST /groups/me/requests/:requestId/decline`

Accept atomically checks request is pending, not expired, groups still enabled, and the user is not blocked/banned; then creates membership. Decline marks it closed. Repeating either action is idempotent and returns current state. No endpoint may accept on behalf of the recipient without their authenticated action.

### `GET /groups/:groupId/requests`, `POST /groups/:groupId/requests/:requestId/approve`, `POST /groups/:groupId/requests/:requestId/decline`

Admin-side management of users' requests to join through a shareable invitation. Approval adds membership; decline does not. Keep this separate from incoming invitations because consent direction differs.

### `POST /groups/:groupId/leave`

Current member leaves. Ensure a remaining admin/owner or transfer ownership rules before removing the last owner.

### `GET /groups/:groupId/messages`, `POST /groups/:groupId/messages`, `DELETE /groups/:groupId/messages/:messageId`, reaction routes

Same message fields, content/link validation, deletion scopes and reaction semantics as direct chats; require current membership and group permissions. No image/media payload support in initial version.

## Stories

Stories are optional at the client, but API access remains governed by account state and audience rules.

### `GET /stories/feed?cursor=`

Return active text-only stories from eligible mutual-follow users, filtered by author audience and viewer blocks. Story `{ id, author, text, createdAt, expiresAt, reactionSummary }`.

### `POST /stories`

Request `{ "text": "...", "audience": "mutuals|selected", "userIds": [], "expiresAt": "..." }`. First release accepts text only; reject media fields. Validate audience, selected user relationships, and expiry range (product default 24 hours).

### `GET /stories/:storyId`, `DELETE /stories/:storyId`

Read only when authorized by audience rules; author can delete own story.

### `PUT /stories/:storyId/reactions/:emoji`, `DELETE .../reactions/:emoji`

Optional story reaction; use same emoji validation.

## Events

### `GET /events?from=&to=&cursor=`

List events visible to the user, sorted by start time ascending. Initial policy should limit event discovery to events created by mutual follows or explicitly shared with the user; avoid public global discovery until a privacy model is chosen.

### `POST /events`

Request `{ "title": "...", "details": "...", "startsAt": "...", "endsAt": "...", "timezone": "Asia/Kolkata", "locationText": "...", "visibility": "mutuals|selected", "inviteeIds": [] }`. Validate title, date ordering, timezone, location length, visibility, and invitee eligibility. No location coordinates in initial version.

### `GET /events/:eventId`, `PATCH /events/:eventId`, `DELETE /events/:eventId`

Owner can read/edit/cancel. Guests can read only if invited or visibility allows; edits return canonical fields and update timestamp. Cancellation should preserve a cancelled record for invitees rather than silently removing it.

### `PUT /events/:eventId/rsvp`, `DELETE /events/:eventId/rsvp`

Request `{ "status": "going|interested|declined" }`; only visible invitees can respond. Return RSVP state and aggregate counts, not an unrestricted attendee list.

## Preferences and notifications

### `GET /users/me/preferences`, `PATCH /users/me/preferences`

Preference schema: `{ "sections": { "chats": true, "groups": true, "stories": true, "events": true }, "groupsEnabled": true, "storyAudienceDefault": "mutuals" }`. Server rejects `sections.chats: false`. Setting `groupsEnabled: false` also forces `sections.groups: false`, prevents new requests/invitations, and prevents pending invites from acceptance; preserve pending records for audit but return no actionable requests. Re-enabling does not auto-accept prior requests.

### `GET /notifications`, `PATCH /notifications/:notificationId/read`

Paginated group request, message, reaction, story, and event notification inbox. Suppress notifications for disabled/hidden sections according to documented preference policy.

## Realtime events (future)

Authenticated WebSocket or SSE channel emits `message.created`, `message.deleted`, `message.reaction_changed`, `follow.changed`, `group.request_created`, `group.request_resolved`, `group.member_joined`, `preferences.changed`, `story.created`, `story.expired`, `event.updated`, and `event.rsvp_changed`. Re-check authorization at subscription and event delivery; do not send message bodies to non-members or hidden/deleted resources.

## Security, abuse, and operational requirements

- Rate-limit OTP, username search, follows, message creation, group requests, story creation, event invitations, and reactions. Add per-account and per-device abuse signals and block/report endpoints before public launch.
- Normalize phone numbers and usernames; enforce unique username and prevent enumeration by response shape and rate limits.
- Check mutual-follow and group membership at every relevant write, not just conversation creation.
- Treat group requests as consent records with actor, recipient, expiry, state transitions, and audit timestamps.
- Link allowlisting must parse/normalize URLs on the server; use exact hostname boundaries and never render untrusted HTML.
- Encrypt transport and sensitive stored data, protect OTP secrets, hash refresh tokens, define retention/deletion behavior, and audit privileged moderation actions.
- Define account deletion and export APIs before production. Backend must clarify deletion-for-everyone window and tombstone retention, story expiry, event visibility, timezones, and RSVP visibility before implementation.
