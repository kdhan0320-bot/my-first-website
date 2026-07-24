import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ALL_PROJECTS } from '../data/projectsData';
import { FONT_MONO, HUMAN_SIGNAL, ULTRAWIDE_CONTENT_MAX_WIDTH } from '../theme';
import DMark from '../components/brand/DMark';
import RevealOnScroll from '../components/ui/RevealOnScroll';
import ActionIcon from '../components/ui/ActionIcon';
import QhdSectionIndex from '../components/ui/QhdSectionIndex';
import ProjectMediaStage from '../components/ui/ProjectMediaStage';
import { CONTACT_EMAIL } from '../constants/site';

/* Human Signal Phase 5A: ChatGPT가 최신 Figma(53Ppn2hIgrvs9Jra3eejFs,
 * "21_READY_Projects" 페이지, Desktop node 206:5)를 직접 조회해 실제 코드와 대조한
 * 결과, Phase 3A 이후의 이 페이지는 Human Signal 토큰은 쓰지만 최신 Figma
 * 구조(Warm Paper Hero + dark View Guide 패널, dark full-bleed Featured,
 * light More Works, dark Footer, QHD 01~03 index)와는 달랐다 — 그래서
 * "처음 Human Signal로 바꾸는 작업"이 아니라 "이미 Human Signal인 코드를
 * 최신 Figma에 맞추는 delta sync"다. 아래 텍스트는 전부 direct node
 * `get_design_context` 실측 카피를 그대로 옮겼다(임의 문구·성과 수치 없음).
 *
 * Figma More Works 카드는 2개(OTT Service + Mini SNS)지만, Mini SNS는
 * `moreWorksPublished`가 없어 실제 공개 대상이 아니다(projects/my-portfolio/
 * README.md의 공개 규칙과 동일 기준) — Figma의 "공개 작업 두 개"라는 placeholder 카피를
 * 그대로 베끼지 않고, 실제 공개 개수를 데이터에서 계산해 쓴다. Figma
 * active final의 Mini SNS 카드 노출은 이번 회차에서 Figma 쪽을 실제 공개
 * 상태에 맞추는 것으로 해결한다(코드에 새로 공개하지 않는다).
 *
 * Human Signal Phase 5A-F(Figma 충실도 복구): QHD 208:2 / Desktop 206:5 /
 * Compact 209:2 / Mobile 212:2 4개 node를 `get_design_context`로 직접 다시
 * 조회해 typography(Noto Sans KR/IBM Plex Mono)·geometry(shell·Hero H1·
 * Featured heading·card·media·ROLE/DATA·More Work·Footer D mark)를 재동기화
 * 했다. 이 페이지 전용 변경이며 Home/Detail/Navbar는 건드리지 않는다. */
const FEATURED_REFS = [
  {
    id: 'jobflow', slug: 'jobflow', displayTitle: 'JobFlow',
    proof: '업무 흐름과 실제 저장 구조를 연결하는 능력',
    role: 'DASHBOARD · SERVICE', data: 'ACTUAL / DEMO', mediaRotate: 2,
  },
  {
    id: 'bus-arrival-app', slug: 'bus-arrival', displayTitle: '버스 도착정보 앱',
    proof: '중요한 정보를 먼저 읽게 만드는 모바일 우선순위',
    role: 'MOBILE UI · FIGMA', data: 'STATIC SAMPLE', mediaRotate: 0,
  },
  {
    id: 'feedback-hub', slug: 'feedback-hub', displayTitle: 'Portfolio Feedback Hub',
    proof: '게스트 탐색과 참여 흐름을 분리한 커뮤니티 UX',
    role: 'COMMUNITY · SUPABASE', data: 'ACTUAL / FALLBACK', mediaRotate: -1.5,
  },
];

const FEATURED_CARDS = FEATURED_REFS
  .map((ref) => {
    const project = ALL_PROJECTS.find((p) => p.id === ref.id);
    return project ? { ...ref, project } : null;
  })
  .filter(Boolean);

const MORE_WORKS = ALL_PROJECTS.filter((p) => p.moreWorksPublished === true);

/* Projects 페이지 전용 승인 카피 — 전역 projectsData의 project.description은
 * 다른 화면(More Works 홈 섹션 등)이 같이 참조하므로 바꾸지 않고, 이 페이지의
 * More Work 카드에서만 project.id 기준으로 대체한다. */
const PROJECTS_MORE_WORK_COPY = {
  'ott-service': 'HTML·CSS·JavaScript 기반 반응형 콘텐츠 서비스',
};

/* Figma direct node가 확정한 한글 UI 서체(Noto Sans KR)다. 전역 `FONT_SANS`
 * (SUIT Variable)는 Home/Detail/Navbar가 공유하는 토큰이라 여기서 바꾸면
 * 이번 회차 범위(= /projects 한 페이지, Home 파일 변경 0) 밖까지 영향을
 * 준다 — 그래서 theme.js를 건드리지 않고 이 페이지의 한글 Typography에만
 * `FONT_KR`을 개별 적용한다. IBM Plex Mono(FONT_MONO)는 기존과 동일하게
 * 라벨/기술 텍스트 전용으로 유지한다. */
const FONT_KR = '"Noto Sans KR", "Pretendard", "Malgun Gothic", sans-serif';

/* Figma QHD(2560) "Projects Hero/Featured/More Works/Footer" 4개 프레임 모두
 * divider가 x=504~2056(폭 1552)로 고정돼 있다 — Home이 공유하는 전역
 * `HOME_WIDE_MAX_WIDTH`(1440, 내부 콘텐츠 1312)보다 이 페이지의 QHD 콘텐츠
 * 폭이 더 넓다는 뜻이다. Navbar는 이번 회차 변경 대상이 아니므로 실제 사이트
 * 헤더는 여전히 1312 shell을 쓴다(Figma 원본은 헤더까지 같은 1552 프레임
 * 안에 있어 폭이 같지만, 이 앱은 헤더가 전역 공용 컴포넌트라 구조적으로
 * 분리돼 있다 — Home도 이미 같은 구조라 새로운 제약이 아니다). */
/* 768(sm) content shell padding — Figma 실측 x64/width640 대비 기존 sm값(20px,
 * xs와 동일)은 실제 x22/width726으로 렌더됐다. sm만 64px(=8*8)로 올린다. 390은
 * 20px, 1024는 48px, 1440/2560은 기존 64px를 그대로 유지한다. */
