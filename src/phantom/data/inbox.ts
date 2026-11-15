import type { Conversation } from "../types";
import { CREATORS as C } from "./creators";

// Sample conversations. No messages are sent or received anywhere.
export const CONVERSATIONS: Conversation[] = [
  {
    id: "dm_01",
    creator: C.atelier,
    folder: "primary",
    unread: 2,
    online: true,
    messages: [
      { id: "m1", from: "them", text: "Hey! Saw your grid post — are you using a 4pt baseline?", time: "09:12" },
      { id: "m2", from: "me", text: "8pt for body, 4pt for captions. Happy to share the file.", time: "09:15" },
      { id: "m3", from: "them", text: "That would be amazing. Working on a zine layout.", time: "09:16" },
      { id: "m4", from: "them", text: "Also — would you be up for a collab in December?", time: "09:17" },
    ],
  },
  {
    id: "dm_02",
    creator: C.signal,
    folder: "primary",
    unread: 0,
    messages: [
      { id: "m5", from: "me", text: "The leek plate looked incredible.", time: "Yesterday" },
      { id: "m6", from: "them", text: "Thanks! Still tuning the acidity.", time: "Yesterday" },
    ],
  },
  {
    id: "dm_03",
    creator: C.loop,
    folder: "primary",
    unread: 1,
    online: true,
    messages: [
      { id: "m7", from: "them", text: "Sent you the easing curve preset 🎛️", time: "Mon" },
    ],
  },
  {
    id: "dm_04",
    creator: C.mono,
    folder: "primary",
    unread: 0,
    messages: [
      { id: "m8", from: "them", text: "Sunday long run, 7am at the trailhead?", time: "Sun" },
      { id: "m9", from: "me", text: "In. Bringing the extra headlamp.", time: "Sun" },
    ],
  },
  {
    id: "dm_05",
    creator: C.byte,
    folder: "requests",
    unread: 1,
    messages: [
      { id: "m10", from: "them", text: "Hi! Big fan of your setup posts. Do you take questions?", time: "Fri" },
    ],
  },
  {
    id: "dm_06",
    creator: C.vinyl,
    folder: "requests",
    unread: 0,
    messages: [
      { id: "m11", from: "them", text: "Loved the playlist you shared in stories.", time: "Thu" },
    ],
  },
];
