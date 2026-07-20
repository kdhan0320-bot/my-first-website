import { Box, Container, Typography } from '@mui/material';
import useInViewOnce from '../../hooks/useInViewOnce';
import { PORTFOLIO_PDF_URL, GITHUB_PROFILE_URL, CONTACT_EMAIL } from '../../constants/site';
import { FONT_MONO } from '../../theme';

/* Contact 마무리 모션 — Hero의 정렬 개념을 약하게 되받아치는 정도로: 신호점 3개가
 * 흩어진 위치에서 하나의 선으로 정렬되어 메일 CTA 쪽에서 멈춘다. 0.6~0.9초, 1회,
 * 배경 요소는 낮은 불투명도, 버튼 자체는 움직이지 않는다. Hero 같은 화려한 효과를
 * 새로 만들지 않는다. */
const SignalConverge = () => {
  const [ref, isVisible] = useInViewOnce(0.4);
  return (
    <Box
      ref={ref}
      aria-hidden="true"
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        gap: 1,
        height: 16,
        mb: 2,
        opacity: 0.5,
        '@keyframes signalDotIn': {
          '0%':   { transform: 'translateX(var(--dot-x, 0px))', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        '@keyframes signalLineIn': {
          from: { transform: 'scaleX(0)' },
          to:   { transform: 'scaleX(1)' },
        },
      }}
    >
      {[-18, -9, 0].map((x, i) => (
        <Box
          key={x}
          style={{ '--dot-x': `${x}px` }}
          sx={{
            width: 5, height: 5, borderRadius: '1px', bgcolor: 'primary.main', flexShrink: 0,
            opacity: isVisible ? 1 : 0,
            animation: isVisible ? `signalDotIn 0.25s ease ${i * 0.12}s both` : 'none',
          }}
        />
      ))}
      <Box
        sx={{
          width: 64, height: '1px', bgcolor: 'primary.main', transformOrigin: 'left center',
          animation: isVisible ? 'signalLineIn 0.35s ease 0.4s both' : 'none',
          transform: isVisible ? undefined : 'scaleX(0)',
        }}
      />
    </Box>
  );
};

const ContactSection = () => (
  <Box component="section" id="contact" aria-label="연락처" sx={{ bgcolor: 'background.default', pt: { xs: 7, md: 13 }, pb: { xs: 4, md: 7 } }}>
    <Container maxWidth={false} sx={{ px: { xs: 3, sm: 6, md: 8 } }}>
      <Typography sx={{ fontFamily: FONT_MONO, color: 'primary.main', fontSize: '0.75rem', letterSpacing: '0.04em', mb: 2.5 }}>
        05 / CONTACT
      </Typography>
      <Typography component="h2" sx={{ fontWeight: 700, fontSize: { xs: '2.1rem', sm: '2.8rem', md: '4rem' }, lineHeight: 1.2, color: 'text.primary', mb: 2.5 }}>
        <Box component="span" sx={{ display: 'block' }}>함께 일할 기회를</Box>
        <Box component="span" sx={{ display: 'block' }}>찾고 있습니다.</Box>
      </Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.9375rem', md: '1rem' }, lineHeight: 1.6, mb: { xs: 3.5, md: 4.5 }, maxWidth: 620 }}>
        UX/UI 웹디자인, 웹퍼블리싱, React/MUI 기반 UI 구현 직무의 기회를 찾고 있습니다.
      </Typography>

      <SignalConverge />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Box
          component="a"
          href={`mailto:${CONTACT_EMAIL}`}
          aria-label="이메일 보내기"
          sx={{
            bgcolor: 'primary.main', color: 'primary.contrastText', height: 50, px: 2.5, minWidth: 164,
            borderRadius: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1.25,
            textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 24px rgba(255,107,61,0.35)' },
            '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
          }}
        >
          {CONTACT_EMAIL} <Box component="span" aria-hidden="true" sx={{ fontFamily: FONT_MONO }}>→</Box>
        </Box>
        <Box
          component="a"
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub 프로필 새 탭에서 열기"
          sx={{
            bgcolor: 'background.default', color: 'text.primary', border: '1px solid #33404D', height: 50, px: 2.5, minWidth: 178,
            borderRadius: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1.25,
            textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap',
            transition: 'border-color 0.2s ease, color 0.2s ease',
            '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
            '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
          }}
        >
          GitHub 보기 <Box component="span" aria-hidden="true" sx={{ fontFamily: FONT_MONO }}>↗</Box>
        </Box>
        {PORTFOLIO_PDF_URL && (
          <Box
            component="a"
            href={PORTFOLIO_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="PDF 포트폴리오 새 탭에서 열기"
            sx={{
              bgcolor: 'background.default', color: 'text.primary', border: '1px solid #33404D', height: 50, px: 2.5, minWidth: 204,
              borderRadius: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1.25,
              textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap',
              transition: 'border-color 0.2s ease, color 0.2s ease',
              '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
              '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
            }}
          >
            PDF 포트폴리오 <Box component="span" aria-hidden="true" sx={{ fontFamily: FONT_MONO }}>↗</Box>
          </Box>
        )}
      </Box>

      <Box sx={{ borderTop: '1px solid #33404D', mt: { xs: 2, md: 3 }, pt: { xs: 2.5, md: 3 } }} />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 1 }}>
        <Typography sx={{ fontFamily: FONT_MONO, color: 'text.secondary', fontSize: '0.6875rem' }}>
          김도한 · UX/UI Web Designer · Web Publisher
        </Typography>
        <Typography sx={{ fontFamily: FONT_MONO, color: 'text.secondary', fontSize: '0.6875rem' }}>
          © {new Date().getFullYear()}
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default ContactSection;