const SHELL_SX = {
  px: { xs: 2.5, sm: 8, md: 6, lg: 8 },
  maxWidth: { xl: ULTRAWIDE_CONTENT_MAX_WIDTH + 128 },
  mx: 'auto',
  '@media (min-width:1920px)': { maxWidth: 1552, px: 0 },
};

/* QHD(1920+) 전용 01~03 index 좌우 gutter offset — Figma "QHD / Projects Signal
 * Field"(381:257) 실측(2560 기준: 01/03 left index x=58 · label x=124,
 * 02 right index x=2210 · label x=2140)에서 역산했다. Home과 side당 offset
 * 값이 살짝 다르다(QhdSectionIndex.jsx 상단 주석 참고). */
const QHD_LEFT = { indexOffset: 502, labelOffset: 436 };
const QHD_RIGHT = { indexOffset: 210, labelOffset: 140 };

const focusVisibleSx = {
  '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px' },
};

/* Human Signal Phase 5A-F2: Figma 4개 breakpoint 전부에 있는 배경 halo/arc/rail
 * 장식(Sage Halo, Orange Halo, Alignment Rail, Sage Arc, Orange Arc)이
 * Phase 5A-F에서 통째로 빠져 있었다(fresh visual-verifier가 발견, git history로
 * 이번 회차 회귀가 아니라 원래부터 없었음을 확인함). 새 이미지 자산·패키지를
 * 추가하지 않고 CSS radial-gradient(halo)·outline circle(arc)·1px 세로선(rail)
 * 으로 재현한다 — 전부 aria-hidden + pointer-events:none이며, 각 section의
 * 콘텐츠 Box보다 먼저 렌더돼(DOM 순서) 배경으로만 깔린다(z-index 불필요). */
/* 첫 구현은 sage/orange halo를 opacity 0.26~0.30로 넣었는데, 실제 Figma
 * 스크린샷(figma-2560.png)과 나란히 보니 Figma 쪽이 훨씬 뚜렷한 채도 있는
 * soft-glow였다(옅은 정도가 아니라 눈에 띄는 원형 signal) — 0.40~0.46으로
 * 올리고 fade 구간도 70%→82%로 늘렸다. "Sage Arc"/"Orange Arc" 레이어도
 * Figma 스크린샷상 얇은 outline이 아니라 halo와 같은 채워진 soft glow라
 * `Arc`를 `Halo`와 같은 radial-gradient로 통일한다(레이어 이름만 유지). */
const Halo = ({ tone = 'sage', sx }) => (
  <Box aria-hidden="true" sx={{
    position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
    background: tone === 'sage'
      ? 'radial-gradient(circle, rgba(144,165,139,0.44) 0%, rgba(144,165,139,0) 82%)'
      : 'radial-gradient(circle, rgba(216,92,50,0.40) 0%, rgba(216,92,50,0) 82%)',
    ...sx,
  }} />
);

const Arc = Halo;

const AlignmentRail = ({ sx }) => (
  <Box aria-hidden="true" sx={{
    position: 'absolute', width: '1px', bgcolor: 'rgba(226,217,204,0.18)', pointerEvents: 'none',
    ...sx,
  }} />
);

/* ── Hero ── */
/* View Guide 패널 내부 geometry — Figma 실측 절대 좌표(390/768/1024+ 3개
 * variant)를 그대로 옮긴다. flow(margin/gap)로 근사하면 breakpoint마다 실제
 * 텍스트 줄바꿈에 따라 오차가 누적돼 ±4px 허용 오차를 반복해서 못 맞췄다 —
 * 그래서 패널 자체와 Label/Row/Divider/Note를 모두 `position:absolute`로
 * 패널 좌상단 기준 고정 좌표에 놓는다(패널엔 padding을 주지 않는다 — 자식의
 * left/top이 이미 실제 여백 값이라 padding을 더하면 중복 오프셋이 된다). */
const VIEW_GUIDE_ROW_GEOMETRY = [
  { xsKeyTop: 76, xsValueTop: 104, smTop: 102 },
  { xsKeyTop: 188, xsValueTop: 216, smTop: 194 },
  { xsKeyTop: 300, xsValueTop: 328, smTop: 286 },
];

const ViewGuideRow = ({ eyebrow, value, accent, geometry }) => (
  <>
    <Typography sx={{
      position: 'absolute', left: 28, top: { xs: geometry.xsKeyTop, sm: geometry.smTop },
      fontFamily: FONT_MONO, fontSize: '0.75rem', letterSpacing: '0.04em',
      color: accent ? HUMAN_SIGNAL.brightOrangeOnDark : HUMAN_SIGNAL.mutedSage,
    }}>
      {eyebrow}
    </Typography>
    <Typography sx={{
      position: 'absolute', left: { xs: 28, sm: 150, md: 178 }, right: 28,
      top: { xs: geometry.xsValueTop, sm: geometry.smTop },
      fontFamily: FONT_KR, fontSize: '16px', lineHeight: '27px', color: HUMAN_SIGNAL.softWhite, wordBreak: 'keep-all',
    }}>
      {value}
    </Typography>
  </>
);

/* Phase 5A-R Batch C 9-1: Figma Compact 1024(209:3)은 copy가 위, View Guide가
 * 아래 full width로 쌓인다. MUI 기본 `md`(900px)에서 좌우 2-column으로 전환하면
 * 1024가 그 사이에 끼어 copy 폭이 지나치게 좁아지고 headline이 3줄로 깨졌다
 * (사용자가 실제 2560/1024에서 발견) — 전환 기준을 `lg`(1200px)로 늦춘다. */
/* Human Signal Phase 5A-F2 항목 1/6: Figma 4개 node의 자체 frame 높이(Hero
 * 390=1120 · 1024=1050 · 1440/2560=680 동일)를 section `minHeight`로 그대로
 * 옮긴다. section은 여전히 block(단일 자식)이라 실제 콘텐츠가 이 값보다
 * 짧으면 남는 여백은 자식 뒤(section 하단)에 자연스럽게 쌓인다 — Figma도
 * 콘텐츠를 상단에 놓고 하단 여백을 넉넉히 두는 구조라 이 방식이 그대로
 * 맞는다("단순 min-height + 콘텐츠가 떠 있는" 상태가 아니라 상단 고정 + 하단
 * 여백 흡수).
 *
 * Figma 프레임은 header까지 이 Hero 높이 안에 포함돼 있지만, 이 앱의 header는
 * 별도 고정 Navbar라 실제로는 (Navbar 렌더 높이) + (이 section 자체 높이)가
 * "절대 page y" 기준 Figma 목표와 같아야 한다 — 그래서 Figma 값에서 실측
 * Navbar 높이(390=72 · 1024/1440/2560=80, `Navbar.jsx`의 Toolbar `minHeight`
 * 규칙과 일치)를 뺀 값을 이 section 자체의 minHeight로 쓴다. */
