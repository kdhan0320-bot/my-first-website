import { useState } from 'react';
import {
  Box, Container, Typography, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Divider, Button,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import EvidenceBadges from '../projects/EvidenceBadges';
import { ALL_PROJECTS } from '../../data/projectsData';
import { FONT_MONO, COLORS } from '../../theme';

/* Figma 04_Selected_Projects(42:71) 원문 카피. 실제 프로젝트 사실(역할/데이터 방식)과
 * 모순되지 않는 범위에서 이 섹션 전용 축약 문구로 쓰고, 전체 사실은 기존 DetailModal에서
 * projectsFallbackData.js 원본 필드로 그대로 보여준다. */
const FEATURED_BLOCKS = [
  {
    id: 'jobflow',
    title: 'JobFlow',
    description: '취업 준비의 지원 현황과 다음 행동을 한 화면에서 관리하는 대시보드',
    role: 'UX/UI · React/MUI · 반응형 구현',
    data: '게스트 샘플 데이터 / 로그인 사용자 Supabase 저장',
  },
  {
    id: 'bus-arrival-app',
    title: '버스 도착정보 앱 UI',
    description: '도착 예정 정보를 빠르게 확인하는 모바일 UI 프로토타입',
    role: 'Figma Prototype · UI 설계',
    data: '정적 예시 데이터 · 실시간 버스 API 미연동',
  },
  {
    id: 'feedback-hub',
    title: 'Portfolio Feedback Hub',
    description: '포트폴리오를 탐색하고 피드백을 주고받는 커뮤니티형 서비스',
    role: 'UX/UI · React/MUI · Supabase',
    data: 'Supabase 조회 · fallback 구분 · RLS는 배포 환경 확인 필요',
  },
];

const findProject = (id) => ALL_PROJECTS.find((p) => p.id === id);

/* ── 상세 모달 (기존 ProjectDetailModal 구조 유지, 토큰만 교체) ── */
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
  const { detail, role, tools, liveUrl, githubUrl, figmaPrototypeUrl } = project;
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
          sx={{ color: 'text.secondary', ml: 1, minWidth: 44, minHeight: 44, '&:hover': { bgcolor: 'rgba(184,193,203,0.08)' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2.5 }}>
        <EvidenceBadges project={project} />
        <DetailRow label="프로젝트 개요">
          <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.75 }}>{detail.overview}</Typography>
        </DetailRow>
        {detail.problem && detail.problem !== '—' && (
          <DetailRow label="문제 정의">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.problem}</Typography>
            {detail.goal && detail.goal !== '—' && (
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75, mt: 1 }}>{detail.goal}</Typography>
            )}
          </DetailRow>
        )}
        <DetailRow label="내 역할">
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: tools.length > 0 ? 1 : 0 }}>{role}</Typography>
          {tools.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {tools.map((t) => (
                <Chip key={t} label={t} size="small"
                  sx={{ bgcolor: 'rgba(255,107,61,0.08)', color: 'primary.main', border: '1px solid rgba(255,107,61,0.2)', fontWeight: 600, fontSize: '0.875rem' }} />
              ))}
            </Box>
          )}
        </DetailRow>
        {detail.designPoint && detail.designPoint !== '—' && (
          <DetailRow label="화면 구조">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.designPoint}</Typography>
            {detail.process && (
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75, mt: 1 }}>{detail.process}</Typography>
            )}
          </DetailRow>
        )}
        {(project.cardScope || detail.result) && (
          <DetailRow label="구현 범위">
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{project.cardScope ?? detail.result}</Typography>
            {liveUrl && (
              <Box component="a" href={liveUrl} target="_blank" rel="noopener noreferrer"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1, color: 'primary.main', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                실행 화면 보기 →
              </Box>
            )}
          </DetailRow>
        )}
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
        {figmaPrototypeUrl && (
          <Button component="a" href={figmaPrototypeUrl} target="_blank" rel="noopener noreferrer"
            variant="contained" size="small" endIcon={<OpenInNewIcon sx={{ fontSize: '0.8rem !important' }} />}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, fontWeight: 700, whiteSpace: 'nowrap' }}>
            프로토타입 보기
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

/* Mock — 브라우저 크롬(Figma 그대로)에 실제 프로젝트 자산을 채운다.
 * Figma의 추상 차트/리스트 목업은 최종 이미지로 쓰지 않는다(작업 지시서 이미지 규칙). */
const ProjectMock = ({ project }) => (
  <Box
    sx={{
      width: '100%', flex: '1 1 460px', maxWidth: 760, minWidth: 0,
      borderRadius: '14px', overflow: 'hidden',
      bgcolor: COLORS.deepSlate, border: '1px solid #33404D',
    }}
  >
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: 38, px: 1.75, bgcolor: COLORS.warmIvory }}>
      <Box sx={{ width: 7, height: 7, borderRadius: '4px', bgcolor: '#FF7A52' }} />
      <Box sx={{ width: 7, height: 7, borderRadius: '4px', bgcolor: '#F1B95A' }} />
      <Box sx={{ width: 7, height: 7, borderRadius: '4px', bgcolor: '#7ACB8A' }} />
    </Box>
    <Box sx={{ position: 'relative', height: { xs: 220, sm: 300, md: 360 }, background: project.gradient }}>
      {project.thumbnailUrl && (
        <Box component="img" src={project.thumbnailUrl} alt={`${project.title} 화면 미리보기`} loading="lazy"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', p: 2 }} />
      )}
    </Box>
  </Box>
);

