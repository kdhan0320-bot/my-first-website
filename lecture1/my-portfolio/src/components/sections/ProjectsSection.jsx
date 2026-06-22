import { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent,
  Button, Chip, Tabs, Tab, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Divider,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import CloseIcon from '@mui/icons-material/Close';
import RevealOnScroll from '../common/RevealOnScroll';
import { ALL_PROJECTS, FILTER_TABS } from '../../data/projectsData';

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
          sx={(t) => ({ color: 'text.secondary', ml: 1, '&:hover': { bgcolor: t.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#F1F5F9' } })}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2.5 }}>
        <DetailRow label="Project Overview">
          <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.75 }}>{detail.overview}</Typography>
        </DetailRow>
        <DetailRow label="Problem">
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.problem}</Typography>
        </DetailRow>
        <DetailRow label="Goal">
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.goal}</Typography>
        </DetailRow>
        {detail.targetUser && (
          <DetailRow label="Target User">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.targetUser}</Typography>
          </DetailRow>
        )}
        <DetailRow label="Role">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{role}</Typography>
        </DetailRow>
        <DetailRow label="Tools">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {tools.map((t) => (
              <Chip key={t} label={t} size="small"
                sx={(theme) => ({
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(91,141,184,0.1)' : '#EEF4FB',
                  color: 'primary.main',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(91,141,184,0.2)' : 'rgba(30,58,95,0.18)'}`,
                  fontWeight: 600, fontSize: '0.72rem',
                })} />
            ))}
          </Box>
        </DetailRow>
        <DetailRow label="Design Point">
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.designPoint}</Typography>
        </DetailRow>
        {detail.process && (
          <DetailRow label="UX/UI Process">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.process}</Typography>
          </DetailRow>
        )}
        {detail.result && (
          <DetailRow label="Result">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.result}</Typography>
          </DetailRow>
        )}
        <DetailRow label="Next Step">
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.nextStep}</Typography>
        </DetailRow>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        {liveUrl && (
          <Button component="a" href={liveUrl} target="_blank" rel="noopener noreferrer"
            variant="contained" size="small" endIcon={<OpenInNewIcon sx={{ fontSize: '0.8rem !important' }} />}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, fontWeight: 700 }}>
            Live Demo
          </Button>
        )}
        {githubUrl && (
          <Button component="a" href={githubUrl} target="_blank" rel="noopener noreferrer"
            variant="outlined" size="small" startIcon={<GitHubIcon sx={{ fontSize: '0.85rem !important' }} />}
            sx={(t) => ({ color: 'text.secondary', borderColor: t.palette.divider, '&:hover': { borderColor: 'primary.main', color: 'primary.main' } })}>
            GitHub
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} size="small"
          sx={(t) => ({ color: 'text.secondary', '&:hover': { bgcolor: t.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#F1F5F9' } })}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ── 썸네일 (이미지 우선, 그라데이션 폴백) ── */
const ProjectThumbnail = ({ gradient, thumbnailUrl, title }) => (
  <Box sx={{ position: 'relative', paddingTop: '52%', overflow: 'hidden', flexShrink: 0, background: gradient }}>
    {thumbnailUrl ? (
      <Box component="img" src={thumbnailUrl} alt={`${title} 프로젝트 썸네일`} loading="lazy" className="thumb-img"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
        sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.35s ease' }} />
    ) : (
      <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', userSelect: 'none' }}>
          Project Preview
        </Typography>
      </Box>
    )}
  </Box>
);

/* ── 프로젝트 카드 ── */
const ProjectCard = ({ project, idx, onDetail }) => (
  <RevealOnScroll delay={Math.min(idx % 3, 2) * 0.1} y={16} sx={{ display: 'flex', flexDirection: 'column' }}>
    <Card tabIndex={0} aria-label={`${project.title} 프로젝트 카드`}
      sx={(t) => ({
        display: 'flex', flexDirection: 'column', flex: 1,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: t.palette.mode === 'dark' ? '0 12px 32px rgba(0,0,0,0.4)' : '0 12px 32px rgba(0,0,0,0.1)',
          borderColor: t.palette.primary.main,
        },
        '&:hover .thumb-img': { transform: 'scale(1.05)' },
        '&:focus-visible': { outline: `2px solid ${t.palette.primary.main}`, outlineOffset: '2px' },
      })}>
      <ProjectThumbnail gradient={project.gradient} thumbnailUrl={project.thumbnailUrl} title={project.title} />
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
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, flexShrink: 0, pt: '1px', fontSize: '0.65rem', letterSpacing: '0.04em' }}>ROLE</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5, fontSize: '0.72rem' }}>{project.role}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {project.tools.map((tool) => (
            <Chip key={tool} label={tool} size="small"
              sx={(t) => ({
                bgcolor: t.palette.mode === 'dark' ? 'rgba(91,141,184,0.1)' : '#EEF4FB',
                color: 'primary.main',
                border: `1px solid ${t.palette.mode === 'dark' ? 'rgba(91,141,184,0.18)' : 'rgba(30,58,95,0.16)'}`,
                fontSize: '0.62rem', height: 20, fontWeight: 600,
              })} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {project.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small"
              sx={(t) => ({ bgcolor: 'transparent', color: 'text.secondary', border: `1px solid ${t.palette.divider}`, fontSize: '0.6rem', height: 18 })} />
          ))}
        </Box>
        <Stack direction="row" sx={{ mt: 'auto', pt: 0.5, flexWrap: 'wrap', gap: 0.75 }}>
          <Button size="small" variant="outlined" onClick={() => onDetail(project)} aria-label={`${project.title} 상세 정보 보기`}
            sx={(t) => ({
              fontSize: '0.72rem', px: 1.5, minHeight: 32, color: 'primary.main',
              borderColor: t.palette.mode === 'dark' ? 'rgba(91,141,184,0.4)' : 'rgba(30,58,95,0.35)', fontWeight: 600,
              '&:hover': { borderColor: 'primary.main', bgcolor: t.palette.mode === 'dark' ? 'rgba(91,141,184,0.06)' : '#EEF4FB' },
            })}>
            View Detail
          </Button>
          {project.liveUrl && (
            <Button component="a" href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              size="small" variant="contained" endIcon={<OpenInNewIcon sx={{ fontSize: '0.75rem !important' }} />}
              aria-label={`${project.title} 라이브 데모`}
              sx={{ fontSize: '0.72rem', px: 1.5, minHeight: 32, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, fontWeight: 600 }}>
              Live Demo
            </Button>
          )}
          {project.githubUrl && (
            <Button component="a" href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              size="small" variant="outlined" startIcon={<GitHubIcon sx={{ fontSize: '0.85rem !important' }} />}
              aria-label={`${project.title} GitHub`}
              sx={(t) => ({ fontSize: '0.72rem', px: 1.5, minHeight: 32, color: 'text.secondary', borderColor: t.palette.divider, '&:hover': { borderColor: 'primary.main', color: 'primary.main' } })}>
              GitHub
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  </RevealOnScroll>
);

/* ── 메인 섹션 ── */
const ProjectsSection = () => {
  const [activeTab, setActiveTab]       = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen]       = useState(false);

  const filtered = activeTab === 'all'
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter((p) => p.categories.includes(activeTab));

  return (
    <Box component="section" id="projects" aria-label="프로젝트" sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">

        <RevealOnScroll>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography sx={{ color: 'text.secondary', letterSpacing: 6, fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1.5 }}>
              PROJECTS
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, color: 'text.primary', fontWeight: 800 }}>주요 프로젝트</Typography>
            <Box sx={{ width: 44, height: 3, bgcolor: 'primary.main', mx: 'auto', mt: 2, borderRadius: 2 }} />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Figma UX/UI 설계부터 AI-assisted coding 구현까지, 카테고리별로 정리했습니다.
            </Typography>
          </Box>
        </RevealOnScroll>

        <RevealOnScroll delay={0.05}>
          <Box sx={(t) => ({ mb: 5, borderBottom: `1px solid ${t.palette.divider}` })}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}
              variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile
              TabIndicatorProps={{ style: { height: 2 } }}
              sx={{ '& .MuiTab-root': { fontSize: '0.8rem', fontWeight: 600, minHeight: 44, textTransform: 'none', color: 'text.secondary', '&.Mui-selected': { color: 'primary.main' } } }}>
              {FILTER_TABS.map((tab) => <Tab key={tab.value} label={tab.label} value={tab.value} />)}
            </Tabs>
          </Box>
        </RevealOnScroll>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {filtered.map((project, idx) => (
            <ProjectCard key={project.id} project={project} idx={idx}
              onDetail={(p) => { setSelectedProject(p); setModalOpen(true); }} />
          ))}
        </Box>

        {filtered.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>해당 카테고리의 프로젝트가 없습니다.</Typography>
          </Box>
        )}

      </Container>
      <ProjectDetailModal project={selectedProject} open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default ProjectsSection;
