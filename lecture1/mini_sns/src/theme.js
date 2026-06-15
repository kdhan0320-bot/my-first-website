import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1578AA',
      light: '#1E9BD7',
      dark: '#1A1A2E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#EAF6FC',
      light: '#F6FBFE',
      dark: '#B8DFF2',
      contrastText: '#1578AA',
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
    success: { main: '#2E7D32' },
    warning: { main: '#FFB800' },
  },
  typography: {
    fontFamily: '"Pretendard", "Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.3px' },
    h2: { fontSize: '1.25rem',  fontWeight: 700 },
    h3: { fontSize: '1.0625rem', fontWeight: 700 },
    h4: { fontSize: '1rem',     fontWeight: 700 },
    h5: { fontSize: '0.9375rem', fontWeight: 600 },
    h6: { fontSize: '0.875rem', fontWeight: 600 },
    body1: { fontSize: '0.9375rem', lineHeight: 1.65 },
    body2: { fontSize: '0.875rem',  lineHeight: 1.6 },
    caption: { fontSize: '0.75rem', color: '#7F8FA4' },
    button: { fontSize: '0.875rem', fontWeight: 600, textTransform: 'none' },
  },
  spacing: 8,
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: '#F6F8FB' } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
        },
        containedPrimary: {
          backgroundColor: '#1578AA',
          '&:hover': { backgroundColor: '#1E9BD7' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 8px rgba(26,26,46,0.06)',
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
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: '1px solid #E0E4EA',
          backgroundColor: '#FFFFFF',
          height: 60,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#B0BAC8',
          '&.Mui-selected': { color: '#1578AA' },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            '&:hover fieldset': { borderColor: '#1578AA' },
            '&.Mui-focused fieldset': { borderColor: '#1578AA', borderWidth: 2 },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: { borderColor: '#E0E4EA' },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 10, fontWeight: 500 } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: '#E0E4EA' } },
    },
  },
});

export default theme;