const ProjectsHero = () => (
  <Box component="section" sx={{
    position: 'relative', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.warmPaper,
    pt: { xs: 6, md: 9 }, pb: { xs: 6, md: 8 },
    /* Phase 5A-H: get_metadata 210:3(Tablet 768) 재확인 — 이전에는 `sm` tier가
     * 없어 xs(390) 값 1048을 그대로 물려받았다. 768 Figma frame 높이 1150에서
     * 실측 Navbar 높이(768도 xs와 동일하게 72px, `Toolbar minHeight` md 미만
     * 구간) 72를 뺀 1078로 별도 지정한다. */
    minHeight: { xs: 1048, sm: 1078, md: 970, lg: 600 },
  }}>
    {/* Human Signal Phase 5A-G: get_metadata로 QHD 208:3 / Desktop 206:6 / Compact
     * 209:3 / Tablet 210:3 / Mobile 212:3 5개 node를 직접 재조회해 발견한 오차 2건.
     * (1) QHD Sage Halo는 원(900x900)이 아니라 타원(900x820, ellipse id 208:4) —
     * height를 820으로 고친다. (2) `sm`(768) tier가 없어 768 실제 폭이 `xs`(390)
     * 값을 그대로 물려받고 있었다 — 210:4/210:5/210:6 실측값으로 `sm` tier를
     * 추가한다(md=1024 값과 별개, mobile-first cascade 유지). */}
    <Halo tone="sage" sx={{
      left: { xs: 120, sm: 300, md: 420, lg: 700 }, top: { xs: -70, sm: -100, md: -80, lg: -110 },
      width: { xs: 340, sm: 520, md: 650, lg: 820 }, height: { xs: 340, sm: 520, md: 650, lg: 820 },
      '@media (min-width:1920px)': { left: 1110, top: -110, width: 900, height: 820 },
    }} />
    <Halo tone="orange" sx={{
      left: { xs: 280, sm: 570, md: 760, lg: 1100 }, top: { xs: 720, sm: 720, md: 580, lg: 210 },
      width: { xs: 100, sm: 180, md: 220, lg: 300 }, height: { xs: 100, sm: 180, md: 220, lg: 300 },
      '@media (min-width:1920px)': { left: 1740, top: 210, width: 330, height: 330 },
    }} />
    <AlignmentRail sx={{
      left: { xs: 195, sm: 384, md: 512, lg: 706 }, top: { xs: 80, sm: 100, md: 100, lg: 100 },
      height: { xs: 900, sm: 900, md: 820, lg: 500 },
      '@media (min-width:1920px)': { left: 1280, top: 100, height: 500 },
    }} />
    {/* View Guide 패널은 아래에서 position:absolute로 Figma 절대 좌표에 직접
     * 고정한다(이 shell box가 그 좌표의 기준점) — 이제 flex 흐름에 참여하지
     * 않으므로, 왼쪽 카피 블록만 남는 이 컨테이너의 gap은 더 이상 의미가 없다. */}
    <Box sx={{
      ...SHELL_SX, position: 'relative', display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, alignItems: 'flex-start',
    }}>
      <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
        <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '11px', letterSpacing: '0.44px', mb: 2 }}>
          PROJECT LIBRARY
        </Typography>
        {/* Figma H1: mobile 32/40 · tablet 768 42/52(210:21, h=104=compact와 동일
         * 2줄) · compact 1024 42/52 · desktop 1440 52/64 · QHD 2560 56/68(5개
         * node 직접 실측, 모두 tracking -0.6~-1.1px). */}
        <Typography component="h1" sx={{
          fontFamily: FONT_KR, fontWeight: 700,
          fontSize: { xs: '32px', sm: '42px', md: '42px', lg: '52px' },
          lineHeight: { xs: '40px', sm: '52px', md: '52px', lg: '64px' },
          letterSpacing: { xs: '-0.6px', sm: '-1.1px', md: '-1.1px' },
          color: HUMAN_SIGNAL.inkNavy, mb: 2.5, wordBreak: 'keep-all',
          maxWidth: { xs: '100%', md: 760, lg: 650 },
          '@media (min-width:1920px)': { fontSize: '56px', lineHeight: '68px' },
        }}>
          작업을 역할과 구현 범위로<br />정리했습니다.
        </Typography>
        <Typography sx={{
          fontFamily: FONT_KR, color: HUMAN_SIGNAL.inkNavy,
          fontSize: { xs: '14.5px', lg: '16px' }, lineHeight: { xs: '24px', lg: '27px' },
          maxWidth: { xs: '100%', lg: 610 }, mb: { xs: 4, md: 5 }, wordBreak: 'keep-all',
        }}>
          대표 프로젝트와 추가 작업을 같은 기준으로 확인할 수 있습니다. Actual·Demo·Static·Mock 범위를 구분하고, 상세 페이지에서는 설계 판단과 화면 증거를 보여줍니다.
        </Typography>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            bgcolor: HUMAN_SIGNAL.inkNavy, color: HUMAN_SIGNAL.warmPaper, textDecoration: 'none',
            fontFamily: FONT_KR, height: { xs: 54, sm: 52, md: 52, lg: 56 }, px: 3, borderRadius: '14px',
            minWidth: { xs: '100%', sm: 'auto' },
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
            fontWeight: 700, fontSize: '0.9375rem',
            transition: 'transform 180ms ease, box-shadow 180ms ease',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 24px rgba(12,20,32,0.24)' },
            '&:active': { transform: 'translateY(0)' },
            ...focusVisibleSx,
            '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
          }}
        >
          홈으로 돌아가기 <ActionIcon variant="internal" sx={{ color: HUMAN_SIGNAL.brightOrangeOnDark }} />
        </Box>
      </Box>

      {/* View Guide — dark panel, 실제 공개 데이터에서 숫자를 계산한다(Figma
       * placeholder "공개 가능한 추가 작업 2개"를 그대로 베끼지 않는다).
       * Figma 실측 절대 좌표(x/y/w/h)를 이 shell box 기준 position:absolute로
       * 그대로 옮긴다. 주의: absolute의 containing block은 조상의 padding
       * box라 `left:0`/`right:0`은 shell 자체의 좌우 padding을 건너뛴다(처음
       * 구현에서 1440 이상이 padding 64px만큼 바깥으로 밀려나는 것을 실측으로
       * 발견) — 그래서 left/right/width를 shell padding을 반영한 실제 px로
       * 쓴다(390 20/768 64/1024 48 = 각 breakpoint의 SHELL_SX px와 동일값,
       * 1200 이상은 right:64, 1920 이상은 shell 자체 padding이 0이라 right:0).
       * top은 (Figma 절대 y − Navbar 높이 − Hero pt)로 역산했다 — 1200 이상은
       * pt(72)가 Figma가 기대하는 y보다 커서 top이 음수(-26)가 된다(Hero 자체
       * minHeight는 그대로라 잘리지 않는다). */}
      <Box sx={{
        bgcolor: HUMAN_SIGNAL.deepHarbor, borderRadius: '22px',
        position: 'absolute',
        left: { xs: 20, sm: 64, md: 48, lg: 'auto' }, right: { lg: 64 },
        top: { xs: 360, sm: 428, md: 388, lg: -26 },
        width: { xs: 350, sm: 640, md: 928, lg: 586 },
        height: { xs: 540, sm: 500, md: 420, lg: 430 },
        '@media (min-width:1920px)': { width: 646, right: 0 },
      }}>
        <Typography sx={{
          position: 'absolute', left: 28, top: 26,
          fontFamily: FONT_MONO, color: HUMAN_SIGNAL.brightOrangeOnDark, fontSize: '0.75rem', letterSpacing: '0.06em',
        }}>
          VIEW GUIDE
        </Typography>
        {/* divider 3개 — 390: row1/2/3 각각의 아래(164/276/388). 768 이상:
         * label 아래(66) · row1-2 사이(170) · row2-3 사이(262), row3(SCOPE)
         * 뒤에는 divider가 없다(note가 바로 이어짐) — Figma 실측 그대로다. */}
        <Box sx={{ position: 'absolute', left: 28, right: 28, top: { xs: 164, sm: 66 }, borderTop: `1px solid rgba(170,183,196,0.16)` }} />
        <Box sx={{ position: 'absolute', left: 28, right: 28, top: { xs: 276, sm: 170 }, borderTop: `1px solid rgba(170,183,196,0.16)` }} />
        <Box sx={{ position: 'absolute', left: 28, right: 28, top: { xs: 388, sm: 262 }, borderTop: `1px solid rgba(170,183,196,0.16)` }} />
        <ViewGuideRow eyebrow="FEATURED" value={`서로 다른 역량을 보여주는 대표 ${FEATURED_CARDS.length}개`} geometry={VIEW_GUIDE_ROW_GEOMETRY[0]} />
        <ViewGuideRow eyebrow="MORE WORKS" value={`공개 가능한 추가 작업 ${MORE_WORKS.length}개`} geometry={VIEW_GUIDE_ROW_GEOMETRY[1]} />
        <ViewGuideRow eyebrow="SCOPE" value="Actual · Demo · Static · Mock 구분" accent geometry={VIEW_GUIDE_ROW_GEOMETRY[2]} />
        <Typography sx={{
          position: 'absolute', left: { xs: 18, sm: 28 }, right: 18, top: { xs: 454, sm: 382 },
          fontFamily: FONT_KR, color: HUMAN_SIGNAL.steelMist, fontSize: '0.875rem', lineHeight: 1.6, wordBreak: 'keep-all',
        }}>
          공개하지 않을 초안과 내부 실험은 목록에서 제외합니다.
        </Typography>
      </Box>
    </Box>
  </Box>
);

