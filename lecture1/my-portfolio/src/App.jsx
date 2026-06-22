import { useMemo } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeModeProvider, useThemeMode } from './context/ThemeModeContext';
import { getDesignTokens } from './theme';
import Navbar from './components/layout/Navbar';
import CustomCursor from './components/common/CustomCursor';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';

const NAVBAR_HEIGHT = 64;

const ThemedApp = () => {
  const { mode } = useThemeMode();
  const theme = useMemo(
    () => responsiveFontSizes(createTheme(getDesignTokens(mode))),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <CustomCursor />
        <Navbar />
        <Box sx={{ height: NAVBAR_HEIGHT }} aria-hidden="true" />
        <Box component="main">
        <Routes>
          <Route path="/"         element={<HomePage />} />
          <Route path="/about"    element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
        </Box>
      </HashRouter>
    </ThemeProvider>
  );
};

const App = () => (
  <ThemeModeProvider>
    <ThemedApp />
  </ThemeModeProvider>
);

export default App;
