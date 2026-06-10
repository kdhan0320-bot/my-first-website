import { Box, Container, Typography, Button, Grid, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#FFFFFF', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" sx={{ color: '#888888', letterSpacing: 4, fontWeight: 600 }}>
            About Me 섹션
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, color: '#111111' }}>
            여기는 About Me 섹션입니다.
          </Typography>
          <Divider sx={{ width: 60, mx: 'auto', mt: 2, borderColor: '#111111', borderWidth: 3 }} />
        </Box>

        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: '#F0F0F0',
                borderRadius: 3,
                p: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 240,
              }}
            >
              <PersonIcon sx={{ fontSize: 100, color: '#AAAAAA' }} />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ color: '#555555', lineHeight: 2, mb: 3 }}>
              간단한 자기소개와 &apos;더 알아보기&apos; 버튼이 들어갈 예정입니다.
            </Typography>
            <Typography variant="body2" sx={{ color: '#AAAAAA', mb: 4 }}>
              이름, 직군, 관심 분야, 간단한 경력 등이 이 영역에 작성됩니다.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/about')}
            >
              더 알아보기
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;