/* ── Featured Projects ── */
const InfoChip = ({ eyebrow, value, tone }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', gap: 1.5, width: '100%',
    minHeight: { xs: 54, lg: 54 }, '@media (min-width:1920px)': { minHeight: '61.56px' },
    borderRadius: '12px', px: 2, py: 1,
    bgcolor: tone === 'dark' ? HUMAN_SIGNAL.deepHarbor : HUMAN_SIGNAL.warmPaper,
  }}>
    <Typography sx={{
      fontFamily: FONT_MONO, fontSize: '11px', letterSpacing: '0.44px', flexShrink: 0, width: 44,
      color: tone === 'dark' ? HUMAN_SIGNAL.brightOrangeOnDark : HUMAN_SIGNAL.burntOrange,
    }}>
      {eyebrow}
    </Typography>
    <Typography sx={{
      fontFamily: FONT_KR, fontSize: '14px', fontWeight: 400, wordBreak: 'keep-all',
      color: tone === 'dark' ? HUMAN_SIGNAL.softWhite : HUMAN_SIGNAL.inkNavy,
    }}>
      {value}
    </Typography>
  </Box>
);

/* Phase 5A-R Batch C 9-2: Figma가 정의한 3개 레이아웃 모드를 카드 자체가 갖는다.
 * <900(xs): 세로 카드 1열. 900–1199(md): media left(약 45%) + content right(약
 * 55%)인 가로형 row — Figma Compact 1024(209:38)가 3개를 이 모양으로 세로
 * 쌓는다. 1200+(lg): 다시 세로 카드, FeaturedProjects의 3-column grid가 감싼다.
 *
 * Phase 5A-F: card/media 크기·ROLE·DATA 배치를 QHD 208:44 / Desktop 206:47 /
 * Compact 209:44 / Mobile 212:48 4개 node 실측값으로 다시 맞췄다. Figma는
 * ROLE·DATA 칩이 가로 2열이 아니라 세로로 full-width 쌓인다(ChatGPT가 실제
 * 비교 이미지로 확인한 차이) — `InfoChip`을 column stack으로 바꿨다. */
