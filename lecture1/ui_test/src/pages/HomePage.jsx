import { Box, Container, Typography } from '@mui/material';

// ─── 섹션 import (추가 순서대로 주석 해제) ───────────────────────
import Section01 from '../components/sections/Section01';
import Section02 from '../components/sections/Section02';
import Section03 from '../components/sections/Section03';
import Section04 from '../components/sections/Section04';
import Section05 from '../components/sections/Section05';
import Section06 from '../components/sections/Section06';
import Section07 from '../components/sections/Section07';
import Section08 from '../components/sections/Section08';
import Section09 from '../components/sections/Section09';
import Section10 from '../components/sections/Section10';
import Section11 from '../components/sections/Section11';
import Section12 from '../components/sections/Section12';
import Section13 from '../components/sections/Section13';
import Section14 from '../components/sections/Section14';
import Section15 from '../components/sections/Section15';
import Section16 from '../components/sections/Section16';
import Section17 from '../components/sections/Section17';
// ...

const HomePage = () => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* 페이지 헤더 */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 5,
          px: { xs: 2, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h1" gutterBottom>
            UI Components Showcase
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85 }}>
            16개의 MUI UI 요소를 섹션별로 살펴봅니다.
          </Typography>
        </Container>
      </Box>

      {/* ─── 섹션 목록 (추가 순서대로 렌더링) ─────────────────── */}
      <Container maxWidth="lg">
        <Section01 />
        <Section02 />
        <Section03 />
        <Section04 />
        <Section05 />
        <Section06 />
        <Section07 />
        <Section08 />
        <Section09 />
        <Section10 />
        <Section11 />
        <Section12 />
        <Section13 />
        <Section14 />
        <Section15 />
        <Section16 />
        <Section17 />
      </Container>
    </Box>
  );
};

export default HomePage;
