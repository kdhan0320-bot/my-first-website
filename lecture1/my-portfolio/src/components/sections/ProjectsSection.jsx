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
  { label: 'Figma UX/UI',    value: 'figma'    },
  { label: 'AI Vibe Coding', value: 'ai'       },
  { label: 'Redesign',       value: 'redesign' },
];

const ALL_PROJECTS = [
  {
    id: 'p1',
    title: 'AI Portfolio Manager',
    description: '취업준비생을 위한 AI 기반 포트폴리오 일정관리 및 작업관리 서비스',
    categories: ['featured', 'ai'],
    categoryLabel: 'AI Vibe Coding / UX/UI Design',
    role: 'UX/UI Design, Web Design, AI-assisted Coding',
    tools: ['Figma', 'Claude', 'HTML', 'CSS', 'JavaScript'],
    tags: ['SaaS', 'Dashboard', 'AI', 'Responsive'],
    gradient: 'linear-gradient(135deg, #1E3A5F 0%, #2A5A8F 100%)',
    liveUrl: null,
    githubUrl: null,
    detail: {
      overview: '취업 준비생이 포트폴리오 작업을 AI 도움으로 효율적으로 관리할 수 있는 SaaS 형태의 서비스 UI 설계 프로젝트입니다.',
      problem: '취업준비생은 여러 포트폴리오 작업을 동시에 관리하기 어렵고, 일정과 진행 상황을 한눈에 파악하기 힘듭니다.',
      goal: 'AI 보조 기능을 통해 작업 분류, 일정 추천, 우선순위 정리가 가능한 대시보드 UI를 설계합니다.',
      designPoint: 'SaaS 형태의 대시보드 레이아웃, 카드형 작업 목록, AI 추천 배지, 반응형 그리드 구성.',
      nextStep: '실제 AI API 연동 및 사용자 테스트를 통한 UX 개선 예정입니다.',
    },
  },
  {
    id: 'p2',
    title: 'Clinic Reservation Website',
    description: '신뢰감 있는 병원/클리닉 예약 랜딩페이지와 예약 서브페이지 디자인',
    categories: ['featured', 'figma'],
    categoryLabel: 'Figma UX/UI Design',
    role: 'Web Design, UX/UI Design',
    tools: ['Figma'],
    tags: ['Healthcare', 'Booking', 'Landing Page', 'Responsive'],
    gradient: 'linear-gradient(135deg, #0D9488 0%, #2DD4BF 100%)',
    liveUrl: null,
    githubUrl: null,
    detail: {
      overview: '신뢰감을 기반으로 한 병원/클리닉 랜딩페이지와 예약 서브페이지 UX/UI 설계 프로젝트입니다.',
      problem: '기존 병원 예약 사이트는 정보가 복잡하고 시각적 신뢰감이 부족해 예약 전환율이 낮습니다.',
      goal: '클리닉의 신뢰감을 높이는 랜딩페이지와 사용자가 쉽게 예약할 수 있는 서브페이지를 설계합니다.',
      designPoint: '따뜻하고 신뢰감 있는 컬러 팔레트, 명확한 CTA 배치, 반응형 예약 폼 UX.',
      nextStep: 'Figma 프로토타입 기반 사용성 테스트 및 실제 예약 시스템 연동 설계 예정입니다.',
    },
  },
  {
    id: 'p3',
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
    detail: {
      overview: '웹디자인을 처음 배우는 학습자를 위한 교육 플랫폼 UI 설계 프로젝트입니다.',
      problem: '교육 플랫폼 특성상 정보가 많고 복잡해 처음 방문한 사용자가 강의를 선택하기 어렵습니다.',
      goal: '주요 강의 정보를 명확하게 전달하고, 수강 신청까지 자연스럽게 이어지는 화면 설계.',
      designPoint: '정보 계층 구조 최적화, 강의 카드 레이아웃, 수강생 후기 섹션 UX 설계.',
      nextStep: '모바일 화면 전용 UI 최적화 및 수강생 온보딩 플로우 추가 예정입니다.',
    },
  },
  {
    id: 'p4',
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
    detail: {
      overview: '노령견을 키우는 보호자가 건강 루틴 관리와 병원 예약을 쉽게 할 수 있는 서비스 UI 설계입니다.',
      problem: '노령 반려동물 보호자는 건강 체크 항목이 많고 예약이 복잡해 꾸준한 관리에 어려움을 겪습니다.',
      goal: '건강 루틴 체크, 약 복용 기록, 병원 예약을 하나의 앱에서 간편하게 처리하는 UI 설계.',
      designPoint: '따뜻한 톤의 컬러, 노령견 특성을 고려한 단순한 정보 구조, 명확한 루틴 카드 레이아웃.',
      nextStep: '보호자 인터뷰를 통한 핵심 기능 검증 및 프로토타입 사용성 테스트 예정입니다.',
    },
  },
  {
    id: 'p5',
    title: 'Community Redesign',
    description: '기존 커뮤니티 프로젝트의 정보 구조와 사용자 흐름을 개선한 리디자인',
    categories: ['redesign'],
    categoryLabel: 'Redesign',
    role: 'UX Improvement, UI Redesign',
    tools: ['Figma', 'HTML', 'CSS'],
    tags: ['Redesign', 'Community', 'Before/After'],
    gradient: 'linear-gradient(135deg, #475569 0%, #94A3B8 100%)',
    liveUrl: null,
    githubUrl: null,
    detail: {
      overview: '기존 커뮤니티 프로젝트의 구조적 문제를 분석하고 정보 설계와 사용자 흐름을 개선한 리디자인 작업입니다.',
      problem: '초기 커뮤니티 화면은 정보 구조가 불명확하고, 사용자가 원하는 게시글을 찾기까지 클릭 횟수가 많았습니다.',
      goal: '정보 계층 구조 단순화, 주요 기능 접근성 향상, 모바일 레이아웃 최적화.',
      designPoint: 'Before/After 비교 설계, 탐색 구조 개선, 글쓰기 플로우 단축.',
      nextStep: '개선된 구조로 실제 HTML/CSS 재구현 및 사용자 피드백 수집 예정입니다.',
    },
  },
  {
    id: 'p6',
    title: 'Personal Portfolio Website',
    description: 'Claude를 활용해 구현한 개인 웹 포트폴리오 사이트',
    categories: ['ai'],
    categoryLabel: 'AI Vibe Coding',
    role: 'AI-assisted Coding, Web Publishing',
    tools: ['Claude', 'React', 'MUI', 'GitHub Pages'],
    tags: ['Portfolio', 'AI Coding', 'Responsive'],
    gradient: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
    liveUrl: 'https://kdhan0320-bot.github.io/my-first-website/my-portfolio/',
    githubUrl: 'https://github.com/kdhan0320-bot',
    detail: {
      overview: 'Claude AI를 활용한 AI-assisted coding으로 구현한 개인 웹 포트폴리오 사이트입니다.',
      problem: '웹 구현 경험이 부족한 상태에서 디자인 의도를 실제 동작하는 사이트로 연결하는 것이 어려웠습니다.',
      goal: 'Figma 기반 설계 의도를 React + MUI 스택으로 실제 배포까지 연결하는 전 과정 경험.',
      designPoint: '네이비/블루그레이 컬러 시스템, 반응형 레이아웃, 카테고리 필터, 다크모드 지원.',
      nextStep: '실제 프로젝트 이미지 연결, Figma 링크 추가, 방명록 기능 개선 예정입니다.',
    },
  },
];

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
      {/* 헤더 */}
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
        <IconButton
          onClick={onClose}
          aria-label="상세 정보 닫기"
          size="small"
          sx={(theme) => ({
            color: 'text.secondary',
            ml: 1,
            '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#F1F5F9' },
          })}
        >
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
              <Chip
                key={t}
                label={t}
                size="small"
                sx={(theme) => ({
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(91,141,184,0.1)' : '#EEF4FB',
                  color: 'primary.main',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(91,141,184,0.2)' : 'rgba(30,58,95,0.18)'}`,
                  fontWeight: 600,
                  fontSize: '0.72rem',
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
          <Button
            component="a"
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            size="small"
            endIcon={<OpenInNewIcon sx={{ fontSize: '0.8rem !important' }} />}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, fontWeight: 700 }}
          >
            Live Demo
          </Button>
        )}
        {githubUrl && (
          <Button
            component="a"
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            size="small"
            startIcon={<GitHubIcon sx={{ fontSize: '0.85rem !important' }} />}
            sx={(theme) => ({
              color: 'text.secondary',
              borderColor: theme.palette.divider,
              '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
            })}
          >
            GitHub
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button
          onClick={onClose}
          size="small"
          sx={(theme) => ({
            color: 'text.secondary',
            '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#F1F5F9' },
          })}
        >
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const GradientThumbnail = ({ gradient, title }) => (
  <Box
    aria-hidden="true"
    sx={{
      position: 'relative',
      paddingTop: '52%',
      overflow: 'hidden',
      flexShrink: 0,
      background: gradient,
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        sx={{
          color: 'rgba(255,255,255,0.2)',
          fontWeight: 800,
          fontSize: '0.7rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          userSelect: 'none',
        }}
      >
        Project Preview
      </Typography>
    </Box>
  </Box>
);

const ProjectCard = ({ project, idx, onDetail }) => (
  <RevealOnScroll
    delay={Math.min(idx % 3, 2) * 0.1}
    y={16}
    sx={{ display: 'flex', flexDirection: 'column' }}
  >
    <Card
      tabIndex={0}
      aria-label={`${project.title} 프로젝트 카드`}
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 12px 32px rgba(0,0,0,0.4)'
            : '0 12px 32px rgba(0,0,0,0.1)',
          borderColor: theme.palette.primary.main,
        },
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: '2px',
        },
      })}
    >
      <GradientThumbnail gradient={project.gradient} title={project.title} />

      <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.25 }}>

        {/* 카테고리 + 제목 */}
        <Box>
          <Typography
            variant="caption"
            sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 0.5 }}
          >
            {project.categoryLabel}
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: 'text.primary', lineHeight: 1.3 }}>
            {project.title}
          </Typography>
        </Box>

        {/* 설명 */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.8rem',
            lineHeight: 1.65,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description}
        </Typography>

        {/* 역할 */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, flexShrink: 0, pt: '1px', fontSize: '0.65rem', letterSpacing: '0.04em' }}>
            ROLE
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5, fontSize: '0.72rem' }}>
            {project.role}
          </Typography>
        </Box>

        {/* 툴 칩 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {project.tools.map((tool) => (
            <Chip
              key={tool}
              label={tool}
              size="small"
              sx={(theme) => ({
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(91,141,184,0.1)' : '#EEF4FB',
                color: 'primary.main',
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(91,141,184,0.18)' : 'rgba(30,58,95,0.16)'}`,
                fontSize: '0.62rem',
                height: 20,
                fontWeight: 600,
              })}
            />
          ))}
        </Box>

        {/* 태그 칩 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {project.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={(theme) => ({
                bgcolor: 'transparent',
                color: 'text.secondary',
                border: `1px solid ${theme.palette.divider}`,
                fontSize: '0.6rem',
                height: 18,
              })}
            />
          ))}
        </Box>

        {/* 버튼 영역 */}
        <Stack direction="row" spacing={1} sx={{ mt: 'auto', pt: 0.5, flexWrap: 'wrap', gap: 0.75 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onDetail(project)}
            aria-label={`${project.title} 상세 정보 보기`}
            sx={(theme) => ({
              fontSize: '0.72rem',
              px: 1.5,
              minHeight: 32,
              color: 'primary.main',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(91,141,184,0.4)' : 'rgba(30,58,95,0.35)',
              fontWeight: 600,
              '&:hover': { borderColor: 'primary.main', bgcolor: theme.palette.mode === 'dark' ? 'rgba(91,141,184,0.06)' : '#EEF4FB' },
            })}
          >
            View Detail
          </Button>

          {project.liveUrl && (
            <Button
              component="a"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="contained"
              endIcon={<OpenInNewIcon sx={{ fontSize: '0.75rem !important' }} />}
              aria-label={`${project.title} 라이브 데모 새 탭에서 열기`}
              sx={{ fontSize: '0.72rem', px: 1.5, minHeight: 32, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, fontWeight: 600 }}
            >
              Live Demo
            </Button>
          )}

          {project.githubUrl && (
            <Button
              component="a"
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="outlined"
              startIcon={<GitHubIcon sx={{ fontSize: '0.85rem !important' }} />}
              aria-label={`${project.title} GitHub 새 탭에서 열기`}
              sx={(theme) => ({
                fontSize: '0.72rem',
                px: 1.5,
                minHeight: 32,
                color: 'text.secondary',
                borderColor: theme.palette.divider,
                '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
              })}
            >
              GitHub
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  </RevealOnScroll>
);

const ProjectsSection = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = activeTab === 'all'
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter((p) => p.categories.includes(activeTab));

  const handleOpenDetail = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleCloseDetail = () => {
    setModalOpen(false);
  };

  return (
    <Box component="section" id="projects" aria-label="프로젝트" sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">

        {/* 섹션 헤더 */}
        <RevealOnScroll>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              sx={{ color: 'text.secondary', letterSpacing: 6, fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1.5 }}
            >
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

        {/* 필터 탭 */}
        <RevealOnScroll delay={0.05}>
          <Box sx={(theme) => ({ mb: 5, borderBottom: `1px solid ${theme.palette.divider}` })}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              TabIndicatorProps={{ style: { height: 2 } }}
              sx={{
                '& .MuiTab-root': {
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  minHeight: 44,
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&.Mui-selected': { color: 'primary.main' },
                },
              }}
            >
              {FILTER_TABS.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
          </Box>
        </RevealOnScroll>

        {/* 프로젝트 카드 그리드 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {filtered.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              idx={idx}
              onDetail={handleOpenDetail}
            />
          ))}
        </Box>

        {filtered.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              해당 카테고리의 프로젝트가 없습니다.
            </Typography>
          </Box>
        )}

      </Container>

      {/* View Detail 모달 */}
      <ProjectDetailModal
        project={selectedProject}
        open={modalOpen}
        onClose={handleCloseDetail}
      />
    </Box>
  );
};

export default ProjectsSection;
