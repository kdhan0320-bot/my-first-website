import { Box, Container, Typography, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const HeroSection = () => (
  <Box
    sx={{
      bgcolor: '#1A1A2E',
      color: '#FFFFFF',
      py: { xs: 10, md: 16 },
      textAlign: 'center',
    }}
  >
    <Container maxWidth="md">
      <Typography
        variant="overline"
        sx={{ color: '#888888', letterSpacing: 4, fontWeight: 600 }}
      >
        HERO
      </Typography>

      <Typography variant="h1" sx={{ mt: 2, mb: 3, color: '#FFFFFF', px: { xs: 1, sm: 0 } }}>
        여기는 Hero 섹션입니다.
      </Typography>

      <Typography variant="body1" sx={{ color: '#AAAAAA', mb: 5, lineHeight: 2, px: { xs: 1, sm: 0 } }}>
        메인 비주얼, 이름, 간단 소개가 들어갈 예정입니다.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', px: { xs: 2, sm: 0 } }}>
        <Button
          variant="contained"
          size="large"
          sx={{ bgcolor: '#1578AA', color: '#FFFFFF', '&:hover': { bgcolor: '#1E9BD7' } }}
        >
          프로젝트 보기
        </Button>
        <Button
          variant="outlined"
          size="large"
          sx={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.08)' } }}
        >
          연락하기
        </Button>
      </Box>

      <Box sx={{ mt: 8, color: '#555555' }}>
        <KeyboardArrowDownIcon sx={{ fontSize: 36, animation: 'bounce 1.5s infinite' }} />
      </Box>
    </Container>
  </Box>
);

export default HeroSection;
