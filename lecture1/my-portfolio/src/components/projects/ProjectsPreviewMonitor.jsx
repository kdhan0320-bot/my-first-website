import { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import RevealOnScroll from '../ui/RevealOnScroll';
import { ALL_PROJECTS } from '../../data/projectsData';

/* SELECTED PROJECTS PREVIEW — i-AWARD식 "모니터 화면 안에 작품이 보이는" 구조.
 * 왼쪽 탭에서 프로젝트를 고르면 오른쪽 모니터의 썸네일과 설명이 함께 바뀐다.
 * Home 대표 프로젝트 카드와 동일한 소스/필터를 사용해 데이터 정합성을 유지한다. */
const PREVIEW_PROJECTS = [...ALL_PROJECTS]
  .filter((p) => p.is_featured)
  .sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99))
  .slice(0, 3);

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
          {/* 왼쪽: 설명 + 탭 */}
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
            <Typography sx={{ color: 'text.disabled', fontSize: '0.875rem', mt: 0.25, lineHeight: 1.6, mb: 2.5 }}>
              대표 프로젝트 3개의 문제와 구현 범위를 미리 살펴보는 영역입니다.
            </Typography>

            {/* 프로젝트 탭 */}
            <Stack
              component="div"
              aria-label="대표 프로젝트 선택"
              sx={{ gap: 1, mb: 2.5 }}
            >
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
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.25,
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      font: 'inherit',
                      color: 'inherit',
                      p: 1.25,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: isActive ? `${projectAccent}59` : 'rgba(148,163,184,0.14)',
                      borderLeft: `2px solid ${isActive ? projectAccent : 'rgba(148,163,184,0.2)'}`,
                      bgcolor: isActive ? 'rgba(15,23,42,0.55)' : 'transparent',
                      transition: 'border-color 0.2s ease, background-color 0.2s ease',
                      '&:hover': { bgcolor: 'rgba(15,23,42,0.45)' },
                      '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '2px' },
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary' }}>
                      {project.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: projectAccent }}>
                      {project.categoryLabel}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>

            {/* 선택된 프로젝트 요약 */}
            <Box key={active.id}>
              <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary', lineHeight: 1.7 }}>
                {active.description}
              </Typography>
              {active.cardLimit && (
                <Typography sx={{ fontSize: '0.875rem', color: 'text.disabled', lineHeight: 1.6, mt: 1 }}>
                  <Box component="span" sx={{ color: 'text.secondary', fontWeight: 700 }}>한계</Box>
                  {' '}{active.cardLimit}
                </Typography>
              )}
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

            {/* 인디케이터 — 왼쪽 탭과 동일 상태 공유 */}
            <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 1.75 }}>
              {PREVIEW_PROJECTS.map((project, i) => (
                <Box
                  component="button"
                  type="button"
                  key={project.id}
                  aria-label={`${project.title} 보기`}
                  aria-pressed={i === activeIndex}
                  onClick={() => setActiveIndex(i)}
                  sx={{
                    width: i === activeIndex ? 22 : 8,
                    height: 8,
                    p: 0,
                    border: 'none',
                    borderRadius: 999,
                    bgcolor: i === activeIndex ? accent : 'rgba(148,163,184,0.3)',
                    cursor: 'pointer',
                    transition: 'width 0.25s ease, background-color 0.25s ease',
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '2px' },
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    </RevealOnScroll>
  );
};

export default ProjectsPreviewMonitor;
