/* 게스트 모드 / Supabase 데이터 없을 때 표시하는 샘플 데이터 */

const now = Date.now();
const ago = (min) => new Date(now - min * 60 * 1000).toISOString();

export const SAMPLE_POSTS = [
  {
    id: 'sample-1',
    title: '버스도착정보 앱 UI 피드백 부탁드립니다.',
    content: '버스도착정보 앱을 포트폴리오 대표 Figma 프로젝트로 넣으려고 합니다. 홈, 검색, 상세, 마이페이지 4개 화면으로 구성했고, 도착 시간과 노선 정보를 빠르게 확인하는 흐름에 집중했습니다. 정보 위계와 색상 대비가 괜찮은지 피드백 부탁드립니다.',
    hashtags: ['Figma', '포트폴리오', 'UX'],
    category: '포트폴리오 피드백',
    profiles: { username: '디자인러너' },
    created_at: ago(40),
    like_count: 12, comment_count: 3, view_count: 84, image_url: null, user_id: 'sample',
  },
  {
    id: 'sample-2',
    title: 'JobFlow Dashboard 프로젝트 설명 문구를 정리해봤습니다.',
    content: 'AI-assisted Coding 프로젝트를 포트폴리오에 넣을 때 "Claude로 만들었다"는 표현이 어색하게 느껴질 수 있어서 어떻게 쓰면 좋을지 고민했습니다. "AI-assisted Coding"이라는 표현이 가장 자연스럽고 투명하게 보이는 것 같습니다.',
    hashtags: ['AI-assisted', '포트폴리오', '취업준비'],
    category: 'AI Coding',
    profiles: { username: '김도한_dev' },
    created_at: ago(90),
    like_count: 28, comment_count: 7, view_count: 156, image_url: null, user_id: 'sample',
  },
  {
    id: 'sample-3',
    title: 'AI-assisted Coding 프로젝트를 포트폴리오에 어떻게 적으면 좋을까요?',
    content: 'Claude나 GPT 같은 AI 도구를 활용해서 만든 프로젝트를 이력서나 포트폴리오에 어떻게 표현하면 좋을지 고민입니다. 솔직하게 쓰는 게 맞는 것 같긴 한데, 채용 담당자 입장에서 어떻게 볼지 궁금합니다.',
    hashtags: ['AI-assisted', '이력서', '취업'],
    category: 'AI Coding',
    profiles: { username: 'UX학습자' },
    created_at: ago(180),
    like_count: 41, comment_count: 12, view_count: 230, image_url: null, user_id: 'sample',
  },
  {
    id: 'sample-4',
    title: 'Figma 모바일 앱 화면 여백 피드백 부탁드립니다.',
    content: '모바일 앱 UI를 처음 Figma로 만들어봤는데, 여백이 너무 좁거나 넓은 것 같아서 피드백 부탁드립니다. 8pt 그리드 시스템을 적용했는데 맞게 적용한 건지도 궁금합니다.',
    hashtags: ['Figma', '모바일UI', '여백'],
    category: 'Figma',
    profiles: { username: 'Figma유저' },
    created_at: ago(300),
    like_count: 9, comment_count: 5, view_count: 67, image_url: null, user_id: 'sample',
  },
  {
    id: 'sample-5',
    title: '포트폴리오 메인 프로젝트 순서 조언 부탁드립니다.',
    content: 'Figma로 설계한 UX 프로젝트와 AI-assisted Coding으로 구현한 React 프로젝트 중 어떤 걸 메인으로 내세우는 게 좋을까요? UX/UI 디자이너 포지션 지원 시 Figma 프로젝트가 더 중요하다고 들었는데, Coding 프로젝트도 차별점이 될 것 같아서요.',
    hashtags: ['포트폴리오', '취업준비', 'UXUI'],
    category: '취업 준비',
    profiles: { username: '취준생모임' },
    created_at: ago(480),
    like_count: 35, comment_count: 9, view_count: 198, image_url: null, user_id: 'sample',
  },
  {
    id: 'sample-6',
    title: '웹디자인 취업 준비 체크리스트 공유합니다.',
    content: '웹디자인/UXUI 직군으로 취업 준비하면서 직접 만든 체크리스트입니다. 포트폴리오 완성도, 이력서, 자기소개서, 면접 준비 항목을 정리했습니다. 혹시 빠진 항목이 있으면 댓글로 알려주세요!',
    hashtags: ['취업준비', '체크리스트', '웹디자인'],
    category: '취업 준비',
    profiles: { username: '웹디자인선생' },
    created_at: ago(720),
    like_count: 67, comment_count: 14, view_count: 412, image_url: null, user_id: 'sample',
  },
];

export const SAMPLE_COMMENTS = {
  'sample-1': [
    { id: 'sc-1-1', content: '도착 시간 색상 기준을 명확히 하면 더 좋아 보입니다. 예를 들어 5분 이내는 초록, 10분 이내는 주황 식으로요.', profiles: { username: 'UX멘토' }, created_at: ago(35), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-1-2', content: '마이페이지는 최근 조회보다 알림/접근성 설정 중심이 좋아 보입니다.', profiles: { username: '디자인피드백' }, created_at: ago(30), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-1-3', content: '상세 화면에 업데이트 시간을 넣으면 실시간 정보 신뢰도가 올라갑니다!', profiles: { username: 'Figma유저' }, created_at: ago(25), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-2': [
    { id: 'sc-2-1', content: '"AI-assisted Coding"이라는 표현 좋네요. 솔직하고 전문적으로 들립니다.', profiles: { username: 'UX학습자' }, created_at: ago(80), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-2-2', content: '저도 비슷한 고민을 했었는데, 도구 활용 능력을 강조하는 방향이 맞는 것 같더라고요.', profiles: { username: '취준생모임' }, created_at: ago(70), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-3': [
    { id: 'sc-3-1', content: '"Claude를 활용해 UI 구조와 기능 구현을 보조받았습니다" 정도면 충분합니다.', profiles: { username: '디자인멘토' }, created_at: ago(170), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-3-2', content: '포트폴리오에 AI 사용 사실을 투명하게 적었는데 채용 담당자가 긍정적으로 봐주셨어요!', profiles: { username: 'UX멘토' }, created_at: ago(160), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-4': [
    { id: 'sc-4-1', content: '8pt 그리드 적용 좋습니다! 카드 간격은 최소 16px 이상이면 숨쉬는 느낌이 나요.', profiles: { username: '디자인러너' }, created_at: ago(290), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-5': [
    { id: 'sc-5-1', content: 'UX/UI 포지션 지원이라면 Figma 프로젝트를 먼저 보여주고, Coding은 기술 활용 능력으로 보완하는 게 좋을 것 같아요.', profiles: { username: '웹디자인선생' }, created_at: ago(470), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-6': [
    { id: 'sc-6-1', content: '정리 감사합니다! 포트폴리오에 GitHub 링크와 배포 URL도 꼭 넣으세요.', profiles: { username: '김도한_dev' }, created_at: ago(710), comment_likes: [], replies: [], user_id: 'sample' },
  ],
};

export const CATEGORIES = ['전체', '포트폴리오 피드백', 'Figma', 'UX/UI', '취업 준비', 'AI Coding', '자유게시판'];
