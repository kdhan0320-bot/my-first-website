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

const FILTER_TABS = [
  { label: 'All',            value: 'all'      },
  { label: 'Featured',       value: 'featured' },
  { label: 'AI Vibe Coding', value: 'ai'       },
  { label: 'Figma UX/UI',    value: 'figma'    },
  { label: 'Redesign',       value: 'redesign' },
];

/* ── 실제 AI Vibe Coding 프로젝트 4개 (Supabase DB + 정적) ── */
const ALL_PROJECTS = [
  {
    id: 'jobflow',
    title: 'JobFlow Dashboard',
    description: '지원 회사와 전형 상태를 칸반 보드로 관리하고, 체크리스트·면접 메모·AI 프롬프트 보관까지 한곳에 정리하는 취업 준비 대시보드',
    categories: ['featured', 'ai'],
    categoryLabel: 'AI Vibe Coding',
    role: 'UI Design, AI-assisted Coding, Web Publishing',
    tools: ['React', 'Vite', 'MUI', 'Supabase', 'Claude'],
    tags: ['Dashboard', 'Kanban', 'SaaS', 'Responsive'],
    gradient: 'linear-gradient(135deg, #1E3A5F 0%, #2A5A8F 100%)',
    liveUrl: 'https://kdhan0320-bot.github.io/my-first-website/jobflow-dashboard/',
    githubUrl: 'https://github.com/kdhan0320-bot/my-first-website/tree/main/lecture1/jobflow-dashboard',
    detail: {
      overview: '취업 준비생이 지원 현황, 전형 일정, 포트폴리오 체크리스트를 한 화면에서 관리할 수 있도록 설계한 대시보드 프로젝트입니다.',
      problem: '취업 준비 중 여러 회사에 동시 지원하면서 전형 상태와 일정을 분산 관리하는 어려움이 있습니다.',
      goal: '칸반 보드 UI로 전형 단계를 시각화하고, 면접 메모와 AI 프롬프트를 함께 보관할 수 있는 올인원 대시보드 구현.',
      designPoint: 'SaaS형 대시보드 레이아웃, 칸반 카드 드래그 UX, 사이드패널 메모 영역, 반응형 Grid 구성.',
      nextStep: '알림 기능, 캘린더 연동, 지원 통계 시각화 차트 추가 예정입니다.',
    },
  },
  {
    id: 'feedback-hub',
    title: 'Portfolio Feedback Hub',
    description: '수강생과 취업준비생이 포트폴리오·과제·취업 정보를 공유하고 피드백을 주고받을 수 있는 커뮤니티형 게시판 프로젝트',
    categories: ['featured', 'ai'],
    categoryLabel: 'AI Vibe Coding',
    role: 'UI Design, AI-assisted Coding, Web Publishing',
    tools: ['React', 'Vite', 'MUI', 'Supabase', 'Claude'],
    tags: ['Community', 'Board', 'Responsive', 'Supabase'],
    gradient: 'linear-gradient(135deg, #0D9488 0%, #2DD4BF 100%)',
    liveUrl: 'https://kdhan0320-bot.github.io/my-first-website/my-community/',
    githubUrl: 'https://github.com/kdhan0320-bot/my-first-website/tree/main/lecture1/my-community',
    detail: {
      overview: '수강생과 취업준비생이 포트폴리오·과제·취업 정보를 공유하고 피드백을 주고받을 수 있도록 만든 커뮤니티형 게시판 프로젝트입니다.',
      problem: '포트폴리오 제작 중 주변에 피드백을 줄 수 있는 동료를 찾기 어렵고, 취업 정보도 분산되어 있습니다.',
      goal: '게시글 작성·검색·해시태그·댓글·대댓글·좋아요·조회수 기능을 통해 정보 탐색과 소통 흐름을 구현.',
      designPoint: '카드형 게시물 레이아웃, 해시태그 필터, 댓글 트리 구조, 모바일 반응형 설계.',
      nextStep: '북마크 기능, 알림 시스템, 프로필 페이지 강화 예정입니다.',
    },
  },
  {
    id: 'gamstagram',
    title: '겜스타그램',
    description: '게임 유저들이 리뷰·댓글·좋아요·모임 정보를 공유할 수 있는 관심사 기반 SNS 프로젝트. 로그인 없이 둘러보기 기능 제공',
    categories: ['ai'],
    categoryLabel: 'AI Vibe Coding',
    role: 'UI Design, AI-assisted Coding, Web Publishing',
    tools: ['React', 'MUI', 'Supabase', 'React Router', 'Claude'],
    tags: ['SNS', 'Community', 'Gaming', 'Responsive'],
    gradient: 'linear-gradient(135deg, #4338CA 0%, #7C3AED 100%)',
    liveUrl: 'https://kdhan0320-bot.github.io/my-first-website/mini-sns/',
    githubUrl: 'https://github.com/kdhan0320-bot/my-first-website/tree/main/lecture1/mini_sns',
    detail: {
      overview: '게임 유저들이 리뷰와 모임 정보를 공유하는 관심사 기반 SNS 프로젝트입니다.',
      problem: '게임 관련 리뷰와 모임 정보를 한 플랫폼에서 찾기 어려운 문제를 해결하고자 했습니다.',
      goal: '로그인 없이 둘러보기가 가능한 SNS UI와, 로그인 후 리뷰·댓글·좋아요를 남길 수 있는 경험 설계.',
      designPoint: '인스타그램식 카드 피드 레이아웃, 게임 장르별 필터, 모임 카드 UI, 모바일 퍼스트 설계.',
      nextStep: '실시간 채팅, 팔로우 시스템, 게임 모임 신청 기능 추가 예정입니다.',
    },
  },
  {
    id: 'ott-service',
    title: 'OTT Service',
    description: '프리미엄 스트리밍 서비스 콘셉트로 제작한 OTT 웹 UI. 시네마틱 히어로, 트렌딩 콘텐츠, 장르 필터, 추천 콘텐츠 섹션 구성',
    categories: ['ai'],
    categoryLabel: 'AI Vibe Coding',
    role: 'Web Design, AI-assisted Coding',
    tools: ['HTML', 'CSS', 'JavaScript', 'Claude'],
    tags: ['Landing Page', 'UI Design', 'Responsive'],
    gradient: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
    liveUrl: 'https://kdhan0320-bot.github.io/my-first-website/ott-service/',
    githubUrl: 'https://github.com/kdhan0320-bot/my-first-website',
    detail: {
      overview: '프리미엄 스트리밍 서비스를 콘셉트로 제작한 OTT 웹 UI 프로젝트입니다.',
      problem: '넷플릭스 같은 서비스 UI를 순수 HTML/CSS/JS로만 구현하며 웹 구조와 CSS 레이아웃을 깊이 이해하고자 했습니다.',
      goal: '시네마틱 히어로 섹션, 트렌딩 콘텐츠 슬라이더, 장르 필터, 추천 섹션을 포함한 실제 서비스형 랜딩페이지 완성.',
      designPoint: '다크 테마, 영화 포스터 그리드, hover 인터랙션, 모달 팝업, 모바일 반응형 레이아웃.',
      nextStep: 'React 컴포넌트 구조로 리팩토링 및 실제 영화 API 연동 예정입니다.',
    },
  },

  /* ── Figma UX/UI Placeholder 프로젝트 ── */
  {
    id: 'clinic',
    title: 'Clinic Reservation Website',
    description: '신뢰감 있는 병원/클리닉 예약 랜딩페이지와 예약 서브페이지 디자인',
    categories: ['figma'],
    categoryLabel: 'Figma UX/UI Design',
    role: 'Web Design, UX/UI Design',
    tools: ['Figma'],
    tags: ['Healthcare', 'Booking', 'Landing Page', 'Responsive'],
    gradient: 'linear-gradient(135deg, #0891B2 0%, #22D3EE 100%)',
    liveUrl: null,
    githubUrl: null,
    isPlaceholder: true,
    detail: {
      overview: '신뢰감을 기반으로 한 병원/클리닉 랜딩페이지와 예약 서브페이지 UX/UI 설계 프로젝트입니다.',
      problem: '기존 병원 예약 사이트는 정보가 복잡하고 시각적 신뢰감이 부족해 예약 전환율이 낮습니다.',
      goal: '클리닉의 신뢰감을 높이는 랜딩페이지와 사용자가 쉽게 예약할 수 있는 서브페이지 설계.',
      designPoint: '따뜻하고 신뢰감 있는 컬러 팔레트, 명확한 CTA 배치, 반응형 예약 폼 UX.',
      nextStep: 'Figma 프로토타입 기반 사용성 테스트 및 실제 예약 시스템 연동 설계 예정.',
    },
  },
  {
    id: 'education',
    title: 'Education Platform',
    description: '웹디자인 학습자를 위한 교육 플랫폼 랜딩페이지와 강의 상세페이지',
    categories: ['figma'],
    categoryLabel: 'Figma UX/UI Design',
    role: 'Web Design, UX/UI Design',
    tools: ['Figma'],
    tags: ['Education', 'Course', 'Landing Page'],
    gradient: 'linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%)',
    liveUrl: null,
    githubUrl: null,
    isPlaceholder: true,
    detail: {
      overview: '웹디자인을 처음 배우는 학습자를 위한 교육 플랫폼 UI 설계 프로젝트입니다.',
      problem: '교육 플랫폼의 정보 과부하로 처음 방문한 사용자가 강의를 선택하기 어렵습니다.',
      goal: '주요 강의 정보를 명확하게 전달하고, 수강 신청까지 자연스럽게 이어지는 화면 설계.',
      designPoint: '정보 계층 구조 최적화, 강의 카드 레이아웃, 수강생 후기 섹션 UX.',
      nextStep: '모바일 전용 UI 최적화 및 수강생 온보딩 플로우 추가 예정.',
    },
  },
  {
    id: 'petcare',
    title: 'Senior Pet Care Service',
    description: '노령견 보호자를 위한 건강관리 및 병원예약 서비스 UI',
    categories: ['figma'],
    categoryLabel: 'Figma UX/UI Design',
    role: 'UX/UI Design, Service Design',
    tools: ['Figma'],
    tags: ['Pet Care', 'Healthcare', 'Routine'],
    gradient: 'linear-gradient(135deg, #059669 0%, #2DD4BF 100%)',
    liveUrl: null,
    githubUrl: null,
    isPlaceholder: true,
    detail: {
      overview: '노령견을 키우는 보호자가 건강 루틴 관리와 병원 예약을 쉽게 할 수 있는 서비스 UI 설계입니다.',
      problem: '노령 반려동물 보호자는 건강 체크 항목이 많고 예약이 복잡해 꾸준한 관리에 어려움을 겪습니다.',
      goal: '건강 루틴 체크, 약 복용 기록, 병원 예약을 하나의 앱에서 간편하게 처리하는 UI 설계.',
      designPoint: '따뜻한 톤의 컬러, 단순한 정보 구조, 명확한 루틴 카드 레이아웃.',
      nextStep: '보호자 인터뷰를 통한 핵심 기능 검증 및 프로토타입 사용성 테스트 예정.',
    },
  },

  /* ── Redesign ── */
  {
    id: 'redesign',
    title: 'Community Redesign',
    description: '기존 커뮤니티 프로젝트의 정보 구조와 사용자 흐름을 개선한 리디자인 작업',
    categories: ['redesign'],
    categoryLabel: 'Redesign',
    role: 'UX Improvement, UI Redesign',
    tools: ['Figma', 'HTML', 'CSS'],
    tags: ['Redesign', 'Community', 'Before/After'],
    gradient: 'linear-gradient(135deg, #475569 0%, #94A3B8 100%)',
    liveUrl: null,
    githubUrl: null,
    isPlaceholder: true,
    detail: {
      overview: '기존 커뮤니티 프로젝트의 구조적 문제를 분석하고 정보 설계와 사용자 흐름을 개선한 리디자인 작업입니다.',
      problem: '초기 커뮤니티 화면은 정보 구조가 불명확하고, 원하는 게시글을 찾기까지 클릭 횟수가 많았습니다.',
      goal: '정보 계층 구조 단순화, 주요 기능 접근성 향상, 모바일 레이아웃 최적화.',
      designPoint: 'Before/After 비교 설계, 탐색 구조 개선, 글쓰기 플로우 단축.',
      nextStep: '개선된 구조로 실제 재구현 및 사용자 피드백 수집 예정.',
    },
  },
];

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      aria-labelledby="project-detail-title"
      PaperProps={{
        sx: (theme) => ({
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
        }),
      }}
    >
      <DialogTitle
        id="project-detail-title"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1 }}
      >
        <Box>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {project.categoryLabel}
          </Typography>
          <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700, mt: 0.25 }}>
            {project.title}
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="상세 정보 닫기" size="small"
          sx={(theme) => ({ color: 'text.secondary', ml: 1, '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#F1F5F9' } })}>
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
                })}
              />
            ))}
          </Box>
        </DetailRow>
        <DetailRow label="Design Point">
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.designPoint}</Typography>
        </DetailRow>
        <DetailRow label="Next Step">
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{detail.nextStep}</Typography>
        </DetailRow>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        {liveUrl && (
          <Button component="a" href={liveUrl} target="_blank" rel="noopener noreferrer"
            variant="contained" size="small"
            endIcon={<OpenInNewIcon sx={{ fontSize: '0.8rem !important' }} />}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, fontWeight: 700 }}>
            Live Demo
          </Button>
        )}
        {githubUrl && (
          <Button component="a" href={githubUrl} target="_blank" rel="noopener noreferrer"
            variant="outlined" size="small"
            startIcon={<GitHubIcon sx={{ fontSize: '0.85rem !important' }} />}
            sx={(theme) => ({ color: 'text.secondary', borderColor: theme.palette.divider, '&:hover': { borderColor: 'primary.main', color: 'primary.main' } })}>
            GitHub
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} size="small"
          sx={(theme) => ({ color: 'text.secondary', '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#F1F5F9' } })}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ── 프로젝트 카드 ── */
