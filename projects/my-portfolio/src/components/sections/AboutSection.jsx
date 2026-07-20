import { Box, Container, Typography } from '@mui/material';
import RevealOnScroll from '../ui/RevealOnScroll';
import { FONT_MONO, COLORS } from '../../theme';

/* Home의 유일한 About 섹션 — Figma 03_About(42:44) 그대로 구현했다. 별도의 /about
 * 페이지는 존재하지 않으며, `/about` 접근은 App.jsx의 <Navigate>를 통해 이 섹션으로
 * 연결된다. */

const ABOUT_HEADLINE = ['시각적 완성도에 그치지 않고,', '정보가 이해되고 실제로 작동하는', '구조까지 설계합니다.'];

const ABOUT_BODY =
  '사용자의 목적과 정보 우선순위를 정리한 뒤, 반응형 화면과 구현 범위를 검토해 실제 웹으로 연결합니다.';

const WORK_PROCESS = ['UNDERSTAND', 'STRUCTURE', 'DESIGN', 'BUILD', 'VERIFY'];

const AboutSection = () => {
  return (
    <Box
      component="section"
      id="about"
      aria-label="소개"
      sx={{
        bgcolor: COLORS.warmIvory,
        py: { xs: 7, md: 12 },
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 3, sm: 6, md: 8 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: { xs: 6, md: 8 },
          }}
        >
          {/* About_Copy */}
          <RevealOnScroll sx={{ maxWidth: { xs: '100%', md: 610 }, width: '100%' }}>
            <Box>
              <Typography sx={{ fontFamily: FONT_MONO, color: COLORS.lightBgAccentText, fontSize: '0.75rem', letterSpacing: '0.04em', mb: 2 }}>
                02 / ABOUT
              </Typography>
              <Typography
                component="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2.1rem', md: '2.75rem' },
                  lineHeight: { xs: 1.35, md: 1.28 },
                  color: COLORS.inkBlack,
                  mb: 2.5,
                }}
              >
                {ABOUT_HEADLINE.map((line) => (
                  <Box key={line} component="span" sx={{ display: 'block' }}>{line}</Box>
                ))}
              </Typography>
              <Typography sx={{ color: COLORS.darkSecondary, fontSize: { xs: '0.9375rem', md: '1rem' }, lineHeight: 1.75, maxWidth: 560 }}>
                {ABOUT_BODY}
              </Typography>
            </Box>
          </RevealOnScroll>

          {/* Work_Process */}
          <RevealOnScroll delay={0.08} sx={{ width: '100%', maxWidth: { xs: '100%', md: 500 } }}>
            <Box>
              <Typography sx={{ fontFamily: FONT_MONO, color: COLORS.lightBgAccentText, fontSize: '0.75rem', letterSpacing: '0.04em', mb: 1 }}>
                WORK PROCESS
              </Typography>
              {WORK_PROCESS.map((label, i) => (
                <Box
                  key={label}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 2.25,
                    height: 54,
                    borderBottom: '1px solid #C6C1B7',
                  }}
                >
                  <Typography sx={{ fontFamily: FONT_MONO, color: COLORS.lightBgAccentText, fontSize: '0.6875rem', minWidth: 20 }}>
                    {String(i + 1).padStart(2, '0')}
                  </Typography>
                  <Typography sx={{ fontFamily: FONT_MONO, fontWeight: 600, color: COLORS.inkBlack, fontSize: '1.0625rem' }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </RevealOnScroll>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutSection;
