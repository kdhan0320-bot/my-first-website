import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Navbar from './components/layout/Navbar';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));

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
          <Route path="/"              element={<HomePage />} />
          {/* 예전 별도 /about 페이지는 제거했다. 기존 주소로 들어온 방문자가 빈 화면/404를
           * 보지 않도록 Home의 About 섹션으로 안전하게 리다이렉트한다(HomePage.jsx의
           * location.state.scrollTo 처리 로직 재사용). */}
          <Route path="/about"         element={<Navigate to="/" state={{ scrollTo: 'about' }} replace />} />
          <Route path="/projects"      element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </Suspense>
      </Box>
    </HashRouter>
  </ThemeProvider>
);

export default App;
