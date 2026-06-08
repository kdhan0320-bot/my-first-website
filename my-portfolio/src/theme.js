import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      main:         '#111111',
      light:        '#333333',
      dark:         '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main:         '#666666',
      light:        '#999999',
      dark:         '#444444',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper:   '#FAFAFA',
    },
    text: {
      primary:   '#111111',
      secondary: '#555555',
      disabled:  '#AAAAAA',
    },
    divider: '#E0E0E0',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem',  fontWeight: 700 },
    h2: { fontSize: '2rem',    fontWeight: 600 },
    h3: { fontSize: '1.5rem',  fontWeight: 600 },
    h4: { fontSize: '1.25rem', fontWeight: 500 },
    body1: { fontSize: '1rem',     fontWeight: 400 },
    body2: { fontSize: '0.875rem', fontWeight: 400 },
  },
  spacing: 8,
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          border: '1px solid #E0E0E0',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: '#111111' },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
