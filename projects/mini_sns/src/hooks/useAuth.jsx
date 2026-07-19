import { useState, createContext, useContext } from "react";

const AuthContext = createContext(null);

const AVATAR_PALETTE = ["6366F1", "4F46E5", "0F172A", "06B6D4", "312E81"].join(
  ",",
);

export const getRandomProfileAvatar = (seed) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed || Math.random().toString(36).slice(2))}&backgroundColor=${AVATAR_PALETTE}`;

export const DEMO_USER = {
  id: "demo-user",
  nickname: "데모유저",
  handle: "@demo_user",
  bio: "Mini SNS 화면 흐름을 체험하기 위한 mock 사용자",
  profile_image_url:
    "https://api.dicebear.com/7.x/initials/svg?seed=%EB%8D%B0%EB%AA%A8%EC%9C%A0%EC%A0%80",
};

export const AuthProvider = ({ children }) => {
  const [isGuest, setIsGuest] = useState(false);

  const enterGuestMode = () => setIsGuest(true);
  const exitGuestMode = () => setIsGuest(false);

  return (
    <AuthContext.Provider
      value={{
        isGuest,
        guestIdentity: DEMO_USER,
        enterGuestMode,
        exitGuestMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export default AuthContext;
