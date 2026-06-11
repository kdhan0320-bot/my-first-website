import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      main: '#1578AA',
      light: '#1E9BD7',
      dark: '#1A1A2E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1A1A2E',
      light: '#2D2D4A',
      dark: '#0D0D1A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F6F8FB',
      paper:   '#FFFFFF',
    },
    text: {
      primary:   '#1A1A2E',
      secondary: '#7F8FA4',
      disabled:  '#B0BAC8',
    },
    divider: '#E0E4EA',
    error:   { main: '#E53935' },
    warning: { main: '#FFB800' },
    success: { main: '#2E7D32' },
    info:    { main: '#1E9BD7' },
  },
  typography: {
    fontFamily: '"Pretendard", "Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.75rem',  fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h2: { fontSize: '2rem',     fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.5rem',   fontWeight: 700 },
    h4: { fontSize: '1.25rem',  fontWeight: 700 },
    h5: { fontSize: '1.125rem', fontWeight: 600 },
    h6: { fontSize: '1rem',     fontWeight: 600 },
    body1: { fontSize: '1rem',      lineHeight: 1.7 },
    body2: { fontSize: '0.875rem',  lineHeight: 1.65 },
    caption: { fontSize: '0.75rem' },
    button: { fontSize: '0.9375rem', fontWeight: 600, textTransform: 'none' },
    overline: { fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em' },
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
        containedPrimary: {
          backgroundColor: '#1578AA',
          '&:hover': { backgroundColor: '#1E9BD7' },
        },
        outlinedPrimary: {
          borderColor: '#1578AA',
          color: '#1578AA',
          '&:hover': { borderColor: '#1E9BD7', color: '#1E9BD7', backgroundColor: '#EAF6FC' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 16px rgba(26,26,46,0.06)',
          border: '1px solid #E0E4EA',
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1A1A2E',
          borderBottom: '1px solid #E0E4EA',
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 8, fontWeight: 500 } },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&:hover fieldset': { borderColor: '#1578AA' },
            '&.Mui-focused fieldset': { borderColor: '#1578AA', borderWidth: 2 },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: '#E0E4EA' } },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
