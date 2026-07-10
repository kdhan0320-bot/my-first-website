import { Box, Typography, Stack } from '@mui/material';
import useInViewOnce from '../../hooks/useInViewOnce';
import { scrollToSection } from '../../hooks/useScrollNav';
import { ALL_PROJECTS } from '../../data/projectsData';

/* Portfolio Preview Monitor — Projects 섹션과 동일한 대표 프로젝트 소스를 재사용해 정합성 유지 */
const PREVIEW_PROJECTS = [...ALL_PROJECTS]
  .filter((p) => p.is_featured)
  .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99))
  .slice(0, 3);

const WORKFLOW_STEPS = ['Figma', 'React/MUI', 'Responsive QA', 'AI Assist'];

const FlowCanvasIllustration = () => {
  const [ref, isVisible] = useInViewOnce(0.3);

  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        maxWidth: { xs: 340, sm: 420, md: 700 },
        mx: 'auto',
        p: { xs: 2.5, sm: 3, md: 3.5 },
        borderRadius: 4,
        border: '1px solid rgba(56,189,248,0.16)',
        background: 'linear-gradient(180deg, rgba(19,28,46,0.6) 0%, rgba(11,16,32,0.42) 100%)',
        backdropFilter: 'blur(18px)',
        boxShadow: '0 24px 60px rgba(2,6,23,0.35)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.96)',
        transition: 'opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
        /* Hero 한정 ambient motion — 느리고 약함, prefers-reduced-motion에서는 HeroSection 루트 규칙으로 제거됨 */
        '@keyframes workflowHighlightSweep': {
          '0%':   { left: '-12%' },
          '100%': { left: '104%' },
        },
        '@keyframes stripBorderShimmer': {
          '0%, 100%': { borderTopColor: 'rgba(148,163,184,0.14)' },
          '50%':      { borderTopColor: 'rgba(56,189,248,0.34)' },
        },
      }}
    >
      {/* 모니터 chrome bar — 완료된 화면 은유 */}
      <Box aria-hidden="true" sx={{ display: 'flex', gap: 0.75, mb: 2 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#A7F3D0', opacity: 0.8 }} />
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#94A3B8', opacity: 0.4 }} />
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#94A3B8', opacity: 0.4 }} />
      </Box>

      <Box sx={{ mb: 2, textAlign: { xs: 'center', md: 'left' } }}>
        <Typography
          sx={{
            color: 'text.disabled',
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          Portfolio Preview
        </Typography>
        <Typography
          sx={{
            color: 'text.disabled',
            fontSize: '0.875rem',
            mt: 0.25,
          }}
        >
          대표 프로젝트 미리보기
        </Typography>
      </Box>

      {/* 대표 프로젝트 3개 미니 카드 — 실제 작업물, 순차 등장 */}
      <Stack component="ul" sx={{ listStyle: 'none', p: 0, m: 0, gap: 1.25, display: 'flex', flexDirection: 'column' }}>
        {PREVIEW_PROJECTS.map((project, i) => {
          const accent = project.accentColor ?? '#38BDF8';
          const delay = 0.15 + i * 0.15;
          return (
            <Box
              component="li"
              key={project.id}
              sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                transition: `opacity 0.5s ease ${delay}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
              }}
            >
              <Box
                component="button"
                type="button"
                onClick={() => scrollToSection('projects')}
                aria-label={`${project.title} 프로젝트로 이동`}
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  p: 1.5,
                  bgcolor: 'rgba(15,23,42,0.4)',
                  border: '1px solid rgba(148,163,184,0.16)',
                  borderLeft: `2px solid ${accent}`,
                  borderRadius: 2,
                  textAlign: 'left',
                  cursor: 'pointer',
                  font: 'inherit',
                  color: 'inherit',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
                  '&:hover': {
                    transform: 'translateX(2px)',
                    borderColor: `${accent}80`,
                    bgcolor: 'rgba(15,23,42,0.6)',
                  },
                  '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '2px' },
                }}
              >
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary' }}>
                    {project.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: accent, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {project.categoryLabel}
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    color: 'text.secondary',
                    lineHeight: 1.55,
                    display: '-webkit-box',
                    WebkitLineClamp: { xs: 1, md: 2 },
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {project.description}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Stack>

      {/* workflow 라벨 스트립 — AI Assist는 마지막 보조 라벨, highlight가 14~18초 주기로 천천히 이동 */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          mt: 2.5,
          pt: 2,
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'rgba(148,163,184,0.14)',
          animation: isVisible ? 'stripBorderShimmer 12s ease-in-out infinite' : 'none',
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            display: isVisible ? 'block' : 'none',
            position: 'absolute',
            top: 0,
            width: '16%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(186,230,253,0.9), transparent)',
            animation: 'workflowHighlightSweep 16s linear infinite',
          }}
        />
        <Stack
          direction="row"
          alignItems="center"
          sx={{ flexWrap: 'wrap', rowGap: 0.75, columnGap: 0.75, justifyContent: { xs: 'center', md: 'flex-start' } }}
        >
          {WORKFLOW_STEPS.map((label, i) => {
            const isLast = i === WORKFLOW_STEPS.length - 1;
            return (
              <Box key={label} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    color: isLast ? 'text.disabled' : 'text.secondary',
                    opacity: isLast ? 0.75 : 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </Typography>
                {!isLast && (
                  <Typography aria-hidden="true" sx={{ fontSize: '0.875rem', color: 'text.disabled', opacity: 0.6 }}>
                    →
                  </Typography>
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
};

export default FlowCanvasIllustration;
