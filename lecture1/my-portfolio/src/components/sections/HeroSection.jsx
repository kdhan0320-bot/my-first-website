import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Chip, Grid, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { usePortfolio } from '../../context/PortfolioContext';
import { supabase } from '../../lib/supabase';
import useInViewOnce from '../../hooks/useInViewOnce';
import useCountUp from '../../hooks/useCountUp';
import { scrollToSection } from '../../hooks/useScrollNav';
import StarField from '../common/StarField';

const PROCESS_STEPS = [
  { label: 'Research', sub: 'UX 분석',   num: '01', color: '#A78BFA', lightColor: '#7C3AED' },
  { label: 'Design',   sub: 'Figma',     num: '02', color: '#38BDF8', lightColor: '#2563EB' },
  { label: 'Build',    sub: 'React',     num: '03', color: '#22D3EE', lightColor: '#0891B2' },
  { label: 'Review',   sub: '개선 반영', num: '04', color: '#F59E0B', lightColor: '#D97706' },
];

const CosmicOverlay = () => {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';
  const starA = dark ? 'rgba(255,255,255,0.52)' : 'rgba(37,99,235,0.38)';
  const starB = dark ? 'rgba(255,255,255,0.35)' : 'rgba(124,58,237,0.28)';
  const o1 = dark ? 'rgba(56,189,248,0.22)' : 'rgba(37,99,235,0.16)';
  const o2 = dark ? 'rgba(167,139,250,0.17)' : 'rgba(124,58,237,0.13)';
  const gx = dark ? 'rgba(56,189,248,0.09)' : 'rgba(37,99,235,0.07)';
  return (
    <svg viewBox="0 0 440 360" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      style={{ position: 'absolute', top: '-14%', left: '-14%', width: '128%', height: '128%', pointerEvents: 'none', zIndex: 0 }}>
      {/* 궤도 타원 2개 */}
      <ellipse cx="220" cy="180" rx="208" ry="168" fill="none" stroke={o1} strokeWidth="1" />
      <ellipse cx="220" cy="180" rx="148" ry="118" fill="none" stroke={o2} strokeWidth="0.8" strokeDasharray="6 9" />
      {/* 행성 노드 4개 (각 프로세스 단계 색) */}
      <circle cx="19" cy="124" r="6" fill="#A78BFA" opacity={dark ? 0.65 : 0.45} />
      <circle cx="19" cy="124" r="11" fill="#A78BFA" opacity="0.1" />
      <circle cx="429" cy="82" r="5" fill="#38BDF8" opacity={dark ? 0.6 : 0.42} />
      <circle cx="429" cy="82" r="9" fill="#38BDF8" opacity="0.1" />
      <circle cx="432" cy="298" r="7" fill="#22D3EE" opacity={dark ? 0.55 : 0.4} />
      <circle cx="432" cy="298" r="12" fill="#22D3EE" opacity="0.09" />
      <circle cx="22" cy="265" r="5" fill="#F59E0B" opacity={dark ? 0.6 : 0.42} />
      <circle cx="22" cy="265" r="9" fill="#F59E0B" opacity="0.1" />
      {/* 별자리 점 */}
      <circle cx="38" cy="36" r="1.5" fill={starA} />
      <circle cx="96" cy="16" r="1" fill={starB} />
      <circle cx="162" cy="7" r="1.5" fill={starA} />
      <circle cx="377" cy="26" r="1.5" fill={starB} />
      <circle cx="407" cy="54" r="1" fill={starA} />
      <circle cx="430" cy="188" r="1" fill={starB} />
      <circle cx="8" cy="198" r="1" fill={starB} />
      <circle cx="56" cy="328" r="1.5" fill={starA} />
      <circle cx="114" cy="348" r="1" fill={starB} />
      <circle cx="336" cy="342" r="1.5" fill={starA} />
      <circle cx="400" cy="316" r="1" fill={starB} />
      {/* 별자리 연결선 */}
      <line x1="38" y1="36" x2="96" y2="16" stroke={starA} strokeWidth="0.5" opacity="0.4" />
      <line x1="96" y1="16" x2="162" y2="7" stroke={starA} strokeWidth="0.5" opacity="0.3" />
      <line x1="377" y1="26" x2="407" y2="54" stroke={starA} strokeWidth="0.5" opacity="0.35" />
      <line x1="56" y1="328" x2="114" y2="348" stroke={starA} strokeWidth="0.5" opacity="0.4" />
      <line x1="114" y1="348" x2="336" y2="342" stroke={starA} strokeWidth="0.5" opacity="0.25" />
      {/* 은하수 곡선 */}
      <path d="M 28 268 Q 220 318 424 198" fill="none" stroke={gx} strokeWidth="2" />
    </svg>
  );
};

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
    { label: '활용 기술',     value: skillNum, suffix: '개' },
    { label: '학습 기간',     value: studyNum, suffix: '개월+' },
  ];

  return (
    <Box
      ref={statsRef}
      sx={(theme) => ({
        display: 'flex',
        gap: { xs: 3, sm: 4 },
        mt: 3,
        pt: 2.5,
        borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.15)' : '#E2E8F0'}`,
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
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: '90vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: { xs: 8, sm: 10, md: 6 },
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0F172A 0%, #0D1B2A 60%, #111827 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 60%, #FFFFFF 100%)',
        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
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
      {/* 별 배경 */}
      <StarField count={48} />

      {/* Gradient blob 1 - 우측 상단 */}
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          position: 'absolute',
          top: '-12%',
          right: '-6%',
          width: { xs: 260, md: 500 },
          height: { xs: 260, md: 500 },
          borderRadius: '50%',
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, rgba(56,189,248,0.10) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(48px)',
        })}
      />

      {/* Gradient blob 2 - 좌측 하단 */}
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          position: 'absolute',
          bottom: '-8%',
          left: '-6%',
          width: { xs: 200, md: 360 },
          height: { xs: 200, md: 360 },
          borderRadius: '50%',
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(48px)',
        })}
      />

      {/* SVG Orbit arc 장식 */}
      <Box
        component="svg"
        viewBox="0 0 800 500"
        aria-hidden="true"
        sx={(theme) => ({
          position: 'absolute',
          top: '-5%',
          right: '-10%',
          width: { xs: 300, md: 600 },
          height: 'auto',
          opacity: theme.palette.mode === 'dark' ? 0.12 : 0.06,
          zIndex: 0,
          pointerEvents: 'none',
        })}
      >
        <ellipse cx="400" cy="250" rx="360" ry="180" fill="none" stroke="#38BDF8" strokeWidth="1" />
        <ellipse cx="400" cy="250" rx="260" ry="130" fill="none" stroke="#7C3AED" strokeWidth="0.8" strokeDasharray="6 8" />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Grid container spacing={{ xs: 5, md: 8 }} sx={{ alignItems: 'center' }}>

          {/* 왼쪽: 텍스트 */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                animation: 'fadeInUp 0.6s ease both',
              }}
            >
              <Chip
                label="UX/UI · Figma · Web Publishing · AI-assisted Prototype"
                sx={(theme) => ({
                  bgcolor: theme.palette.mode === 'dark'
                    ? 'rgba(56,189,248,0.1)'
                    : 'rgba(37,99,235,0.08)',
                  color: 'primary.main',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(56,189,248,0.22)'
                    : 'rgba(37,99,235,0.22)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  mb: { xs: 2.5, md: 3 },
                  height: 30,
                  borderRadius: '999px',
                })}
              />

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

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                sx={{ mb: 1.5 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => scrollToSection('projects')}
                  aria-label="프로젝트 섹션으로 이동"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 3.5,
                    minHeight: 50,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
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
                    whiteSpace: 'nowrap',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.07)' : 'rgba(37,99,235,0.05)',
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                    },
                    '&:active': { transform: 'translateY(0)' },
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
                  })}
                >
                  연락하기
                </Button>
              </Stack>

              {/* PDF 준비 중 버튼 */}
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 2.5 }}>
                <Button
                  disabled
                  size="small"
                  startIcon={<PictureAsPdfIcon sx={{ fontSize: '0.8rem !important' }} />}
                  aria-label="PDF 포트폴리오 준비 중"
                  sx={(theme) => ({
                    color: 'text.disabled',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    px: 2,
                    minHeight: 32,
                    whiteSpace: 'nowrap',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.14)' : '#E2E8F0'}`,
                    borderRadius: 2,
                    '&.Mui-disabled': {
                      color: 'text.disabled',
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.12)' : '#EDF2F7',
                    },
                  })}
                >
                  PDF Portfolio — Coming Soon
                </Button>
              </Box>

              <PortfolioStats />
            </Box>
          </Grid>

          {/* 오른쪽: Design Process 미션 패널 + 우주 일러스트 */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              aria-hidden="true"
              sx={{ position: 'relative', animation: 'fadeInUp 0.6s ease 0.18s both' }}
            >
              {/* 우주 SVG 오버레이 */}
              <CosmicOverlay />

              <Box
                sx={(theme) => ({
                  position: 'relative',
                  zIndex: 1,
                  bgcolor: theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(255,255,255,0.88)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.15)' : '#E2E8F0'}`,
                  borderRadius: 3,
                  p: { xs: 2.5, md: 3 },
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
                    : '0 4px 24px rgba(15,23,42,0.08)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 16px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)'
                      : '0 16px 40px rgba(15,23,42,0.12)',
                  },
                })}
              >
                {/* 패널 헤더 */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box
                    sx={(theme) => ({
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: theme.palette.mode === 'dark' ? '#38BDF8' : '#2563EB',
                      boxShadow: theme.palette.mode === 'dark' ? '0 0 6px rgba(56,189,248,0.7)' : 'none',
                    })}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      fontSize: '0.65rem',
                    }}
                  >
                    Design Process
                  </Typography>
                </Box>

                {/* 프로세스 스텝 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {PROCESS_STEPS.map((step, i) => (
                    <Box key={step.label}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
                        {/* 번호 + 노드 */}
                        <Box sx={{ flexShrink: 0 }}>
                          <Box
                            sx={(theme) => ({
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              border: `1.5px solid ${theme.palette.mode === 'dark' ? step.color : step.lightColor}`,
                              bgcolor: theme.palette.mode === 'dark'
                                ? `${step.color}14`
                                : `${step.lightColor}0D`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: theme.palette.mode === 'dark'
                                ? `0 0 8px ${step.color}22`
                                : 'none',
                            })}
                          >
                            <Typography
                              sx={(theme) => ({
                                fontSize: '0.6rem',
                                fontWeight: 700,
                                color: theme.palette.mode === 'dark' ? step.color : step.lightColor,
                                letterSpacing: '0.05em',
                              })}
                            >
                              {step.num}
                            </Typography>
                          </Box>
                        </Box>

                        {/* 텍스트 */}
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={(theme) => ({
                              fontWeight: 600,
                              fontSize: '0.875rem',
                              color: theme.palette.mode === 'dark' ? step.color : step.lightColor,
                              lineHeight: 1.2,
                            })}
                          >
                            {step.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary', fontSize: '0.72rem' }}
                          >
                            {step.sub}
                          </Typography>
                        </Box>
                      </Box>

                      {/* 연결선 (dotted) */}
                      {i < PROCESS_STEPS.length - 1 && (
                        <Box
                          sx={(theme) => ({
                            ml: '17px',
                            width: 2,
                            height: 14,
                            background: theme.palette.mode === 'dark'
                              ? `linear-gradient(180deg, ${step.color}40, ${PROCESS_STEPS[i + 1].color}40)`
                              : `linear-gradient(180deg, ${step.lightColor}30, ${PROCESS_STEPS[i + 1].lightColor}30)`,
                          })}
                        />
                      )}
                    </Box>
                  ))}
                </Box>

                {/* 하단 태그 */}
                <Box
                  sx={(theme) => ({
                    mt: 2.5,
                    pt: 2,
                    borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.1)' : '#F1F5F9'}`,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.75,
                  })}
                >
                  {['Figma', 'React', 'AI-assisted'].map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={(theme) => ({
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.08)' : 'rgba(37,99,235,0.06)',
                        color: 'primary.main',
                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.18)' : 'rgba(37,99,235,0.18)'}`,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 22,
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
