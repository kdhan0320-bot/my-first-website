import { createContext, useContext, useState, useMemo, useCallback } from 'react';

// ── 단일 데이터 소스 ──────────────────────────────────────────────────
const initialAboutMeData = {
  basicInfo: {
    name: "Dohan Kim",
    education: "4년제 대학 졸업 (비전공)",
    educationNote: "웹디자인·UX/UI 분야로 전환 준비 중",
    major: "웹디자인 · UX/UI · AI-assisted Web Design 학습 중",
    experience: "신입 / 전환 취업 준비",
    position: "Web Designer & UX/UI Designer",
    summary: "비전공자 출신으로, UX/UI와 웹디자인에 관심을 가지며 전환을 준비하고 있습니다. 사용자가 불편함을 느끼는 지점을 찾고 구조적으로 개선하는 작업에서 가장 큰 보람을 느낍니다.",
    photo: "",
  },
  sections: [
    {
      id: "dev-story",
      title: "웹디자인을 시작한 이유",
      content: "정보가 복잡하거나 사용자가 불편한 화면을 볼 때, 단순히 예쁜 디자인보다 사용자가 쉽게 이해하고 행동할 수 있는 구조가 중요하다고 느꼈습니다. Figma를 활용한 랜딩페이지, 서비스 UI, 반응형 웹디자인 작업과 Claude·AI 도구를 통한 웹 구현 경험을 쌓으며, 기획에서 디자인, 구현까지 연결할 수 있는 실무형 디자이너로 성장하고 있습니다.",
      showInHome: true,
      priority: 1,
    },
    {
      id: "philosophy",
      title: "디자인 방향성",
      content: "보기 좋은 화면보다 사용자가 헷갈리지 않는 화면을 먼저 생각합니다. 정보 구조화, 사용자 흐름 개선, 깔끔한 UI, 반응형 웹, AI 도구 활용이 저의 핵심 역량입니다. Figma로 설계하고 AI 도구로 구현하며, 디자인이 실제 웹 환경에서도 작동할 수 있도록 연결하는 과정을 중요하게 생각합니다.",
      showInHome: true,
      priority: 2,
    },
    {
      id: "personal",
      title: "개인적인 이야기",
      content: "저는 게임, 커뮤니티, 웹서비스처럼 사람들이 정보를 공유하고 소통하는 서비스에 관심이 있습니다. 이 관심을 바탕으로 게임 리뷰와 모임을 다루는 Mini SNS, 수강생과 취업준비생이 정보를 나눌 수 있는 커뮤니티형 프로젝트를 만들고 있습니다.",
      showInHome: false,
      priority: 3,
    },
  ],
  skills: [
    { id: 1, icon: "html",       name: "HTML",       level: 75, category: "Frontend",    description: "시맨틱 마크업과 기본 웹 구조를 이해하고, 포트폴리오와 서비스형 화면 구성에 적용하고 있습니다.",               status: "프로젝트 적용",   showInHome: true,  isMainSkill: true,  priority: 5 },
    { id: 2, icon: "css",        name: "CSS",        level: 70, category: "Frontend",    description: "반응형 레이아웃, 여백, 색상, 카드형 UI 구성 등 화면의 가독성과 정리감을 만드는 데 활용하고 있습니다.",          status: "프로젝트 적용",   showInHome: true,  isMainSkill: true,  priority: 6 },
    { id: 3, icon: "javascript", name: "JavaScript", level: 60, category: "Frontend",    description: "이벤트 처리, 조건부 렌더링, 데이터 흐름 등 사용자 인터랙션을 구현하는 기초를 학습하고 있습니다.",              status: "학습 및 적용 중", showInHome: true,  isMainSkill: true,  priority: 4 },
    { id: 4, icon: "react",      name: "React",      level: 58, category: "Framework",   description: "컴포넌트 기반 화면 구성, 라우팅, 상태 관리 기초를 활용해 실제 작동하는 웹서비스 화면을 구현하고 있습니다.",    status: "학습 및 적용 중", showInHome: true,  isMainSkill: true,  priority: 1 },
    { id: 5, icon: "mui",        name: "MUI",        level: 60, category: "Framework",   description: "카드, 버튼, 폼, 탭, 아코디언 등 UI 컴포넌트를 활용해 일관성 있는 화면을 구성하고 있습니다.",                  status: "프로젝트 적용",   showInHome: true,  isMainSkill: true,  priority: 2 },
    { id: 6, icon: "figma",      name: "Figma",      level: 55, category: "Design",      description: "와이어프레임, 화면 흐름, UI 구조를 정리하는 도구로 활용하며 디자인 의도를 시각화하고 있습니다.",               status: "학습 및 적용 중", showInHome: true,  isMainSkill: true,  priority: 3 },
    { id: 7, icon: "database",   name: "Supabase",   level: 45, category: "Backend / DB",description: "로그인, 게시글, 방명록 등 기본적인 데이터 연동 기능을 프로젝트에 적용하고 있습니다.",                         status: "기초 적용",       showInHome: true,  isMainSkill: true,  priority: 7 },
    { id: 8, icon: "github",     name: "GitHub",     level: 50, category: "Tool",        description: "프로젝트 코드 관리와 GitHub Pages 배포를 통해 결과물을 공유하는 데 활용하고 있습니다.",                       status: "기초 적용",       showInHome: true,  isMainSkill: true,  priority: 8 },
    { id: 9, icon: "ai",         name: "AI Tools",   level: 70, category: "Workflow",    description: "Claude와 ChatGPT를 활용해 아이디어 정리, 코드 보조, 문구 개선, UI 구조 점검에 활용하고 있습니다.",            status: "적극 활용",       showInHome: true,  isMainSkill: false, priority: 9 },
  ],
};

