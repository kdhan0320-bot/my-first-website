import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Navbar from './components/layout/Navbar';
import RouteEffects from './components/layout/RouteEffects';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

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
      <RouteEffects />
      <Navbar />
      <Box sx={{ height: NAVBAR_HEIGHT }} aria-hidden="true" />
      {/* 스크롤 오프셋 계산은 hooks/useScrollNav.js의 HEADER_OFFSET, index.css의
       * scroll-margin-top과 함께 헤더 높이(모바일 72px / md+ 80px)를 기준으로 맞춘다. */}
      {/* tabIndex=-1: div/main은 기본적으로 focus를 받지 못해, skip link가
       * 스크롤만 시키고 실제 focus는 body에 남는 문제가 있었다(QA로 확인).
       * -1로 프로그램적 focus만 허용해 skip link 클릭 시 focus가 실제로
       * 여기로 이동하게 한다. */}
      <Box component="main" id="main-content" tabIndex={-1} sx={{ outline: 'none' }}>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/"              element={<HomePage />} />
          {/* 예전 별도 /about 페이지는 제거했다. 기존 주소로 들어온 방문자가 빈 화면/404를
           * 보지 않도록 Home의 About 섹션으로 안전하게 리다이렉트한다(HomePage.jsx의
           * location.state.scrollTo 처리 로직 재사용). */}
          <Route path="/about"         element={<Navigate to="/" state={{ scrollTo: 'about' }} replace />} />
          <Route path="/projects"      element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="*"              element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      </Box>
    </HashRouter>
  </ThemeProvider>
);

export default App;
