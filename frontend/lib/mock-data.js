export const people = [
  {
    id: "maya",
    name: "Maya Chen",
    username: "@mayachen",
    about: "Collecting small moments, one city at a time.",
    color: "bg-[#ead6c3]",
    active: true,
  },
  {
    id: "leo",
    name: "Leo Park",
    username: "@leopark",
    about: "Making things that make people think.",
    color: "bg-[#d9dfc7]",
    active: true,
  },
  {
    id: "amara",
    name: "Amara Okafor",
    username: "@amarao",
    about: "Books, long walks, and good questions.",
    color: "bg-[#e9d7e4]",
    active: false,
  },
  {
    id: "noah",
    name: "Noah Williams",
    username: "@noahw",
    about: "Here for the good conversations.",
    color: "bg-[#d6e2e8]",
    active: true,
  },
];

export const initialConversations = [
  {
    id: "maya",
    personId: "maya",
    last: "That little bookshop was perfect",
    time: "10:42",
    unread: 2,
    messages: [
      {
        id: "m1",
        mine: false,
        text: "Found the place I was telling you about",
        time: "10:39",
      },
      {
        id: "m2",
        mine: false,
        text: "That little bookshop was perfect",
        time: "10:42",
        reaction: "",
      },
    ],
  },
  {
    id: "leo",
    personId: "leo",
    last: "See you there!",
    time: "Yesterday",
    unread: 0,
    messages: [
      {
        id: "m3",
        mine: true,
        text: "Coffee and a catch-up this week?",
        time: "Yesterday",
      },
      { id: "m4", mine: false, text: "See you there!", time: "Yesterday" },
    ],
  },
  {
    id: "amara",
    personId: "amara",
    last: "You: sent you the reading list",
    time: "Tue",
    unread: 0,
    messages: [
      { id: "m5", mine: true, text: "sent you the reading list", time: "Tue" },
    ],
  },
  {
    id: "noah",
    personId: "noah",
    last: "Thanks for sharing!",
    time: "Mon",
    unread: 0,
    messages: [
      { id: "m6", mine: false, text: "Thanks for sharing!", time: "Mon" },
    ],
  },
];

export const initialGroups = [
  {
    id: "weekenders",
    name: "The Weekenders",
    about: "Friends, fresh air, and a free Saturday.",
    members: 8,
    color: "bg-[#e8d4bc]",
    last: "Maya: Saturday hike?",
    time: "9:18",
  },
  {
    id: "studio",
    name: "Studio Notes",
    about: "A tiny corner for sharing works in progress.",
    members: 5,
    color: "bg-[#d7dced]",
    last: "Leo: just posted the new draft",
    time: "Yesterday",
  },
];

export const initialRequests = [
  {
    id: "request-1",
    personId: "amara",
    groupName: "Sunday Table",
    note: "Amara would like to join",
    time: "12 min ago",
  },
  {
    id: "request-2",
    personId: "noah",
    groupName: "Garden Club",
    note: "Noah would like to join",
    time: "1 hr ago",
  },
];

export const stories = [
  {
    id: "maya",
    personId: "maya",
    caption: "Slow morning, good coffee",
    time: "2h",
  },
  {
    id: "leo",
    personId: "leo",
    caption: "A little color study for today",
    time: "4h",
  },
  {
    id: "amara",
    personId: "amara",
    caption: "Current chapter, current mood",
    time: "5h",
  },
];

export const initialEvents = [
  {
    id: "e1",
    title: "A slow Sunday picnic",
    details:
      "Bring something small to share. Blankets and good company provided.",
    date: "2026-11-15T11:00",
    location: "Lodhi Garden, New Delhi",
    attendees: 6,
    host: "Maya Chen",
  },
  {
    id: "e2",
    title: "Pages & pastries",
    details: "A relaxed morning reading together. Any book, any pastry.",
    date: "2026-11-19T09:30",
    location: "Paper & Bean, Hauz Khas",
    attendees: 4,
    host: "Leo Park",
  },
];

export const emojiOptions = [
  "😊",
  "😂",
  "🥹",
  "😍",
  "✨",
  "💚",
  "👋",
  "🎉",
  "🌿",
  "☕",
  "📚",
  "🙌",
  "❤️",
  "👍",
  "🔥",
  "🫶",
];

// Domain matching is intentionally exact/suffix based; arbitrary subdomains of a trusted host are accepted.
export const allowedLinkHosts = [
  "x.com",
  "twitter.com",
  "youtu.be",
  "youtube.com",
  "google.com",
  "google.co.in",
  "facebook.com",
  "instagram.com",
  "threads.net",
  "whatsapp.com",
  "meta.com",
];

export function isAllowedLink(raw) {
  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    return allowedLinkHosts.some(
      (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
    );
  } catch {
    return false;
  }
}

export function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
