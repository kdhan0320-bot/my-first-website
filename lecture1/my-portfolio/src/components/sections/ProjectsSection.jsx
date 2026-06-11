import { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Grid, Button, Chip, Divider } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const ProjectsSection = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from('projects')
        .select('id, title, description, tech_stack, thumbnail_url')
        .eq('is_published', true)
        .order('sort_order')
        .limit(4);
      if (data) setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <Box sx={{ bgcolor: '#FFFFFF', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" sx={{ color: '#888888', letterSpacing: 4, fontWeight: 600 }}>
            PROJECTS
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, color: '#111111' }}>
            주요 프로젝트
          </Typography>
          <Divider sx={{ width: 60, mx: 'auto', mt: 2, borderColor: '#111111', borderWidth: 3 }} />
          <Typography variant="body2" sx={{ mt: 2, color: '#666666' }}>
            직접 만든 대표 프로젝트들입니다.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {projects.map(({ id, title, description, tech_stack, thumbnail_url }) => (
            <Grid item xs={12} sm={6} md={3} key={id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <Box sx={{ height: 150, bgcolor: '#E8E8E8', overflow: 'hidden', flexShrink: 0 }}>
                  {thumbnail_url && (
                    <Box
                      component="img"
                      src={thumbnail_url}
                      alt={title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="h4" gutterBottom sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                    {title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666666',
                      mb: 1.5,
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {tech_stack?.slice(0, 3).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{ border: '1px solid #CCCCCC', color: '#555555', bgcolor: 'transparent', fontSize: '0.68rem' }}
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
            전체 프로젝트 보기
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ProjectsSection;
