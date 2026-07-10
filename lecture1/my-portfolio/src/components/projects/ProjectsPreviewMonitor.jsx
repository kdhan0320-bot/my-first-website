import { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import RevealOnScroll from '../ui/RevealOnScroll';
import { ALL_PROJECTS } from '../../data/projectsData';

/* SELECTED PROJECTS PREVIEW — i-AWARD식 "모니터 화면 안에 작품이 보이는" 구조.
 * 왼쪽은 선택된 프로젝트 1개의 상세만 보여주고, 나머지는 컴팩트 탭으로만 노출한다.
 * Home 대표 프로젝트 카드와 동일한 소스/필터를 사용해 데이터 정합성을 유지한다. */
const PREVIEW_PROJECTS = [...ALL_PROJECTS]
  .filter((p) => p.is_featured)
  .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99))
  .slice(0, 3);

const DetailRow = ({ label, children }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mt: 1 }}>
    <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'text.secondary', flexShrink: 0, pt: '1px' }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary', lineHeight: 1.65 }}>
      {children}
    </Typography>
  </Box>
);

const ProjectsPreviewMonitor = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = PREVIEW_PROJECTS[activeIndex];
  const accent = active.accentColor ?? '#38BDF8';

  return (
    <RevealOnScroll>
      <Box
        sx={{
          maxWidth: 980,
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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '0.85fr 1.15fr' },
            gap: { xs: 3, md: 4 },
            alignItems: 'center',
          }}
        >
          {/* 왼쪽: 선택된 프로젝트 1개 상세 + 컴팩트 탭 */}
          <Box>
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
            <Typography sx={{ color: 'text.disabled', fontSize: '0.875rem', mt: 0.25, lineHeight: 1.6, mb: 2 }}>
              대표 프로젝트 3개의 문제와 구현 범위를 미리 살펴보는 영역입니다.
            </Typography>

            {/* 컴팩트 탭 — 프로젝트 선택만 담당, 상세 정보는 아래 한 곳에만 표시 */}
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75, mb: 2.5 }} aria-label="대표 프로젝트 선택">
              {PREVIEW_PROJECTS.map((project, i) => {
                const isActive = i === activeIndex;
                const projectAccent = project.accentColor ?? '#38BDF8';
                return (
                  <Box
                    component="button"
                    type="button"
                    key={project.id}
                    aria-pressed={isActive}
                    onClick={() => setActiveIndex(i)}
                    sx={{
                      minHeight: 44,
                      px: 1.5,
                      cursor: 'pointer',
                      font: 'inherit',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: isActive ? projectAccent : 'text.secondary',
                      borderRadius: 999,
                      border: '1px solid',
                      borderColor: isActive ? `${projectAccent}66` : 'rgba(148,163,184,0.2)',
                      bgcolor: isActive ? `${projectAccent}14` : 'transparent',
                      transition: 'border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease',
                      '&:hover': { borderColor: `${projectAccent}66`, color: projectAccent },
                      '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '2px' },
                    }}
                  >
                    {project.title}
                  </Box>
                );
              })}
            </Stack>

            {/* 선택된 프로젝트 상세 — 유형 / 한 줄 문제 / 구현 범위 / 한계 */}
            <Box key={active.id}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: accent, mb: 0.5 }}>
                {active.categoryLabel}
              </Typography>
              <Typography sx={{ fontSize: '0.9375rem', color: 'text.primary', lineHeight: 1.65 }}>
                {active.cardProblem ?? active.description}
              </Typography>
              {active.cardScope && <DetailRow label="구현 범위">{active.cardScope}</DetailRow>}
              {active.cardLimit && <DetailRow label="한계">{active.cardLimit}</DetailRow>}
            </Box>
          </Box>

          {/* 오른쪽: 큰 모니터 mockup */}
          <Box>
            <Box
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(148,163,184,0.18)',
                bgcolor: 'rgba(15,23,42,0.5)',
                p: 1.25,
              }}
            >
              {/* chrome bar */}
              <Box aria-hidden="true" sx={{ display: 'flex', gap: 0.75, px: 0.5, py: 0.75 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#A7F3D0', opacity: 0.8 }} />
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#94A3B8', opacity: 0.4 }} />
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#94A3B8', opacity: 0.4 }} />
              </Box>

              {/* 화면 — 선택된 프로젝트 썸네일 */}
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 220, sm: 260, md: 300 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  background: `linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0.08)), ${active.gradient || 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)'}`,
                }}
              >
                {active.thumbnailUrl ? (
                  <Box
                    component="img"
                    src={active.thumbnailUrl}
                    alt={`${active.title} 썸네일`}
                    sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', p: 2 }}
                  />
                ) : (
                  <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9375rem' }}>{active.title}</Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* 인디케이터 — 시각적 점은 작지만 실제 hit area는 44x44px 이상 확보 */}
            <Stack direction="row" justifyContent="center" sx={{ mt: 0.5 }}>
              {PREVIEW_PROJECTS.map((project, i) => (
                <Box
                  component="button"
                  type="button"
                  key={project.id}
                  aria-label={`${project.title} 보기`}
                  aria-pressed={i === activeIndex}
                  onClick={() => setActiveIndex(i)}
                  sx={{
                    width: 44,
                    height: 44,
                    p: 0,
                    border: 'none',
                    bgcolor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '-2px', borderRadius: 999 },
                  }}
                >
                  <Box
                    sx={{
                      width: i === activeIndex ? 22 : 8,
                      height: 8,
                      borderRadius: 999,
                      bgcolor: i === activeIndex ? accent : 'rgba(148,163,184,0.3)',
                      transition: 'width 0.25s ease, background-color 0.25s ease',
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    </RevealOnScroll>
  );
};

export default ProjectsPreviewMonitor;
