import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import { FONT_MONO, FONT_SANS, HUMAN_SIGNAL, ULTRAWIDE_CONTENT_MAX_WIDTH } from '../theme';
import QuietSignalBackground from '../components/ui/QuietSignalBackground';
import ActionIcon from '../components/ui/ActionIcon';

/* Human Signal 404 (Figma HS/404 Desktop 223:47 / Mobile 224:2).
 * Desktop/Mobile을 별도 컴포넌트로 나누지 않고 반응형 한 컴포넌트로 구현한다.
 * 복구 행동은 홈 / 전체 프로젝트 두 가지만 제공하고, 비공개·draft slug가
 * 있다는 사실을 암시하는 문구는 넣지 않는다. 전역 Header는 App.jsx의
 * <Navbar />가 모든 라우트에 공통으로 렌더링하므로 이 페이지에서
 * 헤더를 다시 그리지 않는다. */
const NotFoundPage = () => {
  const location = useLocation();

  const focusVisibleSx = {
    '&:focus-visible': {
      outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`,
      outlineOffset: '3px',
    },
  };

  return (
    <Box
      sx={{
        position: 'relative', bgcolor: HUMAN_SIGNAL.warmPaper,
        minHeight: { xs: 'calc(100vh - 72px)', md: 'calc(100vh - 80px)' },
        py: { xs: 7, md: 10 },
      }}
    >
      <QuietSignalBackground />
      <Container maxWidth={false} sx={{ position: 'relative', zIndex: 1, px: { xs: 3, sm: 6, md: 8 }, maxWidth: { xl: ULTRAWIDE_CONTENT_MAX_WIDTH + 128 }, mx: 'auto' }}>
        <Typography
          sx={{
            fontFamily: FONT_MONO, fontSize: '0.75rem', letterSpacing: '0.06em',
            // Warm Paper(밝은 배경) 위 작은 텍스트라 burntOrange를 쓴다.
            color: HUMAN_SIGNAL.burntOrange, mb: { xs: 2.5, md: 3.5 },
          }}
        >
          404 · PATH NOT FOUND
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 6 }, alignItems: { md: 'flex-start' } }}>
          <Typography
            aria-hidden="true"
            sx={{
              fontFamily: FONT_SANS, fontWeight: 700, color: HUMAN_SIGNAL.inkNavy,
              fontSize: { xs: '3.5rem', md: '4.5rem' }, lineHeight: 1.1, letterSpacing: '-0.02em',
            }}
          >
            404
          </Typography>

          <Box sx={{ maxWidth: 650 }}>
            <Typography
              component="h1"
              sx={{
                fontFamily: FONT_SANS, fontWeight: 700, color: HUMAN_SIGNAL.inkNavy,
                fontSize: { xs: '1.75rem', md: '2.5rem' }, lineHeight: 1.3, mb: { xs: 2, md: 2.5 },
              }}
            >
              요청한 페이지를 찾을 수 없습니다.
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_SANS, color: HUMAN_SIGNAL.inkNavy,
                fontSize: { xs: '0.9375rem', md: '1rem' }, lineHeight: 1.7, mb: { xs: 4, md: 5 },
              }}
            >
              주소가 바뀌었거나 입력한 주소가 올바르지 않을 수 있습니다.
              <br />
              홈 또는 전체 프로젝트에서 다시 확인할 수 있습니다.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, mb: { xs: 4, md: 5 } }}>
              <Box
                component={RouterLink}
                to="/"
                sx={{
                  bgcolor: HUMAN_SIGNAL.inkNavy, color: HUMAN_SIGNAL.softWhite, textDecoration: 'none',
                  borderRadius: '16px', cursor: 'pointer',
                  minHeight: 54, px: 3, fontFamily: FONT_SANS, fontWeight: 500, fontSize: '0.9375rem',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  ...focusVisibleSx,
                }}
              >
                홈으로 돌아가기
                <ActionIcon variant="internal" sx={{ color: HUMAN_SIGNAL.brightOrangeOnDark }} />
              </Box>
              <Box
                component={RouterLink}
                to="/projects"
                sx={{
                  bgcolor: HUMAN_SIGNAL.softWhite, color: HUMAN_SIGNAL.inkNavy, textDecoration: 'none',
                  border: `1px solid ${HUMAN_SIGNAL.paperDeep}`, borderRadius: '16px', cursor: 'pointer',
                  minHeight: 54, px: 3, fontFamily: FONT_SANS, fontWeight: 500, fontSize: '0.9375rem',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  ...focusVisibleSx,
                }}
              >
                전체 프로젝트
                <ActionIcon variant="internal" sx={{ color: HUMAN_SIGNAL.burntOrange }} />
              </Box>
            </Box>

            <Box
              sx={{
                bgcolor: HUMAN_SIGNAL.softWhite, borderRadius: '14px',
                px: 2.25, py: 1.5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 0.5, sm: 1.5 }, alignItems: { sm: 'center' }, mb: { xs: 5, md: 6 },
              }}
            >
              {/* Soft White(밝은 배경) 위 작은 텍스트라 burntOrange를 쓴다. */}
              <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', letterSpacing: '0.06em', color: HUMAN_SIGNAL.burntOrange }}>
                REQUEST
              </Typography>
              <Typography sx={{ fontFamily: FONT_SANS, fontSize: '0.875rem', color: HUMAN_SIGNAL.inkNavy, wordBreak: 'break-all' }}>
                {location.pathname}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ borderTop: `1px solid ${HUMAN_SIGNAL.paperDeep}`, pt: 2.5 }}>
          <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', letterSpacing: '0.06em', color: HUMAN_SIGNAL.inkNavy }}>
            DOHAN KIM · HUMAN SIGNAL
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
