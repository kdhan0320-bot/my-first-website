import { Box, Container, Typography, Divider } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const ProjectsPage = () => (
  <Box sx={{ bgcolor: '#111111', minHeight: '100vh', py: { xs: 8, md: 12 } }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="overline" sx={{ color: '#888888', letterSpacing: 4, fontWeight: 600 }}>
          PROJECTS
        </Typography>
        <Typography variant="h1" sx={{ mt: 1, color: '#FFFFFF' }}>
          Projects
        </Typography>
        <Divider sx={{ width: 60, mx: 'auto', mt: 2, borderColor: '#FFFFFF', borderWidth: 3 }} />
      </Box>

      <Box
        sx={{
          bgcolor: 'rgba(255,255,255,0.05)',
          border: '1px solid #333333',
          borderRadius: 3,
          p: { xs: 4, md: 8 },
          textAlign: 'center',
        }}
      >
        <FolderOpenIcon sx={{ fontSize: 80, color: '#555555', mb: 3 }} />
        <Typography variant="h3" sx={{ color: '#FFFFFF', mb: 2 }}>
          Projects 페이지가 개발될 공간입니다.
        </Typography>
        <Typography variant="body1" sx={{ color: '#AAAAAA', lineHeight: 2 }}>
          포트폴리오 작품들이 들어갈 예정입니다. 각 프로젝트의 썸네일, 설명, 기술 스택, GitHub 링크 등이 카드 형태로 전시됩니다.
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default ProjectsPage;
