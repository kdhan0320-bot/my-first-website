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
import RevealOnScroll from '../ui/RevealOnScroll';
import DMark from '../ui/DMark';
import FlowNode from '../ui/FlowNode';
import ProjectThumbnailArt, { hasThumbnailArt, GenericPreviewArt } from '../projects/ProjectThumbnailArt';
import EvidenceBadges from '../projects/EvidenceBadges';
import ProjectsPreviewMonitor from '../projects/ProjectsPreviewMonitor';
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
    nextStep:    row.nextStep    ?? '추후 프로젝트 상세 내용을 추가할 예정입니다.',
  },
});

/* ── View Detail 모달 ── */
const DetailRow = ({ label, children }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
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
      slotProps={{ paper: { sx: (t) => ({ borderRadius: 3, bgcolor: 'background.paper', border: `1px solid ${t.palette.divider}` }) } }}>
      <DialogTitle id="project-detail-title"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {project.categoryLabel}
          </Typography>
          <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700, mt: 0.25 }}>{project.title}</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="상세 정보 닫기" size="small"
          sx={{ color: 'text.secondary', ml: 1, minWidth: 44, minHeight: 44, '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2.5 }}>
        <EvidenceBadges project={project} />
        {/* 1. 프로젝트 개요 */}
        <DetailRow label="프로젝트 개요">
          <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.75 }}>{detail.overview}</Typography>
        </DetailRow>

        {/* 2. 문제 정의 */}
        {detail.problem && detail.problem !== '—' && (
          <DetailRow label="문제 정의">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.problem}</Typography>
            {detail.goal && detail.goal !== '—' && (
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75, mt: 1 }}>{detail.goal}</Typography>
            )}
          </DetailRow>
        )}

        {/* 3. 내 역할 */}
        <DetailRow label="내 역할">
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: tools.length > 0 ? 1 : 0 }}>{role}</Typography>
          {tools.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {tools.map((t) => (
                <Chip key={t} label={t} size="small"
                  sx={{
                    bgcolor: 'rgba(56,189,248,0.08)',
                    color: 'primary.main',
                    border: '1px solid rgba(56,189,248,0.18)',
                    fontWeight: 600, fontSize: '0.875rem',
                  }} />
              ))}
            </Box>
          )}
        </DetailRow>

        {/* 4. 화면 구조 */}
        {detail.designPoint && detail.designPoint !== '—' && (
          <DetailRow label="화면 구조">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.designPoint}</Typography>
            {detail.process && (
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75, mt: 1 }}>{detail.process}</Typography>
            )}
          </DetailRow>
        )}

        {/* 5. 구현 범위 */}
        {(project.cardScope || detail.result) && (
          <DetailRow label="구현 범위">
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
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', letterSpacing: '0.1em' }}>
                      실행 화면 보기 →
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{project.cardScope ?? detail.result}</Typography>
            {project.liveUrl && (
              <Box component="a" href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1, color: 'primary.main', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                실행 화면 보기 →
              </Box>
            )}
          </DetailRow>
        )}

        {/* 6. 한계와 다음 개선점 */}
        <DetailRow label="한계와 다음 개선점">
          {detail.limitation && (
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.limitation}</Typography>
          )}
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75, mt: detail.limitation ? 1 : 0 }}>{detail.nextStep}</Typography>
        </DetailRow>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: 'wrap' }}>
        {liveUrl && (
          <Button component="a" href={liveUrl} target="_blank" rel="noopener noreferrer"
            variant="contained" size="small" endIcon={<OpenInNewIcon sx={{ fontSize: '0.8rem !important' }} />}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, fontWeight: 700, whiteSpace: 'nowrap' }}>
            실행 화면 보기
          </Button>
        )}
        {githubUrl && (
          <Button component="a" href={githubUrl} target="_blank" rel="noopener noreferrer"
            variant="outlined" size="small" startIcon={<GitHubIcon sx={{ fontSize: '0.85rem !important' }} />}
            sx={{ color: 'text.secondary', borderColor: 'divider', '&:hover': { borderColor: 'primary.main', color: 'primary.main' }, whiteSpace: 'nowrap' }}>
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
const THUMB_ZOOM = {};

/* ── 썸네일 (이미지 우선 → SVG 프리뷰 폴백) ── */
/* Project Stage Frame — 단순 이미지 박스가 아니라 작업물이 놓인 화면처럼 보이도록
 * 상단 chrome bar(window dots) + inner shadow를 더한다. objectFit은 항상 contain 유지,
 * dots는 좌상단 Evidence Badge(대표 작업)와 겹치지 않게 우측 정렬한다. */
const ProjectThumbnail = ({ gradient, thumbnailUrl, title, projectId }) => (
  <Box sx={{ position: 'relative', flexShrink: 0, border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 0 22px rgba(56,189,248,0.05)' }}>
    <Box
      aria-hidden="true"
      sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.75,
        px: 1.5, py: 0.85,
        bgcolor: 'rgba(15,23,42,0.55)',
        borderBottom: '1px solid rgba(148,163,184,0.14)',
      }}
    >
      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#F87171', opacity: 0.5 }} />
      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#FBBF24', opacity: 0.5 }} />
      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#34D399', opacity: 0.5 }} />
    </Box>
    <Box sx={{ position: 'relative', height: { xs: 216, sm: 256, md: 300 }, overflow: 'hidden', background: `linear-gradient(rgba(255,255,255,0.10), rgba(255,255,255,0.10)), ${gradient}`, boxShadow: 'inset 0 0 28px rgba(0,0,0,0.4)' }}>
      {thumbnailUrl ? (
        <Box sx={{ position: 'absolute', inset: 0, transform: `scale(${THUMB_ZOOM[projectId] ?? 1})`, transformOrigin: 'center' }}>
          <Box component="img" src={thumbnailUrl} alt={`${title} 프로젝트 썸네일`} loading="lazy" className="thumb-img"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', padding: '4px', transition: 'transform 0.35s ease, filter 0.3s ease' }} />
        </Box>
      ) : hasThumbnailArt(projectId) ? (
        <ProjectThumbnailArt projectId={projectId} />
      ) : (
        <GenericPreviewArt />
      )}
    </Box>
  </Box>
);

/* 홈 대표 섹션은 정의상 대표 프로젝트만 노출되므로 배지는 항상 동일하게 표시 */
const HOME_BADGE = { label: '대표 작업', color: '#38BDF8', border: 'rgba(56,189,248,0.4)' };

/* ── 프로젝트 카드 — 썸네일 중심 리스트 카드. 문제/역할/구현 범위/한계 같은 상세 설명은 모달에서만 보여준다 ── */
const ProjectCard = ({ project, idx, onDetail }) => {
  const badge = HOME_BADGE;
  /* Selected Works 카드 chrome(top-border/hover glow)은 프로젝트별 accentColor 대신
   * 고정 cyan을 써서 카드마다 색이 제각각으로 보이지 않게 통일한다 */
  const accent = '#38BDF8';

  return (
  <RevealOnScroll delay={Math.min(idx % 3, 2) * 0.1} y={16} sx={{ display: 'flex', flexDirection: 'column' }}>
    <Card tabIndex={0} aria-label={`${project.title} 프로젝트 카드`}
      sx={{
        display: 'flex', flexDirection: 'column', flex: 1,
        position: 'relative',
        minHeight: { md: 520 },
        bgcolor: '#111827',
        border: '1px solid rgba(148,163,184,0.14)',
        borderTop: `2px solid ${accent}59`,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background-color 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          bgcolor: '#131C2E',
          borderTopColor: accent,
          borderColor: `${accent}59`,
          boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 20px ${accent}22`,
        },
        '&:hover .thumb-img': { transform: 'scale(1.05)', filter: 'brightness(1.08)' },
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '2px' },
      }}>

      {/* 배지 */}
      <Box
        sx={{
          position: 'absolute',
          top: 9,
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
          fontSize: '0.875rem',
        }}>
          {badge.label}
        </Typography>
      </Box>

      <ProjectThumbnail gradient={project.gradient} thumbnailUrl={project.thumbnailUrl} title={project.title} projectId={project.id} />

      <CardContent sx={{ flexGrow: 1, p: { xs: 2.5, md: 3 }, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Box>
          <Typography variant="caption"
            component="span"
            sx={{
              display: 'inline-block', color: 'text.secondary', fontWeight: 700, fontSize: '0.875rem',
              letterSpacing: '0.06em', textTransform: 'uppercase', mb: 0.75,
              px: 1, py: 0.25, borderRadius: 999,
              bgcolor: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.22)',
            }}>
            {project.categoryLabel}
            {project.isPlaceholder && (
              <Box component="span" sx={{ ml: 1, color: 'text.disabled', fontWeight: 400, fontSize: '0.875rem' }}>(준비 중)</Box>
            )}
          </Typography>
          <Typography component="h3" sx={{ fontSize: '1.05rem', fontWeight: 700, color: 'text.primary', lineHeight: 1.3, m: 0, minHeight: '2.6rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {project.title}
          </Typography>
        </Box>

        <Typography variant="body2"
          sx={{ color: 'text.secondary', fontSize: '0.875rem', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {project.description}
        </Typography>

        <Stack direction="row" sx={{ mt: 'auto', pt: 0.5, flexWrap: 'wrap', gap: 0.75 }}>
          <Button size="small" variant="contained" onClick={() => onDetail(project)} aria-label={`${project.title} 작업 과정 보기`}
            sx={{
              fontSize: '0.875rem', px: 1.5, minHeight: 44, bgcolor: 'primary.main', fontWeight: 600,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-1px)' },
            }}>
            작업 과정 보기
          </Button>
          {project.liveUrl && (
            <Button component="a" href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              size="small" variant="outlined" endIcon={<OpenInNewIcon sx={{ fontSize: '0.75rem !important' }} />}
              aria-label={`${project.title} 화면 보기`}
              sx={{
                fontSize: '0.875rem', px: 1.5, minHeight: 44, color: 'primary.main',
                borderColor: 'rgba(56,189,248,0.3)', fontWeight: 600,
                transition: 'transform 0.2s ease',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(56,189,248,0.06)', transform: 'translateY(-1px)' },
              }}>
              화면 보기
            </Button>
          )}
          {project.githubUrl && (
            <Button component="a" href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              size="small" variant="outlined" startIcon={<GitHubIcon sx={{ fontSize: '0.85rem !important' }} />}
              aria-label={`${project.title} GitHub 보기`}
              sx={{
                fontSize: '0.875rem', px: 1.5, minHeight: 44, color: 'text.secondary', borderColor: 'divider',
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
    /* env 변수가 없어 supabase 클라이언트가 없으면 FEATURED_FALLBACK을 그대로 사용한다 */
    if (!supabase) return;
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
        pt: { xs: 5, md: 6 },
        pb: { xs: 4, md: 6 },
      }}
    >
      {/* About Flow Path를 받는 소프트 글로우 — 하드 라인으로 끊기지 않고 번져 들어오는 느낌 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          top: '-4%', left: '50%', transform: 'translateX(-50%)',
          width: 320, height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(56,189,248,0.13) 0%, transparent 72%)',
          filter: 'blur(52px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Stage focus — Projects Preview Monitor 뒤 은은한 스포트라이트, 컴포넌트 구조는 건드리지 않음 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          top: '14%', left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 340,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(56,189,248,0.09) 0%, transparent 72%)',
          filter: 'blur(60px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Flow Stream이 이어지는 아주 옅은 blueprint grid — 카드 가독성을 해치지 않는 선에서만 배치, 은하처럼 보이지 않게 절제 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.11) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 112% 75% at 50% 0%, black 15%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 112% 75% at 50% 0%, black 15%, transparent 90%)',
        }}
      />
      {/* D 모노그램 workmark — About과 다른 코너에 배치해 반복이지만 과하지 않게 */}
      <DMark size={200} sx={{ bottom: '2%', left: '0%' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>

        <RevealOnScroll>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.875rem',
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
              02 SELECTED PROJECTS
            </Typography>
            <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 800 }}>문제 정의부터 구현 범위까지 정리한 프로젝트</Typography>
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', maxWidth: 520, mx: 'auto' }}>
              각 프로젝트는 문제 상황, 화면 구조, 구현 범위, 한계를 함께 정리했습니다. 실제 없는 성과 수치나 운영 서비스처럼 보이는 표현은 사용하지 않았습니다.
            </Typography>
          </Box>
        </RevealOnScroll>

        <ProjectsPreviewMonitor />

        {/* Preview는 대표 프로젝트 쇼케이스, List는 각 프로젝트 상세(모달)로 들어가는 진입 카드 — 역할을 분리해 중복을 없앤다 */}
        <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
          <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: '1.0625rem', letterSpacing: '0.04em' }}>
            SELECTED WORKS
          </Typography>
          <Typography sx={{ mt: 0.5, color: 'text.secondary', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            카드를 눌러 문제 정의, 구현 범위, 한계까지 자세한 내용을 확인할 수 있습니다.
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: { xs: 2.5, sm: 3, md: 3 } }}>
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} idx={idx}
              onDetail={(p) => { setSelectedProject(p); setModalOpen(true); }} />
          ))}
        </Box>

        <RevealOnScroll delay={0.1}>
          <Box sx={{ textAlign: 'center', mt: { xs: 3, md: 6 } }}>
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

        {/* Flow Path — 버튼과 충분한 간격을 둔 뒤 정상 흐름에 배치해 버튼 뒤로 선이 지나가지 않게 함 */}
        <Box
          aria-hidden="true"
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'relative',
            width: '1px', height: 56, mt: 5, mx: 'auto',
            background: 'linear-gradient(180deg, transparent, rgba(56,189,248,0.3))',
            pointerEvents: 'none',
          }}
        >
          {/* Flow Node — Projects→Contact 경계 마디, Route Line 표준 마커. 버튼과 물리적으로 겹치지 않는 정상 흐름 위치 */}
          <FlowNode sx={{ left: '50%', bottom: 0, transform: 'translate(-50%, 50%)' }} />
        </Box>

      </Container>
      <ProjectDetailModal project={selectedProject} open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default ProjectsSection;
