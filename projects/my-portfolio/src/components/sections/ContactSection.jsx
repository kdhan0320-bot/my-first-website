import { useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { PORTFOLIO_PDF_URL, GITHUB_PROFILE_URL, CONTACT_EMAIL } from '../../constants/site';
import { FONT_MONO, HUMAN_SIGNAL, ULTRAWIDE_CONTENT_MAX_WIDTH, HOME_WIDE_MAX_WIDTH } from '../../theme';
import DMark from '../brand/DMark';
import ActionIcon from '../ui/ActionIcon';
import useInViewOnce from '../../hooks/useInViewOnce';

const APPLICATION_ROLES = ['UX/UI 웹디자인', '웹퍼블리싱', 'UI 구현'];

const SPLIT_MQ = '@media (min-width:1100px)';
const QHD_MQ = '@media (min-width:1920px)';

/* Human Signal Phase 3C 재검토(2차): Phase 3C 1차 구현은 34/66 grid를 만들었지만
 * 섹션 전체가 Deep Harbor 한 톤이라 "오른쪽 65~70% Soft White/Warm Paper action
 * plane"이 실제로는 없었다(확정안 불일치, ChatGPT 재검토로 확인). Hero의 full-bleed
 * 2-plane split(좌 Ink Navy / 우 Deep Harbor)과 같은 기법으로 좌 32% Deep Harbor
 * identity plane / 우 68% Soft White action plane을 실제로 나눈다. 좌측 콘텐츠
 * (D2/이름/정리·연결·검증/OPEN TO WORK)는 그대로 두고, 우측은 배경이 밝아졌으므로
 * 텍스트·버튼 색을 전부 밝은 배경 규칙(작은 텍스트=burntOrange, 큰 헤드라인=inkNavy)으로
 * 다시 설정했다. Mail 버튼은 이전엔 페이지 전체가 어두워 Soft White 채움만으로도
 * 튀었지만, 배경 자체가 Soft White로 바뀌면 버튼이 배경에 묻히므로 Ink Navy 채움
 * 버튼으로 반전했다(밝은 배경 위에서 primary가 눈에 띄어야 한다는 원래 의도는 그대로,
 * 구현 방식만 배경에 맞게 바꿨다). */
const isReviewCapture =
  (typeof window !== 'undefined' && window.__PORTFOLIO_REVIEW_MODE__ === true) ||
  (typeof document !== 'undefined' && document.documentElement?.getAttribute('data-review-mode') === 'true');

const ContactSection = () => {
  const prefersReduced = useRef(
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
  );
  const [ref, isVisible] = useInViewOnce(0.2);
  const show = isReviewCapture || prefersReduced.current || isVisible;
  const skip = isReviewCapture || prefersReduced.current;

  const t = (delay, duration, extra = '') =>
    skip ? 'none' : `opacity ${duration}s ease-out ${delay}s, transform ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s${extra}`;

  return (
    <Box ref={ref} component="section" id="contact" aria-label="연락처" sx={{ position: 'relative', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.deepHarbor }}>
      {/* 2-pane full-bleed split — Hero와 동일한 breakout 기법(width:100vw + 음수 margin). */}
      <Box sx={{
        position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw',
        display: 'block',
        [SPLIT_MQ]: { display: 'grid', gridTemplateColumns: '32fr 68fr' },
      }}>
        {/* 좌측 identity plane — Deep Harbor 32% */}
        <Box sx={{
          position: 'relative', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.deepHarbor,
          px: { xs: 3, sm: 6 }, py: { xs: 6, sm: 7 },
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          [SPLIT_MQ]: { px: 6, py: 0 },
          [QHD_MQ]: { px: 9 },
        }}>
          <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <Box sx={{
              position: 'absolute', top: '-14%', left: '-20%', width: 320, height: 320,
              borderRadius: '50%', background: `radial-gradient(circle, ${HUMAN_SIGNAL.brightOrange} 0%, transparent 70%)`, opacity: 0.16, filter: 'blur(40px)',
            }} />
          </Box>
          <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box
              data-contact-motion="dmark"
              sx={{
                display: 'inline-block',
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0) rotate(0deg)' : 'translateY(10px) rotate(5deg)',
                transition: t(0, 0.24),
              }}
            >
              {/* Human Signal Phase 3C: D2가 Mail CTA보다 시각 질량이 크지 않도록 md
               * 108px까지 낮췄다("D2 150px 하한" 폐기). 2차 재검토(라이트 액션 플레인
               * 도입)에서 2560 실측 후 QHD 값도 함께 재확인했다(art-direction-before.md
               * 5절 + 이번 회차 재확인 근거는 최종 보고서에 기록). */}
              <DMark
                size={72}
                tone="onDark"
                sx={{
                  width: { xs: 72, md: 100, lg: 116 }, height: { xs: 72, md: 100, lg: 116 },
                  '@media (min-width:1920px)': { width: 124, height: 124 },
                  '@media (min-width:2300px)': { width: 130, height: 130 },
                }}
              />
            </Box>
            <Typography
              data-contact-motion="identity"
              sx={{
                fontWeight: 700, fontSize: '1rem', color: HUMAN_SIGNAL.softWhite,
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(8px)',
                transition: t(0.05, 0.24),
              }}
            >
              DOHAN KIM
            </Typography>
            <Typography
              data-contact-motion="identity"
              sx={{
                fontSize: '0.9375rem', color: HUMAN_SIGNAL.steelMist,
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(8px)',
                transition: t(0.07, 0.24),
              }}
            >
              정리 · 연결 · 검증
            </Typography>
            <Box
              data-contact-motion="identity"
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                opacity: show ? 1 : 0,
                transform: show ? 'translateY(0)' : 'translateY(8px)',
                transition: t(0.09, 0.24),
              }}
            >
              <Box aria-hidden="true" sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: HUMAN_SIGNAL.mutedSage }} />
              <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', letterSpacing: '0.04em', color: HUMAN_SIGNAL.steelMist }}>
                OPEN TO WORK · {new Date().getFullYear()}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 우측 action plane — Soft White 68%. 밝은 배경 규칙(작은 텍스트=burntOrange,
         * 큰 헤드라인/본문=inkNavy·inkText)으로 전체 재색상화. */}
        <Box
          data-contact-motion="invite"
          sx={{
            position: 'relative', bgcolor: HUMAN_SIGNAL.softWhite,
            px: { xs: 3, sm: 6 }, py: { xs: 6, sm: 7 },
            [SPLIT_MQ]: { px: 8, py: 9 },
            [QHD_MQ]: { px: 11, py: 11 },
            minWidth: 0,
            opacity: show ? 1 : 0,
            transform: show ? 'translateY(0)' : 'translateY(12px)',
            transition: t(0.24, 0.34),
            '&:focus-within': { opacity: 1, transform: 'none', transition: 'none' },
          }}
        >
          <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.75rem', letterSpacing: '0.06em', mb: 2.5 }}>
            CONTACT
          </Typography>
          <Typography component="h2" sx={{
            fontWeight: 750, fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' }, lineHeight: 1.16, letterSpacing: '-0.02em',
            color: HUMAN_SIGNAL.inkNavy, mb: 2.5,
            '@media (min-width:1920px)': { fontSize: '3.75rem' },
            '@media (min-width:2300px)': { fontSize: '4.25rem' },
          }}>
            <Box component="span" sx={{ display: 'block' }}>함께 일할 기회를</Box>
            <Box component="span" sx={{ display: 'block' }}>찾고 있습니다.</Box>
          </Typography>
          <Typography sx={{
            color: HUMAN_SIGNAL.inkText, fontSize: { xs: '0.9375rem', md: '1rem' }, lineHeight: 1.65, mb: { xs: 3.5, md: 4.5 }, maxWidth: { xs: '100%', md: 680 }, wordBreak: 'keep-all',
            '@media (min-width:1920px)': { fontSize: '1.1875rem', maxWidth: 760 },
          }}>
            복잡한 정보를 정리하고, Figma 설계부터 반응형 UI 구현과 검증까지 연결합니다.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', gap: 1.5, mb: 3, alignItems: { sm: 'center' } }}>
            {/* Mail — light plane에서 눈에 띄어야 하므로 Ink Navy 채움 버튼으로 반전
             * (이전 dark 페이지에서는 Soft White 채움만으로 충분히 튀었다). */}
            <Box
              component="a"
              href={`mailto:${CONTACT_EMAIL}`}
              aria-label="이메일 보내기"
              sx={{
                bgcolor: HUMAN_SIGNAL.inkNavy, color: HUMAN_SIGNAL.softWhite, height: 60, px: 3.5, minWidth: 208,
                width: { xs: '100%', sm: 'auto' },
                borderRadius: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                textDecoration: 'none', fontWeight: 700, fontSize: '1.0625rem', whiteSpace: 'nowrap',
                transition: 'transform 180ms ease, box-shadow 180ms ease',
                boxShadow: '0 14px 30px rgba(12,20,32,0.22)',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 16px 34px rgba(12,20,32,0.3)' },
                '&:active': { transform: 'translateY(0)' },
                '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px', opacity: 1, transform: 'none' },
                '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
              }}
            >
              메일 보내기 <ActionIcon variant="internal" sx={{ color: HUMAN_SIGNAL.brightOrangeOnDark, fontSize: '1.15rem' }} />
            </Box>
            <Box
              component="a"
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub 프로필 새 탭에서 열기"
              sx={{
                bgcolor: 'transparent', color: HUMAN_SIGNAL.inkNavy, border: `1px solid ${HUMAN_SIGNAL.paperDeep}`, height: 48, px: 2.25, minWidth: 156,
                width: { xs: '100%', sm: 'auto' },
                borderRadius: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap',
                transition: 'border-color 180ms ease, color 180ms ease',
                '&:hover': { borderColor: HUMAN_SIGNAL.inkNavy, color: HUMAN_SIGNAL.burntOrange },
                '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px', opacity: 1 },
                '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
              }}
            >
              GitHub 보기 <ActionIcon variant="external" sx={{ color: HUMAN_SIGNAL.burntOrange }} />
            </Box>
            {PORTFOLIO_PDF_URL && (
              <Box
                component="a"
                href={PORTFOLIO_PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PDF 포트폴리오 새 탭에서 열기"
                sx={{
                  bgcolor: 'transparent', color: HUMAN_SIGNAL.inkNavy, border: `1px solid ${HUMAN_SIGNAL.paperDeep}`, height: 48, px: 2.25, minWidth: 156,
                  width: { xs: '100%', sm: 'auto' },
                  borderRadius: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                  textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap',
                  transition: 'border-color 180ms ease, color 180ms ease',
                  '&:hover': { borderColor: HUMAN_SIGNAL.inkNavy, color: HUMAN_SIGNAL.burntOrange },
                  '&:focus-visible': { outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px', opacity: 1 },
                  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                }}
              >
                PDF 포트폴리오 <ActionIcon variant="download" sx={{ color: HUMAN_SIGNAL.burntOrange }} />
              </Box>
            )}
          </Box>

          <Box sx={{ mt: { xs: 1, md: 1.5 }, pt: 2.5, borderTop: `1px solid ${HUMAN_SIGNAL.paperDeep}` }}>
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', letterSpacing: '0.06em', color: HUMAN_SIGNAL.burntOrange, mb: 1 }}>
              지원 분야
            </Typography>
            <Typography sx={{ fontSize: { xs: '0.9375rem', md: '1rem' }, color: HUMAN_SIGNAL.inkNavy, lineHeight: 1.6, wordBreak: 'keep-all' }}>
              {APPLICATION_ROLES.join(' · ')}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer — 2-pane 분할과 별개로, 전체 폭 Deep Harbor 마무리 strip(사이트 서명). */}
      <Box sx={{
        position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw',
        bgcolor: HUMAN_SIGNAL.deepHarbor,
      }}>
        <Container
          maxWidth={false}
          sx={{
            px: { xs: 3, sm: 6, md: 8 }, maxWidth: { xl: ULTRAWIDE_CONTENT_MAX_WIDTH + 128 }, mx: 'auto',
            '@media (min-width:1920px)': { maxWidth: HOME_WIDE_MAX_WIDTH, px: 8 },
          }}
        >
          <Box
            data-contact-motion="footer"
            sx={{
              display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 1,
              py: { xs: 2.5, md: 3 },
              opacity: show ? 1 : 0,
              transform: show ? 'translateY(0)' : 'translateY(6px)',
              transition: t(0.6, 0.27),
            }}
          >
            <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.steelMist, fontSize: '0.6875rem', letterSpacing: '0.04em' }}>
              DOHAN KIM · HUMAN SIGNAL
            </Typography>
            <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.steelMist, fontSize: '0.6875rem', letterSpacing: '0.04em' }}>
              {new Date().getFullYear()} PORTFOLIO
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ContactSection;
