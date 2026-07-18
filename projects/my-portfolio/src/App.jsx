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

const NAVBAR_HEIGHT = { xs: 72, md: 80 };

const RouteFallback = () => (
  <Box
    sx={{
      minHeight: { xs: `calc(100vh - ${NAVBAR_HEIGHT.xs}px)`, md: `calc(100vh - ${NAVBAR_HEIGHT.md}px)` },
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
      {/* 스크롤 오프셋 계산은 hooks/useScrollNav.js의 HEADER_OFFSET, index.css의
       * scroll-margin-top과 함께 헤더 높이(모바일 72px / md+ 80px)를 기준으로 맞춘다. */}
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
