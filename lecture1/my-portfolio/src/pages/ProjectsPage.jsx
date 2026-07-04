import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent,
  Chip, Button, Tabs, Tab, Stack, Skeleton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Divider,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../lib/supabase';
import { ALL_PROJECTS, FILTER_TABS } from '../data/projectsData';
import ProjectThumbnailArt, { hasThumbnailArt, GenericPreviewArt } from '../components/common/ProjectThumbnailArt';

/* ── Supabase 데이터를 공유 포맷으로 변환 ── */
const fromSupabase = (row) => ({
  id: String(row.id),
  title: row.title,
  description: row.description,
  categories: ['ai'],
  categoryLabel: 'AI 도구 활용 웹 구현',
  role: '—',
  tools: row.tech_stack ?? [],
  tags: row.tech_stack?.slice(0, 3) ?? [],
  gradient: 'linear-gradient(135deg, #1E3A5F 0%, #2A5A8F 100%)',
  thumbnailUrl: row.thumbnail_url ?? null,
  liveUrl: row.detail_url ?? null,
  githubUrl: row.github_url ?? null,
  detail: {
    overview: row.description,
    problem: '—',
    goal: '—',
    designPoint: '—',
    nextStep: '추후 케이스스터디 상세 내용 추가 예정입니다.',
  },
});