const FeaturedCard = ({ card, index }) => {
  const { project, slug, displayTitle, proof, role, data, mediaRotate } = card;
  return (
    <RevealOnScroll y={16} duration={0.45} delay={index * 0.06}>
      <Box
        data-project-id={project.id}
        data-project-kind="featured"
        data-published="true"
        sx={{
          bgcolor: HUMAN_SIGNAL.softWhite, border: `1px solid ${HUMAN_SIGNAL.paperDeep}`, borderRadius: '22px',
          overflow: 'hidden', display: 'flex',
          flexDirection: { xs: 'column', md: 'row', lg: 'column' },
          /* Phase 5A-F2 항목 5: xs(390) 실측 585px가 Figma 목표 600px보다 짧았다
           * — auto-height가 실제 콘텐츠보다 작아지지 않도록 `height`가 아니라
           * `minHeight`(바닥값)로 준다. md/lg/QHD는 이미 정확히 일치해 `height`를
           * 그대로 유지한다(고정값이라 잘림 위험 없음, Phase 5A-F에서 확인됨).
           * `minHeight`를 `md`에서 명시적으로 0으로 되돌리지 않으면 MUI
           * breakpoint 객체가 xs 값을 그 위 tier까지 그대로 이어받아(mobile-first
           * cascade) `min-height:600`이 `height:500`(md)보다 우선 적용되는
           * 버그가 있었다(1024 실측으로 발견) — xs 전용으로 명시 범위를 좁힌다. */
          minHeight: { xs: 600, md: 0 },
          // Phase 5A-H: 210:44(Tablet 768) 카드 높이 740 — md가 뒤에 명시돼 있어
          // sm 값이 900px+ 구간으로 새지 않는다.
          height: { sm: 740, md: 500, lg: 760 },
          '@media (min-width:1920px)': { height: '866.4px' },
        }}
      >
        <Box sx={{
          p: '17px', flexShrink: 0,
          pb: { xs: 0, md: '17px', lg: '17px' },
          width: { xs: '100%', md: '45%', lg: '100%' },
        }}>
          <Box sx={{
            borderRadius: '18px', overflow: 'hidden',
            height: { xs: 220, sm: 330, md: '100%', lg: 330 },
            '@media (min-width:1920px)': { height: '376.2px' },
          }}>
            {project.thumbnailUrl ? (
              <ProjectMediaStage image={project.thumbnailUrl} alt={`${displayTitle} 실제 화면`} rotate={mediaRotate} />
            ) : (
              <Box sx={{
                width: '100%', height: '100%', bgcolor: HUMAN_SIGNAL.deepHarbor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.steelMist, fontSize: '0.875rem' }}>{displayTitle}</Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ p: '24px', pt: { xs: '20px', sm: '34px', md: '24px', lg: '20px' }, display: 'flex', flexDirection: 'column', gap: 1.25, flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '11px', letterSpacing: '0.44px' }}>
            FEATURED {String(index + 1).padStart(2, '0')}
          </Typography>
          <Typography component="h3" sx={{
            fontFamily: FONT_KR, fontWeight: 700, color: HUMAN_SIGNAL.inkNavy, wordBreak: 'keep-all',
            fontSize: { xs: '24px', sm: '28px', md: '28px', lg: '30px' },
            lineHeight: { xs: '32px', sm: '36px', md: '36px', lg: '38px' },
            '@media (min-width:1920px)': { fontSize: '32px', lineHeight: '40px' },
          }}>
            {displayTitle}
          </Typography>
          <Typography sx={{
            fontFamily: FONT_KR, color: HUMAN_SIGNAL.inkNavy, wordBreak: 'keep-all', mb: 'auto',
            fontSize: { xs: '14.5px', lg: '16px' }, lineHeight: { xs: '24px', lg: '27px' },
          }}>
            {proof}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
            <InfoChip eyebrow="ROLE" value={role} tone="light" />
            <InfoChip eyebrow="DATA" value={data} tone="dark" />
          </Box>
          <Box
            component={RouterLink}
            to={`/projects/${slug}`}
            aria-label={`${displayTitle} 상세 보기`}
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.75, mt: 1.5,
              fontFamily: FONT_KR, color: HUMAN_SIGNAL.burntOrange, fontWeight: 500, fontSize: '0.875rem', textDecoration: 'none',
              minHeight: 44,
              ...focusVisibleSx,
            }}
          >
            프로젝트 상세 보기 <ActionIcon variant="internal" />
          </Box>
        </Box>
      </Box>
    </RevealOnScroll>
  );
};

