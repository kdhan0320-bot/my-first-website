import { responsiveFontSizes, createTheme } from '@mui/material/styles';

/* 라벨/숫자/메타데이터용 모노스페이스 폰트. MUI 테마에는 보조 폰트 슬롯이
 * 없어 공용 상수로 두고 필요한 곳에 sx={{ fontFamily: FONT_MONO }}로 개별
 * 적용한다. */
export const FONT_MONO = '"IBM Plex Mono", "Roboto Mono", monospace';
/* Phase 2D: 한글 H1~body/버튼/nav의 primary sans를 IBM Plex Sans KR(공학·기술
 * 문서 톤)에서 SUIT Variable(@sun-typeface/suit, SIL OFL-1.1, npm 패키지 —
 * main.jsx에서 variable WOFF2 1개만 import)로 교체했다. FONT_MONO(IBM Plex
 * Mono)는 그대로 두고 짧은 영문 라벨/index/technical status 용도로만 쓴다. */
export const FONT_SANS = '"SUIT Variable", "SUIT", "Pretendard", "Noto Sans KR", sans-serif';

/* HUMAN SIGNAL 컬러 시스템 — Figma 파일 53Ppn2hIgrvs9Jra3eejFs를 Phase 4A에서
 * 다시 조회해 확인한 hex 값이다(Foundations 447:2, Navigation States 220:7,
 * Home Desktop 1440 254:3). 이 파일에는 Figma Variables가 바인딩돼 있지
 * 않아(get_variable_defs가 빈 값을 반환) 각 프레임에 지정된 실제 fill 값을
 * 대조해서 정리했다.
 *
 * 작은 텍스트/기호의 배경별 대비 역할(Figma 접근성 점검 기준):
 * - Warm Paper/Soft White(밝은 배경) 위 작은 텍스트·기호 → burntOrange
 * - Deep Harbor/Ink Navy(어두운 배경) 위 작은 텍스트·기호 → brightOrangeOnDark
 * - 큰 강조 텍스트·비텍스트 장식(밑줄 인디케이터 등)은 배경과 무관하게
 *   brightOrange를 그대로 쓸 수 있다.
 * burntOrange는 Phase 4A Foundations(447:16 "LIGHT META #A84325")에서 값이
 * #A74224 → #A84325로 갱신됐다. deepSage는 Header PORTFOLIO PDF 비활성
 * 라벨(220:22)에서 #496149로 처음 solid fill로 확인됐다(Phase 3C까지
 * [확인 필요]였던 값). mutedInk는 Foundations 설명 본문·Featured/Selected
 * 보조 설명 등 밝은 배경 위 회색 계열 본문에 반복 등장하는 새 역할
 * 색이라(447:6, 447:20, 261:7 등) 이번 회차에 추가했다. */
export const HUMAN_SIGNAL = {
  inkNavy: '#0C1420',
  deepHarbor: '#172432',
  warmPaper: '#F2EDE3',
  paperDeep: '#E2D9CC',
  softWhite: '#FFFDF8',
  inkText: '#27313B',
  burntOrange: '#A84325',
  brightOrange: '#D85C32',
  brightOrangeOnDark: '#EC6B3D',
  mutedSage: '#90A58B',
  steelMist: '#AAB7C4',
  deepSage: '#496149',
  mutedInk: '#59636E',
};

/* 2560 QHD 등 Ultra-wide 화면에서 콘텐츠가 화면 끝까지 과확장되지 않도록
 * 쓰는 공통 max-width(px) — 실제 콘텐츠 폭(Container 안쪽, 좌우 padding
 * 제외) 기준이다. Phase 4A에서 QHD 2560 프레임(347:383)을 직접 재측정한
 * 결과, "Content Master" 프레임이 2560 캔버스 안에서도 1440 Desktop과
 * 동일한 1440px 폭(내부 콘텐츠 1312px)으로 중앙에 고정되고, 그 바깥 여백에는
 * 별도의 저대비 "Ambient Signal" 장식만 확장되는 구조였다 — Phase 3C까지
 * 썼던 1680/2080/1960 상수는 옛 QHD 프레임 기준이라 폐기한다(요구사항: 오래된
 * 상수를 맹목적으로 유지하지 않는다). */
export const ULTRAWIDE_CONTENT_MAX_WIDTH = 1312;

/* Home 섹션을 포함한 모든 페이지가 1920px 이상에서 참조하는 Container 자체의
 * CSS max-width(내부 padding 64px×2 포함) — ULTRAWIDE_CONTENT_MAX_WIDTH(1312)
 * + 128이다. 별도 값으로 분리해 하드코딩을 피한다. */
export const HOME_WIDE_MAX_WIDTH = ULTRAWIDE_CONTENT_MAX_WIDTH + 128;
export const HOME_PROJECT_MAX_WIDTH = ULTRAWIDE_CONTENT_MAX_WIDTH; // Featured Projects block shell(QHD) — 콘텐츠 폭과 동일
export const HOME_READING_MAX_WIDTH = 680; // 본문 한 단락이 읽기 좋은 최대 폭(QHD 전용, 별도 근거)

/* Phase 5A-R: QhdSectionIndex/QhdAmbientSignal이 기존에 `1920px`을 표시 기준으로
 * 썼는데, 실제로는 side index/label이 화면 안에 전부 들어오려면 최소 2444px가
 * 필요하다(Projects QHD index 좌우 gutter offset 기준 실측 계산 — 사용자가 실제
 * 2560 모니터에서 잘린 장식을 확인해 발견됨). "1920에서는 필요하면 잘린다"는
 * 이전 원칙을 폐기하고, 계산값에 안전 여백을 더한 이 상수 미만에서는 장식을
 * 아예 숨긴다(부분 노출 금지 — 숫자만 보이고 label이 잘리는 상태를 막는다).
 * QhdSectionIndex/QhdAmbientSignal(Contact 포함, Home/Projects 규칙 통일) 양쪽이
 * 이 상수 하나만 참조하도록 해 임계값을 두 곳에 중복 하드코딩하지 않는다. */
