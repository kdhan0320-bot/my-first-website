import { Box, Container, Typography, Button, Grid, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { scrollToSection } from '../../hooks/useScrollNav';
import { PORTFOLIO_PDF_URL, GITHUB_PROFILE_URL } from '../../constants/site';
import FlowCanvasIllustration from '../hero/FlowCanvasIllustration';

const STRENGTH_KEYWORDS = ['Figma 구조화', 'React/MUI 구현', 'Responsive 검수'];

const HeroSection = () => {
  return (
    <Box
      component="section"
      id="home"
      aria-label="소개"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 'auto', md: '90vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        pt: { xs: 5, sm: 8, md: 6 },
        pb: { xs: 2, sm: 5, md: 6 },
        bgcolor: 'background.default',
        background: 'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(56,189,248,0.04) 0%, transparent 55%), #0B1020',
        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        '@media (prefers-reduced-motion: reduce)': {
          '& *': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
        },
      }}
    >
      {/* Gradient blob 1 - 우측 상단 */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '-14%',
          right: '-8%',
          width: { xs: 300, md: 580 },
          height: { xs: 300, md: 580 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(52px)',
        }}
      />

      {/* Gradient blob 2 - 좌측 하단 */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-8%',
          width: { xs: 230, md: 420 },
          height: { xs: 230, md: 420 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(52px)',
        }}
      />

      {/* 아주 옅은 guide line — 구조화된 느낌의 미세 디테일 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          left: 0, right: 0, top: '18%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(148,163,184,0.14) 30%, rgba(148,163,184,0.14) 70%, transparent)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* 다음 섹션(About)으로 이어지는 아주 약한 flow line 커넥터 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          left: '50%', bottom: 0, transform: 'translateX(-50%)',
          width: '1px', height: 48,
          background: 'linear-gradient(180deg, transparent, rgba(56,189,248,0.3))',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Grid container spacing={{ xs: 3, md: 8 }} sx={{ alignItems: 'center' }}>

          {/* 왼쪽: 텍스트 */}
          <Grid size={{ xs: 12, md: 7 }} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                animation: 'fadeInUp 0.6s ease both',
              }}
            >
              {/* 강점 키워드 — 클릭 불가 텍스트 나열 (버튼처럼 보이지 않게) */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  alignItems: 'center',
                  gap: 0,
                  mb: { xs: 2, md: 2.5 },
                }}
              >
                {STRENGTH_KEYWORDS.map((keyword, i) => (
                  <Box component="span" key={keyword} sx={{ display: 'flex', alignItems: 'center' }}>
                    {i > 0 && (
                      <Typography component="span" sx={{ color: 'text.disabled', mx: 1.2, fontSize: '0.78rem' }}>·</Typography>
                    )}
                    <Typography
                      component="span"
                      sx={{
                        color: 'primary.main',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {keyword}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.7rem', sm: '2.15rem', md: '2.75rem', lg: '3.1rem' },
                  lineHeight: { xs: 1.32, md: 1.22 },
                  letterSpacing: '-0.02em',
                  color: 'text.primary',
                  mb: 1.5,
                }}
              >
                복잡한 흐름을 정리하고,
                <Box component="span" sx={{ display: 'block' }}>
                  실제 웹 화면으로 구현합니다.
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.85,
                  maxWidth: { xs: '100%', md: 500 },
                  mx: { xs: 'auto', md: 0 },
                  mb: { xs: 1, md: 1.25 },
                  fontSize: { xs: '0.92rem', md: '1rem' },
                }}
              >
                사용자 흐름과 정보 구조를 정리한 뒤, Figma 설계와 React 구현으로 연결합니다.
              </Typography>

              <Typography
                sx={{
                  color: 'text.disabled',
                  lineHeight: 1.7,
                  maxWidth: { xs: '100%', md: 460 },
                  mx: { xs: 'auto', md: 0 },
                  mb: { xs: 3.5, md: 4.5 },
                  fontSize: '0.75rem',
                }}
              >
                AI는 요구사항 정리와 코드 개선안 도출을 보조하는 도구로 활용했습니다.
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{
                  alignItems: { xs: 'stretch', sm: 'center' },
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  flexWrap: 'wrap',
                  rowGap: 2,
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => scrollToSection('projects')}
                  aria-label="프로젝트 섹션으로 이동"
                  endIcon={<ArrowForwardIcon sx={{ transition: 'transform 0.2s ease' }} />}
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
                    '&:hover .MuiButton-endIcon': { transform: 'translateX(3px)' },
                    '&:active': { transform: 'translateY(0)' },
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
                  }}
                >
                  프로젝트 보기
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component="a"
                  href={GITHUB_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<GitHubIcon />}
                  aria-label="GitHub 프로필 새 탭으로 열기"
                  sx={{
                    color: 'primary.main',
                    borderColor: 'rgba(56,189,248,0.4)',
                    px: 3.5,
                    minHeight: 50,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(56,189,248,0.07)',
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                    },
                    '&:active': { transform: 'translateY(0)' },
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
                  }}
                >
                  GitHub
                </Button>
                {PORTFOLIO_PDF_URL && (
                  <Button
                    variant="text"
                    size="large"
                    component="a"
                    href={PORTFOLIO_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<PictureAsPdfIcon />}
                    aria-label="PDF 포트폴리오 새 탭으로 열기"
                    sx={{
                      color: 'text.secondary',
                      px: 2,
                      minHeight: 50,
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      whiteSpace: 'nowrap',
                      '&:hover': { color: 'primary.main', bgcolor: 'rgba(56,189,248,0.06)' },
                      '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
                    }}
                  >
                    PDF 포트폴리오
                  </Button>
                )}
              </Stack>
            </Box>
          </Grid>

          {/* 오른쪽: Flow Canvas Illustration — 모바일에서는 축소되어 텍스트 아래에 노출 */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, md: 0 } }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <FlowCanvasIllustration />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
