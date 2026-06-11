import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardActions,
  Chip, Button, Divider, Skeleton, Alert, IconButton, Tooltip,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { supabase } from '../lib/supabase';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const ProjectCard = ({ project, index }) => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#161616',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 3,
      boxShadow: 'none',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
        borderColor: 'rgba(255,255,255,0.2)',
      },
      '&:hover .thumb-img': {
        transform: 'scale(1.05)',
      },
    }}
  >
    {/* 썸네일 */}
    <Box sx={{ position: 'relative', height: 180, bgcolor: '#0D0D0D', overflow: 'hidden', flexShrink: 0 }}>
      {project.thumbnail_url ? (
        <Box
          component="img"
          className="thumb-img"
          src={project.thumbnail_url}
          alt={project.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      ) : (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" sx={{ color: '#333' }}>No Image</Typography>
        </Box>
      )}
      {/* 프로젝트 번호 뱃지 */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: 'rgba(0,0,0,0.75)',
          border: '1px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 700 }}>
          {String(index + 1).padStart(2, '0')}
        </Typography>
      </Box>
    </Box>

    <CardContent sx={{ flexGrow: 1, p: 2.5, pb: 1.5 }}>
      {/* 날짜 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
        <CalendarTodayIcon sx={{ fontSize: '0.7rem', color: '#666666' }} />
        <Typography sx={{ fontSize: '0.72rem', color: '#666666', letterSpacing: 0.5 }}>
          {formatDate(project.created_at)}
        </Typography>
      </Box>

      {/* 제목 */}
      <Typography
        variant="h4"
        sx={{ color: '#FFFFFF', mb: 1, fontSize: '1rem', fontWeight: 700, lineHeight: 1.4 }}
      >
        {project.title}
      </Typography>

      {/* 설명 */}
      <Typography
        variant="body2"
        sx={{
          color: '#888888',
          mb: 2,
          lineHeight: 1.7,
          fontSize: '0.82rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {project.description}
      </Typography>

      {/* 기술 스택 */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {project.tech_stack?.map((tech) => (
          <Chip
            key={tech}
            label={tech}
            size="small"
            sx={{
              height: 22,
              bgcolor: 'rgba(255,255,255,0.06)',
              color: '#AAAAAA',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.65rem',
              fontWeight: 500,
              '& .MuiChip-label': { px: 1 },
            }}
          />
        ))}
      </Box>
    </CardContent>

    <CardActions sx={{ p: 2.5, pt: 1, flexDirection: 'column', gap: 1, alignItems: 'stretch' }}>
      {/* Live Demo + GitHub */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {project.detail_url && (
          <Button
            size="small"
            variant="contained"
            href={project.detail_url}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon sx={{ fontSize: '0.8rem !important' }} />}
            sx={{
              flex: 1,
              bgcolor: '#FFFFFF',
              color: '#111111',
              fontSize: '0.72rem',
              fontWeight: 700,
              py: 0.8,
              '&:hover': { bgcolor: '#E0E0E0' },
            }}
          >
            Live Demo
          </Button>
        )}
        {project.github_url && (
          <Tooltip title="GitHub">
            <IconButton
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 1.5,
                color: '#AAAAAA',
                px: 1.5,
                '&:hover': { borderColor: '#FFFFFF', color: '#FFFFFF', bgcolor: 'transparent' },
              }}
            >
              <GitHubIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* View Details */}
      <Button
        size="small"
        variant="text"
        href={project.detail_url}
        target="_blank"
        rel="noopener noreferrer"
        endIcon={<ArrowForwardIcon sx={{ fontSize: '0.85rem !important' }} />}
        fullWidth
        sx={{
          color: '#666666',
          fontSize: '0.72rem',
          justifyContent: 'flex-start',
          px: 0,
          '&:hover': { color: '#FFFFFF', bgcolor: 'transparent' },
        }}
      >
        View Details
      </Button>
    </CardActions>
  </Card>
);

const SkeletonCard = () => (
  <Card sx={{ bgcolor: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, boxShadow: 'none' }}>
    <Skeleton variant="rectangular" height={180} sx={{ bgcolor: '#1E1E1E' }} />
    <CardContent sx={{ p: 2.5 }}>
      <Skeleton variant="text" width={70} height={16} sx={{ bgcolor: '#222', mb: 1 }} />
      <Skeleton variant="text" width="70%" height={22} sx={{ bgcolor: '#242424', mb: 1 }} />
      <Skeleton variant="text" sx={{ bgcolor: '#1E1E1E' }} />
      <Skeleton variant="text" width="85%" sx={{ bgcolor: '#1E1E1E', mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {[52, 44, 56].map((w) => (
          <Skeleton key={w} variant="rounded" width={w} height={22} sx={{ bgcolor: '#1E1E1E' }} />
        ))}
      </Box>
    </CardContent>
    <CardActions sx={{ p: 2.5, pt: 1, flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
        <Skeleton variant="rounded" height={32} sx={{ bgcolor: '#1E1E1E', flex: 1 }} />
        <Skeleton variant="rounded" width={40} height={32} sx={{ bgcolor: '#1E1E1E' }} />
      </Box>
      <Skeleton variant="text" width={90} height={20} sx={{ bgcolor: '#1E1E1E' }} />
    </CardActions>
  </Card>
);

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('sort_order');
      if (error) setError(error.message);
      else setProjects(data ?? []);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <Box sx={{ bgcolor: '#111111', minHeight: '100vh', py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        {/* 헤더 */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            sx={{ color: '#555555', letterSpacing: 6, fontWeight: 600, fontSize: '0.7rem' }}
          >
            PROJECTS
          </Typography>
          <Typography variant="h1" sx={{ mt: 1, color: '#FFFFFF', fontWeight: 800 }}>
            Projects
          </Typography>
          <Box sx={{ width: 48, height: 3, bgcolor: '#FFFFFF', mx: 'auto', mt: 2, borderRadius: 2 }} />
          <Typography variant="body2" sx={{ mt: 2.5, color: '#666666' }}>
            직접 설계하고 구현한 프로젝트들을 소개합니다.
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        {/* 프로젝트 그리드 */}
        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <SkeletonCard />
                </Grid>
              ))
            : projects.map((project, i) => (
                <Grid item xs={12} sm={6} md={3} key={project.id}>
                  <ProjectCard project={project} index={i} />
                </Grid>
              ))
          }
          {!loading && projects.length === 0 && !error && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 12 }}>
                <Typography variant="h3" sx={{ color: '#333333' }}>
                  아직 등록된 프로젝트가 없습니다.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default ProjectsPage;