export const QHD_DECORATION_MIN_WIDTH = 2480;

/* Phase 4F: 옛 Ordered Signal `COLORS`(dark palette)를 완전히 걷어내고 MUI
 * 기본 팔레트를 Human Signal 기준(light mode)으로 맞춘다. 이 저장소의 모든
 * 화면은 이미 개별 컴포넌트에서 `HUMAN_SIGNAL.*` 토큰을 직접 sx로 지정하므로
 * (dark section도 명시적으로 deepHarbor/inkNavy를 쓴다), 이 palette는 주로
 * `sx`로 색을 지정하지 않는 MUI 기본 컴포넌트(CssBaseline 기본 배경, 향후
 * 추가될 Dialog/Tooltip/TextField 등)가 상속할 기본값이다. primary/secondary는
 * 실제 사용처(MuiTextField 포커스 보더가 유일한 참조처, 앱 안에 TextField
 * 자체가 아직 없음)를 확인해 밝은 배경에서 안전한 burntOrange/inkNavy로
 * 정했다 — 대비가 낮은 brightOrange를 기본 primary로 쓰지 않는다. */
export const getDesignTokens = () => ({
  palette: {
    mode: 'light',
    primary: {
      main:         HUMAN_SIGNAL.burntOrange,
      contrastText: HUMAN_SIGNAL.softWhite,
    },
    secondary: {
      main:         HUMAN_SIGNAL.inkNavy,
      contrastText: HUMAN_SIGNAL.softWhite,
    },
    background: {
      default: HUMAN_SIGNAL.warmPaper,
      paper:   HUMAN_SIGNAL.softWhite,
    },
    text: {
      primary:   HUMAN_SIGNAL.inkNavy,
      secondary: HUMAN_SIGNAL.inkText,
      disabled:  HUMAN_SIGNAL.deepSage,
    },
    divider: HUMAN_SIGNAL.paperDeep,
    error:   { main: '#E53935' },
    warning: { main: '#F59E0B' },
    success: { main: '#2E7D32' },
    info:    { main: HUMAN_SIGNAL.steelMist },
  },
  typography: {
    fontFamily: FONT_SANS,
    // Phase 2D: SUIT Variable 기준 heading weight 720~800 / letter-spacing
    // -0.025em~-0.015em / display line-height 1.05~1.15, section heading
    // 1.12~1.22, body weight 430~500 / line-height 1.55~1.7 범위로 정리.
    h1: { fontSize: '2.75rem',  fontWeight: 780, letterSpacing: '-0.02em', lineHeight: 1.1 },
    h2: { fontSize: '2rem',     fontWeight: 750, letterSpacing: '-0.02em', lineHeight: 1.18 },
    h3: { fontSize: '1.5rem',   fontWeight: 730, letterSpacing: '-0.015em', lineHeight: 1.22 },
    h4: { fontSize: '1.25rem',  fontWeight: 700, lineHeight: 1.3 },
    h5: { fontSize: '1.125rem', fontWeight: 500 },
    h6: { fontSize: '1rem',     fontWeight: 500 },
    body1:   { fontSize: '1rem',     fontWeight: 450, lineHeight: 1.65 },
    body2:   { fontSize: '0.875rem', fontWeight: 430, lineHeight: 1.6 },
    caption: { fontSize: '0.75rem' },
    button:  { fontSize: '0.9375rem', fontWeight: 500, textTransform: 'none' },
    overline:{ fontSize: '0.7rem',    fontWeight: 600, letterSpacing: '0.12em' },
  },
  spacing: 8,
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9375rem',
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 14,
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
          backgroundImage: 'none',
        }),
      },
    },
    /* MUI Paper의 기본 elevation 오버레이(반투명 그라디언트)를 제거해
     * Dialog/Drawer 배경이 각 컴포넌트가 명시한 Human Signal 색 그대로
     * 보이게 한다(예: Navbar 모바일 Drawer의 deepHarbor). */
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
        }),
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 8, fontWeight: 500 } },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&:hover fieldset': { borderColor: theme.palette.primary.main },
            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: 2 },
          },
        }),
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          wordBreak: 'keep-all',
          overflowWrap: 'break-word',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          wordBreak: 'keep-all',
          overflowWrap: 'break-word',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({ borderColor: theme.palette.divider }),
      },
    },
    /* Tooltip은 배경과 무관하게 어두운 chip으로 띄우는 일반적인 패턴을
     * 유지한다(라이트 페이지 위에서도 대비가 확실하다) — 색만 Human Signal
     * dark 톤(deepHarbor/softWhite)으로 바꾼다. 이 앱에는 아직 실제
     * `<Tooltip>` 사용처가 없어(rg 결과 0건) 시각적으로 검증되지 않은
     * 기본값이라는 점을 남겨둔다. */
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: HUMAN_SIGNAL.deepHarbor,
          color: HUMAN_SIGNAL.softWhite,
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: 6,
          padding: '5px 10px',
          border: '1px solid rgba(170,183,196,0.24)',
        },
        arrow: {
          color: HUMAN_SIGNAL.deepHarbor,
        },
      },
    },
  },
});

const theme = responsiveFontSizes(createTheme(getDesignTokens()));
export default theme;
