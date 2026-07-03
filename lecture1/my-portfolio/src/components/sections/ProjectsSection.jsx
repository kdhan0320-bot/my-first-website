import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent,
  Button, Chip, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Divider,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import RevealOnScroll from '../common/RevealOnScroll';
import StarField from '../common/StarField';
import ProjectThumbnailArt, { hasThumbnailArt, GenericPreviewArt } from '../common/ProjectThumbnailArt';
import { supabase } from '../../lib/supabase';
import { ALL_PROJECTS } from '../../data/projectsData';

/* 홈 fallback: is_featured=true → sort_order 오름차순 → 최대 3개 */
const FEATURED_FALLBACK = [...ALL_PROJECTS]
  .filter((p) => p.is_featured)
  .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99))
  .slice(0, 3);

/* Supabase row → 공유 포맷 (detail 포함) */
const fromSupabase = (row) => ({
  id: String(row.id),
  title: row.title,
  description: row.description,
  categories: ['ai'],
  categoryLabel: row.category ?? 'AI 도구 활용 웹 구현',
  role: row.role ?? '—',
  tools: row.tech_stack ?? [],
  tags: (row.tech_stack ?? []).slice(0, 3),
  gradient: 'linear-gradient(135deg, #1E3A5F 0%, #2A5A8F 100%)',
  thumbnailUrl: row.thumbnail_url ?? null,
  liveUrl: row.demo_url ?? null,
  githubUrl: row.github_url ?? null,
  is_featured: row.is_featured ?? false,
  detail: {
    overview:    row.overview    ?? row.description,
    problem:     row.problem     ?? '—',
    goal:        row.goal        ?? '—',
    targetUser:  row.targetUser  ?? null,
    designPoint: row.designPoint ?? '—',
    process:     row.process     ?? null,
    result:      row.result      ?? null,
    nextStep:    row.nextStep    ?? '추후 케이스스터디 상세 내용을 추가할 예정입니다.',
  },
});

/* ── View Detail 모달 ── */
const DetailRow = ({ label, children }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

const ProjectDetailModal = ({ project, open, onClose }) => {
  if (!project) return null;
  const { detail, role, tools, liveUrl, githubUrl } = project;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper"
      aria-labelledby="project-detail-title"
      PaperProps={{ sx: (t) => ({ borderRadius: 3, bgcolor: 'background.paper', border: `1px solid ${t.palette.divider}` }) }}>
      <DialogTitle id="project-detail-title"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {project.categoryLabel}
          </Typography>
          <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700, mt: 0.25 }}>{project.title}</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="상세 정보 닫기" size="small"
          sx={{ color: 'text.secondary', ml: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2.5 }}>
        <DetailRow label="작업 개요">
          <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.75 }}>{detail.overview}</Typography>
        </DetailRow>
        {detail.problem && detail.problem !== '—' && (
          <DetailRow label="문제">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.problem}</Typography>
          </DetailRow>
        )}
        {detail.goal && detail.goal !== '—' && (
          <DetailRow label="목표">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.goal}</Typography>
          </DetailRow>
        )}
        {detail.targetUser && (
          <DetailRow label="대상 사용자">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.targetUser}</Typography>
          </DetailRow>
        )}
        <DetailRow label="맡은 일">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{role}</Typography>
        </DetailRow>
        {tools.length > 0 && (
          <DetailRow label="도구">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {tools.map((t) => (
                <Chip key={t} label={t} size="small"
                  sx={{
                    bgcolor: 'rgba(56,189,248,0.08)',
                    color: 'primary.main',
                    border: '1px solid rgba(56,189,248,0.18)',
                    fontWeight: 600, fontSize: '0.72rem',
                  }} />
              ))}
            </Box>
          </DetailRow>
        )}
        {detail.designPoint && detail.designPoint !== '—' && (
          <DetailRow label="핵심 설계 방향">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.designPoint}</Typography>
          </DetailRow>
        )}
        {detail.process && (
          <DetailRow label="작업 과정">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.process}</Typography>
          </DetailRow>
        )}
        {detail.result && (
          <DetailRow label="결과 화면">
            {/* 썸네일 미리보기 */}
            {(project.thumbnailUrl || project.liveUrl) && (
              <Box sx={{
                mb: 1.5, borderRadius: 1.5, overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                background: project.gradient || 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)',
                position: 'relative', height: 120,
              }}>
                {project.thumbnailUrl ? (
                  <Box component="img" src={project.thumbnailUrl} alt="결과 화면 미리보기"
                    sx={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', p: 1 }} />
                ) : (
                  <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', letterSpacing: '0.1em' }}>
                      실행 화면 보기 →
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.result}</Typography>
            {project.liveUrl && (
              <Box component="a" href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1, color: 'primary.main', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                실행 화면 보기 →
              </Box>
            )}
          </DetailRow>
        )}
        {detail.lesson && (
          <DetailRow label="배운 점">
            <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.lesson}</Typography>
            </Box>
          </DetailRow>
        )}
        {detail.aiContribution && (
          <DetailRow label="AI 도구 활용">
            <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.aiContribution}</Typography>
            </Box>
          </DetailRow>
        )}
        {detail.limitation && (
          <DetailRow label="한계 및 개선점">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.limitation}</Typography>
          </DetailRow>
        )}
        <DetailRow label="다음 단계">
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.nextStep}</Typography>
        </DetailRow>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        {liveUrl && (
          <Button component="a" href={liveUrl} target="_blank" rel="noopener noreferrer"
            variant="contained" size="small" endIcon={<OpenInNewIcon sx={{ fontSize: '0.8rem !important' }} />}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, fontWeight: 700 }}>
            실행 화면 보기
          </Button>
        )}
        {githubUrl && (
          <Button component="a" href={githubUrl} target="_blank" rel="noopener noreferrer"
            variant="outlined" size="small" startIcon={<GitHubIcon sx={{ fontSize: '0.85rem !important' }} />}
            sx={{ color: 'text.secondary', borderColor: 'divider', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
            GitHub
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} size="small"
          sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* 실제 스크린샷 이미지 자체에 여백이 많아 contain만으로는 작게 보이는 항목 — 실제 작업물은 그대로, 빈 여백만 확대로 정리 */
const THUMB_ZOOM = { gamstagram: 2.3 };

/* ── 썸네일 (이미지 우선 → SVG 프리뷰 폴백) ── */
const ProjectThumbnail = ({ gradient, thumbnailUrl, title, projectId }) => (
  <Box sx={{ position: 'relative', height: { xs: 200, md: 250 }, overflow: 'hidden', flexShrink: 0, background: gradient }}>
    {thumbnailUrl ? (
      <Box sx={{ position: 'absolute', inset: 0, transform: `scale(${THUMB_ZOOM[projectId] ?? 1})`, transformOrigin: 'center' }}>
        <Box component="img" src={thumbnailUrl} alt={`${title} 프로젝트 썸네일`} loading="lazy" className="thumb-img"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', padding: '8px', transition: 'transform 0.35s ease' }} />
      </Box>
    ) : hasThumbnailArt(projectId) ? (
      <ProjectThumbnailArt projectId={projectId} />
    ) : (
      <GenericPreviewArt />
    )}
    {/* hover overlay */}
    <Box className="thumb-overlay" sx={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.32) 100%)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none',
    }} />
  </Box>
);

