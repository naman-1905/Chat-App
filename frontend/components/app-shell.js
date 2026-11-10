"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  Compass,
  Hash,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  Settings2,
  Pencil,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {
  emojiOptions,
  initialConversations,
  initialEvents,
  initialGroups,
  initialRequests,
  initials,
  isAllowedLink,
  people,
  stories,
} from "../lib/mock-data";

const sections = [
  { id: "chats", label: "Chats", icon: MessageCircle },
  { id: "groups", label: "Groups", icon: Users },
  { id: "stories", label: "Stories", icon: Sparkles },
  { id: "events", label: "Events", icon: CalendarDays },
];

function Avatar({ name, color = "bg-[#e2e7df]", size = "md", ring = false }) {
  const sizing =
    size === "lg"
      ? "h-14 w-14 text-base"
      : size === "sm"
        ? "h-9 w-9 text-[11px]"
        : "h-11 w-11 text-xs";
  return (
    <div
      className={`${sizing} ${color} ${ring ? "ring-2 ring-white outline outline-1 outline-moss/30" : ""} flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide text-[#35423a]`}
    >
      {initials(name)}
    </div>
  );
}

function IconButton({ children, label, onClick, className = "" }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#6e7770] transition hover:bg-paper hover:text-ink ${className}`}
    >
      {children}
    </button>
  );
}

function SectionNav({ active, setActive, enabled, requestsCount }) {
  const visible = sections.filter((section) => enabled[section.id]);
  if (visible.length <= 1) return null;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-line bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur md:static md:flex-col md:items-stretch md:justify-start md:gap-2 md:border-0 md:bg-transparent md:px-0 md:py-8">
      {visible.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActive(id)}
          className={`relative flex min-w-[64px] flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[10px] font-medium transition md:w-full md:flex-row md:gap-3 md:px-4 md:py-3 md:text-sm ${active === id ? "bg-[var(--accent)]/35 text-ink" : "bg-transparent text-[#858d86] hover:bg-[var(--accent)]/20 hover:text-ink"}`}
        >
          <span className="relative">
            <Icon
              size={19}
              strokeWidth={active === id ? 2.5 : 1.8}
              fill={active === id ? "var(--accent)" : "none"}
              style={active === id ? { color: "var(--accent)" } : undefined}
            />
            {id === "groups" && requestsCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[#d77b59] px-1 text-[9px] font-bold text-white">
                {requestsCount}
              </span>
            )}
          </span>
          <span>{label}</span>
          {id === "groups" && requestsCount > 0 && (
            <span className="ml-auto hidden rounded-full bg-[#f3e4dc] px-2 py-0.5 text-[10px] text-[#aa6042] md:inline">
              {requestsCount}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}

function Header({ title, onSettings, right, logo = false }) {
  return (
    <header className="flex items-center justify-between border-b border-line px-5 py-4 md:px-7 md:py-5">
      <div
        className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--accent)] text-ink"
        aria-label="Common"
      >
        <MessageCircle size={20} fill="currentColor" />
      </div>
      <div className="flex items-center gap-1">
        {right}
        <IconButton label="Settings" onClick={onSettings}>
          <Settings2 size={19} />
        </IconButton>
      </div>
    </header>
  );
}