const FeaturedProjects = () => (
  <Box component="section" aria-label="대표 프로젝트" sx={{
    position: 'relative', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.inkNavy, py: { xs: 7, md: 9 },
    // Phase 5A-H: 210:38(Tablet 768) 실측 높이 2650(=1150~3800) — 카드 높이(740)·
    // 헤딩 타이포·gap을 아래에서 함께 맞춰 실제 콘텐츠로 채운다.
    minHeight: { xs: 2240, sm: 2650, md: 2000, lg: 1200 },
    '@media (min-width:1920px)': { minHeight: 1300 },
  }}>
    {/* Featured/Footer는 순수 dark(inkNavy) full-bleed라 deepHarbor 숫자는
     * 배경과 거의 구분되지 않는다(실측 스크린샷으로 확인) — More Works(light
     * warmPaper)에서만 deepHarbor를 쓰고, 여기는 softWhite로 대비를 준다. */}
    <Arc tone="sage" sx={{
      left: 1050, top: -180, width: 560, height: 560,
      '@media (min-width:1920px)': { left: 1760, width: 620, height: 620 },
    }} />
    <QhdSectionIndex
      id="projects-featured" index="01" label="LIBRARY / FEATURED" side="left"
      indexTop={140} labelTop={310} {...QHD_LEFT}
      indexColor={HUMAN_SIGNAL.softWhite} indexFontSize="150px" labelOpacity={0.55}
    />
    <Box sx={SHELL_SX}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-end' }, gap: { xs: 2, md: 6 }, mb: { xs: 4, md: 5 } }}>
        <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
          <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.brightOrange, fontSize: '11px', letterSpacing: '0.44px', mb: 2 }}>
            01 / FEATURED PROJECTS
          </Typography>
          {/* Figma Featured H2: mobile 30/40 · tablet 768 40/50(210:41, h=100=
           * compact와 동일 2줄) · compact 40/50 · desktop 48/60 · QHD 52/64
           * (모두 tracking 약 -0.9px). */}
          <Typography component="h2" sx={{
            fontFamily: FONT_KR, fontWeight: 700, color: HUMAN_SIGNAL.softWhite, wordBreak: 'keep-all',
            fontSize: { xs: '30px', sm: '40px', md: '40px', lg: '48px' },
            lineHeight: { xs: '40px', sm: '50px', md: '50px', lg: '60px' },
            letterSpacing: '-0.9px',
            // 768(sm)은 xs(350)를 그대로 물려받으면 Figma 640px 폭 기준 2줄이
            // 3줄로 더 꺾인다(210:41 h=100=2줄 실측과 불일치) — sm에서 실제
            // 콘텐츠 폭(640)만큼 풀어준다.
            maxWidth: { xs: 350, sm: 640, md: 760, lg: 720 },
            '@media (min-width:1920px)': { fontSize: '52px', lineHeight: '64px' },
          }}>
            대표 세 작업으로
            <Box component="br" sx={{ display: { xs: 'block', sm: 'none' } }} />
            {' '}서로 다른 역량을
            <Box component="br" sx={{ display: { xs: 'block', sm: 'none' } }} />
            {' '}보여드립니다.
          </Typography>
        </Box>
        <Typography sx={{
          fontFamily: FONT_KR, color: HUMAN_SIGNAL.steelMist, flexShrink: 0, wordBreak: 'keep-all',
          fontSize: { xs: '14.5px', lg: '16px' }, lineHeight: { xs: '24px', lg: '27px' },
          maxWidth: 500,
          '@media (min-width:1920px)': { maxWidth: 600 },
        }}>
          역할·문제·구현 범위가 다른 세 작업을 한눈에 비교할 수 있습니다.
        </Typography>
      </Box>
      <Box sx={{ borderTop: `1px solid rgba(170,183,196,0.22)`, mb: { xs: 4, md: 5 } }} />
      {/* <900: 1-column 세로 카드. 900–1199: 1-column, 카드 자체가 가로형 row로
       * 바뀐다(FeaturedCard 내부 분기). 1200+: 3-column 세로 카드 — Figma 실측
       * 카드 폭(1440에서 396px, QHD에서 451.44px)을 고정폭으로 쓴다.
       * Phase 5A-F2: `justify-content:space-between`은 카드 폭은 정확했지만
       * 카드 사이 gap을 임의로 넓혀(1440에서 실측 62px, Figma는 32px) 셋째
       * 카드가 shell 오른쪽 끝(x=1376)까지 붙어버렸다 — Figma 1440은 카드
       * 3개+32px gap 2개(1252px)가 1312px shell을 다 채우지 않고 오른쪽에
       * 60px 여백을 그대로 남긴다(원본 구조). 고정 gap(32px/QHD 99.56px)만
       * 쓰고 기본 정렬(start)로 첫 카드를 shell 왼쪽에 고정한다. */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 396px)' },
        gap: { xs: 3, sm: 2.5, md: 2.5, lg: '32px' },
        '@media (min-width:1920px)': { gridTemplateColumns: 'repeat(3, 451.44px)', gap: '99.56px' },
      }}>
        {FEATURED_CARDS.map((card, i) => <FeaturedCard key={card.id} card={card} index={i} />)}
      </Box>
    </Box>
  </Box>
);

/* ── More Works ── */
/* Phase 5A-R Batch D: published 항목이 1개뿐일 때 기존 `maxWidth:632` 좌측정렬
 * 카드는 1312px shell 안에서 절반 이상을 빈 공간으로 남겼다(사용자가 실제
 * QHD에서 "빠진 두 번째 카드 자리"처럼 느낌). 두 번째 자리를 채우는 대신,
 * 카드 자체를 media+content 가로형 single-feature layout으로 넓혀 실제 화면을
 * 더 크게 보여준다.
 *
 * Phase 5A-F: 상한을 임의 1100px에서 Figma 실측값(Desktop 1440 = 1180px,
 * QHD 2560 = 1312px = shell 전체 폭)으로 교체했다 — ChatGPT가 실제 비교
 * 이미지로 확인한 차이(2)를 그대로 반영한다. media:content 비율(약 55:45)은
 * 기존 실측이 Figma와 이미 거의 일치해 유지한다. */
