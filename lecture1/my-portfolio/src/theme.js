import { responsiveFontSizes, createTheme } from '@mui/material/styles';

export const getDesignTokens = () => ({
  palette: {
    mode: 'dark',
    primary: {
      main:         '#38BDF8',
      light:        '#7DD3FC',
      dark:         '#0EA5E9',
      contrastText: '#0B1020',
    },
    secondary: {
      main:         '#A78BFA',
      light:        '#C4B5FD',
      dark:         '#7C3AED',
      contrastText: '#0B1020',
    },
    background: {
      default: '#0B1020',
      paper:   '#0F172A',
    },
    text: {
      primary:   '#F8FAFC',
      secondary: '#CBD5E1',
      disabled:  '#94A3B8',
    },
    divider: 'rgba(148,163,184,0.16)',
    highlight: {
      background: 'rgba(56,189,248,0.08)',
    },
    error:   { main: '#E53935' },
    warning: { main: '#F59E0B' },
    success: { main: '#2E7D32' },
    info:    { main: '#60A5FA' },
  },
  typography: {
    fontFamily: '"Pretendard", "Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.75rem',  fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h2: { fontSize: '2rem',     fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.3 },
    h3: { fontSize: '1.5rem',   fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.35 },
    h4: { fontSize: '1.25rem',  fontWeight: 700, lineHeight: 1.4 },
    h5: { fontSize: '1.125rem', fontWeight: 600 },
    h6: { fontSize: '1rem',     fontWeight: 600 },
    body1:   { fontSize: '1rem',     lineHeight: 1.7  },
    body2:   { fontSize: '0.875rem', lineHeight: 1.65 },
    caption: { fontSize: '0.75rem' },
    button:  { fontSize: '0.9375rem', fontWeight: 600, textTransform: 'none' },
    overline:{ fontSize: '0.7rem',    fontWeight: 600, letterSpacing: '0.12em' },
  },
  spacing: 8,
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.9375rem',
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
          backgroundImage: 'none',
        }),
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
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
          backgroundColor: '#1E2D3D',
          color: '#F1F5F9',
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: 6,
          padding: '5px 10px',
          border: '1px solid rgba(51,65,85,0.8)',
        },
        arrow: {
          color: '#1E2D3D',
        },
      },
    },
  },
});

const theme = responsiveFontSizes(createTheme(getDesignTokens()));
export default theme;
