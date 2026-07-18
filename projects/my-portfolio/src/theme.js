import { responsiveFontSizes, createTheme } from '@mui/material/styles';

/* ORDERED SIGNAL 시스템의 라벨/숫자/메타데이터용 모노스페이스 폰트.
 * MUI 테마에는 보조 폰트 슬롯이 없어 공용 상수로 두고 필요한 곳에
 * sx={{ fontFamily: FONT_MONO }}로 개별 적용한다. */
export const FONT_MONO = '"IBM Plex Mono", "Roboto Mono", monospace';
export const FONT_SANS = '"IBM Plex Sans KR", "Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif';

/* ORDERED SIGNAL 컬러 시스템 (Figma Style Guide 19:233 기준) */
export const COLORS = {
  inkBlack: '#0B0F14',
  deepSlate: '#151B23',
  warmIvory: '#F4F1EA',
  lightSecondary: '#B8C1CB',
  darkSecondary: '#4D5966',
  signalOrange: '#FF6B3D',
  lightBgAccentText: '#B93A17',
};

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
    h1: { fontSize: '2.75rem',  fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 },
    h2: { fontSize: '2rem',     fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 },
    h3: { fontSize: '1.5rem',   fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.35 },
    h4: { fontSize: '1.25rem',  fontWeight: 700, lineHeight: 1.4 },
    h5: { fontSize: '1.125rem', fontWeight: 500 },
    h6: { fontSize: '1rem',     fontWeight: 500 },
    body1:   { fontSize: '1rem',     lineHeight: 1.7  },
    body2:   { fontSize: '0.875rem', lineHeight: 1.65 },
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
