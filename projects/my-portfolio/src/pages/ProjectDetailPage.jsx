import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Box, Container, Typography, Chip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import { ALL_PROJECTS } from '../data/projectsData';
import EvidenceBadges from '../components/projects/EvidenceBadges';
import { FONT_MONO, COLORS } from '../theme';

/* 대표 프로젝트 3개만 고유 상세 URL을 갖는다(작업 지시서 확정 경로). 나머지 archive
 * 프로젝트는 여전히 /projects의 모달로 본다 — 이 페이지는 이 3개 전용이다. */
const SLUG_TO_ID = {
  jobflow: 'jobflow',
  'bus-arrival': 'bus-arrival-app',
  'feedback-hub': 'feedback-hub',
};

const Section = ({ label, children }) => (
  <Box sx={{ mb: { xs: 4, md: 5 } }}>
    <Typography sx={{ fontFamily: FONT_MONO, color: 'primary.main', fontSize: '0.75rem', letterSpacing: '0.04em', mb: 1.25 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

const Prose = ({ children }) => (
  <Typography sx={{ color: 'text.secondary', fontSize: '0.9375rem', lineHeight: 1.8 }}>{children}</Typography>
);

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const id = SLUG_TO_ID[slug];
  const project = id ? ALL_PROJECTS.find((p) => p.id === id) : null;

  // 존재하지 않는 slug나 데이터가 없는 프로젝트는 가짜 페이지를 만들지 않고
  // 전체 프로젝트 목록으로 안전하게 돌려보낸다.
  if (!project) return <Navigate to="/projects" replace />;

  const { detail, role, tools = [], thumbnailUrl, gradient, liveUrl, githubUrl, figmaPrototypeUrl } = project;

  return (
    <Box component="main" sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ px: { xs: 3, sm: 6, md: 8 }, py: { xs: 6, md: 10 } }}>
        {/* 1. 이전 목록으로 이동 */}
        <Box
          component="button"
          type="button"
          onClick={() => navigate('/projects')}
          aria-label="전체 프로젝트 목록으로 이동"
          sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.75, mb: { xs: 4, md: 5 },
            bgcolor: 'transparent', border: 0, cursor: 'pointer', p: 0, minHeight: 44,
            fontFamily: FONT_MONO, fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600,
            '&:hover': { color: 'primary.main' },
            '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
          }}
        >
          ← 전체 프로젝트
        </Box>

        {/* 2. 제목 + 한 줄 설명 */}
        <Typography component="h1" sx={{ fontWeight: 700, fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.2, color: 'text.primary', mb: 1.5 }}>
          {project.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.7, mb: { xs: 4, md: 5 }, maxWidth: 640 }}>
          {project.description}
        </Typography>

        {/* 3. 역할·도구 등 메타데이터 */}
        <Section label="ROLE & TOOLS">
          <Prose>{role}</Prose>
          {tools.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.25 }}>
              {tools.map((t) => (
                <Chip key={t} label={t} size="small"
                  sx={{ bgcolor: 'rgba(255,107,61,0.08)', color: 'primary.main', border: '1px solid rgba(255,107,61,0.2)', fontWeight: 600, fontSize: '0.875rem' }} />
              ))}
            </Box>
          )}
        </Section>

        <EvidenceBadges project={project} />

        {/* 4. 실제 대표 화면 */}
        {thumbnailUrl && (
          <Box sx={{ mb: { xs: 4, md: 5 }, borderRadius: '14px', overflow: 'hidden', border: '1px solid #33404D' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: 38, px: 1.75, bgcolor: COLORS.warmIvory }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '4px', bgcolor: '#FF7A52' }} />
              <Box sx={{ width: 7, height: 7, borderRadius: '4px', bgcolor: '#F1B95A' }} />
              <Box sx={{ width: 7, height: 7, borderRadius: '4px', bgcolor: '#7ACB8A' }} />
            </Box>
            <Box sx={{ position: 'relative', height: { xs: 220, sm: 320, md: 420 }, background: gradient ?? COLORS.deepSlate }}>
              <Box component="img" src={thumbnailUrl} alt={`${project.title} 대표 화면`} loading="lazy"
                sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', p: 2 }} />
            </Box>
          </Box>
        )}

        {/* 5. 해결하려던 문제 */}
        {detail.problem && detail.problem !== '—' && (
          <Section label="PROBLEM">
            <Prose>{detail.problem}</Prose>
            {detail.goal && detail.goal !== '—' && (
              <Typography sx={{ color: 'text.secondary', fontSize: '0.9375rem', lineHeight: 1.8, mt: 1 }}>{detail.goal}</Typography>
            )}
          </Section>
        )}

        {/* 6. 사용자가 담당한 범위 (role 문장은 위 메타데이터에서 이미 노출했으므로 중복 표시하지 않는다) */}

        {/* 7. 주요 화면 또는 구현 내용 */}
        {detail.designPoint && detail.designPoint !== '—' && (
          <Section label="DESIGN & IMPLEMENTATION">
            <Prose>{detail.designPoint}</Prose>
            {detail.process && detail.process !== '—' && (
              <Typography sx={{ color: 'text.secondary', fontSize: '0.9375rem', lineHeight: 1.8, mt: 1 }}>{detail.process}</Typography>
            )}
          </Section>
        )}

        {/* 8. 실제 데이터와 기능 범위 */}
        {project.dataUsage && (
          <Section label="DATA & SCOPE">
            <Prose>{project.dataUsage}</Prose>
          </Section>
        )}

        {/* 9. AI 보조 활용 — 프로젝트 소개보다 뒤에서, 사용자 주도 방식으로만 표현 */}
        {detail.aiContribution && (
          <Section label="AI ASSISTANCE">
            <Prose>{detail.aiContribution}</Prose>
          </Section>
        )}

        {/* 10. 한계와 다음 개선 항목 */}
        {(detail.limitation || detail.nextStep) && (
          <Section label="LIMITATIONS & NEXT STEPS">
            {detail.limitation && <Prose>{detail.limitation}</Prose>}
            {detail.nextStep && (
              <Typography sx={{ color: 'text.secondary', fontSize: '0.9375rem', lineHeight: 1.8, mt: detail.limitation ? 1 : 0 }}>{detail.nextStep}</Typography>
            )}
          </Section>
        )}

        {/* 11. 실제 존재하는 링크 */}
        {(liveUrl || githubUrl || figmaPrototypeUrl) && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: { xs: 5, md: 6 } }}>
            {liveUrl && (
              <Box component="a" href={liveUrl} target="_blank" rel="noopener noreferrer"
                aria-label="실행 화면 새 탭에서 열기"
                sx={{
                  bgcolor: 'primary.main', color: 'primary.contrastText', height: 48, px: 2.5, borderRadius: '10px',
                  display: 'inline-flex', alignItems: 'center', gap: 1, textDecoration: 'none',
                  fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap',
                  '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
                }}
              >
                실행 화면 보기 <OpenInNewIcon sx={{ fontSize: '1rem' }} />
              </Box>
            )}
            {figmaPrototypeUrl && (
              <Box component="a" href={figmaPrototypeUrl} target="_blank" rel="noopener noreferrer"
                aria-label="Figma 프로토타입 새 탭에서 열기"
                sx={{
                  bgcolor: 'primary.main', color: 'primary.contrastText', height: 48, px: 2.5, borderRadius: '10px',
                  display: 'inline-flex', alignItems: 'center', gap: 1, textDecoration: 'none',
                  fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap',
                  '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
                }}
              >
                프로토타입 보기 <OpenInNewIcon sx={{ fontSize: '1rem' }} />
              </Box>
            )}
            {githubUrl && (
              <Box component="a" href={githubUrl} target="_blank" rel="noopener noreferrer"
                aria-label="GitHub 새 탭에서 열기"
                sx={{
                  bgcolor: 'background.default', color: 'text.primary', border: '1px solid #33404D', height: 48, px: 2.5, borderRadius: '10px',
                  display: 'inline-flex', alignItems: 'center', gap: 1, textDecoration: 'none',
                  fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap',
                  '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                  '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
                }}
              >
                <GitHubIcon sx={{ fontSize: '1rem' }} /> GitHub
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ProjectDetailPage;
