# Chat App Product and Frontend Plan

## Product goal

Build a mobile-first chat application where people can message only after following one another, keep group membership opt-in, and independently choose which optional sections appear. The first release is a frontend prototype using Next.js, Tailwind CSS, and JavaScript. It uses local mock data and does not connect to a backend.

## Product scope

The app has three core areas: **Chats**, **Groups**, and **Stories**. **Events** is an additional optional area requested for this app. Chats cannot be disabled. Stories, Groups, and Events can each be hidden from Settings. If Chats is the only enabled area, hide the section navigation entirely. If any optional area is enabled, show navigation for the enabled sections.

### Chats

- One-to-one conversations are separate from Groups in both navigation and data model.
- Account lookup uses username; account registration and login use a verified phone number plus a unique username.
- A direct conversation can be started only when both users follow each other. Show follow state and a clear pending/blocked state where relevant.
- Support text, Unicode emoji, emoji reactions, and links from approved Twitter/X, YouTube, Google, and Meta platform domains only. Do not support photos or other file uploads in the first release.
- Every message offers **Delete for me** and **Delete for everyone**, subject to server authorization and retention rules. The UI must make the scope of deletion explicit.
- Profiles show username initials in a colored circle instead of a profile picture, plus a user-written About section.

### Groups

- Groups have their own list and their own conversations; never mix them into the Chats list.
- A user cannot be directly added to a group without consent. Group membership starts with a request visible at the top of the Groups area, with accept and decline actions modeled on social follow-request inboxes.
- A setting to disable Groups prevents the user from being added or sent group requests. Re-enabling restores the Groups section and permits new requests.
- Group creation and invite controls must respect every prospective member's preference and never bypass acceptance.
- Group messages support text, emoji, reactions, and approved links only. No photos in this release.

### Stories

- Stories are an optional section that can be hidden entirely in Settings.
- Story viewing and audience privacy controls should be represented in the product design; story media publishing is outside the photo-free first release and needs a later decision about text-only stories.
- Hiding Stories is a user-interface preference; it does not delete the account's story data or change other users' visibility settings.

### Events

- Events are an optional section in the navigation and can be hidden from Settings.
- Users can create an event with a title, details, start/end date and time, and optional location text.
- Events appear in a vertically scrolling list, ordered by start time, with event detail and RSVP affordances in the future UI/API design.

### Settings and privacy

- Provide section visibility controls for Stories, Groups, and Events. Chats stays enabled and cannot be removed.
- Group preferences include a master disable control. Disabled Groups means no membership, invitations, or pending group request can be accepted until the user re-enables the section; requests should not be silently accepted.
- Include profile About editing, username, phone verification state, and account privacy entry points.
- Persist display preferences locally in the frontend prototype; the backend plan specifies eventual account persistence.

## Navigation and responsive behavior

- Mobile-first single-column layouts with comfortable tap targets and a fixed bottom section bar when at least one optional section is enabled.
- When only Chats is enabled, remove the section bar and let Chats occupy the full app shell.
- On wider screens, use a responsive app shell with a section rail and a conversation/detail pane.
- Keep group requests visually prominent at the top of Groups, with a pending count and accept/decline actions.

## Proposed frontend structure

```text
frontend/
  app/
    globals.css
    layout.js
    page.js
  components/
    app-shell.js
    chat-panel.js
    groups-panel.js
    stories-panel.js
    events-panel.js
    settings-panel.js
  lib/
    mock-data.js
    preferences.js
  package.json
  postcss.config.js
  tailwind.config.js
  AGENT.md
backend/
  backend_plan.md
```

## Frontend draft acceptance criteria

- Next.js app starts with `npm run dev` and uses JavaScript and Tailwind CSS.
- Chats, Groups, and Stories are distinct sections; Events is optional.
- Settings can hide/show each optional section, cannot disable Chats, and the navbar disappears when Chats is the only enabled section.
- Groups shows pending membership requests above group conversations; request accept/decline, group disable, text sending, emoji selection/reactions, message deletion choices, and event creation are demonstrable with mock state.
- Use initials avatars only; no photo upload or photo rendering.
- Render profile About, responsive mobile layouts, and link-domain allowlist behavior in the interface.

## Documentation basis

The design borrows interaction patterns, not branding or implementation, from official WhatsApp and Telegram materials:

- WhatsApp documents group privacy settings that control who can add a user and a private invitation fallback: [WhatsApp group privacy settings](https://faq.whatsapp.com/1131457590844955/?cms_platform=web&locale=ml_IN).
- WhatsApp documents audience controls for Status and profile/About privacy: [WhatsApp privacy settings](https://faq.whatsapp.com/3307102709559968/?cms_platform=web&query=harga+tingkat+produsen) and [Status privacy](https://faq.whatsapp.com/502161774931737/?cms_platform=windows-desktop&helpref=platform_switcher).
- Telegram documents story-specific audience choices and expiry options: [Telegram Stories](https://telegram.org/tour/stories).
- Telegram documents private group invite links that can require administrator approval: [Telegram invite links and join requests](https://core.telegram.org/api/invites).
- Telegram's API distinguishes deleting a message just locally from revoking it for chat participants: [Telegram deleteMessages API](https://core.telegram.org/method/messages.deleteMessages).
- Telegram's FAQ describes usernames as a way to find users without exposing phone numbers: [Telegram FAQ](https://telegram.org/faq/).

These sources document existing platform features. Mutual-follow gating, a dedicated group-request inbox, configurable sections, and Events are product requirements for this app, not claims about WhatsApp or Telegram. Events and RSVP policy require product decisions beyond the requested frontend draft.

## Deferred beyond this frontend draft

- Backend services, phone OTP delivery, sessions, follow graph, conversation persistence, push notifications, and abuse prevention.
- Photo/media upload, voice/video calls, channels, bots, end-to-end encryption design, and production moderation tooling.
- Final decision on story content format while photo support is excluded.
- Event invitation audience, RSVP states, timezone handling, and reminders.
