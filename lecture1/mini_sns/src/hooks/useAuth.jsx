import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../utils/supabase";

const AuthContext = createContext(null);

export const DEMO_USER = {
  id: "demo-user",
  username: "demo",
  nickname: "데모유저",
  handle: "@demo_user",
  bio: "Mini SNS 기능을 체험하기 위한 데모 계정입니다.",
  profile_image_url:
    "https://api.dicebear.com/7.x/initials/svg?seed=%EB%8D%B0%EB%AA%A8%EC%9C%A0%EC%A0%80",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [guestIdentity, setGuestIdentity] = useState(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) fetchProfile(session.user.id);
        else setLoading(false);
      })
      .catch(() => setLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
    setLoading(false);
  };

  const signUp = async (username, nickname, password) => {
    const email = `${username}@minisns.app`;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // 이메일 확인이 켜져 있어도 프로필 먼저 생성 시도
    const userId = data.user?.id;
    if (userId) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        username,
        nickname,
        profile_image_url: getRandomProfileAvatar(nickname),
      });
      if (profileError && profileError.code !== "23505") throw profileError;
    }

    // 이메일 확인 미완료 상태여도 바로 로그인 시도
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      // 이메일 확인 필요한 경우 → 안내 메시지로 처리
      if (signInError.message.includes("Email not confirmed")) {
        throw new Error(
          "회원가입은 완료됐어요! 데모 환경에서는 게스트 모드로 주요 기능을 확인할 수 있습니다.",
        );
      }
      throw signInError;
    }
    return signInData;
  };

  const signIn = async (username, password) => {
    const email = `${username}@minisns.app`;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const enterGuestMode = () => {
    setGuestIdentity(null);
    setIsGuest(true);
  };
  const enterDemoMode = () => {
    setGuestIdentity(DEMO_USER);
    setIsGuest(true);
  };
  const exitGuestMode = () => {
    setIsGuest(false);
    setGuestIdentity(null);
  };
  const isDemo = Boolean(guestIdentity);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isGuest,
        isDemo,
        guestIdentity,
        signUp,
        signIn,
        signOut,
        fetchProfile,
        enterGuestMode,
        enterDemoMode,
        exitGuestMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AVATAR_PALETTE = ["6366F1", "4F46E5", "0F172A", "06B6D4", "312E81"].join(
  ",",
);

export const getRandomProfileAvatar = (seed) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed || Math.random().toString(36).slice(2))}&backgroundColor=${AVATAR_PALETTE}`;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export default AuthContext;