const ProjectBlock = ({ block, index }) => {
  const project = findProject(block.id);
  const mockFirst = index % 2 === 0;
  const [openDetail, setOpenDetail] = useState(null);

  const mock = <ProjectMock project={project ?? { gradient: COLORS.deepSlate }} />;
  const copy = (
    <Box sx={{ width: '100%', flex: { xs: '1 1 100%', md: '1 1 340px' }, maxWidth: { xs: '100%', md: 420 }, minWidth: 0 }}>
      <Typography sx={{ fontFamily: FONT_MONO, color: 'primary.main', fontSize: '0.75rem', letterSpacing: '0.04em', mb: 1.5 }}>
        {String(index + 1).padStart(2, '0')}
      </Typography>
      <Typography component="h3" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.1rem' }, lineHeight: 1.3, color: 'text.primary', mb: 1.5, wordBreak: 'normal', overflowWrap: 'normal' }}>
        {block.title}
      </Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: '1rem', lineHeight: 1.7, mb: 2 }}>
        {block.description}
      </Typography>
      <Typography sx={{ fontFamily: FONT_MONO, color: 'primary.main', fontSize: '0.75rem', letterSpacing: '0.04em', mb: 0.75 }}>
        ROLE
      </Typography>
      <Typography sx={{ color: 'text.primary', fontSize: '0.9375rem', lineHeight: 1.6, mb: 2 }}>
        {block.role}
      </Typography>
      <Typography sx={{ fontFamily: FONT_MONO, color: 'primary.main', fontSize: '0.75rem', letterSpacing: '0.04em', mb: 0.75 }}>
        DATA
      </Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: '0.9375rem', lineHeight: 1.6, mb: 2.5 }}>
        {block.data}
      </Typography>
      <Box
        component="button"
        type="button"
        onClick={() => setOpenDetail(project)}
        aria-label={`${block.title} 상세보기`}
        sx={{
          bgcolor: 'background.default', color: 'text.primary', border: '1px solid #33404D',
          cursor: 'pointer', height: 48, minWidth: 148, px: 2.5, borderRadius: '10px',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
          fontWeight: 600, fontSize: '0.875rem', fontFamily: 'inherit',
          transition: 'border-color 0.2s ease, color 0.2s ease',
          '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
          '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
        }}
      >
        상세보기 <Box component="span" aria-hidden="true" sx={{ fontFamily: FONT_MONO }}>→</Box>
      </Box>
      <ProjectDetailModal project={openDetail} open={Boolean(openDetail)} onClose={() => setOpenDetail(null)} />
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: mockFirst ? 'row' : 'row-reverse' },
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: { xs: 4, md: 6 },
        width: '100%',
      }}
    >
      {mock}
      {copy}
    </Box>
  );
};

const ProjectsSection = () => {
  const navigate = useNavigate();

  return (
    <Box component="section" id="projects" aria-label="프로젝트" sx={{ bgcolor: 'background.default', py: { xs: 8, md: 13 } }}>
      <Container maxWidth={false} sx={{ px: { xs: 3, sm: 6, md: 8 } }}>
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <Typography sx={{ fontFamily: FONT_MONO, color: 'primary.main', fontSize: '0.75rem', letterSpacing: '0.04em', mb: 2 }}>
            03 / SELECTED PROJECTS
          </Typography>
          <Typography component="h2" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2.2rem', md: '2.9rem' }, lineHeight: 1.25, color: 'text.primary', maxWidth: 900, mb: 1.5 }}>
            <Box component="span" sx={{ display: 'block' }}>대표 프로젝트 3개를</Box>
            <Box component="span" sx={{ display: 'block' }}>실제 구현 범위와 함께 보여줍니다.</Box>
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            실제 화면 · 담당 역할 · 데이터 방식 · 현재 한계
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 8, md: 13 } }}>
          {FEATURED_BLOCKS.map((block, i) => (
            <ProjectBlock key={block.id} block={block} index={i} />
          ))}
        </Box>

        <Box sx={{ mt: { xs: 6, md: 9 } }}>
          <Box
            component="button"
            type="button"
            onClick={() => navigate('/projects')}
            aria-label="전체 프로젝트 페이지로 이동"
            sx={{
              bgcolor: 'primary.main', color: 'primary.contrastText', border: 0, cursor: 'pointer',
              height: 52, minWidth: 220, px: 2.5, borderRadius: '10px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
              fontWeight: 600, fontSize: '0.9375rem', fontFamily: 'inherit',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 26px rgba(255,107,61,0.35)' },
              '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
            }}
          >
            전체 프로젝트 보기 <Box component="span" aria-hidden="true" sx={{ fontFamily: FONT_MONO }}>→</Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProjectsSection;
