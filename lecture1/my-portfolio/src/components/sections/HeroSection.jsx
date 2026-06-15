import { Box, Container, Typography, Button, Chip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

const HeroSection = () => (
  <Box
    sx={{
      background: 'linear-gradient(160deg, #1A1A2E 0%, #16213E 55%, #1578AA 100%)',
      color: '#FFFFFF',
      py: { xs: 12, md: 18 },
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-40%',
        right: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(21,120,170,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      },
    }}
  >
    <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>

      {/* 배지 */}
      <Chip
        label="UX/UI 기반 웹디자이너 지망생"
        sx={{
          bgcolor: 'rgba(21,120,170,0.25)',
          color: '#1E9BD7',
          border: '1px solid rgba(30,155,215,0.4)',
          fontWeight: 600,
          fontSize: '0.8rem',
          mb: 3,
          height: 30,
        }}
      />

      {/* 메인 제목 */}
      <Typography
        variant="h1"
        sx={{
          color: '#FFFFFF',
          fontWeight: 800,
          fontSize: { xs: '2.2rem', md: '3rem' },
          lineHeight: 1.2,
          letterSpacing: '-0.03em',
          mb: 2,
        }}
      >
        사용자 흐름을 정리하고,
        <br />
        <Box component="span" sx={{ color: '#1E9BD7' }}>화면으로 구현합니다.</Box>
      </Typography>

      {/* 부제 */}
      <Typography
        variant="body1"
        sx={{
          color: 'rgba(255,255,255,0.65)',
          mb: 5,
          lineHeight: 1.9,
          fontSize: { xs: '0.95rem', md: '1.05rem' },
          maxWidth: 520,
          mx: 'auto',
          px: { xs: 1, sm: 0 },
        }}
      >
        사용자 입장에서 화면을 설계하고,
        <br />
        React · MUI로 실제 작동하는 웹서비스 화면을 만들고 있습니다.
      </Typography>

      {/* CTA 버튼 */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', px: { xs: 2, sm: 0 } }}>
        <Button
          variant="contained"
          size="large"
          endIcon={<OpenInNewIcon />}
          href="#projects"
          sx={{
            bgcolor: '#1578AA',
            color: '#FFFFFF',
            borderRadius: 12,
            px: 3.5,
            fontWeight: 700,
            '&:hover': { bgcolor: '#1E9BD7' },
          }}
        >
          작업물 보기
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<EmailOutlinedIcon />}
          href="mailto:kdhan0320@gmail.com"
          sx={{
            color: '#FFFFFF',
            borderColor: 'rgba(255,255,255,0.35)',
            borderRadius: 12,
            px: 3.5,
            fontWeight: 600,
            '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.08)' },
          }}
        >
          연락하기
        </Button>
      </Box>

      {/* 스크롤 다운 화살표 */}
      <Box sx={{ mt: 10, color: 'rgba(255,255,255,0.3)', animation: 'bounce 1.8s infinite' }}>
        <KeyboardArrowDownIcon sx={{ fontSize: 32 }} />
      </Box>
    </Container>
  </Box>
);

export default HeroSection;
