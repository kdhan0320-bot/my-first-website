/* 게스트 모드 / Supabase 데이터 없을 때 표시하는 샘플 데이터 */

const now = Date.now();
const ago = (min) => new Date(now - min * 60 * 1000).toISOString();

export const SAMPLE_POSTS = [
  // ── 포트폴리오 피드백 ──
  {
    id: 'sample-1',
    title: '버스도착정보 앱 UI 피드백 부탁드립니다.',
    content: '버스도착정보 앱을 포트폴리오 대표 Figma 프로젝트로 넣으려고 합니다. 홈, 검색, 상세, 마이페이지 4개 화면으로 구성했고, 도착 시간과 노선 정보를 빠르게 확인하는 흐름에 집중했습니다. 정보 위계와 색상 대비가 괜찮은지 피드백 부탁드립니다.',
    hashtags: ['Figma', '포트폴리오', 'UX'],
    category: '포트폴리오 피드백',
    profiles: { username: '디자인러너' },
    created_at: ago(115),
    like_count: 12, comment_count: 3, image_url: null, user_id: 'sample',
  },
  {
    id: 'sample-7',
    title: '카페 앱 메인 화면 색감 피드백 부탁드립니다',
    content: '카페 주문 앱 메인 화면을 브라운·크림 톤으로 잡아봤는데 너무 차분해서 밋밋해 보이는 것 같기도 합니다. 포인트 컬러를 하나 더 넣는 게 나을지, 지금 톤을 유지하는 게 나을지 의견 부탁드립니다.',
    hashtags: ['Figma', '컬러', '포트폴리오'],
    category: '포트폴리오 피드백',
    profiles: { username: '카페앱디자이너' },
    created_at: ago(15),
    like_count: 4, comment_count: 0, image_url: null, user_id: 'sample',
  },
  {
    id: 'sample-8',
    title: '웹 포트폴리오 첫 화면 문구 조언 부탁드립니다',
    content: '포트폴리오 첫 화면 히어로 문구를 "안녕하세요, OOO입니다" 대신 프로젝트 목적이 바로 보이는 문장으로 바꿔보려 합니다. 어떤 톤으로 쓰면 채용 담당자 시선을 더 끌 수 있을지 궁금합니다.',
    hashtags: ['포트폴리오', '카피라이팅'],
    category: '포트폴리오 피드백',
    profiles: { username: '웹디자인준비생' },
    created_at: ago(300),
    like_count: 18, comment_count: 4, image_url: null, user_id: 'sample',
  },

  // ── Figma ──
  {
    id: 'sample-4',
    title: 'Figma 모바일 앱 화면 여백 피드백 부탁드립니다.',
    content: '모바일 앱 UI를 처음 Figma로 만들어봤는데, 여백이 너무 좁거나 넓은 것 같아서 피드백 부탁드립니다. 8pt 그리드 시스템을 적용했는데 맞게 적용한 건지도 궁금합니다.',
    hashtags: ['Figma', '모바일UI', '여백'],
    category: 'Figma',
    profiles: { username: 'Figma유저' },
    created_at: ago(340),
    like_count: 9, comment_count: 5, image_url: null, user_id: 'sample',
  },
  {
    id: 'sample-9',
    title: 'Auto Layout으로 카드 컴포넌트 정리해봤습니다',
    content: 'Figma Auto Layout으로 게시글 카드 컴포넌트를 만들어봤습니다. 제목 길이가 달라져도 카드 높이가 자연스럽게 늘어나게 했는데, 실제 화면 구현에서도 이런 구조가 무리 없이 적용될지 궁금합니다.',
    hashtags: ['Figma', 'AutoLayout', '컴포넌트'],
    category: 'Figma',
    profiles: { username: '디자인시스템러버' },
    created_at: ago(30),
    like_count: 15, comment_count: 2, image_url: null, user_id: 'sample',
  },
  {
    id: 'sample-10',
    title: '디자인 시스템 버튼 상태값 정리 중입니다',
    content: '버튼 컴포넌트의 default/hover/pressed/disabled 상태를 Variants로 정리하고 있습니다. 상태별 색상 대비가 충분한지, 놓친 상태값은 없는지 확인 부탁드립니다.',
    hashtags: ['Figma', '디자인시스템'],
    category: 'Figma',
    profiles: { username: '컴포넌트장인' },
    created_at: ago(165),
    like_count: 21, comment_count: 3, image_url: null, user_id: 'sample',
  },

  // ── UX/UI ──
  {
    id: 'sample-11',
    title: '회원가입 단계를 3단계로 나누는 게 나을까요?',
    content: '회원가입을 한 화면에 다 넣을지, 이메일 인증-비밀번호-프로필 순서로 3단계로 나눌지 고민입니다. 이탈률과 완성도 중 무엇을 더 우선해야 할지 의견 듣고 싶습니다.',
    hashtags: ['UXUI', '회원가입', '플로우'],
    category: 'UX/UI',
    profiles: { username: 'UX리서처' },
    created_at: ago(45),
    like_count: 7, comment_count: 0, image_url: null, user_id: 'sample',
  },
  {
    id: 'sample-12',
    title: '검색 필터 위치가 사용하기 편한지 궁금합니다',
    content: '카테고리 필터를 검색창 위에 둘지, 검색창 아래에 둘지 테스트해보고 있습니다. 모바일 화면에서는 필터가 검색창을 가리는 느낌이 들어서 순서를 바꿔야 할지 고민입니다.',
    hashtags: ['UXUI', '검색', '모바일'],
    category: 'UX/UI',
    profiles: { username: '인터랙션디자이너' },
    created_at: ago(140),
    like_count: 11, comment_count: 2, image_url: null, user_id: 'sample',
  },
  {
    id: 'sample-13',
    title: '상세 페이지 CTA 버튼 위치 피드백 부탁드립니다',
    content: '게시물 상세 페이지에서 "좋아요" 버튼을 본문 하단 중앙에 크게 배치했는데, 스크롤을 많이 내려야 보이는 게 단점인 것 같습니다. 상단 고정 방식과 비교했을 때 어떤 방식이 더 나을지 궁금합니다.',
    hashtags: ['UXUI', 'CTA'],
    category: 'UX/UI',
    profiles: { username: 'UX졸업준비생' },
    created_at: ago(385),
    like_count: 19, comment_count: 5, image_url: null, user_id: 'sample',
  },

  // ── 취업 준비 ──
  {
    id: 'sample-5',
    title: '포트폴리오 메인 프로젝트 순서 조언 부탁드립니다.',
    content: 'Figma로 설계한 UX 프로젝트와 AI-assisted Coding으로 구현한 React 프로젝트 중 어떤 걸 메인으로 내세우는 게 좋을까요? UX/UI 디자이너 포지션 지원 시 Figma 프로젝트가 더 중요하다고 들었는데, Coding 프로젝트도 차별점이 될 것 같아서요.',
    hashtags: ['포트폴리오', '취업준비', 'UXUI'],
    category: '취업 준비',
    profiles: { username: '취준생모임' },
    created_at: ago(195),
    like_count: 35, comment_count: 9, image_url: null, user_id: 'sample',
  },
  {
    id: 'sample-6',
    title: '웹디자인 취업 준비 체크리스트 공유합니다.',
    content: '웹디자인/UXUI 직군으로 취업 준비하면서 직접 만든 체크리스트입니다. 포트폴리오 완성도, 이력서, 자기소개서, 면접 준비 항목을 정리했습니다. 혹시 빠진 항목이 있으면 댓글로 알려주세요!',
    hashtags: ['취업준비', '체크리스트', '웹디자인'],
    category: '취업 준비',
    profiles: { username: '웹디자인선생' },
    created_at: ago(435),
    like_count: 67, comment_count: 14, image_url: null, user_id: 'sample',
  },
  {
    id: 'sample-14',
    title: '면접에서 이 프로젝트를 어떻게 설명하면 좋을까요?',
    content: 'Portfolio Feedback Hub 프로젝트를 면접에서 소개할 때, Supabase 연동이나 라우팅 구조보다 "왜 만들었는지"를 먼저 말하는 게 나을지 고민입니다. 기술 스택 설명과 기획 의도 중 어떤 걸 먼저 이야기해야 할지 궁금합니다.',
    hashtags: ['면접', '취업준비'],
    category: '취업 준비',
    profiles: { username: '면접준비중' },
    created_at: ago(60),
    like_count: 6, comment_count: 0, image_url: null, user_id: 'sample',
  },

  // ── AI Coding ──
  {
    id: 'sample-2',
    title: 'JobFlow Dashboard 프로젝트 설명 문구를 정리해봤습니다.',
    content: 'AI-assisted Coding 프로젝트를 포트폴리오에 넣을 때 "Claude로 만들었다"는 표현이 어색하게 느껴질 수 있어서 어떻게 쓰면 좋을지 고민했습니다. "AI-assisted Coding"이라는 표현이 가장 자연스럽고 투명하게 보이는 것 같습니다.',
    hashtags: ['AI-assisted', '포트폴리오', '취업준비'],
    category: 'AI Coding',
    profiles: { username: '김도한_dev' },
    created_at: ago(225),
    like_count: 28, comment_count: 7, image_url: null, user_id: 'sample',
  },
  {
    id: 'sample-3',
    title: 'AI-assisted Coding 프로젝트를 포트폴리오에 어떻게 적으면 좋을까요?',
    content: 'Claude나 GPT 같은 AI 도구를 활용해서 만든 프로젝트를 이력서나 포트폴리오에 어떻게 표현하면 좋을지 고민입니다. 솔직하게 쓰는 게 맞는 것 같긴 한데, 채용 담당자 입장에서 어떻게 볼지 궁금합니다.',
    hashtags: ['AI-assisted', '이력서', '취업'],
    category: 'AI Coding',
    profiles: { username: 'UX학습자' },
    created_at: ago(490),
    like_count: 41, comment_count: 12, image_url: null, user_id: 'sample',
  },
  {
    id: 'sample-15',
    title: 'Supabase 연동 과정을 포트폴리오에 어떻게 설명할까요?',
    content: 'Auth, RLS, 실시간 좋아요/댓글 카운트까지 Supabase로 구현했는데, 이 과정에서 어떤 부분을 직접 설계했고 어떤 부분에서 AI 도움을 받았는지 나눠서 설명하는 게 좋을지 궁금합니다.',
    hashtags: ['Supabase', 'AI-assisted'],
    category: 'AI Coding',
    profiles: { username: '풀스택준비생' },
    created_at: ago(75),
    like_count: 13, comment_count: 1, image_url: null, user_id: 'sample',
  },

  // ── 자유게시판 ──
  {
    id: 'sample-16',
    title: '오늘 작업 집중 잘 되는 방법 공유합니다',
    content: '25분 집중, 5분 휴식 뽀모도로 방식으로 포트폴리오 작업을 하니 확실히 덜 지치는 것 같습니다. 다들 어떤 방식으로 집중력을 유지하시나요?',
    hashtags: ['잡담', '작업루틴'],
    category: '자유게시판',
    profiles: { username: '오늘도작업중' },
    created_at: ago(95),
    like_count: 8, comment_count: 2, image_url: null, user_id: 'sample',
  },
  {
    id: 'sample-17',
    title: '포트폴리오 피드백 받을 때 멘탈 관리법',
    content: '냉정한 피드백을 받으면 처음엔 속상하지만, 결국 완성도를 높이는 데 다 도움이 되더라고요. 저는 피드백을 받으면 하루 정도 묵혀뒀다가 다시 읽어보는 편입니다.',
    hashtags: ['잡담', '멘탈관리'],
    category: '자유게시판',
    profiles: { username: '취준생모임' },
    created_at: ago(550),
    like_count: 24, comment_count: 6, image_url: null, user_id: 'sample',
  },
  {
    id: 'sample-18',
    title: '학원 과제 정리 루틴 공유합니다',
    content: '과제를 마칠 때마다 노션에 진행 과정과 배운 점을 짧게 기록해두는데, 나중에 포트폴리오 작성할 때 정말 큰 도움이 됩니다. 다른 분들은 과제 기록을 어떻게 관리하시는지 궁금합니다.',
    hashtags: ['잡담', '학습기록'],
    category: '자유게시판',
    profiles: { username: '웹디자인준비생' },
    created_at: ago(260),
    like_count: 16, comment_count: 3, image_url: null, user_id: 'sample',
  },
];

