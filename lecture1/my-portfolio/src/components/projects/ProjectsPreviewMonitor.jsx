import { Box, Typography, Stack } from '@mui/material';
import RevealOnScroll from '../ui/RevealOnScroll';
import { ALL_PROJECTS } from '../../data/projectsData';

/* SELECTED PROJECTS PREVIEW — i-AWARD식 "모니터 안에 작품 리스트" 구조.
 * Home 대표 프로젝트 카드와 동일한 소스/필터를 사용해 데이터 정합성을 유지한다. */
const PREVIEW_PROJECTS = [...ALL_PROJECTS]
  .filter((p) => p.is_featured)
  .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99))
  .slice(0, 3);

const WORKFLOW_STEPS = ['Figma', 'React/MUI', 'Responsive QA', 'AI Assist'];

const ProjectsPreviewMonitor = () => (
  <RevealOnScroll>
    <Box
      sx={{
        maxWidth: 860,
        mx: 'auto',
        mb: { xs: 4, md: 6 },
        p: { xs: 2.5, sm: 3, md: 3.5 },
        borderRadius: 4,
        border: '1px solid rgba(56,189,248,0.16)',
        background: 'linear-gradient(180deg, rgba(19,28,46,0.6) 0%, rgba(11,16,32,0.42) 100%)',
        backdropFilter: 'blur(18px)',
        boxShadow: '0 24px 60px rgba(2,6,23,0.35)',
      }}
    >
      {/* 모니터 chrome bar — 완료된 화면 은유 */}
      <Box aria-hidden="true" sx={{ display: 'flex', gap: 0.75, mb: 2 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#A7F3D0', opacity: 0.8 }} />
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#94A3B8', opacity: 0.4 }} />
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#94A3B8', opacity: 0.4 }} />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography
          sx={{
            color: 'text.disabled',
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          Selected Projects Preview
        </Typography>
        <Typography sx={{ color: 'text.disabled', fontSize: '0.875rem', mt: 0.25, lineHeight: 1.6 }}>
          대표 프로젝트 3개의 문제, 구현 범위, 한계를 요약한 미리보기입니다.
        </Typography>
      </Box>

      {/* 대표 프로젝트 3개 미니 카드 */}
      <Box
        component="ul"
        sx={{
          listStyle: 'none',
          p: 0,
          m: 0,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 1.25,
        }}
      >
        {PREVIEW_PROJECTS.map((project) => {
          const accent = project.accentColor ?? '#38BDF8';
          return (
            <Box
              component="li"
              key={project.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                p: 1.5,
                bgcolor: 'rgba(15,23,42,0.4)',
                border: '1px solid rgba(148,163,184,0.16)',
                borderLeft: `2px solid ${accent}`,
                borderRadius: 2,
              }}
            >
              <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary' }}>
                  {project.title}
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: accent }}>
                {project.categoryLabel}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  lineHeight: 1.65,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {project.description}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* workflow 라벨 스트립 — AI Assist는 마지막 보조 라벨. Hero와 달리 무한 반복 모션 없음 */}
      <Box
        sx={{
          mt: 2.5,
          pt: 2,
          borderTop: '1px solid rgba(148,163,184,0.14)',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          sx={{ flexWrap: 'wrap', rowGap: 0.75, columnGap: 0.75 }}
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
  </RevealOnScroll>
);

export default ProjectsPreviewMonitor;
