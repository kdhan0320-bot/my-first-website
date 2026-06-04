import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary:   { main: '#1976d2', light: '#42a5f5', dark: '#1565c0', 50: '#e3f2fd' },
    secondary: { main: '#dc004e', light: '#e33371', dark: '#9a0036', 50: '#fce4ec' },
    success:   { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20', 50: '#e8f5e9' },
    warning:   { main: '#ed6c02', light: '#ff9800', dark: '#e65100', 50: '#fff3e0' },
    error:     { main: '#d32f2f', light: '#ef5350', dark: '#c62828', 50: '#ffebee' },
    info:      { main: '#0288d1', light: '#03a9f4', dark: '#01579b', 50: '#e1f5fe' },
    background: {
      default: '#f5f5f5',
      paper:   '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.125rem', fontWeight: 500 },
    h2: { fontSize: '1.5rem',   fontWeight: 500 },
    h3: { fontSize: '1.25rem',  fontWeight: 500 },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiCard: {
      defaultProps: { elevation: 1 },
    },
  },
});

export default theme;
