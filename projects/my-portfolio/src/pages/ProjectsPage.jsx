import { useState, useEffect } from 'react';
import { Box, Container, Typography, Chip, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Divider, Button } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../lib/supabase';
import { ALL_PROJECTS } from '../data/projectsData';
import EvidenceBadges from '../components/projects/EvidenceBadges';
import { FONT_MONO, COLORS } from '../theme';

/* Figma 03_Projects/Desktop(42:674) 원문 카피. Featured 3개는 Home Selected Projects와
 * 같은 실제 프로젝트를 더 짧은 카드 형태로 보여준다. */
const FEATURED_CARDS = [
  { id: 'jobflow', title: 'JobFlow', meta: 'UX/UI · React/MUI · Supabase', description: '취업 준비 관리 대시보드' },
  { id: 'bus-arrival-app', title: '버스 도착정보 앱 UI', meta: 'Figma Prototype · Static Data', description: '모바일 도착정보 UI' },
  { id: 'feedback-hub', title: 'Portfolio Feedback Hub', meta: 'React/MUI · Supabase · Fallback', description: '포트폴리오 피드백 서비스' },
];

/* Figma의 Archive 섹션 목업은 예시로 3개 행(WEB PORTFOLIO/OTT SERVICE/추가 작품)만
 * 보여주지만, 실제로는 archive 태그 프로젝트가 더 많다. 항목을 임의로 줄이지 않고
 * 같은 행 스타일로 실제 개수만큼 반복 렌더링한다(작업 지시서: 프로젝트 데이터를
 * 임의로 축소하지 않는다). */
const archiveMeta = (p) => {
  if (p.tools?.length) return [...new Set(p.tools)].slice(0, 3).join(' · ');
  return p.archiveStatus ?? '';
};

const fromSupabase = (row) => ({
  id: String(row.id),
  title: row.title,
  description: row.description,
  categories: ['ai'],
  categoryLabel: 'AI 도구 활용 웹 구현',
  role: '—',
  tools: row.tech_stack ?? [],
  gradient: COLORS.deepSlate,
  thumbnailUrl: row.thumbnail_url ?? null,
  liveUrl: row.detail_url ?? null,
  githubUrl: row.github_url ?? null,
  detail: {
    overview: row.description,
    problem: '—',
    goal: '—',
    designPoint: '—',
    nextStep: '추후 프로젝트 상세 내용 추가 예정입니다.',
  },
});

