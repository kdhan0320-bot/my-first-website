import { Box, Container, Typography, Button, Grid, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { scrollToSection } from '../../hooks/useScrollNav';
import { ALL_PROJECTS } from '../../data/projectsData';
import { PORTFOLIO_PDF_URL, GITHUB_PROFILE_URL } from '../../constants/site';

const STRENGTH_KEYWORDS = ['화면 설계', '사용자 흐름 개선', 'React 웹 구현'];

/* 홈 대표 프로젝트 중 첫 번째 항목을 Hero 프리뷰 카드에 사용 */
const previewProject = ALL_PROJECTS[0];

/* ── Hero 대표 프로젝트 프리뷰 카드 ── */
const FeaturedProjectPreview = () => {
  if (!previewProject) return null;
  const { title, categoryLabel, description, thumbnailUrl, gradient, tools } = previewProject;

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => scrollToSection('projects')}
      onKeyDown={(e) => e.key === 'Enter' && scrollToSection('projects')}
      aria-label={`대표 프로젝트 ${title} 보기 — 프로젝트 섹션으로 이동`}
      sx={{
        display: 'block',
        width: '100%',
        maxWidth: 380,
        cursor: 'pointer',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(148,163,184,0.18)',
        bgcolor: 'rgba(15,23,42,0.72)',
        backdropFilter: 'blur(8px)',
        transition: 'transform 0.2s ease, border-color 0.2s ease',
        '&:hover': { transform: 'translateY(-3px)', borderColor: 'rgba(56,189,248,0.4)' },
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '2px' },
      }}
    >
      <Typography
        sx={{
          px: 2, pt: 1.5,
          color: 'primary.main',
          fontWeight: 700,
          fontSize: '0.68rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        대표 프로젝트
      </Typography>

      <Box sx={{ position: 'relative', height: 150, mt: 1, background: gradient }}>
        {thumbnailUrl && (
          <Box
            component="img"
            src={thumbnailUrl}
            alt={`${title} 썸네일`}
            loading="lazy"
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', p: 1.5 }}
          />
        )}
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography sx={{ color: 'text.disabled', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.06em', textTransform: 'uppercase', mb: 0.5 }}>
          {categoryLabel}
        </Typography>
        <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: '1rem', mb: 0.75 }}>
          {title}
        </Typography>
        <Typography
          sx={{ color: 'text.secondary', fontSize: '0.8rem', lineHeight: 1.6, mb: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'primary.main', fontWeight: 600, fontSize: '0.78rem' }}>
          자세히 보기 <ArrowForwardIcon sx={{ fontSize: '0.9rem' }} />
        </Box>
        {tools?.length > 0 && (
          <Typography sx={{ mt: 1, color: 'text.disabled', fontSize: '0.7rem' }}>
            {[...new Set(tools)].slice(0, 3).join(' · ')}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

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
                사용자 흐름을 화면 설계와{' '}
                <Box component="span" sx={{ display: { xs: 'block', sm: 'inline' } }}>
                  웹 구현으로 연결하는
                </Box>
                <Box component="span" sx={{ display: 'block' }}>
                  신입 웹퍼블리셔{' '}
                  <Box component="span" sx={{ color: 'primary.main' }}>
                    김도한
                  </Box>
                  입니다
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
                  fontSize: { xs: '0.92rem', md: '1rem' },
                }}
              >
                Figma로 화면 구조를 정리하고, React 기반 웹 화면으로 구현하며, AI 도구는 아이디어 정리와 코드 검토 보조에 활용했습니다.
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
                  aria-label="대표 프로젝트 섹션으로 이동"
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
                  대표 프로젝트 보기
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

          {/* 오른쪽: 대표 프로젝트 프리뷰 카드 (모바일 숨김) */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <Box sx={{ animation: 'fadeInUp 0.6s ease 0.18s both', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <FeaturedProjectPreview />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
