import { Box, Container, Typography, Stack } from '@mui/material';
import { scrollToSection } from '../../hooks/useScrollNav';
import {
  HERO_LABEL, HERO_ROLE_LINE, HERO_HEADLINE_LINES, HERO_DESCRIPTION,
} from '../../data/portfolioMeta';
import { FONT_MONO } from '../../theme';

/* review 캡처 모드(tools/site-audit-kit의 리뷰 스크립트가 page.addInitScript로
 * 페이지 로드 전에 심어두는 표시)에서는 Hero 텍스트의 진입 애니메이션을 아예
 * 건너뛰고 최종 상태(opacity:1)로 렌더링한다. 일반 사용자는 영향 없음.
 * 모듈 로드 시점에 한 번만 읽는다 — addInitScript가 React 마운트보다 먼저 실행되므로
 * 이 값은 항상 정확하다. */
const isReviewCapture =
  typeof document !== 'undefined' && document.documentElement.getAttribute('data-review-mode') === 'true';

/* Figma Hero Motion States(19:277 Scattered → 19:288 Align → 19:296 Final)를
 * 기준으로 한 1회 진입 모션. 헤드라인 각 줄이 흩어진 위치(Scattered)에서 정렬
 * (Align)되고, Signal Panel 각 행이 순서대로 정렬되며 마지막에 CTA가 나타나
 * 완료(Final) 상태가 된다. 전체 약 1.7초, 반복 없음. */
const SIGNAL_ROWS = [
  { label: 'USER FLOW' },
  { label: 'INFORMATION' },
  { label: 'RESPONSIVE' },
  { label: 'BUILD', accent: true },
];

/* 헤드라인 줄마다 살짝 다른 시작 오프셋 — Scattered 상태를 흉내내되 큰 타이포가
 * 컨테이너 밖으로 밀리지 않을 만큼만 작게 둔다("텍스트를 읽을 수 없는 과도한
 * 변형 금지"). 모바일에서는 이동 거리를 더 줄인다. */
const LINE_OFFSETS_DESKTOP = [0, 22, -14, 16];
const LINE_OFFSETS_MOBILE = [0, 10, -6, 8];

