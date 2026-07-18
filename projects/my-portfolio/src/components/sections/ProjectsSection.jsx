import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ALL_PROJECTS } from '../../data/projectsData';
import { FONT_MONO, COLORS } from '../../theme';

/* Figma 04_Selected_Projects(42:71) 원문 카피. 실제 프로젝트 사실(역할/데이터 방식)과
 * 모순되지 않는 범위에서 이 섹션 전용 축약 문구로 쓰고, 전체 사실은 각 프로젝트의
 * 상세 페이지(/projects/:slug)에서 실제 데이터 필드로 그대로 보여준다. */
const FEATURED_BLOCKS = [
  {
    id: 'jobflow',
    slug: 'jobflow',
    title: 'JobFlow',
    description: '취업 준비 과정을 한 화면에서 관리하도록 설계한 React/MUI 기반 대시보드입니다.',
    role: 'UX/UI · React/MUI · 반응형 구현',
    data: '게스트 샘플 데이터 / 로그인 사용자 Supabase 저장',
  },
  {
    id: 'bus-arrival-app',
    slug: 'bus-arrival',
    title: '버스 도착정보 앱 UI',
    description: '도착 예정 정보를 빠르게 확인하는 모바일 UI 프로토타입',
    role: 'Figma Prototype · UI 설계',
    data: '정적 예시 데이터 · 실시간 버스 API 미연동',
  },
  {
    id: 'feedback-hub',
    slug: 'feedback-hub',
    title: 'Portfolio Feedback Hub',
    description: '포트폴리오를 탐색하고 피드백을 주고받는 커뮤니티형 서비스',
    role: 'UX/UI · React/MUI · Supabase',
    data: 'Supabase 조회 · fallback 구분 · RLS는 배포 환경 확인 필요',
  },
];

const findProject = (id) => ALL_PROJECTS.find((p) => p.id === id);

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
  const navigate = useNavigate();

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
        onClick={() => navigate(`/projects/${block.slug}`)}
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