const CARD_BADGES = [
  { label: '대표 작업',    color: '#F59E0B', border: 'rgba(245,158,11,0.4)' },
  { label: '케이스 스터디', color: '#7DD3FC', border: 'rgba(56,189,248,0.4)' },
  { label: '시안',         color: '#C4B5FD', border: 'rgba(167,139,250,0.4)' },
];

/* ── 프로젝트 카드 ── */
const ProjectCard = ({ project, idx, onDetail }) => {
  const uniqueTools = [...new Set(project.tools)].slice(0, 3);
  const hasRole = project.role && project.role !== '—';
  const badge = CARD_BADGES[idx] ?? CARD_BADGES[1];

  return (
  <RevealOnScroll delay={Math.min(idx % 3, 2) * 0.1} y={16} sx={{ display: 'flex', flexDirection: 'column' }}>
    <Card tabIndex={0} aria-label={`${project.title} 프로젝트 카드`}
      sx={{
        display: 'flex', flexDirection: 'column', flex: 1,
        position: 'relative',
        minHeight: { md: 500 },
        bgcolor: 'rgba(30,41,59,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(148,163,184,0.14)',
        borderTop: '2px solid rgba(56,189,248,0.35)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderTopColor: 'primary.main',
          borderColor: 'rgba(56,189,248,0.35)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.5), 0 0 20px rgba(56,189,248,0.08)',
        },
        '&:hover .thumb-img': { transform: 'scale(1.05)' },
        '&:hover .thumb-overlay': { opacity: 1 },
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '2px' },
      }}>

      {/* 배경 번호 */}
      <Typography component="span" aria-hidden="true"
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 14,
          fontSize: '5rem',
          fontWeight: 900,
          lineHeight: 1,
          color: 'rgba(255,255,255,0.028)',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
          letterSpacing: '-0.04em',
        }}
      >
        0{idx + 1}
      </Typography>

      {/* 배지 */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 2,
          px: 1.25,
          py: 0.5,
          borderRadius: '6px',
          bgcolor: 'rgba(15,23,42,0.88)',
          border: `1px solid ${badge.border}`,
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
        }}
      >
        <Typography sx={{
          color: badge.color,
          fontWeight: 700,
          fontSize: '0.75rem',
        }}>
          {badge.label}
        </Typography>
      </Box>

      <ProjectThumbnail gradient={project.gradient} thumbnailUrl={project.thumbnailUrl} title={project.title} projectId={project.id} />

      <CardContent sx={{ flexGrow: 1, p: { xs: 2.5, md: 3 }, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Box>
          <Typography variant="caption"
            sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
            {project.categoryLabel}
            {project.isPlaceholder && (
              <Box component="span" sx={{ ml: 1, color: 'text.disabled', fontWeight: 400, fontSize: '0.6rem' }}>(준비 중)</Box>
            )}
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: 'text.primary', lineHeight: 1.3 }}>
            {project.title}
          </Typography>
        </Box>

        <Typography variant="body2"
          sx={{ color: 'text.secondary', fontSize: '0.8rem', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {project.description}
        </Typography>

        {hasRole && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, flexShrink: 0, pt: '1px', fontSize: '0.65rem', letterSpacing: '0.04em' }}>맡은 일</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5, fontSize: '0.72rem' }}>{project.role}</Typography>
          </Box>
        )}

        {uniqueTools.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, flexShrink: 0, pt: '1px', fontSize: '0.65rem', letterSpacing: '0.04em' }}>도구</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5, fontSize: '0.72rem' }}>{uniqueTools.join(' · ')}</Typography>
          </Box>
        )}

        <Stack direction="row" sx={{ mt: 'auto', pt: 0.5, flexWrap: 'wrap', gap: 0.75 }}>
          <Button size="small" variant="outlined" onClick={() => onDetail(project)} aria-label={`${project.title} 작업 과정 보기`}
            sx={{
              fontSize: '0.72rem', px: 1.5, minHeight: 32, color: 'primary.main',
              borderColor: 'rgba(56,189,248,0.3)', fontWeight: 600,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(56,189,248,0.06)', transform: 'translateY(-1px)' },
            }}>
            작업 과정 보기
          </Button>
          {project.liveUrl && (
            <Button component="a" href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              size="small" variant="contained" endIcon={<OpenInNewIcon sx={{ fontSize: '0.75rem !important' }} />}
              aria-label={`${project.title} 실행 화면 보기`}
              sx={{
                fontSize: '0.72rem', px: 1.5, minHeight: 32, bgcolor: 'primary.main', fontWeight: 600,
                transition: 'transform 0.2s ease',
                '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-1px)' },
              }}>
              실행 화면 보기
            </Button>
          )}
          {project.githubUrl && !project.liveUrl && (
            <Button component="a" href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              size="small" variant="outlined" startIcon={<GitHubIcon sx={{ fontSize: '0.85rem !important' }} />}
              aria-label={`${project.title} GitHub 보기`}
              sx={{
                fontSize: '0.72rem', px: 1.5, minHeight: 32, color: 'text.secondary', borderColor: 'divider',
                transition: 'transform 0.2s ease',
                '&:hover': { borderColor: 'primary.main', color: 'primary.main', transform: 'translateY(-1px)' },
              }}>
              GitHub
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  </RevealOnScroll>
  );
};