/* ── 상세 모달 ── */
const DetailRow = ({ label, children }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

const DetailModal = ({ project, open, onClose }) => {
  if (!project) return null;
  const { detail, role, tools, liveUrl, githubUrl } = project;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper"
      aria-labelledby="ppage-detail-title"
      slotProps={{ paper: { sx: (t) => ({ borderRadius: 3, bgcolor: 'background.paper', border: `1px solid ${t.palette.divider}` }) } }}>
      <DialogTitle id="ppage-detail-title"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {project.categoryLabel}
          </Typography>
          <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700, mt: 0.25 }}>{project.title}</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="닫기" size="small"
          sx={{ color: 'text.secondary', ml: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2.5 }}>
        <DetailRow label="작업 개요">
          <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.75 }}>{detail.overview}</Typography>
        </DetailRow>
        {detail.problem !== '—' && (
          <DetailRow label="문제">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.problem}</Typography>
          </DetailRow>
        )}
        {detail.goal !== '—' && (
          <DetailRow label="목표">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.goal}</Typography>
          </DetailRow>
        )}
        {detail.targetUser && detail.targetUser !== '—' && (
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
        {detail.designPoint !== '—' && (
          <DetailRow label="핵심 설계 방향">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.designPoint}</Typography>
          </DetailRow>
        )}
        {detail.process && detail.process !== '—' && (
          <DetailRow label="작업 과정">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.process}</Typography>
          </DetailRow>
        )}
        {detail.result && detail.result !== '—' && (
          <DetailRow label="결과 화면">
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
            <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.18)' }}>
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
const THUMB_ZOOM = {};

/* ── 썸네일 (이미지 우선 → SVG 프리뷰 폴백) ── */
const Thumbnail = ({ gradient, thumbnailUrl, title, projectId }) => (
  <Box sx={{ position: 'relative', height: { xs: 200, md: 240 }, overflow: 'hidden', flexShrink: 0, background: gradient }}>
    {thumbnailUrl ? (
      <Box sx={{ position: 'absolute', inset: 0, transform: `scale(${THUMB_ZOOM[projectId] ?? 1})`, transformOrigin: 'center' }}>
        <Box component="img" src={thumbnailUrl} alt={`${title} 썸네일`} loading="lazy" className="thumb-img"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', padding: '8px', transition: 'transform 0.35s ease' }} />
      </Box>
    ) : hasThumbnailArt(projectId) ? (
      <ProjectThumbnailArt projectId={projectId} />
    ) : (
      <GenericPreviewArt />
    )}
  </Box>
);

/* ── 카드 ── */
const ProjectCard = ({ project, onDetail }) => (
  <Card tabIndex={0} aria-label={`${project.title} 프로젝트`}
    sx={{
      display: 'flex', flexDirection: 'column',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
        borderColor: 'primary.main',
      },
      '&:hover .thumb-img': { transform: 'scale(1.05)' },
      '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '2px' },
    }}>
    <Thumbnail gradient={project.gradient} thumbnailUrl={project.thumbnailUrl} title={project.title} projectId={project.id} />
    <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      <Box>
        <Typography variant="caption"
          sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
          {project.categoryLabel}
          {project.isPlaceholder && (
            <Box component="span" sx={{ ml: 1, color: 'text.disabled', fontWeight: 400, fontSize: '0.6rem' }}>(Figma 준비 중)</Box>
          )}
        </Typography>
        <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: 'text.primary', lineHeight: 1.3 }}>{project.title}</Typography>
      </Box>
      <Typography variant="body2"
        sx={{ color: 'text.secondary', fontSize: '0.8rem', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {project.description}
      </Typography>
      {project.role && project.role !== '—' && (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, flexShrink: 0, pt: '1px', fontSize: '0.65rem', letterSpacing: '0.04em' }}>맡은 일</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem', lineHeight: 1.5 }}>{project.role}</Typography>
        </Box>
      )}
      {project.tools.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, flexShrink: 0, pt: '1px', fontSize: '0.65rem', letterSpacing: '0.04em' }}>도구</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem', lineHeight: 1.5 }}>{[...new Set(project.tools)].slice(0, 3).join(' · ')}</Typography>
        </Box>
      )}
      <Stack direction="row" sx={{ mt: 'auto', pt: 0.5, flexWrap: 'wrap', gap: 0.75 }}>
        <Button size="small" variant="outlined" onClick={() => onDetail(project)} aria-label={`${project.title} 상세 보기`}
          sx={{
            fontSize: '0.72rem', px: 1.5, minHeight: 32, color: 'primary.main',
            borderColor: 'rgba(56,189,248,0.28)', fontWeight: 600,
            '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(56,189,248,0.06)' },
          }}>
          작업 과정 보기
        </Button>
        {project.liveUrl && (
          <Button component="a" href={project.liveUrl} target="_blank" rel="noopener noreferrer"
            size="small" variant="contained" endIcon={<OpenInNewIcon sx={{ fontSize: '0.75rem !important' }} />}
            aria-label={`${project.title} 라이브 데모`}
            sx={{ fontSize: '0.72rem', px: 1.5, minHeight: 32, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, fontWeight: 600 }}>
            실행 화면 보기
          </Button>
        )}
        {project.githubUrl && (
          <Button component="a" href={project.githubUrl} target="_blank" rel="noopener noreferrer"
            size="small" variant="outlined" startIcon={<GitHubIcon sx={{ fontSize: '0.85rem !important' }} />}
            aria-label={`${project.title} GitHub`}
            sx={{ fontSize: '0.72rem', px: 1.5, minHeight: 32, color: 'text.secondary', borderColor: 'divider', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
            GitHub
          </Button>
        )}
      </Stack>
    </CardContent>
  </Card>
);

const SkeletonCard = () => (
  <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
    <Box sx={{ height: { xs: 200, md: 240 }, position: 'relative' }}>
      <Skeleton variant="rectangular" sx={{ position: 'absolute', inset: 0 }} />
    </Box>
    <CardContent sx={{ p: 2.5 }}>
      <Skeleton width="30%" height={14} sx={{ mb: 0.5 }} />
      <Skeleton width="70%" height={20} sx={{ mb: 1 }} />
      <Skeleton height={14} />
      <Skeleton width="80%" height={14} sx={{ mb: 1.5 }} />
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {[50, 44, 56].map((w) => <Skeleton key={w} variant="rounded" width={w} height={20} />)}
      </Box>
    </CardContent>
  </Card>
);

/* ── 페이지 메인 ── */
const ProjectsPage = () => {
  const [projects, setProjects]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen]       = useState(false);

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          const supabaseProjects = data.map(fromSupabase);
          const localTitles = ALL_PROJECTS.map((p) => p.title.toLowerCase());
          /* 로컬에 이미 있는 프로젝트와 구 버전 항목은 제외 */
          const OLD_TITLES = ['portfolio feedback hub', '겜스타그램', 'gamstagram', 'mini sns'];
          const newFromDb = supabaseProjects.filter((sp) => {
            const t = sp.title.toLowerCase();
            if (OLD_TITLES.some((old) => t.includes(old))) return false;
            return !localTitles.some((local) => t.includes(local.split(' ')[0]) || local.includes(t.split(' ')[0]));
          });
          setProjects([...ALL_PROJECTS, ...newFromDb]);
        } else {
          setProjects(ALL_PROJECTS);
        }
        setLoading(false);
      })
      .catch(() => {
        setProjects(ALL_PROJECTS);
        setLoading(false);
      });
  }, []);

  const filtered = activeTab === 'all'
    ? projects
    : projects.filter((p) => p.categories.includes(activeTab));

  return (
    <Box component="main" sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">

        {/* 헤더 */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography sx={{ color: 'text.secondary', letterSpacing: 6, fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1.5 }}>
            전체 작업
          </Typography>
          <Typography variant="h1" sx={{ color: 'text.primary', fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            전체 프로젝트
          </Typography>
          <Box sx={{ width: 44, height: 3, bgcolor: 'primary.main', mx: 'auto', mt: 2, borderRadius: 2 }} />
          <Typography sx={{ mt: 2.5, color: 'text.secondary', fontSize: '0.875rem', lineHeight: 1.8 }}>
            Figma UX/UI 설계와 AI 도구 활용 웹 구현으로 직접 기획하고 구현한 프로젝트들입니다.
          </Typography>
        </Box>

        {/* 필터 탭 */}
        <Box sx={{ mb: 5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}
            variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile
            slotProps={{ indicator: { style: { height: 2 } } }}
            sx={{ '& .MuiTab-root': { fontSize: '0.8rem', fontWeight: 600, minHeight: 44, textTransform: 'none', color: 'text.secondary', '&.Mui-selected': { color: 'primary.main' } } }}>
            {FILTER_TABS.map((tab) => <Tab key={tab.value} label={tab.label} value={tab.value} />)}
          </Tabs>
        </Box>

        {/* 카드 그리드 */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((project) => (
                <ProjectCard key={project.id} project={project}
                  onDetail={(p) => { setSelectedProject(p); setModalOpen(true); }} />
              ))
          }
        </Box>

        {!loading && filtered.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography sx={{ color: 'text.secondary', fontSize: '1rem' }}>
              해당 카테고리의 프로젝트가 없습니다.
            </Typography>
          </Box>
        )}

      </Container>

      <DetailModal project={selectedProject} open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default ProjectsPage;
