import { Box, Container, Typography, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const HeroSection = () => (
  <Box
    sx={{
      bgcolor: '#111111',
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
        Hero 섹션
      </Typography>

      <Typography variant="h1" sx={{ mt: 2, mb: 3, color: '#FFFFFF', px: { xs: 1, sm: 0 } }}>
        여기는 Hero 섹션입니다.
      </Typography>

      <Typography variant="body1" sx={{ color: '#AAAAAA', mb: 5, lineHeight: 2, px: { xs: 1, sm: 0 } }}>
        메인 비주얼, 이름, 간단 소개가 들어갈 예정입니다.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', px: { xs: 2, sm: 0 } }}>
        <Button variant="contained" color="primary" size="large">
          프로젝트 보기
        </Button>
        <Button
          variant="outlined"
          size="large"
          sx={{ color: '#FFFFFF', borderColor: '#555555', '&:hover': { borderColor: '#FFFFFF' } }}
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