function ChatList({ conversations, selected, onSelect, onNewChat }) {
  const [query, setQuery] = useState("");
  const ordered = [...conversations];
  return (
    <aside
      className={`flex h-full min-h-0 flex-col border-r border-line bg-white md:w-[340px] lg:w-[370px] ${selected ? "hidden md:flex" : "flex"}`}
    >
      <div className="border-b border-line px-5 pb-4 pt-6 md:px-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
        </div>
        <label className="flex h-10 items-center gap-2.5 rounded-xl bg-paper px-3.5 text-[#9aa19a]">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conversations"
            className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-[#a7ada7]"
          />
        </label>
      </div>
      <div className="scrollbar-none flex-1 overflow-y-auto px-3 py-2">
        {ordered
          .filter((item) => {
            const person = people.find((p) => p.id === item.personId);
            return `${person.name} ${person.username} ${item.last}`
              .toLowerCase()
              .includes(query.toLowerCase());
          })
          .map((conversation) => {
            const person = people.find((p) => p.id === conversation.personId);
            return (
              <button
                key={conversation.id}
                onClick={() => onSelect(conversation.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-200 hover:bg-[var(--accent)] hover:translate-x-1 ${selected === conversation.id ? "bg-[var(--accent)]" : ""}`}
              >
                <div className="relative">
                  <Avatar name={person.name} color={person.color} />
                  {person.active && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[var(--accent)]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13px] font-semibold">
                      {person.name}
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {conversation.unread > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-semibold text-ink">
                        {conversation.unread || ""}
                      </span>}
                <span className="text-[10px] text-[#a3aaa3]">{conversation.time}</span>
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[11px] text-[#899189]">
                    {conversation.last}
                  </p>
                </div>
              </button>
            );
          })}
      </div>
    </aside>
  );
}

function MessageBubble({ message, onDelete, onReact, linkPermissions }) {
  const [menu, setMenu] = useState(false);
  const link = message.text.match(/https?:\/\/\S+/)?.[0];
  const validLink = link && isAllowedLink(link, linkPermissions);
  return (
    <div
      className={`group relative flex ${message.mine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-[86%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-[0_2px_10px_rgba(40,50,40,.035)] md:max-w-[72%] ${message.mine ? "rounded-br-md bg-[var(--accent)] text-ink" : "rounded-bl-md border border-line bg-white text-[#333d36]"}`}
      >
        <p className="whitespace-pre-wrap break-words">
          {message.text.split(/(https?:\/\/\S+)/).map((part, i) =>
            part.startsWith("http") ? (
              <a
                key={i}
                href={isAllowedLink(part, linkPermissions) ? part : undefined}
                onClick={(event) => {
                  if (!isAllowedLink(part, linkPermissions)) event.preventDefault();
                }}
                target="_blank"
                rel="noreferrer"
                className={
                  isAllowedLink(part, linkPermissions)
                    ? "underline decoration-white/50 underline-offset-2"
                    : "cursor-not-allowed opacity-60"
                }
              >
                {part}
              </a>
            ) : (
              part
            ),
          )}
        </p>
        {link && (
          <div
            className={`mt-2 rounded-xl px-3 py-2 text-[10px] ${message.mine ? "bg-white/10 text-white/80" : "bg-paper text-[#78827a]"}`}
          >
            {validLink
              ? "Approved link · preview hidden"
              : "Link blocked · domain not supported"}
          </div>
        )}
        <div
          className={`mt-1 text-right text-[9px] ${message.mine ? "text-white/55" : "text-[#afb5af]"}`}
        >
          {message.time}
        </div>
        {message.reaction && (
          <span className="absolute -bottom-3 right-2 rounded-full border border-line bg-white px-1.5 py-0.5 text-xs shadow-sm">
            {message.reaction}
          </span>
        )}
        <button
          onClick={() => setMenu(!menu)}
          aria-label="Message actions"
          className={`absolute -top-3 ${message.mine ? "-left-9" : "-right-9"} hidden h-7 w-7 place-items-center rounded-full bg-white text-[#879087] shadow-soft group-hover:grid`}
        >
          <MoreHorizontal size={15} />
        </button>
        {menu && (
          <div
            className={`absolute top-6 z-10 w-48 rounded-2xl border border-line bg-white p-2 text-xs shadow-soft ${message.mine ? "right-0" : "left-0"}`}
          >
            <p className="px-2 pb-1 text-[10px] text-[#a0a79f]">React</p>
            <div className="flex flex-wrap gap-1 px-1 pb-2">
              {emojiOptions.slice(0, 8).map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact(message.id, emoji);
                    setMenu(false);
                  }}
                  className="rounded-lg p-1 text-base hover:bg-paper"
                >
                  {emoji}
                </button>
              ))}
            </div>
            {message.mine && (
              <>
                <button
                  onClick={() => {
                    onDelete(message.id, "me");
                    setMenu(false);
                  }}
                  className="w-full rounded-lg px-2 py-2 text-left hover:bg-paper"
                >
                  Delete for me
                </button>
                <button
                  onClick={() => {
                    onDelete(message.id, "everyone");
                    setMenu(false);
                  }}
                  className="w-full rounded-lg px-2 py-2 text-left text-[#ad6650] hover:bg-[#fbf1ec]"
                >
                  Delete for everyone
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Conversation({
  conversation,
  person,
  onBack,
  onSend,
  onDelete,
  onReact,
  onProfile,
  linkPermissions,
}) {
  const [draft, setDraft] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  function send() {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  }
  return (
    <section
      className={`relative flex min-h-0 flex-1 flex-col bg-[#f8f9f6] ${conversation ? "" : "hidden md:flex"}`}
    >
      {conversation ? (
        <>
          <header className="flex items-center gap-3 border-b border-line bg-white px-4 py-3 md:px-6">
            <button
              onClick={onBack}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-paper md:hidden"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={onProfile}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <Avatar name={person.name} color={person.color} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold">
                  {person.name}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-[#7b9b83]">
                  {person.username} ·{" "}
                  {person.active ? "Active now" : "Mutual follow"}
                </p>
              </div>
            </button>
            <IconButton label="Conversation options">
              <MoreHorizontal size={19} />
            </IconButton>
          </header>
          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 md:px-8">
            <div className="mx-auto w-fit rounded-full bg-white px-3 py-1 text-[9px] text-[#a5aca5]">
              Today
            </div>
            {conversation.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onDelete={onDelete}
                onReact={onReact}
                linkPermissions={linkPermissions}
              />
            ))}
          </div>
          {showEmoji && (
            <div className="mx-4 mb-2 flex flex-wrap gap-1 rounded-2xl border border-line bg-white p-3 shadow-soft md:mx-8">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setDraft((value) => value + emoji)}
                  className="rounded-lg p-1.5 text-xl hover:bg-paper"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
            className="flex items-end gap-2 border-t border-line bg-white px-3 py-3 pb-[max(env(safe-area-inset-bottom),12px)] md:px-6"
          >
            <button
              type="button"
              onClick={() => setShowEmoji(!showEmoji)}
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${showEmoji ? "bg-mint text-moss" : "text-[#879087] hover:bg-paper"}`}
              aria-label="Add emoji"
            >
              😊
            </button>
            <textarea
              rows={1}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  send();
                }
              }}
              placeholder="Write a message…"
              className="max-h-28 min-h-10 flex-1 resize-none rounded-2xl bg-paper px-4 py-3 text-xs outline-none placeholder:text-[#a5aca5] focus:ring-1 focus:ring-moss/20"
            />
            <button
              type="submit"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-ink transition hover:bg-[#254b3c]"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </>
      ) : (
        <div className="m-auto max-w-xs px-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-mint text-moss">
            <MessageCircle size={27} />
          </div>
          <h2 className="mt-5 text-lg font-semibold">A little space to talk</h2>
          <p className="mt-2 text-xs leading-6 text-[#8b938c]">
            Pick a conversation to catch up. Messages are open between mutual
            follows.
          </p>
        </div>
      )}
    </section>
  );
}

function ProfileModal({ person, onClose, onEditAbout, onEditPhoto, editingAbout, aboutDraft, setAboutDraft, saveAbout }) {
  if (!person) return null;
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/25 p-3 md:items-center"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-soft"
      >
        <div className="flex justify-end">
          <IconButton label="Close profile" onClick={onClose}>
            <X size={18} />
          </IconButton>
        </div>
        <div className="flex flex-col items-center pb-3">
          <div className="relative">
            <Avatar name={person.name} color={person.color} size="lg" />
            {person.id === "me" && <button onClick={onEditPhoto} aria-label="Edit profile picture" className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-[var(--accent)] text-ink shadow-sm"><Pencil size={13} /></button>}
          </div>
          <h2 className="mt-3 text-lg font-semibold">{person.name}</h2>
          <p className="mt-1 text-xs text-[#8b938c]">{person.username}</p>
        </div>
        <div className="mt-4 rounded-2xl bg-paper p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#9da59d]">About</p>
            {person.id === "me" && <button onClick={onEditAbout} aria-label="Edit About" className="grid h-7 w-7 place-items-center rounded-full bg-[var(--accent)] text-ink"><Pencil size={13} /></button>}
          </div>
          {editingAbout && person.id === "me" ? <div><textarea value={aboutDraft} onChange={(event) => setAboutDraft(event.target.value)} maxLength={160} rows={3} className="mt-2 w-full resize-none rounded-xl border border-line bg-white p-3 text-sm outline-none focus:border-[var(--accent)]" /><button onClick={saveAbout} className="mt-2 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-ink">Save</button></div> : <p className="mt-2 text-sm leading-6 text-[#4f5b52]">{person.about}</p>}
        </div>
      </div>
    </div>
  );
}

function ChatsView({
  conversations,
  setConversations,
  selected,
  setSelected,
  onSettings,
  onProfile,
  linkPermissions,
}) {
  const conversation = conversations.find((item) => item.id === selected);
  const person = people.find((item) => item.id === conversation?.personId);
  function updateMessage(id, patch) {
    setConversations((items) =>
      items.map((item) =>
        item.id === selected
          ? {
              ...item,
              messages: item.messages
                .map((message) =>
                  message.id === id ? patch(message) : message,
                )
                .filter(Boolean),
            }
          : item,
      ),
    );
  }
  return (
    <div className="flex h-full min-h-0 flex-col md:flex-row">
      <ChatList
        conversations={conversations}
        selected={selected}
        onSelect={setSelected}
      />
      <Conversation
        conversation={conversation}
        person={person}
        onBack={() => setSelected(null)}
        onProfile={() => onProfile(person)}
        linkPermissions={linkPermissions}
        onSend={(text) =>
          setConversations((items) =>
            items
              .map((item) =>
                item.id === selected
                  ? {
                      ...item,
                      last: `You: ${text}`,
                      time: "Now",
                      activityAt: Date.now(),
                      messages: [
                        ...item.messages,
                        {
                          id: `local-${Date.now()}`,
                          mine: true,
                          text,
                          time: "Now",
                        },
                      ],
                    }
                  : item,
              )
              .sort((a, b) => (b.activityAt || 0) - (a.activityAt || 0)),
          )
        }
        onDelete={(id, scope) =>
          updateMessage(id, (message) =>
            scope === "everyone"
              ? {
                  ...message,
                  text: "This message was deleted",
                  deleted: true,
                  reaction: null,
                }
              : null,
          )
        }
        onReact={(id, reaction) =>
          updateMessage(id, (message) => ({ ...message, reaction }))
        }
      />
    </div>
  );
}

function GroupsView({
  groups,
  setGroups,
  requests,
  setRequests,
  disabled,
  setDisabled,
  onSettings,
  onProfile,
}) {
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState("");
  const group = groups.find((item) => item.id === selected);
  function answer(requestId, accept) {
    const request = requests.find((item) => item.id === requestId);
    if (accept && !disabled)
      setGroups((items) => [
        {
          id: `new-${Date.now()}`,
          name: request.groupName,
          about: "A new place to gather.",
          members: 2,
          color: "bg-[#e9dfc9]",
          last: "You joined the group",
          time: "Now",
        },
        ...items,
      ]);
    setRequests((items) => items.filter((item) => item.id !== requestId));
  }
  if (disabled)
    return (
      <div className="flex h-full flex-col">
        <Header
          title="Groups"
          eyebrow="Together, by choice"
          onSettings={onSettings}
        />
        <div className="m-auto max-w-sm px-7 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#f5e9e2] text-[#b56a4c]">
            <Users size={27} />
          </div>
          <h2 className="mt-5 text-lg font-semibold">Groups are turned off</h2>
          <p className="mt-2 text-xs leading-6 text-[#8b938c]">
            You won’t receive group invitations or requests while this is off.
          </p>
          <button
            onClick={() => setDisabled(false)}
            className="mt-5 rounded-full bg-[var(--accent)] text-ink px-5 py-3 text-xs font-semibold text-white"
          >
            Turn groups back on
          </button>
        </div>
      </div>
    );
  return (
    <div className="flex h-full min-h-0 flex-col md:flex-row">
      <section
        className={`flex min-h-0 flex-1 flex-col bg-white md:max-w-[520px] md:border-r md:border-line ${selected ? "hidden md:flex" : "flex"}`}
      >
        <Header
          title="Groups"
          eyebrow="Together, by choice"
          onSettings={onSettings}
          right={
            <button
              className="mr-1 grid h-9 w-9 place-items-center rounded-full bg-paper text-[#748078]"
              aria-label="Discover groups"
            >
              <Compass size={17} />
            </button>
          }
        />
        <div className="scrollbar-none flex-1 overflow-y-auto px-5 py-5 md:px-7">
          {requests.length > 0 && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-[#eee8dc] bg-[#fbfaf7]">
              <button className="flex w-full items-center justify-between px-4 py-3.5 text-left">
                <span>
                  <span className="block text-xs font-semibold">
                    Group requests
                  </span>
                  <span className="mt-1 block text-[10px] text-[#999e96]">
                  </span>
                </span>
                <span className="rounded-full bg-[#f3e7d7] px-2.5 py-1 text-[10px] font-semibold text-[#aa7446]">
                  {requests.length} new
                </span>
              </button>
              <div className="divide-y divide-[#eee8dc] border-t border-[#eee8dc]">
                {requests.map((request) => {
                  const person = people.find(
                    (item) => item.id === request.personId,
                  );
                  return (
                    <div
                      key={request.id}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <Avatar
                        name={person.name}
                        color={person.color}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold">
                          {person.name}{" "}
                          <span className="font-normal text-[#899189]">
                            wants to join
                          </span>
                        </p>
                        <p className="mt-1 text-[10px] text-[#8d958d]">
                          {request.groupName} · {request.time}
                        </p>
                      </div>
                      <button
                        onClick={() => answer(request.id, false)}
                        className="grid h-8 w-8 place-items-center rounded-full text-[#919991] hover:bg-white"
                        aria-label="Decline request"
                      >
                        <X size={15} />
                      </button>
                      <button
                        onClick={() => answer(request.id, true)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-[var(--accent)] text-ink hover:bg-[#254b3c]"
                        aria-label="Accept request"
                      >
                        <Check size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-[.15em] text-[#9ba29b]">
              Your groups{" "}
              <span className="ml-1 font-normal">{groups.length}</span>
            </h2>
            <button className="text-[10px] font-medium text-moss">
              + Create
            </button>
          </div>
          <div className="space-y-1">
            {groups.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item.id)}
                className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${selected === item.id ? "bg-[#f2f6f0]" : "hover:bg-paper/70"}`}
              >
                <div
                  className={`grid h-12 w-12 place-items-center rounded-2xl ${item.color} text-sm font-semibold text-[#4a554c]`}
                >
                  <Hash size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between">
                    <span className="truncate text-[13px] font-semibold">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[#a3aaa3]">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[11px] text-[#899189]">
                    {item.last}
                  </p>
                  <p className="mt-1 text-[9px] text-[#a2aaa2]">
                    {item.members} members
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
      <section
        className={`flex min-h-0 flex-1 flex-col bg-[#f8f9f6] ${group ? "" : "hidden md:flex"}`}
      >
        {group ? (
          <>
            <header className="flex items-center gap-3 border-b border-line bg-white px-4 py-3">
              <button
                onClick={() => setSelected(null)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-paper md:hidden"
              >
                <ChevronLeft size={20} />
              </button>
              <div
                className={`grid h-10 w-10 place-items-center rounded-2xl ${group.color}`}
              >
                <Hash size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold">{group.name}</p>
                <p className="mt-0.5 text-[10px] text-[#8b938c]">
                  {group.members} members · All here by choice
                </p>
              </div>
              <IconButton label="Group options">
                <MoreHorizontal size={19} />
              </IconButton>
            </header>
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <div className="mx-auto w-fit rounded-full bg-white px-3 py-1 text-[9px] text-[#a5aca5]">
                Today
              </div>
              <div className="mt-8 flex justify-center">
                <div className="max-w-xs rounded-2xl rounded-bl-md border border-line bg-white px-4 py-3 text-[12px] text-[#576158]">
                  Welcome to {group.name}. Introduce yourself and make yourself
                  at home.
                  <p className="mt-1 text-right text-[9px] text-[#afb5af]">
                    System · 9:00
                  </p>
                </div>
              </div>
              {group.last && (
                <div className="mt-4 flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 text-[12px] text-[#576158]">
                    {group.last}
                    <p className="mt-1 text-right text-[9px] text-[#afb5af]">
                      9:18
                    </p>
                  </div>
                </div>
              )}
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!draft.trim()) return;
                setGroups((items) =>
                  items.map((item) =>
                    item.id === group.id
                      ? { ...item, last: `You: ${draft.trim()}`, time: "Now" }
                      : item,
                  ),
                );
                setDraft("");
              }}
              className="flex gap-2 border-t border-line bg-white p-3 pb-[max(env(safe-area-inset-bottom),12px)]"
            >
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Write to the group…"
                className="h-10 flex-1 rounded-2xl bg-paper px-4 text-xs outline-none"
              />
              <button className="grid h-10 w-10 place-items-center rounded-full bg-[var(--accent)] text-ink">
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="m-auto max-w-xs px-8 text-center">
            <Users size={28} className="mx-auto text-[#a2b3a4]" />
            <h2 className="mt-4 text-lg font-semibold">
              Good things happen together
            </h2>
            <p className="mt-2 text-xs leading-6 text-[#8b938c]">
              Choose a group to see the conversation and member details.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function StoriesView({ onSettings, onProfile, onShareStory }) {
  const [selected, setSelected] = useState(null);
  const story = stories.find((item) => item.id === selected);
  const person = people.find((item) => item.id === story?.personId);
  return (
    <div className="flex h-full flex-col bg-white">
      <Header title="Stories" onSettings={onSettings} />
          {story ? (
        <div className="m-auto w-[min(88%,390px)] overflow-hidden rounded-[30px] border border-line bg-[#f5f6f2] shadow-soft">
          <div className="flex items-center gap-3 bg-white p-4">
            <button onClick={() => setSelected(null)}>
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => onProfile(person)}
              className="flex items-center gap-2 text-left"
            >
              <Avatar name={person.name} color={person.color} size="sm" />
              <span>
                <b className="block text-xs">{person.name}</b>
                <small className="text-[#9aa19a]">{story.time} ago</small>
              </span>
            </button>
          </div>
          <div className="flex aspect-[4/5] flex-col items-center justify-center bg-gradient-to-br from-[#e2eadf] via-[#f4eadf] to-[#e2e4eb] px-8 text-center">
            <span className="text-5xl">
              {story.caption.match(/\p{Extended_Pictographic}/u)?.[0] || "🌿"}
            </span>
            <p className="mt-5 max-w-xs text-lg font-medium leading-8 text-[#34443a]">
              {story.caption.replace(/\p{Extended_Pictographic}/gu, "").trim()}
            </p>
          </div>
          <div className="flex items-center justify-between bg-white p-4 text-xs text-[#818981]">
            <span>Shared with mutual follows</span>
            <button className="text-xl">💚</button>
          </div>
        </div>
      ) : (
        <div className="scrollbar-none flex-1 overflow-y-auto px-5 py-6 md:px-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {stories.map((item) => {
              const storyPerson = people.find((p) => p.id === item.personId);
              return (
                <button
                  key={item.id}
                  onClick={() => setSelected(item.id)}
                  className="group overflow-hidden rounded-2xl border border-line text-left transition hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <div
                    className={`flex aspect-[4/5] flex-col items-center justify-center bg-gradient-to-br ${storyPerson.color} to-white p-4`}
                  >
                    <Avatar name={storyPerson.name} color="bg-white/70" ring />
                    <span className="mt-4 text-center text-[11px] font-medium leading-5">
                      {item.caption}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-3">
                    <Avatar
                      name={storyPerson.name}
                      color={storyPerson.color}
                      size="sm"
                    />
                    <span className="min-w-0">
                      <b className="block truncate text-[10px]">
                        {storyPerson.name}
                      </b>
                      <small className="text-[9px] text-[#9ba29b]">
                        {item.time} ago
                      </small>
                    </span>
                  </div>
                </button>
              );
            })}
            <button onClick={onShareStory} className="flex aspect-[4/5] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--accent)] text-ink transition hover:-translate-y-1 hover:shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--accent)] text-lg">
                +
              </span>
              <span className="mt-3 text-xs">Share a story</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EventsView({ events, setEvents, onSettings }) {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  function create(event) {
    event.preventDefault();
    if (!title.trim() || !date) return;
    setEvents((items) =>
      [
        ...items,
        {
          id: `e-${Date.now()}`,
          title: title.trim(),
          details: details.trim() || "A new gathering.",
          date,
          location: location.trim() || "Location to be shared",
          attendees: 1,
          host: "You",
        },
      ].sort((a, b) => new Date(a.date) - new Date(b.date)),
    );
    setTitle("");
    setDetails("");
    setDate("");
    setLocation("");
    setCreating(false);
  }
  return (
    <div className="flex h-full flex-col bg-white">
      <Header
        title="Events"
        eyebrow="Make room for good plans"
        onSettings={onSettings}
        right={
            <button
            data-create-event
            onClick={() => setCreating(true)}
            className="mr-1 rounded-full bg-[var(--accent)] text-ink px-4 py-2.5 text-[11px] font-medium text-white"
          >
            + Create event
          </button>
        }
      />
      <div className="scrollbar-none flex-1 overflow-y-auto px-5 py-6 md:px-8">
        <div className="mb-6 rounded-2xl bg-[#f4f6f1] p-4 md:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#93a092]">
            Coming together
          </p>
          <h2 className="mt-2 text-lg font-semibold">
            A little something to look forward to.
          </h2>
          <p className="mt-1 text-[11px] text-[#8a938a]">
            Simple plans, shared with your people.
          </p>
        </div>
        <div className="space-y-3">
          {events.map((item) => {
            const when = new Date(item.date);
            return (
              <article
                key={item.id}
                className="flex gap-4 rounded-2xl border border-line p-4 transition hover:shadow-soft md:p-5"
              >
                <div className="flex h-[68px] w-[62px] shrink-0 flex-col items-center justify-center rounded-xl bg-[#eef3ed] text-moss">
                  <span className="text-[9px] font-semibold uppercase tracking-[.14em]">
                    {when.toLocaleDateString("en", { month: "short" })}
                  </span>
                  <span className="mt-0.5 text-2xl font-semibold leading-none">
                    {when.getDate()}
                  </span>
                  <span className="mt-1 text-[9px]">
                    {when.toLocaleDateString("en", { weekday: "short" })}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <p className="mt-1 text-[10px] text-[#7c877e]">
                        {when.toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        · {item.location}
                      </p>
                    </div>
                    <button
                      aria-label="More event options"
                      className="rounded-full p-2 text-[#a3aaa3] hover:bg-paper"
                    >
                      <MoreHorizontal size={17} />
                    </button>
                  </div>
                  <p className="mt-3 text-[11px] leading-5 text-[#7f8980]">
                    {item.details}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                    <span className="text-[10px] text-[#9ba29b]">
                      Hosted by {item.host} · {item.attendees} going
                    </span>
                    <button className="rounded-full border border-[#dce4dc] px-3 py-1.5 text-[10px] font-medium text-moss hover:bg-mint">
                      I’m interested
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      {creating && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center bg-ink/25 p-3 md:items-center"
          onClick={() => setCreating(false)}
        >
          <form
            onSubmit={create}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create an event</h2>
              <IconButton label="Close" onClick={() => setCreating(false)}>
                <X size={18} />
              </IconButton>
            </div>
            <p className="mt-1 text-xs text-[#8d968e]">
              Give everyone something to look forward to.
            </p>
            <label className="mt-5 block text-[10px] font-medium text-[#707a71]">
              Event name
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="A slow Sunday picnic"
                className="mt-1.5 h-11 w-full rounded-xl bg-paper px-3 text-xs outline-none focus:ring-1 focus:ring-moss/20"
              />
            </label>
            <label className="mt-3 block text-[10px] font-medium text-[#707a71]">
              Details
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="What should people know?"
                className="mt-1.5 min-h-20 w-full rounded-xl bg-paper p-3 text-xs outline-none focus:ring-1 focus:ring-moss/20"
              />
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="text-[10px] font-medium text-[#707a71]">
                Date & time
                <input
                  required
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl bg-paper px-2 text-[10px] outline-none"
                />
              </label>
              <label className="text-[10px] font-medium text-[#707a71]">
                Location
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Optional"
                  className="mt-1.5 h-11 w-full rounded-xl bg-paper px-3 text-xs outline-none"
                />
              </label>
            </div>
            <button className="mt-5 h-11 w-full rounded-xl bg-moss text-xs font-semibold text-white">
              Create event
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function SettingsView({
  enabled,
  setEnabled,
  groupsDisabled,
  setGroupsDisabled,
  onBack,
  onProfile,
  theme,
  setTheme,
  linkPermissions,
  setLinkPermissions,
  aboutDraft,
}) {
  const me = {
    id: "me",
    name: "Jordan Lee",
    username: "@jordanlee",
    about: aboutDraft,
    color: "bg-[#dce4d9]",
    phoneVerified: true,
  };
  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex items-center gap-3 border-b border-line px-5 py-4 md:px-7">
        <button
          onClick={onBack}
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-paper"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#a4aaa4]">
            Make it yours
          </p>
          <h1 className="mt-1 text-xl font-semibold">Settings</h1>
        </div>
      </header>
      <div className="scrollbar-none mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-5 py-6 md:px-8">
        <button
          type="button"
          onClick={() => onProfile(me)}
          className="flex w-full items-center gap-4 rounded-2xl border border-line p-4 text-left transition hover:bg-paper/60"
        >
          <Avatar name={me.name} color={me.color} size="lg" />
          <span className="flex-1">
            <b className="block text-sm">{me.name}</b>
            <small className="mt-1 block text-xs text-[#899189]">
              {me.username} · <span className="inline-flex items-center gap-1">Phone <span className="sr-only">{me.phoneVerified ? "verified" : "not verified"}</span>{me.phoneVerified ? <Check aria-hidden="true" size={13} className="text-[var(--accent)]" /> : <X aria-hidden="true" size={13} className="text-red-600" />}</span>
            </small>
            <small className="mt-1 block text-[10px] text-[#a0a79f]">{me.about || "Add a short description"}</small>
          </span>
          <ChevronDown className="-rotate-90 text-[#a4aaa4]" size={17} />
        </button>
        <div className="mt-3 flex items-center justify-between rounded-xl border border-line p-4">
          <span>
            <b className="block text-xs font-medium">Phone number</b>
            <small className="mt-1 block text-[10px] text-[#9aa19a]">
              +91 ••••• •• 284 · {me.phoneVerified ? <Check aria-label="Phone verified" size={13} className="inline text-[var(--accent)]" /> : <X aria-label="Phone not verified" size={13} className="inline text-red-600" />}
            </small>
          </span>
          <button aria-label="Edit phone number" className="grid h-8 w-8 place-items-center rounded-full bg-[var(--accent)] text-ink">
            <Pencil size={13} />
          </button>
        </div>
        <div className="mt-7">
          <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#9da59d]">
            Your app, your way
          </p>
          <p className="mt-1 text-xs text-[#8e978f]">
            Choose which spaces show up in your navigation.
          </p>
        </div>
        <div className="mt-4 divide-y divide-line rounded-2xl border border-line px-4">
          {sections.map(({ id, label, icon: Icon }) => {
            const required = id === "chats";
            return (
              <div key={id} className="flex items-center gap-3 py-4">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)]/40 text-[#333]">
                  <Icon size={17} />
                </span>
                <span className="flex-1">
                  <b className="block text-xs font-medium">{label}</b>
                  <small className="mt-1 block text-[10px] text-[#9ca39c]">
                    {required
                      ? "Always here — your conversations stay within reach."
                      : id === "groups"
                        ? "Opt out of groups and stop incoming requests."
                        : id === "stories"
                          ? "Hide story updates from your app."
                          : "Keep plans and gatherings in one place."}
                  </small>
                </span>
                {required ? (
                  <span className="rounded-full bg-[var(--accent)] px-3 py-1.5 text-[9px] font-semibold text-ink">
                    Always on
                  </span>
                ) : (
                  <button
                    role="switch"
                    aria-checked={enabled[id]}
                    onClick={() => {
                      setEnabled((value) => ({ ...value, [id]: !value[id] }));
                      if (id === "groups" && enabled.groups)
                        setGroupsDisabled(true);
                      if (id === "groups" && !enabled.groups)
                        setGroupsDisabled(false);
                    }}
                    className={`relative h-6 w-11 rounded-full transition ${enabled[id] ? "bg-[color-mix(in_srgb,var(--accent)_72%,#000)]" : "bg-[#dfe3de]"}`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-black shadow-sm transition-all ${enabled[id] ? "left-6" : "left-1"}`}
                    />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <section className="mt-6 rounded-2xl border border-line p-4">
          <h2 className="text-sm font-semibold">Theme color</h2>
          <div className="mt-3 flex flex-wrap gap-2">{Object.entries({ Yellow: "#ffd84d", Purple: "#d8c5ff", Pink: "#ffc6df", Cyan: "#a9eeee", Red: "#ffb4a8" }).map(([name, color]) => <button key={name} onClick={() => { setTheme(color); localStorage.setItem("common-accent", color); }} className="rounded-full border px-3 py-2 text-xs" style={{ borderColor: color, borderWidth: theme === color ? 2 : 1, backgroundColor: theme === color ? `${color}33` : "transparent" }}><span className="mr-2 inline-block h-3 w-3 rounded-full align-middle" style={{ backgroundColor: color }} />{name}</button>)}</div>
        </section>
        <section className="mt-4 rounded-2xl border border-line p-4">
          <h2 className="text-sm font-semibold">Allowed links</h2>
          {Object.entries({ x: "X and Twitter", youtube: "YouTube", google: "Google", meta: "Meta platforms" }).map(([key, label]) => <label key={key} className="mt-3 flex items-center justify-between text-xs"><span>{label}</span><input type="checkbox" checked={linkPermissions[key]} onChange={() => setLinkPermissions((value) => { const next = { ...value, [key]: !value[key] }; localStorage.setItem("common-link-permissions", JSON.stringify(next)); return next; })} className="h-4 w-4 accent-[var(--accent)]" /></label>)}
        </section>
      </div>
    </div>
  );
}

export default function AppShell() {
  const [active, setActive] = useState("chats");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [profile, setProfile] = useState(null);
  const [aboutDraft, setAboutDraft] = useState("Making space for the people and plans that matter.");
  const [editingAbout, setEditingAbout] = useState(false);
  const [theme, setTheme] = useState("#ffd84d");
  const [linkPermissions, setLinkPermissions] = useState({ x: true, youtube: true, google: true, meta: true });
  const [enabled, setEnabled] = useState({
    chats: true,
    groups: true,
    stories: true,
    events: true,
  });
  const [groupsDisabled, setGroupsDisabled] = useState(false);
  const [conversations, setConversations] = useState(initialConversations);
  const [groups, setGroups] = useState(initialGroups);
  const [requests, setRequests] = useState(initialRequests);
  const [events, setEvents] = useState(initialEvents);
  useEffect(() => {
    const savedTheme = localStorage.getItem("common-accent");
    if (savedTheme) setTheme(savedTheme);
    const savedLinks = localStorage.getItem("common-link-permissions");
    if (savedLinks) { try { setLinkPermissions(JSON.parse(savedLinks)); } catch {} }
    const savedAbout = localStorage.getItem("common-profile-description");
    if (savedAbout !== null) setAboutDraft(savedAbout);
  }, []);
  const requestsCount = groupsDisabled ? 0 : requests.length;
  const view = useMemo(() => {
    if (settingsOpen) return "settings";
    if (!enabled[active]) return "chats";
    return active;
  }, [active, enabled, settingsOpen]);
  return (
    <main style={{ "--accent": theme }} className="min-h-[100dvh] bg-paper p-0 md:flex md:items-center md:justify-center md:p-6">
      <div className="relative mx-auto flex h-[100dvh] w-full max-w-[1440px] overflow-hidden bg-white md:h-[min(900px,calc(100dvh-48px))] md:rounded-[28px] md:border md:border-[#e5e9e3] md:shadow-soft">
        <aside className="hidden w-[220px] shrink-0 flex-col border-r border-line bg-[#fbfcfa] px-4 md:flex">
          <button
            onClick={() => {
              setSettingsOpen(false);
              setActive("chats");
            }}
            className="flex items-center gap-2 px-3 pt-7 text-left"
          >
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--accent)] text-ink">
              <MessageCircle size={16} fill="currentColor" />
            </div>
            <span className="text-base font-bold tracking-tight">
              common<span className="text-moss">.</span>
            </span>
          </button>
          <SectionNav
            active={view}
            setActive={(id) => {
              setSettingsOpen(false);
              setActive(id);
              setSelectedChat(null);
            }}
            enabled={enabled}
            requestsCount={requestsCount}
          />
          <div className="mt-auto pb-5">
            <button
              onClick={() => setSettingsOpen(true)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm ${settingsOpen ? "bg-mint/70 text-moss" : "text-[#858d86] hover:bg-white"}`}
            >
              <Settings2 size={18} /> Settings
            </button>
              <button className="mt-3 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left hover:bg-[var(--accent)]/40">
              <Avatar name="Jordan Lee" color="bg-[#dce4d9]" size="sm" />
              <span className="min-w-0">
                <b className="block truncate text-xs">Jordan Lee</b>
                <small className="text-[10px] text-[#9da49d]">@jordanlee</small>
              </span>
              <MoreHorizontal className="ml-auto text-[#a5aca5]" size={16} />
            </button>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col pb-[72px] md:pb-0">
          {view === "chats" && (
            <>
              <Header logo onSettings={() => setSettingsOpen(true)} />
              <div className="hidden min-h-0 flex-1 md:flex">
                <ChatsView
                  conversations={conversations}
                  setConversations={setConversations}
                  selected={selectedChat}
                  setSelected={setSelectedChat}
                  onSettings={() => setSettingsOpen(true)}
                  onProfile={setProfile}
                  linkPermissions={linkPermissions}
                />
              </div>
              <div className="min-h-0 flex-1 md:hidden">
                <ChatsView
                  conversations={conversations}
                  setConversations={setConversations}
                  selected={selectedChat}
                  setSelected={setSelectedChat}
                  onSettings={() => setSettingsOpen(true)}
                  onProfile={setProfile}
                  linkPermissions={linkPermissions}
                />
              </div>
            </>
          )}
          {view === "groups" && (
            <GroupsView
              groups={groups}
              setGroups={setGroups}
              requests={requests}
              setRequests={setRequests}
              disabled={groupsDisabled}
              setDisabled={setGroupsDisabled}
              onSettings={() => setSettingsOpen(true)}
              onProfile={(person) => setProfile({ ...person, about: aboutDraft })}
            />
          )}
          {view === "stories" && (
            <StoriesView
              onSettings={() => setSettingsOpen(true)}
              onProfile={setProfile}
              onShareStory={() => setProfile({ name: "Share a story", username: "Stories", about: "Story sharing is ready to connect to your camera or gallery." })}
            />
          )}
          {view === "events" && (
            <EventsView
              events={events}
              setEvents={setEvents}
              onSettings={() => setSettingsOpen(true)}
            />
          )}
          {view === "settings" && (
            <SettingsView
              enabled={enabled}
              setEnabled={setEnabled}
              groupsDisabled={groupsDisabled}
              setGroupsDisabled={setGroupsDisabled}
              onBack={() => setSettingsOpen(false)}
              onProfile={setProfile}
              theme={theme}
              setTheme={setTheme}
              linkPermissions={linkPermissions}
              setLinkPermissions={setLinkPermissions}
              aboutDraft={aboutDraft}
            />
          )}
        </div>
      </div>
      <div className="md:hidden">
        <SectionNav
          active={view}
          setActive={(id) => {
            setSettingsOpen(false);
            setActive(id);
            setSelectedChat(null);
          }}
          enabled={enabled}
          requestsCount={requestsCount}
        />
      </div>
      {!settingsOpen && <div className="fixed bottom-[calc(72px+env(safe-area-inset-bottom)+16px)] right-4 z-30 flex flex-col items-end gap-2 md:bottom-8 md:right-8">
        {[
          ...(view === "chats" ? [{ label: "New chat", action: () => setSelectedChat("maya") }] : []),
          ...(view === "groups" ? [{ label: "Create group", action: () => setProfile({ name: "Create group", username: "Groups", about: "Start a group and invite people to join." }) }] : []),
          ...(view === "stories" ? [{ label: "Share story", action: () => setProfile({ name: "Share a story", username: "Stories", about: "Story sharing is ready to connect to your camera or gallery." }) }] : []),
          ...(view === "events" ? [{ label: "Create event", action: () => document.querySelector("[data-create-event]")?.click() }] : []),
        ].map(({ label, action }) => <button key={label} onClick={action} className="rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold text-ink shadow-soft transition hover:-translate-y-1 hover:shadow-md">+ {label}</button>)}
      </div>}
      <ProfileModal person={profile} onClose={() => { setProfile(null); setEditingAbout(false); }} onEditAbout={() => { setAboutDraft(profile?.about || ""); setEditingAbout(true); }} onEditPhoto={() => window.alert("Profile picture editing is not available yet.")} editingAbout={editingAbout} aboutDraft={aboutDraft} setAboutDraft={setAboutDraft} saveAbout={() => { localStorage.setItem("common-profile-description", aboutDraft); setProfile((person) => ({ ...person, about: aboutDraft })); setEditingAbout(false); }} />
    </main>
  );
}
