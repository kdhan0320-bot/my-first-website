import { Box, Container, Typography, Card, CardContent, Grid, Button, Chip, Divider } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';

const PREVIEW_PROJECTS = [
  { id: 1, title: '프로젝트 1', desc: '프로젝트 설명이 들어갈 예정입니다.', tags: ['React', 'MUI'] },
  { id: 2, title: '프로젝트 2', desc: '프로젝트 설명이 들어갈 예정입니다.', tags: ['JavaScript', 'CSS'] },
  { id: 3, title: '프로젝트 3', desc: '프로젝트 설명이 들어갈 예정입니다.', tags: ['Node.js', 'API'] },
];

const ProjectsSection = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#FFFFFF', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" sx={{ color: '#888888', letterSpacing: 4, fontWeight: 600 }}>
            PROJECTS
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, color: '#111111' }}>
            여기는 Projects 섹션입니다.
          </Typography>
          <Divider sx={{ width: 60, mx: 'auto', mt: 2, borderColor: '#111111', borderWidth: 3 }} />
          <Typography variant="body2" sx={{ mt: 2, color: '#666666' }}>
            대표작 썸네일 3~4개와 &apos;더 보기&apos; 버튼이 들어갈 예정입니다.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {PREVIEW_PROJECTS.map(({ id, title, desc, tags }) => (
            <Grid item xs={12} md={4} key={id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    bgcolor: '#E0E0E0',
                    height: 160,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FolderIcon sx={{ fontSize: 64, color: '#888888' }} />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" gutterBottom>{title}</Typography>
                  <Typography variant="body2" sx={{ color: '#666666', mb: 2 }}>
                    {desc}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{ border: '1px solid #333333', color: '#333333', bgcolor: 'transparent' }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            endIcon={<OpenInNewIcon />}
            onClick={() => navigate('/projects')}
          >
            더 보기
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ProjectsSection;