const HeroSection = () => {
  return (
    <Box
      component="section"
      id="home"
      aria-label="소개"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: 'calc(100vh - 80px)' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: { xs: 6, md: 6 },
        bgcolor: 'background.default',
        '@keyframes heroLineIn': {
          '0%':  { opacity: 0, transform: 'translateX(var(--scatter-x, 0px))' },
          '60%': { opacity: 1, transform: 'translateX(0)' },
          '100%':{ opacity: 1, transform: 'translateX(0)' },
        },
        '@keyframes heroFadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes heroRowIn': {
          from: { opacity: 0, transform: 'translateY(6px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes heroLineScaleIn': {
          from: { transform: 'scaleX(0)' },
          to:   { transform: 'scaleX(1)' },
        },
        '@keyframes heroCtaIn': {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        '@media (prefers-reduced-motion: reduce)': {
          '& *': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
        },
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 3, sm: 6, md: 8 }, position: 'relative', zIndex: 1 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 6, md: 8 }}
          sx={{ alignItems: { xs: 'stretch', md: 'flex-start' }, justifyContent: 'space-between' }}
        >
          {/* Hero_Copy */}
          <Box sx={{ maxWidth: { xs: '100%', md: 700 }, minWidth: 0 }}>
            <Typography
              data-hero-reveal="true"
              sx={{
                fontFamily: FONT_MONO,
                color: 'primary.main',
                fontSize: '0.75rem',
                letterSpacing: '0.04em',
                mb: 1.5,
                opacity: isReviewCapture ? 1 : 0,
                animation: isReviewCapture ? 'none' : 'heroFadeIn 0.5s ease 0s both',
              }}
            >
              {HERO_LABEL}
            </Typography>

            <Typography
              data-hero-reveal="true"
              sx={{
                fontFamily: FONT_MONO,
                color: 'text.secondary',
                fontSize: '0.75rem',
                letterSpacing: '0.02em',
                mb: { xs: 3, md: 4 },
                opacity: isReviewCapture ? 1 : 0,
                animation: isReviewCapture ? 'none' : 'heroFadeIn 0.5s ease 0.08s both',
              }}
            >
              {HERO_ROLE_LINE}
            </Typography>

            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.1rem', sm: '2.6rem', md: '3.4rem', lg: '3.9rem' },
                lineHeight: { xs: 1.28, md: 1.18 },
                letterSpacing: '-0.01em',
                color: 'text.primary',
                mb: { xs: 2.5, md: 3 },
              }}
            >
              {HERO_HEADLINE_LINES.map((line, i) => (
                <Box
                  key={line}
                  component="span"
                  data-hero-reveal="true"
                  sx={{
                    display: 'block',
                    '--scatter-x': { xs: `${LINE_OFFSETS_MOBILE[i] ?? 0}px`, md: `${LINE_OFFSETS_DESKTOP[i] ?? 0}px` },
                    opacity: isReviewCapture ? 1 : 0,
                    animation: isReviewCapture ? 'none' : `heroLineIn 0.6s cubic-bezier(0.22,1,0.36,1) ${0.05 + i * 0.07}s both`,
                  }}
                >
                  {line}
                </Box>
              ))}
            </Typography>

            <Typography
              data-hero-reveal="true"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.75,
                maxWidth: 560,
                mb: { xs: 4, md: 5 },
                fontSize: { xs: '0.9rem', md: '1rem' },
                opacity: isReviewCapture ? 1 : 0,
                animation: isReviewCapture ? 'none' : 'heroFadeIn 0.5s ease 0.5s both',
              }}
            >
              {HERO_DESCRIPTION}
            </Typography>

            <Box
              component="button"
              type="button"
              data-hero-reveal="true"
              onClick={() => scrollToSection('projects')}
              aria-label="대표 프로젝트 섹션으로 이동"
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                border: 0,
                cursor: 'pointer',
                height: 52,
                minWidth: 210,
                px: 2.5,
                borderRadius: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                fontWeight: 600,
                fontSize: '0.9375rem',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                opacity: isReviewCapture ? 1 : 0,
                animation: isReviewCapture ? 'none' : 'heroCtaIn 0.55s ease 1.15s both',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 26px rgba(255,107,61,0.35)' },
                '&:active': { transform: 'translateY(0)' },
                '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
              }}
            >
              대표 프로젝트 보기
              <Box component="span" aria-hidden="true" sx={{ fontFamily: FONT_MONO, fontSize: '1.1rem' }}>↓</Box>
            </Box>
          </Box>

          {/* Signal_Panel */}
          <Box
            component="ul"
            aria-hidden="true"
            sx={{
              listStyle: 'none', m: 0, p: 0,
              display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 2.5 },
              width: { xs: '100%', md: 320 },
              flexShrink: 0,
            }}
          >
            {SIGNAL_ROWS.map((row, i) => (
              <Box
                component="li"
                key={row.label}
                data-hero-reveal="true"
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  opacity: isReviewCapture ? 1 : 0,
                  animation: isReviewCapture ? 'none' : `heroRowIn 0.45s ease ${0.55 + i * 0.13}s both`,
                }}
              >
                <Box sx={{
                  width: 10, height: 10, borderRadius: '2px', flexShrink: 0,
                  bgcolor: row.accent ? 'primary.main' : 'rgba(184,193,203,0.35)',
                }} />
                <Typography sx={{ fontFamily: FONT_MONO, fontSize: { xs: '0.75rem', md: '0.6875rem' }, color: row.accent ? 'primary.main' : 'text.secondary', whiteSpace: 'nowrap' }}>
                  {row.label}
                </Typography>
                <Box sx={{
                  flex: 1, height: '1px', transformOrigin: 'left center',
                  bgcolor: row.accent ? 'primary.main' : 'rgba(184,193,203,0.35)',
                  animation: isReviewCapture ? 'none' : `heroLineScaleIn 0.45s ease ${0.55 + i * 0.13}s both`,
                }} />
              </Box>
            ))}
          </Box>
        </Stack>

        {/* Hero_Footer — 개발/QA 설명 문구("1회 정렬 모션 · 반복 없음 · reduced-motion
            대응")는 공개 화면에서 제거하고 SCROLL 표시만 남긴다. 모션 자체(코드/훅)는
            그대로 유지한다. */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: { xs: 5, md: 7 },
            fontFamily: FONT_MONO,
            fontSize: '0.6875rem',
            color: 'text.secondary',
          }}
        >
          <Typography component="span" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>
            SCROLL / 01—05
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
