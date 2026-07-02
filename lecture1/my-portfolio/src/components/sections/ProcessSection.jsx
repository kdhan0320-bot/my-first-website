import { Box, Container, Typography } from '@mui/material';
import RevealOnScroll from '../common/RevealOnScroll';

const STEPS = [
  {
    step: '01',
    title: 'Research',
    description: '레퍼런스 조사, 사용자 문제 파악',
  },
  {
    step: '02',
    title: 'Planning',
    description: '주제 선정, IA, User Flow, 콘텐츠 우선순위 정리',
  },
  {
    step: '03',
    title: 'Figma Design',
    description: '와이어프레임, 디자인 시스템, 메인/서브 페이지 제작',
  },
  {
    step: '04',
    title: 'AI-assisted Coding',
    description: 'Claude를 활용한 HTML/CSS/JS 구현',
  },
  {
    step: '05',
    title: 'Review & Improve',
    description: '반응형, 접근성, UI 디테일, 코드 구조 개선',
  },
];

const ProcessSection = () => (
  <Box component="section" id="process" aria-label="디자인 프로세스" sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
    <Container maxWidth="lg">

      {/* 섹션 헤더 */}
      <RevealOnScroll>
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography
            sx={{ color: 'text.secondary', letterSpacing: 6, fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1.5 }}
          >
            PROCESS
          </Typography>
          <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 800, mt: 1 }}>
            Design Process
          </Typography>
          <Box sx={{ width: 44, height: 3, bgcolor: 'primary.main', mx: 'auto', mt: 2, borderRadius: 2 }} />
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            기획부터 구현까지, 일관된 흐름으로 작업합니다.
          </Typography>
        </Box>
      </RevealOnScroll>

      {/* 단계 카드 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(5, 1fr)',
          },
          gap: 2,
        }}
      >
        {STEPS.map((step, i) => (
          <RevealOnScroll key={step.step} delay={i * 0.08} y={16}>
            <Box
              sx={(theme) => ({
                bgcolor: 'background.default',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                p: { xs: 2.5, md: 3 },
                height: '100%',
                position: 'relative',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  borderColor: theme.palette.primary.main,
                },
              })}
            >
              <Typography
                sx={{
                  color: 'primary.main',
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  lineHeight: 1,
                  mb: 1.5,
                  letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums',
                  opacity: 0.9,
                }}
              >
                {step.step}
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: 'text.primary', fontWeight: 700, mb: 1, fontSize: { xs: '1rem', md: '0.95rem' } }}
              >
                {step.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.8rem' }}
              >
                {step.description}
              </Typography>

              {/* 단계 연결선 (데스크탑에서 마지막 카드 제외) */}
              {i < STEPS.length - 1 && (
                <Box
                  aria-hidden="true"
                  sx={{
                    display: { xs: 'none', md: 'block' },
                    position: 'absolute',
                    right: '-13px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'text.disabled',
                    fontSize: '1rem',
                    zIndex: 1,
                  }}
                >
                  →
                </Box>
              )}
            </Box>
          </RevealOnScroll>
        ))}
      </Box>

    </Container>
  </Box>
);

export default ProcessSection;