const DetailRow = ({ label, children }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

const DetailModal = ({ project, open, onClose }) => {
  if (!project) return null;
  const { detail, role, tools, liveUrl, githubUrl, figmaPrototypeUrl, figmaDesignUrl } = project;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper"
      aria-labelledby="ppage-detail-title"
      slotProps={{ paper: { sx: (t) => ({ borderRadius: 3, bgcolor: 'background.paper', border: `1px solid ${t.palette.divider}` }) } }}>
      <DialogTitle id="ppage-detail-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {project.categoryLabel}
          </Typography>
          <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700, mt: 0.25 }}>{project.title}</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="닫기" size="small"
          sx={{ color: 'text.secondary', ml: 1, minWidth: 44, minHeight: 44, '&:hover': { bgcolor: 'rgba(184,193,203,0.08)' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2.5 }}>
        <EvidenceBadges project={project} />
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
                  sx={{ bgcolor: 'rgba(255,107,61,0.08)', color: 'primary.main', border: '1px solid rgba(255,107,61,0.2)', fontWeight: 600, fontSize: '0.875rem' }} />
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
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.result}</Typography>
            {project.liveUrl && (
              <Box component="a" href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1, color: 'primary.main', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                실행 화면 보기 →
              </Box>
            )}
          </DetailRow>
        )}
        {detail.lesson && (
          <DetailRow label="배운 점">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.lesson}</Typography>
          </DetailRow>
        )}
        {detail.aiContribution && (
          <DetailRow label="AI 도구 활용">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.aiContribution}</Typography>
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
      <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: 'wrap' }}>
        {liveUrl && (
          <Button component="a" href={liveUrl} target="_blank" rel="noopener noreferrer"
            variant="contained" size="small" endIcon={<OpenInNewIcon sx={{ fontSize: '0.8rem !important' }} />}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, fontWeight: 700, whiteSpace: 'nowrap' }}>
            실행 화면 보기
          </Button>
        )}
        {figmaPrototypeUrl && (
          <Button component="a" href={figmaPrototypeUrl} target="_blank" rel="noopener noreferrer"
            variant="contained" size="small" endIcon={<OpenInNewIcon sx={{ fontSize: '0.8rem !important' }} />}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, fontWeight: 700, whiteSpace: 'nowrap' }}>
            프로토타입 보기
          </Button>
        )}
        {figmaDesignUrl && (
          <Button component="a" href={figmaDesignUrl} target="_blank" rel="noopener noreferrer"
            variant="outlined" size="small" endIcon={<OpenInNewIcon sx={{ fontSize: '0.8rem !important' }} />}
            sx={{ color: 'primary.main', borderColor: 'rgba(255,107,61,0.28)', '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(255,107,61,0.06)' }, fontWeight: 700, whiteSpace: 'nowrap' }}>
            디자인 파일 보기
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
        <Button onClick={onClose} size="small" sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'rgba(184,193,203,0.08)' } }}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const FeaturedCard = ({ card, project, onDetail }) => (
  <Box sx={{ bgcolor: COLORS.deepSlate, border: '1px solid #33404D', borderRadius: '14px', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Box sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #33404D' }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: 38, px: 1.75, bgcolor: COLORS.warmIvory }}>
        <Box sx={{ width: 7, height: 7, borderRadius: '4px', bgcolor: '#FF7A52' }} />
        <Box sx={{ width: 7, height: 7, borderRadius: '4px', bgcolor: '#F1B95A' }} />
        <Box sx={{ width: 7, height: 7, borderRadius: '4px', bgcolor: '#7ACB8A' }} />
      </Box>
      <Box sx={{ position: 'relative', height: 220, background: project?.gradient ?? COLORS.deepSlate }}>
        {project?.thumbnailUrl && (
          <Box component="img" src={project.thumbnailUrl} alt={`${card.title} 화면 미리보기`} loading="lazy"
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', p: 1.5 }} />
        )}
      </Box>
    </Box>
    <Typography sx={{ fontFamily: FONT_MONO, color: 'primary.main', fontSize: '0.75rem' }}>{card.meta}</Typography>
    <Typography component="h3" sx={{ fontWeight: 700, fontSize: '1.5rem', color: 'text.primary' }}>{card.title}</Typography>
    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{card.description}</Typography>
    <Box
      component="button"
      type="button"
      onClick={() => onDetail(project)}
      aria-label={`${card.title} 상세 보기`}
      sx={{
        alignSelf: 'flex-start', bgcolor: 'transparent', border: 0, cursor: 'pointer', p: 0, minHeight: 44,
        fontFamily: FONT_MONO, fontWeight: 600, fontSize: '0.75rem', color: 'text.primary',
        '&:hover': { color: 'primary.main' },
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
      }}
    >
      VIEW CASE →
    </Box>
  </Box>
);

const ArchiveRow = ({ project, index, onDetail }) => {
  const light = index % 2 === 1;
  return (
    <Box
      component="button"
      type="button"
      onClick={() => onDetail(project)}
      aria-label={`${project.title} 상세 보기`}
      sx={{
        width: '100%', textAlign: 'left', cursor: 'pointer', font: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2,
        minHeight: { xs: 'auto', md: 140 }, py: { xs: 3, md: 0 }, px: { xs: 2.5, md: 3.5 },
        borderRadius: '14px', border: light ? 'none' : '1px solid #33404D',
        bgcolor: light ? COLORS.warmIvory : COLORS.deepSlate,
        '&:focus-visible': { outline: '2px solid', outlineColor: light ? COLORS.inkBlack : COLORS.warmIvory, outlineOffset: '2px' },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.6875rem', color: light ? COLORS.inkBlack : 'primary.main' }}>
          {String(index + 4).padStart(2, '0')}
        </Typography>
        <Typography component="h3" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' }, color: light ? COLORS.inkBlack : COLORS.warmIvory }}>
          {project.title}
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: light ? COLORS.darkSecondary : COLORS.lightSecondary }}>
          {archiveMeta(project)}
        </Typography>
      </Box>
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.6875rem', color: light ? COLORS.inkBlack : 'primary.main', flexShrink: 0 }}>
        VIEW PROJECT →
      </Typography>
    </Box>
  );
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState(ALL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          const supabaseProjects = data.map(fromSupabase);
          const localTitles = ALL_PROJECTS.map((p) => p.title.toLowerCase());
          const OLD_TITLES = ['portfolio feedback hub', '겜스타그램', 'gamstagram', 'mini sns'];
          const newFromDb = supabaseProjects.filter((sp) => {
            const t = sp.title.toLowerCase();
            if (OLD_TITLES.some((old) => t.includes(old))) return false;
            return !localTitles.some((local) => t.includes(local.split(' ')[0]) || local.includes(t.split(' ')[0]));
          });
          setProjects([...ALL_PROJECTS, ...newFromDb]);
        }
      })
      .catch(() => {});
  }, []);

  const openDetail = (project) => { setSelectedProject(project); setModalOpen(true); };

  const archiveProjects = projects
    .filter((p) => p.categories?.includes('archive'))
    .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99));

  return (
    <Box component="main" sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth={false} sx={{ px: { xs: 3, sm: 6, md: 8 }, py: { xs: 7, md: 11 } }}>
        <Typography sx={{ fontFamily: FONT_MONO, color: 'primary.main', fontSize: '0.75rem', letterSpacing: '0.04em', mb: 2 }}>
          ALL PROJECTS
        </Typography>
        <Typography component="h1" sx={{ fontWeight: 700, fontSize: { xs: '2.1rem', sm: '3rem', md: '4.2rem' }, lineHeight: 1.2, color: 'text.primary', mb: 2 }}>
          전체 프로젝트
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '1rem', mb: { xs: 6, md: 8 } }}>
          대표작과 공개 가능한 작업을 한 페이지에서 비교하고 선택합니다.
        </Typography>

        <Typography sx={{ fontFamily: FONT_MONO, color: 'primary.main', fontSize: '0.75rem', letterSpacing: '0.04em', mb: 3 }}>
          FEATURED
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3.5 }, mb: { xs: 7, md: 10 } }}>
          {FEATURED_CARDS.map((card) => (
            <FeaturedCard key={card.id} card={card} project={ALL_PROJECTS.find((p) => p.id === card.id)} onDetail={openDetail} />
          ))}
        </Box>

        <Typography sx={{ fontFamily: FONT_MONO, color: 'primary.main', fontSize: '0.75rem', letterSpacing: '0.04em', mb: 3 }}>
          ARCHIVE
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {archiveProjects.map((project, i) => (
            <ArchiveRow key={project.id} project={project} index={i} onDetail={openDetail} />
          ))}
        </Box>
      </Container>

      <DetailModal project={selectedProject} open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default ProjectsPage;
