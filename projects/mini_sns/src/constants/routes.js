export const ROUTES = {
  LOGIN: "/login",
  HOME: "/",
  CREATE_POST: "/create",
  PROFILE: "/profile",
  MEETUP: "/meetup",
  CHAT: "/chat",
  CHAT_ROOM: "/chat/:roomId",
  NOTIFICATIONS: "/notifications",
};

export const chatRoomPath = (roomId) => `/chat/${roomId}`;
