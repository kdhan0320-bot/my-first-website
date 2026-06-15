import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, CardActions,
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
    sx={(theme) => ({
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.paper',
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 3,
      boxShadow: 'none',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 20px 50px rgba(0,0,0,0.5)'
          : '0 20px 50px rgba(0,0,0,0.12)',
        borderColor: theme.palette.mode === 'dark'
          ? 'rgba(56,189,248,0.3)'
          : 'rgba(30,155,215,0.3)',
      },
      '&:hover .thumb-img': {
        transform: 'scale(1.06)',
      },
    })}
  >
    {/* 썸네일 */}
    <Box
      sx={(theme) => ({
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%',
        bgcolor: theme.palette.mode === 'dark' ? '#0D1520' : '#E8EDF2',
        overflow: 'hidden',
        flexShrink: 0,
      })}
    >
      {project.thumbnail_url ? (
        <Box
          component="img"
          className="thumb-img"
          src={project.thumbnail_url}
          alt={project.title}
          loading="lazy"
          sx={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top',
            transition: 'transform 0.4s ease',
          }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      ) : (
        <Box
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ color: 'text.disabled', fontSize: '0.8rem' }}>미리보기 없음</Typography>
        </Box>
      )}

      {/* 번호 뱃지 */}
      <Box
        sx={(theme) => ({
          position: 'absolute',
          top: 10,
          left: 10,
          width: 30,
          height: 30,
          borderRadius: '50%',
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.45)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        })}
      >
        <Typography sx={{ color: '#FFF', fontSize: '0.65rem', fontWeight: 700 }}>
          {String(index + 1).padStart(2, '0')}
        </Typography>
      </Box>
    </Box>

    {/* 카드 본문 */}
    <CardContent sx={{ flexGrow: 1, p: 2.5, pb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
        <CalendarTodayIcon sx={{ fontSize: '0.65rem', color: 'text.disabled' }} />
        <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled', letterSpacing: 0.5 }}>
          {formatDate(project.created_at)}
        </Typography>
      </Box>

      <Typography
        sx={{
          color: 'text.primary',
          fontSize: '0.95rem',
          fontWeight: 700,
          lineHeight: 1.45,
          mb: 1,
          letterSpacing: '-0.01em',
        }}
      >
        {project.title}
      </Typography>

      <Typography
        sx={{
          color: 'text.secondary',
          fontSize: '0.8rem',
          lineHeight: 1.7,
          mb: 2,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {project.description}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {project.tech_stack?.map((tech) => (
          <Chip
            key={tech}
            label={tech}
            size="small"
            sx={(theme) => ({
              height: 22,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              color: 'text.secondary',
              border: `1px solid ${theme.palette.divider}`,
              fontSize: '0.65rem',
              fontWeight: 500,
              '& .MuiChip-label': { px: 1 },
            })}
          />
        ))}
      </Box>
    </CardContent>

    {/* 버튼 영역 */}
    <CardActions sx={{ px: 2.5, pt: 1.5, pb: 2.5, flexDirection: 'column', gap: 1, alignItems: 'stretch' }}>
      <Divider sx={{ mb: 0.5 }} />
      <Box sx={{ display: 'flex', gap: 1 }}>
        {project.detail_url && (
          <Button
            size="small"
            variant="contained"
            component="a"
            href={project.detail_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} 데모 보기 (새 탭)`}
            endIcon={<OpenInNewIcon sx={{ fontSize: '0.8rem !important' }} />}
            sx={{
              flex: 1,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontSize: '0.73rem',
              fontWeight: 700,
              py: 0.8,
              borderRadius: 1.5,
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            데모 보기
          </Button>
        )}
        {project.github_url && (
          <Tooltip title="GitHub 코드 보기">
            <IconButton
              component="a"
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} GitHub 코드 보기 (새 탭)`}
              size="small"
              sx={(theme) => ({
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1.5,
                color: 'text.secondary',
                width: 36,
                height: 36,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  color: 'primary.main',
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.06)' : 'rgba(21,120,170,0.05)',
                },
              })}
            >
              <GitHubIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {project.detail_url && (
        <Button
          size="small"
          variant="text"
          component="a"
          href={project.detail_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} 자세히 보기 (새 탭)`}
          endIcon={<ArrowForwardIcon sx={{ fontSize: '0.8rem !important' }} />}
          fullWidth
          sx={{
            color: 'text.secondary',
            fontSize: '0.72rem',
            justifyContent: 'flex-start',
            px: 0,
            py: 0,
            minHeight: 'unset',
            '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
          }}
        >
          자세히 보기
        </Button>
      )}
    </CardActions>
  </Card>
);

const SkeletonCard = () => (
  <Card
    sx={(theme) => ({
      bgcolor: 'background.paper',
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 3,
      boxShadow: 'none',
      overflow: 'hidden',
    })}
  >
    <Box sx={{ paddingTop: '56.25%', position: 'relative', bgcolor: 'action.hover' }}>
      <Skeleton
        variant="rectangular"
        sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
    </Box>
    <CardContent sx={{ p: 2.5 }}>
      <Skeleton variant="text" width={70} height={14} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="75%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="85%" sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {[48, 40, 52].map((w) => (
          <Skeleton key={w} variant="rounded" width={w} height={22} />
        ))}
      </Box>
    </CardContent>
    <CardActions sx={{ px: 2.5, pb: 2.5, flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
        <Skeleton variant="rounded" height={32} sx={{ flex: 1 }} />
        <Skeleton variant="rounded" width={36} height={32} />
      </Box>
      <Skeleton variant="text" width={80} height={16} />
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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">

        {/* 헤더 */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            sx={{
              color: 'text.secondary',
              letterSpacing: 6,
              fontWeight: 600,
              fontSize: '0.68rem',
              textTransform: 'uppercase',
              mb: 1.5,
            }}
          >
            PROJECTS
          </Typography>
          <Typography
            variant="h1"
            sx={{ color: 'text.primary', fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' } }}
          >
            나의 프로젝트
          </Typography>
          <Box sx={{ width: 44, height: 3, bgcolor: 'primary.main', mx: 'auto', mt: 2, borderRadius: 2 }} />
          <Typography sx={{ mt: 2.5, color: 'text.secondary', fontSize: '0.85rem', lineHeight: 1.8 }}>
            직접 설계하고 구현한 프로젝트들을 소개합니다.
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

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
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : projects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))
          }
        </Box>

        {!loading && projects.length === 0 && !error && (
          <Box sx={{ textAlign: 'center', py: 14 }}>
            <Typography sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
              아직 등록된 프로젝트가 없습니다.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ProjectsPage;