const MoreWorkCard = ({ project }) => {
  const href = project.liveUrl ?? project.githubUrl ?? null;
  const isLink = Boolean(href);
  const scopeLabel = project.tools?.every((t) => ['HTML', 'CSS', 'JavaScript'].includes(t))
    ? 'RESPONSIVE WEB' : (project.categoryLabel || 'MORE WORK');
  const statusLabel = project.tools?.every((t) => ['HTML', 'CSS', 'JavaScript'].includes(t)) ? 'STATIC' : 'DEMO';

  return (
    <Box
      component={isLink ? 'a' : 'div'}
      href={isLink ? href : undefined}
      target={isLink ? '_blank' : undefined}
      rel={isLink ? 'noopener noreferrer' : undefined}
      aria-label={isLink ? `${project.title} 새 탭에서 열기` : undefined}
      data-project-id={project.id}
      data-project-kind="more-work"
      data-published="true"
      sx={{
        display: 'flex', flexDirection: { xs: 'column', md: 'row' },
        width: '100%', maxWidth: { xs: '100%', md: '100%', lg: 1180 }, borderRadius: '22px', overflow: 'hidden',
        textDecoration: 'none', color: 'inherit',
        bgcolor: HUMAN_SIGNAL.softWhite, border: `1px solid ${HUMAN_SIGNAL.paperDeep}`,
        cursor: isLink ? 'pointer' : 'default',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': isLink ? { transform: 'translateY(-3px)', boxShadow: '0 18px 40px rgba(12,20,32,0.14)' } : undefined,
        '&:active': isLink ? { transform: 'translateY(0)' } : undefined,
        ...focusVisibleSx,
        '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
        '@media (min-width:1920px)': { maxWidth: 1312 },
      }}
    >
      <Box sx={{ p: 2.25, pb: { xs: 0, md: 2.25 }, width: { xs: '100%', md: '55%' }, flexShrink: 0 }}>
        <Box sx={{
          position: 'relative', width: '100%', borderRadius: '18px', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.warmPaper,
          height: { xs: 200, sm: 230, md: '100%' }, minHeight: { md: 286, lg: 346 },
          '@media (min-width:1920px)': { minHeight: 382 },
        }}>
          {project.thumbnailUrl ? (
            /* Phase 5A-F2 항목 7: ott-service.png 자체가 뷰포트 하단 근처에서
             * 캡처된 텍스트("NIGHT SIGNAL")를 포함하고 있어 object-fit:contain
             * 이어도 박스 경계에 바짝 붙어 보였다. 새 자산을 만들거나 이미지를
             * 잘라내지 않고(cover로 바꾸면 실제 화면 일부가 잘린다), inset을
             * 줘서 이미지 자체를 살짝 줄이고 사방에 여백을 둔다 — contain이라
             * 전체 화면은 그대로 다 보인다. */
            <Box component="img" src={project.thumbnailUrl} alt={`${project.title} 화면 미리보기`} loading="lazy"
              sx={{ position: 'absolute', inset: '4%', width: '92%', height: '92%', objectFit: 'contain' }} />
          ) : (
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.inkText, fontSize: '0.875rem' }}>{project.title}</Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Box sx={{ p: 2.75, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1, flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', letterSpacing: '0.04em', color: HUMAN_SIGNAL.burntOrange }}>
            {scopeLabel}
          </Typography>
          <Box sx={{ bgcolor: HUMAN_SIGNAL.deepHarbor, color: HUMAN_SIGNAL.softWhite, borderRadius: '10px', px: 1.5, py: 0.5 }}>
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', letterSpacing: '0.04em' }}>{statusLabel}</Typography>
          </Box>
        </Box>
        <Typography component="h3" sx={{
          fontFamily: FONT_KR, fontWeight: 700, color: HUMAN_SIGNAL.inkNavy,
          fontSize: { xs: '22px', sm: '26px', md: '26px', lg: '28px' }, lineHeight: { xs: '30px', sm: '36px', md: '36px', lg: '36px' },
        }}>
          {project.title}
        </Typography>
        <Typography sx={{
          fontFamily: FONT_KR, color: HUMAN_SIGNAL.inkNavy, wordBreak: 'keep-all',
          fontSize: { xs: '14px', md: '15px' }, lineHeight: { xs: '23px', md: '25px' },
        }}>
          {PROJECTS_MORE_WORK_COPY[project.id] ?? project.description}
        </Typography>
        {project.tools?.length > 0 && (
          <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', letterSpacing: '0.04em', color: HUMAN_SIGNAL.inkNavy, mt: 1 }}>
            {project.tools.join(' · ').toUpperCase()}
          </Typography>
        )}
        {isLink && (
          <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.8125rem', fontWeight: 600, color: HUMAN_SIGNAL.burntOrange, mt: 0.5, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            VIEW PROJECT <ActionIcon variant="external" />
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const MoreWorks = () => {
  if (MORE_WORKS.length === 0) return null;
  return (
    <Box component="section" aria-label="더 많은 작업물" sx={{
      position: 'relative', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.warmPaper, py: { xs: 7, md: 9 },
      /* xs(390) More Works frame(212:102) 실측 800 — 실제 렌더 높이가 785로
       * 15px 짧아 Footer 시작·끝이 Figma 대비 밀렸다(measurements 대조로 확인).
       * Phase 5A-H: 210:98(Tablet 768)은 카드 높이(230 thumbnail)·헤딩
       * 타이포를 아래에서 함께 올려 실제 콘텐츠로 900에 가깝게 채우므로 sm만
       * Figma 실측값(900)을 명시한다. */
      minHeight: { xs: 800, sm: 900, md: 720, lg: 800 },
      '@media (min-width:1920px)': { minHeight: 850 },
    }}>
      {/* Phase 5A-G: 209:99(1024)/207:3(1440)는 top=760이지만 210:99(768)=700,
       * 212:103(390)=650으로 breakpoint마다 다르다(고정값이 아니었다) — 반응형으로
       * 고친다. Sage Halo(209:100/207:4)는 1024 이상에만 존재하는 layer다(210:98·
       * 212:102 tree에 아예 없음, hidden이 아니라 부재) — 768/390에서 숨긴다. */}
      <Arc tone="orange" sx={{
        left: -180, top: { xs: 650, sm: 700, md: 760 }, width: 520, height: 520,
        '@media (min-width:1920px)': { left: 260 },
      }} />
      <Halo tone="sage" sx={{
        left: 1040, top: -120, width: 520, height: 520,
        display: { xs: 'none', sm: 'none', md: 'block' },
        '@media (min-width:1920px)': { left: 1770 },
      }} />
      <QhdSectionIndex
        id="projects-more-works" index="02" label="MORE WORKS / SCOPE" side="right"
        indexTop={120} labelTop={290} {...QHD_RIGHT}
        indexColor={HUMAN_SIGNAL.deepHarbor} indexFontSize="150px" labelOpacity={0.55}
      />
      <Box sx={SHELL_SX}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-end' }, gap: { xs: 2, md: 6 }, mb: { xs: 4, md: 5 } }}>
          <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
            <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '11px', letterSpacing: '0.44px', mb: 2 }}>
              02 / MORE WORKS
            </Typography>
            <Typography component="h2" sx={{
              fontFamily: FONT_KR, fontWeight: 700, color: HUMAN_SIGNAL.inkNavy, wordBreak: 'keep-all',
              fontSize: { xs: '30px', sm: '40px', md: '40px', lg: '48px' },
              lineHeight: { xs: '40px', sm: '50px', md: '50px', lg: '60px' },
              letterSpacing: '-0.9px',
              maxWidth: { xs: 350, sm: 640, md: 760, lg: 700 },
              '@media (min-width:1920px)': { fontSize: '52px', lineHeight: '64px' },
            }}>
              대표 사례 밖의 작업도, 한눈에 살펴볼 수 있습니다.
            </Typography>
          </Box>
          <Typography sx={{
            fontFamily: FONT_KR, color: HUMAN_SIGNAL.inkNavy, flexShrink: 0, wordBreak: 'keep-all',
            fontSize: { xs: '14.5px', lg: '16px' }, lineHeight: { xs: '24px', lg: '27px' },
            maxWidth: 500,
            '@media (min-width:1920px)': { maxWidth: 600 },
          }}>
            {`대표 프로젝트와 역할이 다른 공개 작업 ${MORE_WORKS.length}개를 함께 정리했습니다.`}
          </Typography>
        </Box>
        <Box sx={{ borderTop: `1px solid ${HUMAN_SIGNAL.paperDeep}`, mb: { xs: 4, md: 5 } }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {MORE_WORKS.map((project) => <MoreWorkCard key={project.id} project={project} />)}
        </Box>
      </Box>
    </Box>
  );
};

/* ── Footer ── */
const ProjectsFooter = () => (
  <Box component="footer" sx={{
    position: 'relative', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.inkNavy, py: { xs: 7, md: 9 },
    // Phase 5A-H: 210:177(Tablet 768) 실측 700 = 기존 md 값과 동일 — sm을
    // md와 같은 값으로 고정한다(다른 breakpoint에 영향 없음).
    minHeight: { xs: 770, sm: 700, md: 700, lg: 600 },
  }}>
    <Halo tone="sage" sx={{
      left: 0, top: 40, width: 480, height: 480,
      '@media (min-width:1920px)': { left: 440 },
    }} />
    <Halo tone="orange" sx={{
      left: 260, top: 90, width: 210, height: 210,
      '@media (min-width:1920px)': { left: 700 },
    }} />
    <QhdSectionIndex
      id="projects-footer" index="03" label="NAVIGATION / CONTACT" side="left"
      indexTop={40} labelTop={210} {...QHD_LEFT}
      indexColor={HUMAN_SIGNAL.softWhite} indexFontSize="150px" labelOpacity={0.55}
    />
    <Box sx={SHELL_SX}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0,1fr) minmax(0,1.6fr)' }, columnGap: { md: 8 }, rowGap: { xs: 5, md: 0 } }}>
        {/* 390·768은 D Mark와 캡션이 같은 행(mark 왼쪽 · caption 오른쪽)이고,
         * 1024 이상은 기존 세로 스택을 유지한다(Figma 214:221 실측). */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, alignItems: { xs: 'center', md: 'flex-start' }, gap: 2 }}>
          {/* Figma Footer D mark: mobile 84 · tablet 768 116(214:221) · compact
           * 1024 180 · desktop 1440과 QHD 2560 모두 220(동일) — 기존 고정
           * 64px보다 훨씬 크다. */}
          <DMark
            size={84} tone="onDark"
            sx={{
              '@media (min-width:600px) and (max-width:899.98px)': { width: 116, height: 116 },
              '@media (min-width:900px)': { width: 180, height: 180 },
              '@media (min-width:1200px)': { width: 220, height: 220 },
            }}
          />
          <Typography sx={{ fontFamily: FONT_KR, color: HUMAN_SIGNAL.softWhite, fontSize: '0.875rem' }}>정리 · 연결 · 검증</Typography>
        </Box>
        {/* 390·768은 위 mark 행과 자체 간격(grid rowGap)만으로 구분하고, 기존
         * borderTop/상단 padding은 없앤다(Figma에 해당 구분선이 없음). 1024
         * 이상은 기존 2-column(border-left 구분) 구조를 그대로 유지한다. */}
        <Box sx={{ borderLeft: { md: `1px solid rgba(170,183,196,0.22)` }, pl: { md: 8 } }}>
          <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.brightOrange, fontSize: '0.75rem', letterSpacing: '0.06em', mb: 2 }}>
            PROJECT NAVIGATION
          </Typography>
          <Typography component="h2" sx={{
            fontFamily: FONT_KR, fontWeight: 700, color: HUMAN_SIGNAL.softWhite, wordBreak: 'keep-all', mb: 2.5,
            fontSize: { xs: '30px', sm: '40px', md: '40px', lg: '48px' },
            lineHeight: { xs: '40px', sm: '50px', md: '50px', lg: '60px' },
            maxWidth: { xs: 350, sm: 640, md: 550, lg: 660 },
            '@media (min-width:1920px)': { fontSize: '52px', lineHeight: '64px' },
          }}>
            대표 작업을 다시 보거나, 바로 연락할 수 있습니다.
          </Typography>
          <Typography sx={{
            fontFamily: FONT_KR, color: HUMAN_SIGNAL.steelMist, maxWidth: 640, mb: { xs: 4, md: 4.5 }, wordBreak: 'keep-all',
            fontSize: { xs: '14.5px', lg: '16px' }, lineHeight: { xs: '24px', lg: '27px' },
          }}>
            공개 상태와 구현 범위를 확인한 작업만 보여드립니다.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', gap: 2, alignItems: { sm: 'center' } }}>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                bgcolor: HUMAN_SIGNAL.softWhite, color: HUMAN_SIGNAL.inkNavy, textDecoration: 'none',
                fontFamily: FONT_KR, height: 54, px: 3, borderRadius: '16px', minWidth: { xs: '100%', sm: 'auto' },
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                fontWeight: 700, fontSize: '0.9375rem',
                transition: 'transform 180ms ease, box-shadow 180ms ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 24px rgba(0,0,0,0.24)' },
                '&:active': { transform: 'translateY(0)' },
                ...focusVisibleSx,
                '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
              }}
            >
              홈으로 돌아가기 <ActionIcon variant="internal" sx={{ color: HUMAN_SIGNAL.burntOrange }} />
            </Box>
            <Box
              component="a"
              href={`mailto:${CONTACT_EMAIL}`}
              aria-label="이메일 보내기"
              sx={{
                fontFamily: FONT_KR, color: HUMAN_SIGNAL.softWhite, textDecoration: 'none', fontWeight: 500, fontSize: '0.9375rem',
                display: 'inline-flex', alignItems: 'center', gap: 0.75, minHeight: 44,
                ...focusVisibleSx,
              }}
            >
              메일 보내기 <ActionIcon variant="internal" sx={{ color: HUMAN_SIGNAL.brightOrange }} />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ borderTop: `1px solid rgba(170,183,196,0.2)`, mt: { xs: 6, md: 7 }, pt: 2.5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 1 }}>
        <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.steelMist, fontSize: '0.75rem', letterSpacing: '0.04em' }}>
          DOHAN KIM · HUMAN SIGNAL
        </Typography>
        <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.steelMist, fontSize: '0.75rem', letterSpacing: '0.04em' }}>
          PROJECT LIBRARY
        </Typography>
      </Box>
    </Box>
  </Box>
);

const ProjectsPage = () => (
  <Box data-page-id="projects" sx={{ bgcolor: HUMAN_SIGNAL.warmPaper }}>
    <ProjectsHero />
    <FeaturedProjects />
    <MoreWorks />
    <ProjectsFooter />
  </Box>
);

export default ProjectsPage;
