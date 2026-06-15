import { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Chip, Divider } from '@mui/material';
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
          <Typography variant="h2" sx={{ mt: 1, color: '#1A1A2E' }}>
            주요 프로젝트
          </Typography>
          <Divider sx={{ width: 60, mx: 'auto', mt: 2, borderColor: '#1578AA', borderWidth: 3 }} />
          <Typography variant="body2" sx={{ mt: 2, color: '#666666' }}>
            직접 만든 대표 프로젝트들입니다.
          </Typography>
        </Box>

        {/* CSS Grid - MUI v9 호환 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {projects.map(({ id, title, description, tech_stack, thumbnail_url }) => (
            <Card
              key={id}
              onClick={() => navigate('/projects')}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                },
                '&:hover .thumb-img': { transform: 'scale(1.05)' },
              }}
            >
              {/* 16:9 고정 비율 썸네일 */}
              <Box sx={{ position: 'relative', paddingTop: '56.25%', bgcolor: '#E8E8E8', overflow: 'hidden', flexShrink: 0 }}>
                {thumbnail_url && (
                  <Box
                    component="img"
                    className="thumb-img"
                    src={thumbnail_url}
                    alt={title}
                    sx={{
                      position: 'absolute', top: 0, left: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover', objectPosition: 'top',
                      transition: 'transform 0.35s ease',
                    }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: '#1A1A2E', mb: 0.5 }}>
                  {title}
                </Typography>
                <Typography
                  sx={{
                    color: '#777',
                    fontSize: '0.78rem',
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
                      sx={{ border: '1px solid #1E9BD7', color: '#1578AA', bgcolor: 'transparent', fontSize: '0.65rem', height: 22 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

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