export const SAMPLE_COMMENTS = {
  'sample-1': [
    { id: 'sc-1-1', content: '도착 시간 색상 기준을 명확히 하면 더 좋아 보입니다. 예를 들어 5분 이내는 초록, 10분 이내는 주황 식으로요.', profiles: { username: 'UX멘토' }, created_at: ago(35), comment_likes: [], replies: [
      { id: 'sc-1-1-1', content: '좋은 의견이네요! 색상 기준표를 화면에 범례로 추가하면 더 명확할 것 같아요.', profiles: { username: '디자인러너' }, created_at: ago(32), comment_likes: [], user_id: 'sample' },
    ], user_id: 'sample' },
    { id: 'sc-1-2', content: '마이페이지는 최근 조회보다 알림/접근성 설정 중심이 좋아 보입니다.', profiles: { username: '디자인피드백' }, created_at: ago(30), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-1-3', content: '상세 화면에 업데이트 시간을 넣으면 실시간 정보 신뢰도가 올라갑니다!', profiles: { username: 'Figma유저' }, created_at: ago(25), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-7': [],
  'sample-8': [
    { id: 'sc-8-1', content: '"안녕하세요" 대신 "무엇을 만들었는지"로 시작하면 첫 인상이 훨씬 선명해질 것 같아요.', profiles: { username: 'UX멘토' }, created_at: ago(140), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-8-2', content: '프로젝트 목적 + 사용 기술을 한 줄로 압축하는 방향 추천드려요.', profiles: { username: '디자인시스템러버' }, created_at: ago(120), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-8-3', content: '지원 직군에 맞춰 문구 톤을 다르게 가져가는 것도 방법입니다.', profiles: { username: '취준생모임' }, created_at: ago(100), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-8-4', content: '저도 비슷한 고민했는데 결국 담백하게 쓰는 게 제일 낫더라고요.', profiles: { username: '웹디자인선생' }, created_at: ago(80), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-4': [
    { id: 'sc-4-1', content: '8pt 그리드 적용 좋습니다! 카드 간격은 최소 16px 이상이면 숨쉬는 느낌이 나요.', profiles: { username: '디자인러너' }, created_at: ago(290), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-4-2', content: '상단 여백이 조금 좁아 보이는데 24px 정도로 늘려보는 것도 좋을 것 같습니다.', profiles: { username: '컴포넌트장인' }, created_at: ago(270), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-9': [
    { id: 'sc-9-1', content: 'Auto Layout 잘 쓰셨네요. 텍스트가 3줄 이상일 때도 잘 늘어나는지 확인해보세요.', profiles: { username: 'Figma유저' }, created_at: ago(55), comment_likes: [], replies: [
      { id: 'sc-9-1-1', content: '확인해봤는데 4줄까지도 자연스럽게 늘어나서 다행이에요!', profiles: { username: '디자인시스템러버' }, created_at: ago(50), comment_likes: [], user_id: 'sample' },
    ], user_id: 'sample' },
  ],
  'sample-10': [
    { id: 'sc-10-1', content: 'disabled 상태의 텍스트 대비가 살짝 낮아 보여요. 명도 대비 체크 도구로 확인해보시길 추천드려요.', profiles: { username: 'UX졸업준비생' }, created_at: ago(200), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-10-2', content: 'pressed 상태에 살짝 스케일 다운 효과까지 있으면 완성도가 더 높아질 것 같습니다.', profiles: { username: '인터랙션디자이너' }, created_at: ago(180), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-11': [],
  'sample-12': [
    { id: 'sc-12-1', content: '모바일에서는 필터를 칩 형태로 검색창 아래 가로 스크롤로 배치하는 게 무난합니다.', profiles: { username: 'UX리서처' }, created_at: ago(120), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-12-2', content: '저도 검색창 아래가 더 자연스러운 흐름이라고 생각해요.', profiles: { username: 'UX졸업준비생' }, created_at: ago(110), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-13': [
    { id: 'sc-13-1', content: '상단 고정 방식이 접근성 측면에서 더 유리할 것 같아요. 스크롤 중에도 바로 누를 수 있으니까요.', profiles: { username: '인터랙션디자이너' }, created_at: ago(320), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-13-2', content: '중앙 배치는 시각적 임팩트는 있지만 반복 클릭엔 불편할 수 있어요.', profiles: { username: 'UX멘토' }, created_at: ago(300), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-13-3', content: '두 방식을 A/B 테스트 해보는 것도 좋은 방법이겠네요.', profiles: { username: 'UX리서처' }, created_at: ago(280), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-5': [
    { id: 'sc-5-1', content: 'UX/UI 포지션 지원이라면 Figma 프로젝트를 먼저 보여주고, Coding은 기술 활용 능력으로 보완하는 게 좋을 것 같아요.', profiles: { username: '웹디자인선생' }, created_at: ago(470), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-6': [
    { id: 'sc-6-1', content: '정리 감사합니다! 포트폴리오에 GitHub 링크와 배포 URL도 꼭 넣으세요.', profiles: { username: '김도한_dev' }, created_at: ago(710), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-14': [],
  'sample-2': [
    { id: 'sc-2-1', content: '"AI-assisted Coding"이라는 표현 좋네요. 솔직하고 전문적으로 들립니다.', profiles: { username: 'UX학습자' }, created_at: ago(80), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-2-2', content: '저도 비슷한 고민을 했었는데, 도구 활용 능력을 강조하는 방향이 맞는 것 같더라고요.', profiles: { username: '취준생모임' }, created_at: ago(70), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-3': [
    { id: 'sc-3-1', content: '"Claude를 활용해 UI 구조와 기능 구현을 보조받았습니다" 정도면 충분합니다.', profiles: { username: '디자인멘토' }, created_at: ago(170), comment_likes: [], replies: [
      { id: 'sc-3-1-1', content: '이 표현 그대로 제 README에도 참고했어요, 감사합니다!', profiles: { username: 'UX학습자' }, created_at: ago(165), comment_likes: [], user_id: 'sample' },
    ], user_id: 'sample' },
    { id: 'sc-3-2', content: '포트폴리오에 AI 사용 사실을 투명하게 적었는데 채용 담당자가 긍정적으로 봐주셨어요!', profiles: { username: 'UX멘토' }, created_at: ago(160), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-15': [
    { id: 'sc-15-1', content: 'RLS 정책 설계 부분을 직접 했다고 강조하면 백엔드 이해도를 어필할 수 있어요.', profiles: { username: '김도한_dev' }, created_at: ago(45), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-16': [
    { id: 'sc-16-1', content: '뽀모도로 좋죠! 저는 타이머 대신 재생목록 길이로 집중 시간을 나눠요.', profiles: { username: '취준생모임' }, created_at: ago(30), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-16-2', content: '25분은 저한텐 조금 짧아서 40분으로 늘려서 하고 있어요.', profiles: { username: '웹디자인준비생' }, created_at: ago(20), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-17': [
    { id: 'sc-17-1', content: '하루 묵혀두는 방법 좋네요. 저는 피드백을 카테고리별로 나눠 정리해두니 감정 소모가 줄었어요.', profiles: { username: 'UX멘토' }, created_at: ago(390), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-17-2', content: '공감합니다. 피드백은 결국 제 실력을 위한 거니까요!', profiles: { username: '오늘도작업중' }, created_at: ago(370), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-17-3', content: '멘탈 관리 팁 감사합니다, 저도 적용해볼게요.', profiles: { username: '면접준비중' }, created_at: ago(350), comment_likes: [], replies: [], user_id: 'sample' },
  ],
  'sample-18': [
    { id: 'sc-18-1', content: '노션 기록 정말 좋은 습관이네요! 저도 오늘부터 시작해봐야겠어요.', profiles: { username: '오늘도작업중' }, created_at: ago(250), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-18-2', content: '과제별 Before/After 스크린샷도 같이 남기면 포트폴리오에 바로 쓸 수 있어요.', profiles: { username: '디자인러너' }, created_at: ago(230), comment_likes: [], replies: [], user_id: 'sample' },
    { id: 'sc-18-3', content: '기록 습관이 나중에 이력서 작성 시간도 크게 줄여주더라고요.', profiles: { username: '취준생모임' }, created_at: ago(210), comment_likes: [], replies: [], user_id: 'sample' },
  ],
};

export const CATEGORIES = ['전체', '포트폴리오 피드백', 'Figma', 'UX/UI', '취업 준비', 'AI Coding', '자유게시판'];

// 카테고리 라벨: posts 테이블에 category 컬럼이 없으므로 샘플 데이터의 category 또는
// CATEGORIES와 일치하는 해시태그로 유추한다 (DB 스키마 변경 없음).
export const getCategoryLabel = (post) => {
  if (post.category) return post.category;
  return post.hashtags?.find((tag) => CATEGORIES.includes(tag)) ?? null;
};

// 상태 배지: 댓글 수/카테고리 기반 휴리스틱으로 계산 (DB 스키마 변경 없음).
// color는 옅은 배경 틴트(`${color}1A`) 위에서도 WCAG AA(4.5:1) 대비를 만족하도록 진한 톤으로 지정한다.
export const getStatusBadge = (post) => {
  const category = getCategoryLabel(post);
  if (category === 'AI Coding') return { label: 'AI 활용', color: '#4338CA' };
  if (category === '취업 준비') return { label: '취업 준비', color: '#1D4ED8' };
  if ((post.comment_count ?? 0) === 0) return { label: '피드백 요청중', color: '#92400E' };
  return { label: '답변 완료', color: '#1B5E20' };
};
