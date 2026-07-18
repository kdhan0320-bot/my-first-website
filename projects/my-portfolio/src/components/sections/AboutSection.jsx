import { Box, Container, Typography } from '@mui/material';
import RevealOnScroll from '../ui/RevealOnScroll';
import { FONT_MONO, COLORS } from '../../theme';

/* Home용 About Snapshot — Figma 03_About(42:44) 그대로. /about 페이지(AboutPage.jsx)의
 * "지원 방향/사용 도구/현재 한계" 카드 콘텐츠는 Figma Home 설계에는 없으므로 Home에는
 * 옮기지 않고, 기존대로 /about 페이지에서 계속 확인할 수 있게 둔다. */

const ABOUT_HEADLINE = ['화면의 모양보다', '정보의 흐름과', '구현 가능성을 먼저 봅니다.'];

const ABOUT_BODY =
  'Figma로 정보 구조와 화면 흐름을 정리하고, React/MUI로 반응형 화면을 구현합니다. 실제 데이터·정적 데이터·프로토타입의 범위를 구분하며, AI는 문장 정리와 코드 점검을 보조하는 도구로 사용합니다.';

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
