export const APPLICATION_STATUSES = [
  { value: '관심', label: '관심', color: '#94A3B8', bg: '#F1F5F9' },
  { value: '지원 예정', label: '지원 예정', color: '#64748B', bg: '#F1F5F9' },
  { value: '지원 완료', label: '지원 완료', color: '#2563EB', bg: '#EFF6FF' },
  { value: '서류 진행', label: '서류 진행', color: '#2563EB', bg: '#DBEAFE' },
  { value: '면접 예정', label: '면접 예정', color: '#D97706', bg: '#FEF3C7' },
  { value: '합격', label: '합격', color: '#16A34A', bg: '#DCFCE7' },
  { value: '불합격', label: '불합격', color: '#DC2626', bg: '#FEE2E2' },
  { value: '보류', label: '보류', color: '#64748B', bg: '#F8FAFC' },
];

export const PRIORITY_OPTIONS = [
  { value: '낮음', label: '낮음', color: '#94A3B8' },
  { value: '보통', label: '보통', color: '#F59E0B' },
  { value: '높음', label: '높음', color: '#EF4444' },
];

export const COMPANY_SIZE_OPTIONS = ['스타트업', '중소기업', '중견기업', '대기업', '공기업', '외국계'];

export const NOTE_TYPES = ['메모', '면접', '자기소개서', '포트폴리오', '연락'];

export const IMPORTANCE_OPTIONS = [
  { value: '낮음', label: '낮음', color: '#94A3B8' },
  { value: '보통', label: '보통', color: '#F59E0B' },
  { value: '높음', label: '높음', color: '#EF4444' },
];

export const CHECKLIST_CATEGORIES = ['콘텐츠', '디자인', '반응형', '접근성', '링크', '배포', 'GitHub'];

export const PROMPT_TYPES = ['자기소개서', '면접 답변', '포트폴리오 설명', '지원동기'];

export const NAV_ITEMS = [
  { path: '/', label: '대시보드' },
  { path: '/applications', label: '지원 현황' },
  { path: '/kanban', label: '전형 보드' },
  { path: '/checklist', label: '체크리스트' },
  { path: '/interview', label: '면접 메모' },
  { path: '/ai-prompt', label: 'AI 프롬프트' },
  { path: '/settings', label: '설정' },
];

/* 게스트 모드 샘플 데이터 — 기능 체험용 가상 데이터입니다 */
export const DEMO_APPLICATIONS = [
  {
    id: 'demo-1',
    company_name: '블루핀랩',
    position: 'UX/UI 디자이너',
    location: '서울',
    company_size: '스타트업',
    status: '면접 예정',
    applied_date: '2026-06-10',
    deadline: '2026-07-05',
    priority: '높음',
    portfolio_submitted: true,
    resume_submitted: true,
    memo: '포트폴리오 피드백 긍정적. 실무 면접 준비 필요. 면접 질문 리스트 정리 중.',
    job_url: '',
  },
  {
    id: 'demo-2',
    company_name: '라이트웨이브 스튜디오',
    position: '웹 디자이너',
    location: '서울',
    company_size: '중소기업',
    status: '서류 진행',
    applied_date: '2026-06-15',
    deadline: '2026-06-30',
    priority: '높음',
    portfolio_submitted: true,
    resume_submitted: true,
    memo: '포트폴리오 보완 후 제출 완료. 서류 합격 대기 중.',
    job_url: '',
  },
  {
    id: 'demo-3',
    company_name: '모션브릿지',
    position: '웹 퍼블리셔',
    location: '경기',
    company_size: '중소기업',
    status: '지원 예정',
    applied_date: null,
    deadline: '2026-07-10',
    priority: '보통',
    portfolio_submitted: false,
    resume_submitted: false,
    memo: '이력서 마무리 후 제출 예정. 채용 공고 확인 완료.',
    job_url: '',
  },
  {
    id: 'demo-4',
    company_name: '그린웨이브 디자인',
    position: '프로덕트 디자이너',
    location: '서울',
    company_size: '스타트업',
    status: '서류 진행',
    applied_date: '2026-06-12',
    deadline: '2026-06-28',
    priority: '높음',
    portfolio_submitted: true,
    resume_submitted: true,
    memo: '핀테크 스타트업. UI 역량 강조 필요. 자기소개서 작성 완료.',
    job_url: '',
  },
  {
    id: 'demo-5',
    company_name: '클라우드픽스',
    position: 'UI 디자이너',
    location: '서울',
    company_size: '중견기업',
    status: '지원 완료',
    applied_date: '2026-06-08',
    deadline: '2026-06-25',
    priority: '보통',
    portfolio_submitted: true,
    resume_submitted: true,
    memo: '지원 완료. 결과 대기 중.',
    job_url: '',
  },
  {
    id: 'demo-6',
    company_name: '스카이뷰 인터랙티브',
    position: '프론트엔드 개발자',
    location: '서울',
    company_size: '스타트업',
    status: '관심',
    applied_date: null,
    deadline: '2026-07-15',
    priority: '낮음',
    portfolio_submitted: false,
    resume_submitted: false,
    memo: 'React 기반 포지션. 포트폴리오 보완 후 지원 검토 예정.',
    job_url: '',
  },
  {
    id: 'demo-7',
    company_name: '픽셀하우스',
    position: '웹 디자이너',
    location: '부산',
    company_size: '중소기업',
    status: '불합격',
    applied_date: '2026-05-25',
    deadline: null,
    priority: '보통',
    portfolio_submitted: true,
    resume_submitted: true,
    memo: '서류 불합격. 포트폴리오 프로젝트 설명 강화 필요.',
    job_url: '',
  },
  {
    id: 'demo-8',
    company_name: '디자인웍스',
    position: 'UXUI 디자이너',
    location: '서울',
    company_size: '중소기업',
    status: '보류',
    applied_date: '2026-06-01',
    deadline: null,
    priority: '낮음',
    portfolio_submitted: true,
    resume_submitted: true,
    memo: '채용 일정 연기됨. 추후 재공고 예정이라는 안내 수신.',
    job_url: '',
  },
];

