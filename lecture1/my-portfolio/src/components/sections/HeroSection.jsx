import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Chip, Grid, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailIcon from '@mui/icons-material/Email';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { usePortfolio } from '../../context/PortfolioContext';
import { supabase } from '../../lib/supabase';
import useInViewOnce from '../../hooks/useInViewOnce';
import useCountUp from '../../hooks/useCountUp';
import { scrollToSection } from '../../hooks/useScrollNav';

const WORKFLOW = [
  { label: 'Research', sub: 'UX 분석'    },
  { label: 'Design',   sub: 'Figma'      },
  { label: 'Build',    sub: 'AI Coding'  },
  { label: 'Review',   sub: '개선 반영'   },
];

const SKILL_CHIPS = ['UX/UI', 'Figma', 'Web Design', 'AI-assisted Coding', 'Responsive Web'];

const PortfolioStats = () => {
  const { aboutMeData } = usePortfolio();
  const [projectCount, setProjectCount] = useState(null);
  const [statsRef, isVisible] = useInViewOnce(0.1);

  useEffect(() => {
    supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', true)
      .then(({ count }) => setProjectCount(count ?? 0));
  }, []);

  const skillCount  = aboutMeData?.skills?.length ?? 0;
  const loaded      = projectCount !== null;
  const studyMonths = Math.floor(
    (Date.now() - new Date('2024-12-01').getTime()) / (1000 * 60 * 60 * 24 * 30.44),
  );

  const projectNum = useCountUp(projectCount ?? 0, 1000, isVisible && loaded);
  const skillNum   = useCountUp(skillCount,        1000, isVisible);
  const studyNum   = useCountUp(studyMonths,         800, isVisible);

  const stats = [
    { label: '진행 프로젝트', value: loaded ? projectNum : '—', suffix: loaded ? '개' : '' },
    { label: '활용 기술',     value: skillNum,                  suffix: '개'               },
    { label: '학습 기간',     value: studyNum,                  suffix: '개월+'             },
  ];

  return (
    <Box
      ref={statsRef}
      sx={(theme) => ({
        display: 'flex',
        gap: { xs: 3, sm: 4 },
        mt: 3,
        pt: 2.5,
        borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.12)' : 'rgba(30,155,215,0.12)'}`,
        justifyContent: { xs: 'center', md: 'flex-start' },
      })}
    >
      {stats.map(({ label, value, suffix }) => (
        <Box key={label} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography
            component="p"
            sx={{
              color: 'primary.main',
              fontWeight: 800,
              fontSize: { xs: '1.4rem', md: '1.625rem' },
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {value}{suffix}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 500, mt: 0.5, display: 'block', fontSize: '0.7rem' }}
          >
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const HeroSection = () => {
  return (
    <Box
      component="section"
      id="home"
      aria-label="소개"
      sx={(theme) => ({
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0F172A 0%, #0D1E2E 60%, #111827 100%)'
          : 'linear-gradient(135deg, #F6F8FB 0%, #EEF7FC 60%, #FFFFFF 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: '82vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: { xs: 7, sm: 9, md: 5 },

        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, rgba(56,189,248,0.05) 1.5px, transparent 1.5px)'
            : 'radial-gradient(circle, rgba(21,120,170,0.07) 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          zIndex: 0,
          pointerEvents: 'none',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-15%',
          right: '-8%',
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(21,120,170,0.11) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        },

        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to:   { opacity: 1, transform: 'translateY(0)'    },
        },
        '@keyframes bounceDown': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(7px)' },
        },

        '@media (prefers-reduced-motion: reduce)': {
          '& *': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
        },
      })}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Grid container spacing={{ xs: 4, md: 8 }} sx={{ alignItems: 'center' }}>

          {/* 왼쪽: 텍스트 영역 */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                animation: 'fadeInUp 0.6s ease both',
              }}
            >
              {/* 상단 레이블 */}
              <Chip
                label="Web Design · UX/UI · AI-assisted Coding"
                sx={(theme) => ({
                  bgcolor: theme.palette.mode === 'dark'
                    ? 'rgba(56,189,248,0.1)'
                    : 'rgba(21,120,170,0.08)',
                  color: 'primary.main',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(56,189,248,0.2)'
                    : 'rgba(21,120,170,0.2)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  mb: { xs: 2, md: 3 },
                  height: 28,
                })}
              />

              {/* 이름 */}
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.25rem', lg: '3.75rem' },
                  lineHeight: { xs: 1.2, md: 1.15 },
                  letterSpacing: '-0.03em',
                  mb: 0.5,
                }}
              >
                <Box
                  component="span"
                  sx={(theme) => ({
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  })}
                >
                  Dohan Kim
                </Box>
                <Box
                  component="span"
                  sx={{ color: 'text.secondary', fontSize: '0.5em', fontWeight: 600, ml: 1.5, WebkitTextFillColor: 'unset' }}
                >
                  / 김도한
                </Box>
              </Typography>

              {/* 직무 */}
              <Typography
                variant="h4"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  mb: { xs: 2.5, md: 3 },
                  letterSpacing: '0.01em',
                }}
              >
                Web Designer &amp; UX/UI Designer
              </Typography>

              {/* 메인 설명 */}
              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                  lineHeight: 1.8,
                  maxWidth: { xs: '100%', md: 480 },
                  mx: { xs: 'auto', md: 0 },
                  mb: 1.5,
                }}
              >
                사용자의 흐름을 이해하고, 복잡한 정보를 명확한 화면으로 정리하는 웹/UX 디자이너입니다.
              </Typography>

              {/* 보조 설명 */}
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  maxWidth: { xs: '100%', md: 480 },
                  mx: { xs: 'auto', md: 0 },
                  mb: { xs: 3.5, md: 4.5 },
                }}
              >
                Figma 기반의 UX/UI 설계와 AI-assisted web coding을 활용해 기획, 디자인, 구현까지 연결되는 실무형 결과물을 만듭니다.
              </Typography>

              {/* CTA 버튼 */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                sx={{ mb: 3 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => scrollToSection('projects')}
                  aria-label="프로젝트 섹션으로 이동"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 3.5,
                    minHeight: 48,
                    fontWeight: 700,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(21,120,170,0.28)',
                    },
                    '&:active': { transform: 'translateY(0)', boxShadow: '0 4px 12px rgba(21,120,170,0.18)' },
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
                  }}
                >
                  View Projects
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<EmailIcon />}
                  onClick={() => scrollToSection('contact')}
                  aria-label="연락처 섹션으로 이동"
                  sx={(theme) => ({
                    color: 'primary.main',
                    borderColor: theme.palette.mode === 'dark'
                      ? 'rgba(56,189,248,0.4)'
                      : 'rgba(21,120,170,0.4)',
                    px: 3.5,
                    minHeight: 48,
                    fontWeight: 600,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.06)' : 'rgba(21,120,170,0.05)',
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(21,120,170,0.1)',
                    },
                    '&:active': { transform: 'translateY(0)', boxShadow: 'none' },
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
                  })}
                >
                  Contact Me
                </Button>
              </Stack>

              <PortfolioStats />
            </Box>
          </Grid>

          {/* 오른쪽: 시각 요소 */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              aria-hidden="true"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                animation: 'fadeInUp 0.6s ease 0.15s both',
              }}
            >
              {/* 작업 흐름 카드 */}
              <Box
                sx={(theme) => ({
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(17,24,39,0.85)' : 'rgba(255,255,255,0.85)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.12)' : 'rgba(30,155,215,0.12)'}`,
                  borderRadius: 3,
                  p: 3,
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 4px 20px rgba(0,0,0,0.3)'
                    : '0 4px 20px rgba(21,120,170,0.08)',
                  backdropFilter: 'blur(8px)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 12px 32px rgba(0,0,0,0.4)'
                      : '0 12px 32px rgba(21,120,170,0.14)',
                  },
                })}
              >
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', display: 'block', mb: 2.5 }}
                >
                  Design Process
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                  {WORKFLOW.flatMap((s, i) => [
                    <Box key={s.label} sx={{ flex: 1, textAlign: 'center' }}>
                      <Box
                        sx={(theme) => ({
                          width: 44, height: 44, borderRadius: 2, mx: 'auto', mb: 0.75,
                          bgcolor: i === 1
                            ? (theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.12)' : 'rgba(21,120,170,0.1)')
                            : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#F6F8FB'),
                          border: i === 1
                            ? `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.28)' : 'rgba(21,120,170,0.28)'}`
                            : `1px solid ${theme.palette.divider}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        })}
                      >
                        <Typography sx={{ color: i === 1 ? 'primary.main' : 'text.primary', fontWeight: 700, fontSize: '0.65rem' }}>
                          {s.label}
                        </Typography>
                      </Box>
                      <Typography sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>{s.sub}</Typography>
                    </Box>,
                    i < WORKFLOW.length - 1 ? (
                      <Typography key={`arr-${i}`} sx={{ color: 'text.disabled', fontSize: '0.75rem', flexShrink: 0, mt: '13px' }}>
                        →
                      </Typography>
                    ) : null,
                  ]).filter(Boolean)}
                </Box>
              </Box>

              {/* 핵심 역량 카드 */}
              <Box
                sx={(theme) => ({
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(17,24,39,0.85)' : 'rgba(255,255,255,0.85)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.12)' : 'rgba(30,155,215,0.12)'}`,
                  borderRadius: 3,
                  p: 2.5,
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 4px 20px rgba(0,0,0,0.25)'
                    : '0 4px 20px rgba(21,120,170,0.06)',
                  backdropFilter: 'blur(8px)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 12px 32px rgba(0,0,0,0.35)'
                      : '0 12px 32px rgba(21,120,170,0.12)',
                  },
                })}
              >
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', display: 'block', mb: 1.5 }}
                >
                  Key Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {SKILL_CHIPS.map((s) => (
                    <Chip
                      key={s}
                      label={s}
                      size="small"
                      sx={(theme) => ({
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.1)' : '#EAF6FC',
                        color: 'primary.main',
                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.18)' : 'rgba(21,120,170,0.18)'}`,
                        fontWeight: 600,
                        fontSize: '0.72rem',
                      })}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* 스크롤 유도 */}
        <Box
          component="button"
          onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
          aria-label="아래 섹션으로 스크롤"
          sx={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            display: 'block',
            mx: 'auto',
            pt: { xs: 5, md: 6 },
            color: 'text.disabled',
            animation: 'bounceDown 1.8s ease-in-out infinite',
            transition: 'color 0.2s ease',
            '&:hover': { color: 'primary.main' },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '4px',
              borderRadius: '4px',
            },
          }}
        >
          <KeyboardArrowDownIcon sx={{ fontSize: 28 }} />
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
