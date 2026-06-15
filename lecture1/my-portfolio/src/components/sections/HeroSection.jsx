import { Box, Container, Typography, Button, Chip, Grid, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';

const WORKFLOW = [
  { label: '기획',  sub: 'UX 분석'  },
  { label: '설계',  sub: 'Figma'    },
  { label: '구현',  sub: 'React'    },
  { label: '개선',  sub: 'AI Tools' },
];

const SKILL_CHIPS = ['UX/UI', 'React', 'MUI', 'Figma', 'AI Tools'];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #F6F8FB 0%, #EEF7FC 60%, #FFFFFF 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: '82vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: { xs: 10, md: 4 },

        /* 점 패턴 */
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(21,120,170,0.07) 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          zIndex: 0,
          pointerEvents: 'none',
        },

        /* 블러 원 */
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-15%',
          right: '-8%',
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(21,120,170,0.11) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        },

        /* 애니메이션 keyframes */
        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to:   { opacity: 1, transform: 'translateY(0)'    },
        },
        '@keyframes bounceDown': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(7px)' },
        },

        /* 모션 저감 접근성 */
        '@media (prefers-reduced-motion: reduce)': {
          '& *': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">

          {/* ── 왼쪽: 텍스트 영역 ── */}
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                animation: 'fadeInUp 0.6s ease both',
              }}
            >
              {/* 배지 */}
              <Chip
                label="UX/UI 기반 웹디자이너 지망생"
                sx={{
                  bgcolor: 'rgba(21,120,170,0.08)',
                  color: '#1578AA',
                  border: '1px solid rgba(21,120,170,0.2)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  mb: 3,
                  height: 28,
                }}
              />

              {/* 헤드라인 */}
              <Typography
                variant="h1"
                sx={{
                  color: '#1A1A2E',
                  fontWeight: 800,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  lineHeight: 1.25,
                  letterSpacing: '-0.03em',
                  mb: 3,
                }}
              >
                사용자 흐름을 정리하고,
                <br />
                <Box component="span" sx={{ color: '#1E9BD7' }}>
                  실제 작동하는 웹 화면으로
                </Box>
                <br />
                구현합니다.
              </Typography>

              {/* 서브 문구 */}
              <Typography
                variant="body1"
                sx={{
                  color: '#64748B',
                  mb: 5,
                  lineHeight: 1.85,
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  maxWidth: { xs: '100%', md: 480 },
                  mx: { xs: 'auto', md: 0 },
                }}
              >
                UX/UI, 웹디자인, React 기반 구현을 학습하며
                사용자가 이해하기 쉬운 웹서비스 화면을 만들어가고 있습니다.
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
                  onClick={() => navigate('/projects')}
                  aria-label="프로젝트 보기 페이지로 이동"
                  sx={{
                    bgcolor: '#1578AA',
                    color: '#FFFFFF',
                    px: 3.5,
                    fontWeight: 700,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      bgcolor: '#1E9BD7',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(21,120,170,0.28)',
                    },
                  }}
                >
                  프로젝트 보기
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/about')}
                  aria-label="About Me 페이지로 이동"
                  sx={{
                    color: '#1578AA',
                    borderColor: 'rgba(21,120,170,0.4)',
                    px: 3.5,
                    fontWeight: 600,
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(21,120,170,0.05)',
                      borderColor: '#1578AA',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  About Me
                </Button>
              </Stack>

              {/* 작은 텍스트 링크 */}
              <Stack
                direction="row"
                spacing={1.5}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                alignItems="center"
              >
                <Typography
                  component="a"
                  href="https://github.com/kdhan0320-bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub 프로필 새 탭에서 열기"
                  variant="caption"
                  sx={{
                    color: '#94A3B8',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'color 0.2s',
                    '&:hover': { color: '#1578AA' },
                    '&:focus-visible': { outline: '2px solid #1578AA', outlineOffset: '2px', borderRadius: '2px' },
                  }}
                >
                  GitHub
                </Typography>
                <Box
                  aria-hidden="true"
                  sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#CBD5E1' }}
                />
                <Typography
                  component="a"
                  href="mailto:kdhan0320@gmail.com"
                  variant="caption"
                  sx={{
                    color: '#94A3B8',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'color 0.2s',
                    '&:hover': { color: '#1578AA' },
                  }}
                >
                  연락하기
                </Typography>
              </Stack>
            </Box>
          </Grid>

          {/* ── 오른쪽: 시각 요소 ── */}
          <Grid item xs={12} md={5}>
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
                sx={{
                  bgcolor: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(30,155,215,0.12)',
                  borderRadius: 3,
                  p: 3,
                  boxShadow: '0 4px 20px rgba(21,120,170,0.08)',
                  backdropFilter: 'blur(8px)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(21,120,170,0.14)',
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: '#94A3B8',
                    fontWeight: 600,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    display: 'block',
                    mb: 2.5,
                  }}
                >
                  작업 흐름
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                  {WORKFLOW.flatMap((s, i) => [
                    <Box key={s.label} sx={{ flex: 1, textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          mx: 'auto',
                          mb: 0.75,
                          bgcolor: i === 2 ? 'rgba(21,120,170,0.1)' : '#F6F8FB',
                          border: i === 2 ? '1px solid rgba(21,120,170,0.28)' : '1px solid #E8EDF3',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          sx={{
                            color: i === 2 ? '#1578AA' : '#1A1A2E',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                          }}
                        >
                          {s.label}
                        </Typography>
                      </Box>
                      <Typography sx={{ color: '#94A3B8', fontSize: '0.6rem' }}>
                        {s.sub}
                      </Typography>
                    </Box>,
                    i < WORKFLOW.length - 1 ? (
                      <Typography
                        key={`arr-${i}`}
                        sx={{ color: '#CBD5E1', fontSize: '0.75rem', flexShrink: 0, mt: '13px' }}
                      >
                        →
                      </Typography>
                    ) : null,
                  ]).filter(Boolean)}
                </Box>
              </Box>

              {/* 주요 기술 Chip 카드 */}
              <Box
                sx={{
                  bgcolor: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(30,155,215,0.12)',
                  borderRadius: 3,
                  p: 2.5,
                  boxShadow: '0 4px 20px rgba(21,120,170,0.06)',
                  backdropFilter: 'blur(8px)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(21,120,170,0.12)',
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: '#94A3B8',
                    fontWeight: 600,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    display: 'block',
                    mb: 1.5,
                  }}
                >
                  주요 기술
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {SKILL_CHIPS.map((s) => (
                    <Chip
                      key={s}
                      label={s}
                      size="small"
                      sx={{
                        bgcolor: '#EAF6FC',
                        color: '#1578AA',
                        border: '1px solid rgba(21,120,170,0.18)',
                        fontWeight: 600,
                        fontSize: '0.72rem',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* 스크롤 유도 화살표 — 클릭 시 다음 섹션으로 스크롤 */}
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
            color: '#B8C8D8',
            animation: 'bounceDown 1.8s ease-in-out infinite',
            transition: 'color 0.2s ease',
            '&:hover': { color: '#1578AA' },
            '&:focus-visible': {
              outline: '2px solid #1578AA',
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