/* ── 메인 섹션 ── */
const ProjectsSection = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(FEATURED_FALLBACK);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setProjects(data.slice(0, 3).map(fromSupabase));
        }
        /* error 또는 빈 배열이면 FEATURED_FALLBACK 유지 */
      })
      .catch(() => {});
  }, []);

  return (
    <Box
      component="section"
      id="projects"
      aria-label="프로젝트"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
        py: { xs: 7, md: 9 },
      }}
    >
      {/* 옅은 별 배경 — 전체 콘셉트 통일 */}
      <StarField count={18} sx={{ opacity: 0.5 }} />

      {/* 상단 구분선 — About과의 경계가 자연스럽게 이어지도록 낮은 opacity 유지 */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.05), rgba(124,58,237,0.05), transparent)',
        }}
      />

      {/* 배경 orbit ring */}
      <Box
        component="svg"
        viewBox="0 0 900 560"
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '105%',
          height: 'auto',
          pointerEvents: 'none',
          opacity: 0.055,
        }}
      >
        <ellipse cx="450" cy="280" rx="430" ry="250" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
        <ellipse cx="450" cy="280" rx="300" ry="175" fill="none" stroke="#A78BFA" strokeWidth="1" strokeDasharray="8 14" />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>

        <RevealOnScroll>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                '&::before': { content: '""', display: 'block', width: 28, height: 1, bgcolor: 'primary.main', opacity: 0.45 },
                '&::after':  { content: '""', display: 'block', width: 28, height: 1, bgcolor: 'primary.main', opacity: 0.45 },
              }}
            >
              02 대표 작업
            </Typography>
            <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 800 }}>주요 프로젝트</Typography>
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', maxWidth: 480, mx: 'auto' }}>
              문제 발견부터 화면 설계, 구현까지 이어진 대표 작업입니다.
            </Typography>
          </Box>
        </RevealOnScroll>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} idx={idx}
              onDetail={(p) => { setSelectedProject(p); setModalOpen(true); }} />
          ))}
        </Box>

        <RevealOnScroll delay={0.1}>
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/projects')}
              aria-label="전체 프로젝트 페이지로 이동"
              sx={{
                fontWeight: 600,
                px: 4,
                minHeight: 44,
                color: 'primary.main',
                borderColor: 'rgba(56,189,248,0.28)',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(56,189,248,0.06)',
                },
              }}
            >
              모든 프로젝트 보기
            </Button>
          </Box>
        </RevealOnScroll>

      </Container>
      <ProjectDetailModal project={selectedProject} open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default ProjectsSection;
