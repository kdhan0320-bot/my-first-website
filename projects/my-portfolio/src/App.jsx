import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Navbar from './components/layout/Navbar';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));

const NAVBAR_HEIGHT = 64;

const RouteFallback = () => (
  <Box
    sx={{
      minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'background.default',
    }}
  >
    <CircularProgress size={28} sx={{ color: 'primary.main' }} />
  </Box>
);

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <HashRouter>
      <Navbar />
      <Box sx={{ height: NAVBAR_HEIGHT }} aria-hidden="true" />
      <Box component="main">
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/"         element={<HomePage />} />
          <Route path="/about"    element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      </Suspense>
      </Box>
    </HashRouter>
  </ThemeProvider>
);

export default App;
