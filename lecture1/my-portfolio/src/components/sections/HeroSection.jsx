import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Chip, Grid, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailIcon from '@mui/icons-material/Email';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import DevicesIcon from '@mui/icons-material/Devices';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LayersIcon from '@mui/icons-material/Layers';
import { usePortfolio } from '../../context/PortfolioContext';
import { supabase } from '../../lib/supabase';
import useInViewOnce from '../../hooks/useInViewOnce';
import useCountUp from '../../hooks/useCountUp';
import { scrollToSection } from '../../hooks/useScrollNav';

const KEYWORD_CARDS = [
  { icon: <DesignServicesIcon sx={{ fontSize: 18 }} />, label: 'UX/UI Design',         color: '#2563EB' },
  { icon: <LayersIcon          sx={{ fontSize: 18 }} />, label: 'Figma Prototype',      color: '#7C3AED' },
  { icon: <DevicesIcon         sx={{ fontSize: 18 }} />, label: 'React Publishing',     color: '#0891B2' },
  { icon: <AutoAwesomeIcon     sx={{ fontSize: 18 }} />, label: 'AI-assisted Workflow', color: '#F59E0B' },
];

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
        borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.12)' : '#E2E8F0'}`,
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
          : '#F8FAFC',
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: '88vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: { xs: 8, sm: 10, md: 6 },

        /* 은은한 dot 패턴 */
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, rgba(56,189,248,0.05) 1.5px, transparent 1.5px)'
            : 'radial-gradient(circle, rgba(37,99,235,0.06) 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
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
      {/* gradient blob 1 - 우측 상단 */}
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: { xs: 280, md: 520 },
          height: { xs: 280, md: 520 },
          borderRadius: '50%',
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(40px)',
        })}
      />
      {/* gradient blob 2 - 좌측 하단 */}
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          position: 'absolute',
          bottom: '-5%',
          left: '-8%',
          width: { xs: 200, md: 380 },
          height: { xs: 200, md: 380 },
          borderRadius: '50%',
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(40px)',
        })}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Grid container spacing={{ xs: 5, md: 8 }} sx={{ alignItems: 'center' }}>

          {/* 왼쪽: 텍스트 영역 */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                animation: 'fadeInUp 0.6s ease both',
              }}
            >
              {/* 상단 직무 라벨 */}
              <Chip
                label="UX/UI · Figma · Web Publishing · AI-assisted Prototype"
                sx={(theme) => ({
                  bgcolor: theme.palette.mode === 'dark'
                    ? 'rgba(56,189,248,0.1)'
                    : 'rgba(37,99,235,0.08)',
                  color: 'primary.main',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(56,189,248,0.2)'
                    : 'rgba(37,99,235,0.2)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  mb: { xs: 2.5, md: 3 },
                  height: 30,
                  borderRadius: '999px',
                })}
              />

              {/* 메인 헤딩 */}
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.85rem', sm: '2.4rem', md: '2.9rem', lg: '3.25rem' },
                  lineHeight: { xs: 1.25, md: 1.2 },
                  letterSpacing: '-0.02em',
                  color: 'text.primary',
                  mb: 1.5,
                }}
              >
                사용자의 흐름을 설계하고,{' '}
                <Box
                  component="span"
                  sx={(theme) => ({
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  })}
                >
                  웹으로 구현합니다.
                </Box>
              </Typography>

              {/* 이름 부제 */}
              <Typography
                variant="h4"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  mb: { xs: 2.5, md: 3 },
                }}
              >
                UX/UI 디자인 · 웹 퍼블리싱 학습자{' '}
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>
                  김도한
                </Box>
              </Typography>

              {/* 보조 설명 */}
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.85,
                  maxWidth: { xs: '100%', md: 500 },
                  mx: { xs: 'auto', md: 0 },
                  mb: { xs: 3.5, md: 4.5 },
                  fontSize: { xs: '0.9rem', md: '0.975rem' },
                }}
              >
                Figma 기반 UI 설계, 앱 리디자인, AI 도구를 활용한 웹 프로토타입 제작을 중심으로
                작업하는 김도한의 포트폴리오입니다.
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
                    minHeight: 50,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(37,99,235,0.30)',
                    },
                    '&:active': { transform: 'translateY(0)' },
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
                  }}
                >
                  프로젝트 보기
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
                      : 'rgba(37,99,235,0.35)',
                    px: 3.5,
                    minHeight: 50,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.06)' : 'rgba(37,99,235,0.05)',
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(37,99,235,0.12)',
                    },
                    '&:active': { transform: 'translateY(0)' },
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
                  })}
                >
                  연락하기
                </Button>
              </Stack>

              <PortfolioStats />
            </Box>
          </Grid>

          {/* 오른쪽: 키워드 카드 */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              aria-hidden="true"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                animation: 'fadeInUp 0.6s ease 0.15s both',
              }}
            >
              {KEYWORD_CARDS.map((card) => (
                <Box
                  key={card.label}
                  sx={(theme) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(17,24,39,0.85)' : '#FFFFFF',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(51,65,85,0.6)' : '#E2E8F0'}`,
                    borderRadius: 2.5,
                    p: 2.25,
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 2px 12px rgba(0,0,0,0.25)'
                      : '0 2px 12px rgba(15,23,42,0.06)',
                    backdropFilter: 'blur(8px)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderColor: card.color,
                      boxShadow: theme.palette.mode === 'dark'
                        ? `0 8px 24px rgba(0,0,0,0.35)`
                        : `0 8px 24px rgba(15,23,42,0.1)`,
                    },
                  })}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: `${card.color}14`,
                      border: `1px solid ${card.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.color,
                      flexShrink: 0,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary' }}>
                    {card.label}
                  </Typography>
                </Box>
              ))}
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