const GradientThumbnail = ({ gradient, title }) => (
  <Box aria-hidden="true"
    sx={{ position: 'relative', paddingTop: '52%', overflow: 'hidden', flexShrink: 0, background: gradient }}>
    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', userSelect: 'none' }}>
        Project Preview
      </Typography>
    </Box>
  </Box>
);

const ProjectCard = ({ project, idx, onDetail }) => (
  <RevealOnScroll delay={Math.min(idx % 3, 2) * 0.1} y={16} sx={{ display: 'flex', flexDirection: 'column' }}>
    <Card tabIndex={0} aria-label={`${project.title} 프로젝트 카드`}
      sx={(theme) => ({
        display: 'flex', flexDirection: 'column', flex: 1,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.palette.mode === 'dark' ? '0 12px 32px rgba(0,0,0,0.4)' : '0 12px 32px rgba(0,0,0,0.1)',
          borderColor: theme.palette.primary.main,
        },
        '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: '2px' },
      })}>
      <GradientThumbnail gradient={project.gradient} title={project.title} />

      <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Box>
          <Typography variant="caption"
            sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
            {project.categoryLabel}
            {project.isPlaceholder && (
              <Box component="span" sx={{ ml: 1, color: 'text.disabled', fontWeight: 400, fontSize: '0.6rem' }}>(Figma 준비 중)</Box>
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

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, flexShrink: 0, pt: '1px', fontSize: '0.65rem', letterSpacing: '0.04em' }}>ROLE</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5, fontSize: '0.72rem' }}>{project.role}</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {project.tools.map((tool) => (
            <Chip key={tool} label={tool} size="small"
              sx={(theme) => ({
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(91,141,184,0.1)' : '#EEF4FB',
                color: 'primary.main',
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(91,141,184,0.18)' : 'rgba(30,58,95,0.16)'}`,
                fontSize: '0.62rem', height: 20, fontWeight: 600,
              })} />
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {project.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small"
              sx={(theme) => ({ bgcolor: 'transparent', color: 'text.secondary', border: `1px solid ${theme.palette.divider}`, fontSize: '0.6rem', height: 18 })} />
          ))}
        </Box>

        <Stack direction="row" spacing={1} sx={{ mt: 'auto', pt: 0.5, flexWrap: 'wrap', gap: 0.75 }}>
          <Button size="small" variant="outlined" onClick={() => onDetail(project)}
            aria-label={`${project.title} 상세 정보 보기`}
            sx={(theme) => ({
              fontSize: '0.72rem', px: 1.5, minHeight: 32, color: 'primary.main',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(91,141,184,0.4)' : 'rgba(30,58,95,0.35)',
              fontWeight: 600,
              '&:hover': { borderColor: 'primary.main', bgcolor: theme.palette.mode === 'dark' ? 'rgba(91,141,184,0.06)' : '#EEF4FB' },
            })}>
            View Detail
          </Button>

          {project.liveUrl && (
            <Button component="a" href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              size="small" variant="contained"
              endIcon={<OpenInNewIcon sx={{ fontSize: '0.75rem !important' }} />}
              aria-label={`${project.title} 라이브 데모`}
              sx={{ fontSize: '0.72rem', px: 1.5, minHeight: 32, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, fontWeight: 600 }}>
              Live Demo
            </Button>
          )}

          {project.githubUrl && (
            <Button component="a" href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              size="small" variant="outlined"
              startIcon={<GitHubIcon sx={{ fontSize: '0.85rem !important' }} />}
              aria-label={`${project.title} GitHub`}
              sx={(theme) => ({ fontSize: '0.72rem', px: 1.5, minHeight: 32, color: 'text.secondary', borderColor: theme.palette.divider, '&:hover': { borderColor: 'primary.main', color: 'primary.main' } })}>
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
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = activeTab === 'all'
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter((p) => p.categories.includes(activeTab));

  const handleOpenDetail = (project) => { setSelectedProject(project); setModalOpen(true); };
  const handleCloseDetail = () => { setModalOpen(false); };

  return (
    <Box component="section" id="projects" aria-label="프로젝트" sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">

        <RevealOnScroll>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography sx={{ color: 'text.secondary', letterSpacing: 6, fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1.5 }}>
              PROJECTS
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, color: 'text.primary', fontWeight: 800 }}>
              주요 프로젝트
            </Typography>
            <Box sx={{ width: 44, height: 3, bgcolor: 'primary.main', mx: 'auto', mt: 2, borderRadius: 2 }} />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Figma UX/UI 설계부터 AI-assisted coding 구현까지, 카테고리별로 정리했습니다.
            </Typography>
          </Box>
        </RevealOnScroll>

        <RevealOnScroll delay={0.05}>
          <Box sx={(theme) => ({ mb: 5, borderBottom: `1px solid ${theme.palette.divider}` })}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}
              variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile
              TabIndicatorProps={{ style: { height: 2 } }}
              sx={{ '& .MuiTab-root': { fontSize: '0.8rem', fontWeight: 600, minHeight: 44, textTransform: 'none', color: 'text.secondary', '&.Mui-selected': { color: 'primary.main' } } }}>
              {FILTER_TABS.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
          </Box>
        </RevealOnScroll>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {filtered.map((project, idx) => (
            <ProjectCard key={project.id} project={project} idx={idx} onDetail={handleOpenDetail} />
          ))}
        </Box>

        {filtered.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>해당 카테고리의 프로젝트가 없습니다.</Typography>
          </Box>
        )}

      </Container>

      <ProjectDetailModal project={selectedProject} open={modalOpen} onClose={handleCloseDetail} />
    </Box>
  );
};

export default ProjectsSection;
