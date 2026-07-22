import { responsiveFontSizes, createTheme } from '@mui/material/styles';

/* ORDERED SIGNAL 시스템의 라벨/숫자/메타데이터용 모노스페이스 폰트.
 * MUI 테마에는 보조 폰트 슬롯이 없어 공용 상수로 두고 필요한 곳에
 * sx={{ fontFamily: FONT_MONO }}로 개별 적용한다. */
export const FONT_MONO = '"IBM Plex Mono", "Roboto Mono", monospace';
/* Phase 2D: 한글 H1~body/버튼/nav의 primary sans를 IBM Plex Sans KR(공학·기술
 * 문서 톤)에서 SUIT Variable(@sun-typeface/suit, SIL OFL-1.1, npm 패키지 —
 * main.jsx에서 variable WOFF2 1개만 import)로 교체했다. FONT_MONO(IBM Plex
 * Mono)는 그대로 두고 짧은 영문 라벨/index/technical status 용도로만 쓴다. */
export const FONT_SANS = '"SUIT Variable", "SUIT", "Pretendard", "Noto Sans KR", sans-serif';

/* ORDERED SIGNAL 컬러 시스템 (Figma Style Guide 19:233 기준).
 * 현재 승인된 디자인 방향은 Human Signal(HUMAN_SIGNAL, 아래)로 바뀌었지만,
 * 이 COLORS와 MUI 팔레트(getDesignTokens)는 아직 Ordered Signal 화면인
 * HeroSection/AboutSection/ProjectsSection/MoreWorksSection/ContactSection이
 * 그대로 참조하고 있어(COLORS.inkBlack 등 직접 참조 다수) 이번 회차에서
 * 값을 바꾸지 않는다 — 해당 5개 섹션은 이번 회차 변경 금지 범위다.
 * Header/404/D2 마크 등 이번 회차에 새로 Human Signal로 전환한 화면은
 * 아래 HUMAN_SIGNAL을 쓴다. 나머지 Home 섹션이 Phase 2에서 전환되면
 * 이 COLORS 블록을 정리한다. */
export const COLORS = {
  inkBlack: '#0B0F14',
  deepSlate: '#151B23',
  warmIvory: '#F4F1EA',
  lightSecondary: '#B8C1CB',
  darkSecondary: '#4D5966',
  signalOrange: '#FF6B3D',
  lightBgAccentText: '#B93A17',
};

/* HUMAN SIGNAL 컬러 시스템 — Figma 파일 53Ppn2hIgrvs9Jra3eejFs의
 * Human Signal v8 실제 프레임(Home Hero 180:500, About 180:546,
 * Contact 180:698, Interaction/Navigation States 220:7, 404 223:47)에서
 * 직접 확인한 hex 값이다. 이 파일에는 Figma Variables가 바인딩돼 있지
 * 않아(get_variable_defs가 빈 값을 반환) 각 프레임에 지정된 실제 fill
 * 값을 대조해서 정리했다.
 *
 * 작은 텍스트/기호의 배경별 대비 역할(Figma 접근성 점검 기준):
 * - Warm Paper/Soft White(밝은 배경) 위 작은 텍스트·기호 → burntOrange
 * - Deep Harbor/Ink Navy(어두운 배경) 위 작은 텍스트·기호 → brightOrangeOnDark
 * - 큰 강조 텍스트·비텍스트 장식(밑줄 인디케이터 등)은 배경과 무관하게
 *   brightOrange를 그대로 쓸 수 있다.
 * deepSage는 이번 회차 구현 범위(Header/Nav/404) 프레임에서 실제 solid
 * fill로 등장하지 않아 [확인 필요]로 비워둔다(임의 값 추가 금지). */
export const HUMAN_SIGNAL = {
  inkNavy: '#0C1420',
  deepHarbor: '#172432',
  warmPaper: '#F2EDE3',
  paperDeep: '#E2D9CC',
  softWhite: '#FFFDF8',
  inkText: '#27313B',
  burntOrange: '#A74224',
  brightOrange: '#D85C32',
  brightOrangeOnDark: '#EC6B3D',
  mutedSage: '#90A58B',
  steelMist: '#AAB7C4',
};

/* 2560 QHD 등 Ultra-wide 화면에서 Home 콘텐츠가 화면 끝까지 과확장되지
 * 않도록 쓰는 공통 max-width(px). 1440 레이아웃의 단순 확대/복제가 아니라
 * Figma Home v8 QHD 프레임(181:919) 기준 콘텐츠 폭 규칙이다. */
export const ULTRAWIDE_CONTENT_MAX_WIDTH = 1680;

/* Phase 2D QHD-first macro layout: 위 ULTRAWIDE_CONTENT_MAX_WIDTH(전역, Header/
 * 다른 페이지 포함)는 그대로 두고, Home 섹션 전용으로만 쓰는 더 넓은 shell
 * 상수를 추가한다. MUI `xl`(1536+) 하나로 1536~2560을 뭉뚱그리지 않고,
 * 각 섹션에서 `@media (min-width:1920px)` / `@media (min-width:2300px)`
 * 명시적 breakpoint와 함께 쓴다. */
export const HOME_WIDE_MAX_WIDTH = 2080; // Home 섹션 outer visual shell(QHD)
export const HOME_PROJECT_MAX_WIDTH = 1960; // Featured Projects block shell(QHD)
export const HOME_READING_MAX_WIDTH = 680; // 본문 한 단락이 읽기 좋은 최대 폭

export const getDesignTokens = () => ({
  palette: {
    mode: 'dark',
    primary: {
      main:         COLORS.signalOrange,
      light:        '#FF7A52',
      dark:         '#E5522A',
      contrastText: COLORS.inkBlack,
    },
    secondary: {
      main:         COLORS.lightSecondary,
      light:        '#D2D9E0',
      dark:         COLORS.darkSecondary,
      contrastText: COLORS.inkBlack,
    },
    background: {
      default: COLORS.inkBlack,
      paper:   COLORS.deepSlate,
    },
    text: {
      primary:   COLORS.warmIvory,
      secondary: COLORS.lightSecondary,
      disabled:  COLORS.darkSecondary,
    },
    divider: 'rgba(184,193,203,0.16)',
    highlight: {
      background: 'rgba(255,107,61,0.08)',
    },
    error:   { main: '#E53935' },
    warning: { main: '#F59E0B' },
    success: { main: '#2E7D32' },
    info:    { main: COLORS.lightSecondary },
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
    /* MUI 다크 모드 Paper 기본 elevation 오버레이(반투명 흰 그라디언트)를 제거해
     * Dialog/Drawer 배경이 정확히 Ink Black/Deep Slate로 보이게 한다. */
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
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: COLORS.deepSlate,
          color: COLORS.warmIvory,
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: 6,
          padding: '5px 10px',
          border: '1px solid rgba(184,193,203,0.24)',
        },
        arrow: {
          color: COLORS.deepSlate,
        },
      },
    },
  },
});

const theme = responsiveFontSizes(createTheme(getDesignTokens()));
export default theme;