// ── 요약 문구 생성 (100자 초과 시 말줄임) ────────────────────────────
const createSummary = (text = '', maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

// ── Context 생성 ──────────────────────────────────────────────────────
const PortfolioContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────────
export const PortfolioProvider = ({ children }) => {
  const [aboutMeData, setAboutMeData] = useState(initialAboutMeData);

  // Home 탭용 섹션 요약 (showInHome 필터 → priority 정렬 → 100자 요약)
  const getHomeSections = useCallback(() =>
    aboutMeData.sections
      .filter((s) => s.showInHome)
      .sort((a, b) => a.priority - b.priority)
      .map((s) => ({ id: s.id, title: s.title, summary: createSummary(s.content) })),
    [aboutMeData]
  );

  // Home 탭 주요 스킬 (showInHome + isMainSkill → priority 정렬 → 상위 N개)
  const getHomeSkills = useCallback((limit = 4) =>
    aboutMeData.skills
      .filter((s) => s.showInHome && s.isMainSkill)
      .sort((a, b) => a.priority - b.priority)
      .slice(0, limit),
    [aboutMeData]
  );

  // 레벨 상위 스킬 (원본 배열 보호를 위해 spread 복사 후 정렬)
  const getTopSkillsByLevel = useCallback((limit = 4) =>
    [...aboutMeData.skills]
      .sort((a, b) => b.level - a.level)
      .slice(0, limit),
    [aboutMeData]
  );

  // 카테고리별 스킬 필터
  const getSkillsByCategory = useCallback((category) =>
    aboutMeData.skills.filter((s) => s.category === category),
    [aboutMeData]
  );

  // Home 탭에 전달할 요약 데이터 (aboutMeData 변경 시 자동 재계산)
  const homeData = useMemo(() => ({
    basicInfo: aboutMeData.basicInfo,
    sections:  getHomeSections(),
    skills:    getHomeSkills(8),
  }), [aboutMeData, getHomeSections, getHomeSkills]);

  // Context value 메모이제이션 (불필요한 하위 리렌더링 방지)
  const value = useMemo(() => ({
    aboutMeData,
    setAboutMeData,
    homeData,
    getHomeSections,
    getHomeSkills,
    getTopSkillsByLevel,
    getSkillsByCategory,
  }), [aboutMeData, homeData, getHomeSections, getHomeSkills, getTopSkillsByLevel, getSkillsByCategory]);

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

// ── usePortfolio 훅 ───────────────────────────────────────────────────
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio는 PortfolioProvider 안에서 사용해야 합니다.');
  return context;
};

export default PortfolioContext;
