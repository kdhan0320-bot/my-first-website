import { responsiveFontSizes, createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main:         mode === 'dark' ? '#38BDF8' : '#1E3A5F',
      light:        mode === 'dark' ? '#7DD3FC' : '#2A5A8F',
      dark:         mode === 'dark' ? '#0EA5E9' : '#162D4A',
      contrastText: mode === 'dark' ? '#0B1220' : '#FFFFFF',
    },
    secondary: {
      main:         mode === 'dark' ? '#2DD4BF' : '#0D9488',
      light:        mode === 'dark' ? '#5EEAD4' : '#2DD4BF',
      dark:         mode === 'dark' ? '#14B8A6' : '#0F766E',
      contrastText: mode === 'dark' ? '#0B1220' : '#FFFFFF',
    },
    background: {
      default: mode === 'dark' ? '#0B1220' : '#F8FAFC',
      paper:   mode === 'dark' ? '#111827' : '#FFFFFF',
    },
    text: {
      primary:   mode === 'dark' ? '#F8FAFC' : '#0F172A',
      secondary: mode === 'dark' ? '#CBD5E1' : '#475569',
      disabled:  mode === 'dark' ? '#94A3B8' : '#94A3B8',
    },
    divider: mode === 'dark' ? 'rgba(51,65,85,0.75)' : 'rgba(30,58,95,0.12)',
    highlight: {
      background: mode === 'dark' ? 'rgba(56,189,248,0.08)' : '#EEF4FB',
    },
    error:   { main: '#E53935' },
    warning: { main: '#FFB800' },
    success: { main: '#2E7D32' },
    info:    { main: mode === 'dark' ? '#60A5FA' : '#2563EB' },
  },
  typography: {
    fontFamily: '"Pretendard", "Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.75rem',  fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h2: { fontSize: '2rem',     fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.5rem',   fontWeight: 700 },
    h4: { fontSize: '1.25rem',  fontWeight: 700 },
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
          boxShadow: theme.palette.mode === 'dark'
            ? 'none'
            : '0 2px 16px rgba(26,26,46,0.06)',
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
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({ borderColor: theme.palette.divider }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? '#1E2D3D' : 'rgba(15,23,42,0.92)',
          color: theme.palette.mode === 'dark' ? '#F1F5F9' : '#FFFFFF',
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: 6,
          padding: '5px 10px',
          border: theme.palette.mode === 'dark' ? '1px solid rgba(51,65,85,0.8)' : 'none',
        }),
        arrow: ({ theme }) => ({
          color: theme.palette.mode === 'dark' ? '#1E2D3D' : 'rgba(15,23,42,0.92)',
        }),
      },
    },
  },
});

const theme = responsiveFontSizes(createTheme(getDesignTokens('light')));
export default theme;
