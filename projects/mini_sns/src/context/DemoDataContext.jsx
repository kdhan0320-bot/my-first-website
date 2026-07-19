import { createContext, useContext, useState } from "react";
import sampleCardUi from "../assets/samples/sample-card-ui.svg";
import sampleStudy from "../assets/samples/sample-study.svg";
import sampleChatUx from "../assets/samples/sample-chat-ux.svg";
import sampleProfileUi from "../assets/samples/sample-profile-ui.svg";
import sampleFlowUi from "../assets/samples/sample-flow-ui.svg";
import { DEMO_USER, getRandomProfileAvatar } from "../hooks/useAuth";

const DemoDataContext = createContext(null);

const SAMPLE_IMAGES = [
  sampleCardUi,
  sampleStudy,
  sampleChatUx,
  sampleProfileUi,
  sampleFlowUi,
];

export const getRandomSampleImage = () =>
  SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];

const buildInitialPosts = () => [
  {
    id: "guest-1",
    user_id: DEMO_USER.id,
    profiles: {
      nickname: DEMO_USER.nickname,
      profile_image_url: DEMO_USER.profile_image_url,
    },
    image_url: sampleCardUi,
    caption:
      "오늘 홈 피드 카드 컴포넌트를 정리했습니다. 이미지 클릭 모달까지 연결해봤어요.",
    hashtag: "#작업기록 #모바일UI #React",
    location: null,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    liked: false,
    likes_count: 24,
    comments: [
      {
        id: "c1",
        user_id: "mock-2",
        profiles: { nickname: "프론트러너" },
        content: "카드 그림자 톤이 훨씬 차분해졌네요!",
        created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      },
      {
        id: "c2",
        user_id: "mock-3",
        profiles: { nickname: "디자인메이트" },
        content: "이미지 모달 UX 저도 참고할게요.",
        created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      },
    ],
  },
  {
    id: "guest-2",
    user_id: "mock-4",
    profiles: {
      nickname: "스터디메이트",
      profile_image_url: getRandomProfileAvatar("스터디메이트"),
    },
    image_url: sampleStudy,
    caption:
      "이번 주 모바일 UI 스터디 참여하실 분 모집합니다. 하단 탭 UX 사례를 같이 비교해봐요.",
    hashtag: "#스터디 #모바일앱 #UX",
    location: null,
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    liked: false,
    likes_count: 18,
    comments: [
      {
        id: "c3",
        user_id: "mock-1",
        profiles: { nickname: "UX러너" },
        content: "참여하고 싶어요! 시간대 알려주세요.",
        created_at: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
      },
    ],
  },
  {
    id: "guest-3",
    user_id: "mock-2",
    profiles: {
      nickname: "프론트러너",
      profile_image_url: getRandomProfileAvatar("프론트러너"),
    },
    image_url: sampleChatUx,
    caption:
      "채팅방 입력창이 모바일에서 잘리지 않도록 100dvh 기준으로 레이아웃을 수정했습니다.",
    hashtag: "#프론트엔드 #채팅UI #반응형",
    location: null,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    liked: false,
    likes_count: 41,
    comments: [
      {
        id: "c4",
        user_id: "mock-5",
        profiles: { nickname: "모바일UX" },
        content: "안전영역 패딩까지 적용하신 거죠?",
        created_at: new Date(Date.now() - 1000 * 60 * 170).toISOString(),
      },
      {
        id: "c5",
        user_id: "mock-4",
        profiles: { nickname: "스터디메이트" },
        content: "저도 이 이슈로 고생했는데 도움 되네요.",
        created_at: new Date(Date.now() - 1000 * 60 * 160).toISOString(),
      },
    ],
  },
  {
    id: "guest-4",
    user_id: "mock-3",
    profiles: {
      nickname: "디자인메이트",
      profile_image_url: getRandomProfileAvatar("디자인메이트"),
    },
    image_url: sampleProfileUi,
    caption:
      "아바타와 프로필 문구를 더 차분하게 정리하니 앱 분위기가 훨씬 안정적으로 보입니다.",
    hashtag: "#프로필UI #디자인개선",
    location: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    liked: false,
    likes_count: 15,
    comments: [
      {
        id: "c6",
        user_id: "mock-2",
        profiles: { nickname: "프론트러너" },
        content: "이니셜 아바타 톤이 잘 어울려요.",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
    ],
  },
  {
    id: "guest-5",
    user_id: "mock-5",
    profiles: {
      nickname: "모바일UX",
      profile_image_url: getRandomProfileAvatar("모바일UX"),
    },
    image_url: sampleFlowUi,
    caption:
      "모임 참가 후 채팅방으로 이동하는 흐름을 연결했습니다. 화면 간 목적이 더 분명해졌어요.",
    hashtag: "#사용자흐름 #모임 #채팅",
    location: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    liked: false,
    likes_count: 12,
    comments: [
      {
        id: "c7",
        user_id: "mock-1",
        profiles: { nickname: "UX러너" },
        content: "모임에서 바로 채팅으로 넘어가니 훨씬 자연스러워요.",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
      },
    ],
  },
];

export const DemoDataProvider = ({ children }) => {
  const [posts, setPosts] = useState(buildInitialPosts);

  const getPost = (id) => posts.find((p) => p.id === id);

  const addPost = ({ caption, hashtag, location, image_url }) => {
    const newPost = {
      id: `local-${Date.now()}`,
      user_id: DEMO_USER.id,
      profiles: {
        nickname: DEMO_USER.nickname,
        profile_image_url: DEMO_USER.profile_image_url,
      },
      image_url,
      caption,
      hashtag,
      location,
      created_at: new Date().toISOString(),
      liked: false,
      likes_count: 0,
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    return newPost.id;
  };

  const updatePost = (id, updates) => {
    const target = posts.find((p) => p.id === id);
    if (!target || target.user_id !== DEMO_USER.id) return false;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              caption: updates.caption ?? p.caption,
              hashtag: updates.hashtag ?? p.hashtag,
              location: updates.location ?? p.location,
              image_url: updates.image_url ?? p.image_url,
            }
          : p,
      ),
    );
    return true;
  };

  const deletePost = (id) => {
    const target = posts.find((p) => p.id === id);
    if (!target || target.user_id !== DEMO_USER.id) return false;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  const toggleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes_count: p.liked ? p.likes_count - 1 : p.likes_count + 1,
            }
          : p,
      ),
    );
  };

  const addComment = (postId, content) => {
    const comment = {
      id: `comment-${Date.now()}`,
      user_id: DEMO_USER.id,
      profiles: {
        nickname: DEMO_USER.nickname,
        profile_image_url: DEMO_USER.profile_image_url,
      },
      content,
      created_at: new Date().toISOString(),
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, comment] } : p,
      ),
    );
  };

  const updateComment = (postId, commentId, content) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId ? { ...c, content } : c,
              ),
            }
          : p,
      ),
    );
  };

  const deleteComment = (postId, commentId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
          : p,
      ),
    );
  };

  return (
    <DemoDataContext.Provider
      value={{
        posts,
        getPost,
        addPost,
        updatePost,
        deletePost,
        toggleLike,
        addComment,
        updateComment,
        deleteComment,
      }}
    >
      {children}
    </DemoDataContext.Provider>
  );
};

export const useDemoData = () => {
  const context = useContext(DemoDataContext);
  if (!context)
    throw new Error("useDemoData must be used within DemoDataProvider");
  return context;
};
