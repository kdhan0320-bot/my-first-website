import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent,
  Button, Chip, Divider, Skeleton,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import RevealOnScroll from '../common/RevealOnScroll';

const SKELETON_COUNT = 4;

const ProjectCardSkeleton = () => (
  <Card sx={{ display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden', flexShrink: 0 }}>
      <Skeleton
        variant="rectangular"
        sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
    </Box>
    <CardContent sx={{ p: 2 }}>
      <Skeleton variant="text" sx={{ mb: 0.5, height: 22, width: '80%' }} />
      <Skeleton variant="text" sx={{ height: 17 }} />
      <Skeleton variant="text" sx={{ mb: 1.5, height: 17, width: '60%' }} />
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Skeleton variant="rounded" sx={{ width: 48, height: 22 }} />
        <Skeleton variant="rounded" sx={{ width: 48, height: 22 }} />
        <Skeleton variant="rounded" sx={{ width: 48, height: 22 }} />
      </Box>
    </CardContent>
  </Card>
);

const ProjectsSection = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from('projects')
        .select('id, title, description, tech_stack, thumbnail_url')
        .eq('is_published', true)
        .order('sort_order')
        .limit(4);
      if (data) setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <Box id="projects" sx={{ bgcolor: '#FFFFFF', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">

        {/* 섹션 헤더 */}
        <RevealOnScroll>
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
        </RevealOnScroll>

        {/* 프로젝트 카드 그리드 */}
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
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))
            : projects.map(({ id, title, description, tech_stack, thumbnail_url }, idx) => (
                <RevealOnScroll
                  key={id}
                  delay={Math.min(idx, 3) * 0.1}
                  y={16}
                  sx={{ display: 'flex', flexDirection: 'column' }}
                >
                  <Card
                    onClick={() => navigate('/projects')}
                    tabIndex={0}
                    role="button"
                    aria-label={`${title} 프로젝트 자세히 보기`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate('/projects');
                      }
                    }}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      cursor: 'pointer',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                        borderColor: 'rgba(30,155,215,0.25)',
                      },
                      '&:hover .thumb-img': { transform: 'scale(1.05)' },
                      '&:hover .img-overlay': { opacity: 1 },
                      '&:focus-visible': {
                        outline: '2px solid #1578AA',
                        outlineOffset: '2px',
                        borderColor: 'rgba(30,155,215,0.25)',
                      },
                      '&:focus-visible .img-overlay': { opacity: 1 },
                      '&:active': { transform: 'translateY(0)' },
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
                      {/* 이미지 오버레이 (데스크탑) */}
                      <Box
                        className="img-overlay"
                        aria-hidden="true"
                        sx={{
                          position: 'absolute', top: 0, left: 0,
                          width: '100%', height: '100%',
                          bgcolor: 'rgba(26,26,46,0.35)',
                          display: { xs: 'none', md: 'flex' },
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          pointerEvents: 'none',
                        }}
                      >
                        <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.85rem', letterSpacing: 0.5 }}>
                          자세히 보기
                        </Typography>
                      </Box>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
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
                      {/* 모바일: 항상 보이는 자세히 보기 힌트 */}
                      <Box
                        aria-hidden="true"
                        sx={{
                          display: { xs: 'flex', md: 'none' },
                          alignItems: 'center',
                          mt: 1.5,
                          color: '#1578AA',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        자세히 보기 →
                      </Box>
                    </CardContent>
                  </Card>
                </RevealOnScroll>
              ))}
        </Box>

        {/* 전체 프로젝트 보기 버튼 */}
        <RevealOnScroll delay={0.1}>
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<OpenInNewIcon />}
              onClick={() => navigate('/projects')}
              aria-label="전체 프로젝트 보기 페이지로 이동"
              sx={{
                bgcolor: '#1578AA',
                px: 3.5,
                fontWeight: 700,
                minHeight: 44,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
                '&:hover': { bgcolor: '#1E9BD7', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(21,120,170,0.28)' },
                '&:active': { transform: 'translateY(0)', boxShadow: '0 4px 12px rgba(21,120,170,0.18)' },
                '&:focus-visible': { outline: '2px solid #1578AA', outlineOffset: '3px' },
              }}
            >
              전체 프로젝트 보기
            </Button>
          </Box>
        </RevealOnScroll>

      </Container>
    </Box>
  );
};

export default ProjectsSection;