export const DEMO_CHECKLISTS = [
  { id: 'cl-1', title: '포트폴리오 대표 프로젝트 순서 정리', category: '포트폴리오', is_done: true, sort_order: 1 },
  { id: 'cl-2', title: 'JobFlow Dashboard 설명 문구 수정', category: '포트폴리오', is_done: true, sort_order: 2 },
  { id: 'cl-3', title: '자기소개서 1차 수정', category: '서류', is_done: false, sort_order: 3 },
  { id: 'cl-4', title: '면접 질문 5개 답변 작성', category: '면접', is_done: false, sort_order: 4 },
  { id: 'cl-5', title: '블루핀랩 면접 복장 준비', category: '면접', is_done: false, sort_order: 5 },
  { id: 'cl-6', title: '모션브릿지 이력서 최종 확인', category: '서류', is_done: false, sort_order: 6 },
  { id: 'cl-7', title: 'GitHub README 정리', category: '포트폴리오', is_done: true, sort_order: 7 },
  { id: 'cl-8', title: '포트폴리오 모바일 반응형 확인', category: '포트폴리오', is_done: true, sort_order: 8 },
  { id: 'cl-9', title: '자기소개서 지원동기 단락 보완', category: '서류', is_done: false, sort_order: 9 },
];

export const DEMO_INTERVIEW_NOTES = [
  {
    id: 'in-1',
    question: '자기소개를 해주세요.',
    answer: '안녕하세요. 저는 UX/UI 기반 웹디자이너로 사용자 흐름을 정리하고 실무형 웹서비스 화면을 구현하는 것을 목표로 학습하고 있습니다.',
    related_project: 'Mini SNS',
    importance: '높음',
    is_reviewed: true,
  },
  {
    id: 'in-2',
    question: '본인의 강점은 무엇인가요?',
    answer: '사용자 흐름을 정리하고 실무형 웹서비스 화면을 구현하는 능력이 강점입니다.',
    related_project: 'JobFlow Dashboard',
    importance: '높음',
    is_reviewed: false,
  },
  {
    id: 'in-3',
    question: 'React를 선택한 이유는?',
    answer: '컴포넌트 기반 설계로 재사용성이 높고, MUI와 결합 시 빠르게 실무형 UI를 구현할 수 있기 때문입니다.',
    related_project: 'Portfolio Feedback Hub',
    importance: '보통',
    is_reviewed: false,
  },
];
