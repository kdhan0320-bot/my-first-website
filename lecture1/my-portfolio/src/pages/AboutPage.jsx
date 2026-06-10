import { Box, Container, Typography, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const AboutPage = () => (
  <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', py: { xs: 8, md: 12 } }}>
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="overline" sx={{ color: '#888888', letterSpacing: 4, fontWeight: 600 }}>
          About Me 페이지
        </Typography>
        <Typography variant="h1" sx={{ mt: 1, color: '#111111' }}>
          About Me
        </Typography>
        <Divider sx={{ width: 60, mx: 'auto', mt: 2, borderColor: '#111111', borderWidth: 3 }} />
      </Box>

      <Box
        sx={{
          bgcolor: '#FFFFFF',
          border: '1px solid #E0E0E0',
          borderRadius: 3,
          p: { xs: 4, md: 8 },
          textAlign: 'center',
        }}
      >
        <PersonIcon sx={{ fontSize: 80, color: '#CCCCCC', mb: 3 }} />
        <Typography variant="h3" sx={{ color: '#111111', mb: 2 }}>
          About Me 페이지가 개발될 공간입니다.
        </Typography>
        <Typography variant="body1" sx={{ color: '#666666', lineHeight: 2 }}>
          상세한 자기소개가 들어갈 예정입니다. 학력, 경력, 자격증, 관심 분야 등 나를 소개하는 내용이 이 페이지에 작성됩니다.
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default AboutPage;
