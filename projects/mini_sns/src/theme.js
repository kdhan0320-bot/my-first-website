import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6366F1",
      light: "#818CF8",
      dark: "#4F46E5",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#EEF2FF",
      light: "#F5F3FF",
      dark: "#C7D2FE",
      contrastText: "#4F46E5",
    },
    info: {
      main: "#06B6D4",
      light: "#67E8F9",
      dark: "#0891B2",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
      disabled: "#94A3B8",
    },
    divider: "#E2E4F0",
    error: { main: "#E53935" },
    success: { main: "#2E7D32" },
    warning: { main: "#FFB800" },
  },
  typography: {
    fontFamily:
      '"Pretendard", "Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: "1.375rem", fontWeight: 800, letterSpacing: "-0.3px" },
    h2: { fontSize: "1.25rem", fontWeight: 700 },
    h3: { fontSize: "1.0625rem", fontWeight: 700 },
    h4: { fontSize: "1rem", fontWeight: 700 },
    h5: { fontSize: "0.9375rem", fontWeight: 600 },
    h6: { fontSize: "0.875rem", fontWeight: 600 },
    body1: { fontSize: "0.9375rem", lineHeight: 1.65 },
    body2: { fontSize: "0.875rem", lineHeight: 1.6 },
    caption: { fontSize: "0.75rem", color: "#7F8FA4" },
    button: { fontSize: "0.875rem", fontWeight: 600, textTransform: "none" },
  },
  spacing: 8,
  shape: { borderRadius: 20 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F6F7FC",
          backgroundImage: "linear-gradient(180deg, #EEF0FE 0%, #F6F7FC 260px)",
          backgroundRepeat: "no-repeat",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
        },
        containedPrimary: {
          backgroundColor: "#6366F1",
          "&:hover": { backgroundColor: "#4F46E5" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 1px 8px rgba(30,27,75,0.07)",
          border: "1px solid #E2E4F0",
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: "#111827",
          color: "#F8FAFC",
          borderBottom: "1px solid #1F2937",
          boxShadow: "none",
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: "1px solid #E2E4F0",
          backgroundColor: "#FFFFFF",
          height: 60,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: "#B0B4C8",
          "&.Mui-selected": { color: "#6366F1" },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "#FFFFFF",
            "&:hover fieldset": { borderColor: "#6366F1" },
            "&.Mui-focused fieldset": {
              borderColor: "#6366F1",
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: { borderColor: "#E2E4F0" },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 10, fontWeight: 500 } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: "#E2E4F0" } },
    },
  },
});

export default theme;
