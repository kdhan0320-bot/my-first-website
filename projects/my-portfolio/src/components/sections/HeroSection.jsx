import { Box, Typography } from '@mui/material';
import { scrollToSection } from '../../hooks/useScrollNav';
import {
  HERO_LABEL, HERO_HEADLINE_LINES, HERO_DESCRIPTION_LINES,
} from '../../data/portfolioMeta';
import { ALL_PROJECTS } from '../../data/projectsData';
import { HUMAN_SIGNAL } from '../../theme';
import DMark from '../brand/DMark';
import ActionIcon from '../ui/ActionIcon';

/* Human Signal Phase 3C: Identity-First 재구성. Phase 2F/3B의 "좌측 카피
 * 38~42% + 우측 실제 화면 58~62%" 구조는 2560px 실측(before-hero-2560.png)에서
 * JobFlow 스크린샷이 시각적 주인공이 되고 "김도한"이라는 이름 텍스트가 Hero
 * 어디에도 없다는 문제를 반복했다(ChatGPT 재검토 확정, art-direction-before.md
 * 1절). 이번 회차는 다음을 바꾼다:
 * 1) 좌측 plane에 이름(DOHAN KIM)을 명시적으로 배치해 identity를 만든다.
 * 2) split 비율을 55/45(QHD 52/48)로 좌측(정체성)에 유리하게 넘긴다.
 * 3) 우측 plane을 "실제 화면 전시대"에서 "D2 origin → 정리/연결/검증 signal
 *    node 3개 → 축소된 JobFlow proof window"로 재구성한다 — work-method를
 *    시각화하고, 실제 UI는 축소된 근거 자료(proof)로만 남긴다. Bus 이미지는
 *    Hero에서 제거한다(Projects 섹션에 이미 노출되어 정보 손실 없음).
 * 이전 회차의 42/58·40/60 split, JobFlow full-width, Bus overlap 수치는
 * "실제 화면이 항상 주인공"이라는 전제 자체가 이번 지시와 충돌해 폐기한다
 * (art-direction-before.md 7절, PNG 재검증 기준).
 *
 * review 캡처 모드(data-review-mode="true")에서는 애니메이션 없이 최종
 * 상태로 렌더링한다 — HomePage.jsx의 data-hero-reveal opacity>=0.99 계약은
 * 그대로 유지(identity block, H1, 주 CTA 3곳). prefers-reduced-motion은
 * index.css의 전역 규칙이 처리한다. */
const isReviewCapture =
  (typeof window !== 'undefined' && window.__PORTFOLIO_REVIEW_MODE__ === true) ||
  (typeof document !== 'undefined' && document.documentElement?.getAttribute('data-review-mode') === 'true');

const EASE_ALIGN = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE_VERIFY = 'cubic-bezier(0.4, 0, 0.2, 1)';

const anim = (name, duration, delay, ease = EASE_ALIGN) =>
  isReviewCapture ? 'none' : `${name} ${duration}s ${ease} ${delay}s both`;

const findProject = (id) => ALL_PROJECTS.find((p) => p.id === id);

const SPLIT_MQ = '@media (min-width:1100px)';
const QHD_MQ = '@media (min-width:1920px)';

/* 우측 canvas의 work-method 신호 노드. About/Contact와 동일한 "정리·연결·검증"
 * 어휘를 재사용해 세 화면 모두 같은 이야기를 하게 한다(신규 카피 아님). */
const SIGNAL_NODES = [
  { num: '01', word: '정리' },
  { num: '02', word: '연결' },
  { num: '03', word: '검증', accent: true },
];

const HeroSection = () => {
  const jobflow = findProject('jobflow');

  return (
    <Box
      component="section"
      id="home"
      aria-label="소개"
      sx={{
        position: 'relative', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.inkNavy,
        width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw',
        display: 'block',
        [SPLIT_MQ]: { display: 'grid', gridTemplateColumns: '55fr 45fr', minHeight: '92vh' },
        [QHD_MQ]: { gridTemplateColumns: '52fr 48fr' },
        '@keyframes heroCopyIn': {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes heroCopyInMobile': {
          from: { opacity: 0, transform: 'translateY(9px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes heroDMarkIn': {
          from: { opacity: 0, transform: 'translateY(24px) rotate(6deg)' },
          to: { opacity: 1, transform: 'translateY(0) rotate(0deg)' },
        },
        '@keyframes heroDMarkInMobile': {
          from: { opacity: 0, transform: 'translateY(12px) rotate(3deg)' },
          to: { opacity: 1, transform: 'translateY(0) rotate(0deg)' },
        },
        /* proof window(JobFlow)는 clip-path로 "화면이 열리는" 느낌을 준다(opacity만으로
         * 등장하지 않게 — 지시서 7-3 "opacity-only 금지"). 박스 크기는 처음부터 최종
         * 상태로 고정돼 있고 내용만 clip되므로 layout shift가 없다. */
        '@keyframes heroMediaDesktopIn': {
          from: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
          to: { opacity: 1, clipPath: 'inset(0 0% 0 0)' },
        },
        '@keyframes heroMediaDesktopInMobile': {
          from: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
          to: { opacity: 1, clipPath: 'inset(0 0% 0 0)' },
        },
        '@keyframes heroCtaIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        /* signal node — canvas의 정리/연결/검증 각 노드가 살짝 옆에서 자리잡는다. */
        '@keyframes heroNodeIn': {
          from: { opacity: 0, transform: 'translateX(-10px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        /* signal path — D2에서 proof window까지 이어지는 세로선 구간들이 위에서
         * 아래로 자라난다(scaleY, transform-origin:top). 끝난 뒤 사라지지 않고
         * 계속 보인다(Hero B의 1회성 pulse와 달리 canvas 다이어그램의 상시 구조선). */
        '@keyframes heroPathGrow': {
          from: { opacity: 0, transform: 'scaleY(0)' },
          to: { opacity: 1, transform: 'scaleY(1)' },
        },
      }}
    >
      {/* 좌측 plane — Identity(0~450ms 안에 이름+헤드라인이 읽혀야 함) */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          px: { xs: 3, sm: 6, md: 8 }, py: { xs: 6, md: 8 },
          [SPLIT_MQ]: { px: 8, py: 0 },
          [QHD_MQ]: { px: 12 },
        }}
      >
        {/* Identity block — D2 + 이름(DOHAN KIM, Navbar 로고와 동일 표기) + 역할 카피.
         * Phase 3B까지 없던 이름 텍스트를 여기서 처음 명시한다(핵심 결함 수정). */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: { xs: 3, md: 3.5 } }}>
          <Box
            data-hero-motion="dmark"
            sx={{
              display: 'inline-block', flexShrink: 0,
              opacity: isReviewCapture ? 1 : 0,
              animation: { xs: anim('heroDMarkInMobile', 0.24, 0), md: anim('heroDMarkIn', 0.3, 0) },
            }}
          >
            <DMark size={34} tone="onDark" />
          </Box>
          <Box
            data-hero-reveal="true"
            data-hero-motion="identity"
            sx={{
              display: 'flex', flexDirection: 'column', gap: 0.25,
              opacity: isReviewCapture ? 1 : 0,
              animation: { xs: anim('heroCopyInMobile', 0.24, 0), md: anim('heroCopyIn', 0.3, 0) },
            }}
          >
            <Typography sx={{
              fontWeight: 700, color: HUMAN_SIGNAL.softWhite, letterSpacing: '0.01em',
              fontSize: { xs: '1.0625rem', md: '1.125rem' },
              [QHD_MQ]: { fontSize: '1.375rem' },
            }}>
              DOHAN KIM
            </Typography>
            <Typography sx={{ fontWeight: 500, color: HUMAN_SIGNAL.steelMist, fontSize: { xs: '0.8125rem', md: '0.875rem' } }}>
              {HERO_LABEL}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="h1"
          component="h1"
          data-hero-reveal="true"
          data-hero-motion="copy"
          sx={{
            fontWeight: 780,
            fontSize: { xs: '2.25rem', sm: '2.6rem', md: '3.1rem', lg: '3.5rem' },
            lineHeight: { xs: 1.28, md: 1.12 },
            letterSpacing: '-0.02em',
            mb: { xs: 2.5, md: 3 },
            [QHD_MQ]: { fontSize: 'clamp(4rem, 3.2vw, 5.25rem)' },
            opacity: isReviewCapture ? 1 : 0,
            animation: { xs: anim('heroCopyInMobile', 0.26, 0.08), md: anim('heroCopyIn', 0.35, 0.1) },
          }}
        >
          <Box component="span" sx={{ display: 'block', color: HUMAN_SIGNAL.softWhite }}>{HERO_HEADLINE_LINES[0]}</Box>
          <Box component="span" sx={{ display: 'block', color: HUMAN_SIGNAL.brightOrange }}>{HERO_HEADLINE_LINES[1]}</Box>
        </Typography>

        <Box
          data-hero-motion="copy"
          sx={{
            mb: { xs: 4, md: 5 },
            opacity: isReviewCapture ? 1 : 0,
            animation: { xs: anim('heroCopyInMobile', 0.24, 0.16), md: anim('heroCopyIn', 0.32, 0.22) },
          }}
        >
          {HERO_DESCRIPTION_LINES.map((line) => (
            <Typography
              key={line}
              sx={{
                color: HUMAN_SIGNAL.steelMist, lineHeight: 1.75, maxWidth: 460,
                fontSize: { xs: '0.9375rem', md: '1rem' },
                [QHD_MQ]: { fontSize: '1.125rem', maxWidth: 520 },
              }}
            >
              {line}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 2.5 }, alignItems: { xs: 'stretch', sm: 'center' } }}>
          <Box
            component="button"
            type="button"
            data-hero-reveal="true"
            data-hero-motion="cta"
            onClick={() => scrollToSection('projects')}
            aria-label="대표 프로젝트 섹션으로 이동"
            sx={{
              bgcolor: HUMAN_SIGNAL.softWhite, color: HUMAN_SIGNAL.inkNavy,
              border: 0, cursor: 'pointer', height: 54, px: 3, borderRadius: '16px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
              fontWeight: 500, fontSize: '0.9375rem', fontFamily: 'inherit', whiteSpace: 'nowrap',
              opacity: isReviewCapture ? 1 : 0,
              animation: { xs: anim('heroCtaIn', 0.24, 0.78, EASE_VERIFY), md: anim('heroCtaIn', 0.3, 1.11, EASE_VERIFY) },
              transition: 'transform 180ms ease, box-shadow 180ms ease',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 24px rgba(0,0,0,0.35)' },
              '&:active': { transform: 'translateY(0)' },
              '&:focus-visible': {
                outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px',
                opacity: 1, transform: 'none', animation: 'none',
              },
              '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
            }}
          >
            대표 프로젝트 보기
            <ActionIcon variant="internal" sx={{ color: HUMAN_SIGNAL.burntOrange }} />
          </Box>
          <Box
            component="button"
            type="button"
            data-hero-motion="cta"
            onClick={() => scrollToSection('about')}
            aria-label="작업 방식 섹션으로 이동"
            sx={{
              bgcolor: 'transparent', border: `1px solid ${HUMAN_SIGNAL.steelMist}`, cursor: 'pointer',
              height: 54, px: 3, borderRadius: '16px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
              color: HUMAN_SIGNAL.softWhite, fontWeight: 500, fontSize: '0.9375rem', fontFamily: 'inherit', whiteSpace: 'nowrap',
              opacity: isReviewCapture ? 1 : 0,
              animation: { xs: anim('heroCtaIn', 0.24, 0.82, EASE_VERIFY), md: anim('heroCtaIn', 0.25, 1.16, EASE_VERIFY) },
              transition: 'border-color 180ms ease, color 180ms ease',
              '&:hover': { borderColor: HUMAN_SIGNAL.softWhite, color: HUMAN_SIGNAL.brightOrangeOnDark },
              '&:focus-visible': {
                outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px',
                opacity: 1, transform: 'none', animation: 'none',
              },
              '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
            }}
          >
            작업 방식 보기
            <ActionIcon variant="internal" sx={{ color: HUMAN_SIGNAL.brightOrangeOnDark }} />
          </Box>
        </Box>
      </Box>

      {/* 우측 plane — canvas(work-method 25~30% + proof 20~30%). D2 origin →
       * signal path → 정리/연결/검증 node 3개 → 축소된 JobFlow proof window.
       * Bus 이미지는 여기서 제거한다(Projects 섹션에 이미 노출됨). */}
      <Box
        sx={{
          position: 'relative', bgcolor: HUMAN_SIGNAL.deepHarbor,
          px: { xs: 3, sm: 6 }, py: { xs: 4.5, sm: 7 },
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          [SPLIT_MQ]: { px: 0, py: 0, minHeight: '92vh' },
        }}
      >
        {/* Human Signal Phase 3C 수정: 이전엔 이 wrapper가 position:absolute;inset:0로
         * 부모(grid item)에 기대어 높이를 정했다 — grid item 자체는 절대배치 자식만
         * 갖고 있어 실제 CSS 높이가 auto로 붕괴되고, 그 결과 다이어그램이 좌측
         * copy plane의 짧은 콘텐츠 높이에 맞춰 중앙정렬되면서 proof window가 1440x900
         * 실측(after-hero-1440.png)에서 화면 밖으로 잘려 나가는 문제가 있었다. 부모
         * 자체(위 Box)에 명시적 minHeight:92vh + flex center를 주고, 이 wrapper는
         * 일반 흐름(absolute 아님)으로 되돌려 실제 콘텐츠 높이만큼만 차지하게 한다. */}
        <Box
          sx={{
            width: '100%', maxWidth: 400, mx: 'auto',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            [SPLIT_MQ]: { maxWidth: 420 },
            [QHD_MQ]: { maxWidth: 460, transform: 'scale(1.13)', transformOrigin: 'center center' },
          }}
        >
          {/* origin D2 — canvas 다이어그램의 시작점 */}
          <Box
            data-hero-motion="canvas-dmark"
            aria-hidden="true"
            sx={{
              opacity: isReviewCapture ? 1 : 0,
              animation: { xs: anim('heroDMarkInMobile', 0.22, 0.14), md: anim('heroDMarkIn', 0.3, 0.18) },
            }}
          >
            <DMark size={40} tone="onDark" />
          </Box>

          {/* signal path + node 3개 — 세로 다이어그램. 각 connector는 독립된
           * scaleY 세그먼트라 절대좌표 계산 없이도 반응형으로 안전하다. */}
          {SIGNAL_NODES.map((node, i) => (
            <Box key={node.word} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <Box
                aria-hidden="true"
                data-hero-motion="canvas-path"
                sx={{
                  width: '2px', height: { xs: 14, sm: 22 }, bgcolor: HUMAN_SIGNAL.steelMist, opacity: isReviewCapture ? 1 : 0,
                  transformOrigin: 'top center',
                  animation: {
                    xs: anim('heroPathGrow', 0.2, 0.22 + i * 0.06),
                    md: anim('heroPathGrow', 0.26, 0.3 + i * 0.08),
                  },
                }}
              />
              <Box
                data-hero-motion="canvas-node"
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1, py: { xs: 0.5, sm: 0.75 }, px: 1.5,
                  borderRadius: '999px', border: `1px solid rgba(170,183,196,0.24)`,
                  opacity: isReviewCapture ? 1 : 0,
                  animation: {
                    xs: anim('heroNodeIn', 0.22, 0.28 + i * 0.06),
                    md: anim('heroNodeIn', 0.28, 0.38 + i * 0.08),
                  },
                }}
              >
                <Box aria-hidden="true" sx={{
                  width: 7, height: 7, borderRadius: '2px', flexShrink: 0,
                  bgcolor: node.accent ? HUMAN_SIGNAL.brightOrange : HUMAN_SIGNAL.mutedSage,
                }} />
                <Typography sx={{ fontFamily: 'monospace', fontSize: '0.6875rem', letterSpacing: '0.04em', color: HUMAN_SIGNAL.brightOrangeOnDark }}>
                  {node.num}
                </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: HUMAN_SIGNAL.softWhite }}>
                  {node.word}
                </Typography>
              </Box>
            </Box>
          ))}

          {/* proof window — JobFlow 실제 화면(축소, 근거 자료로만 노출) */}
          {jobflow?.thumbnailUrl && (
            <Box sx={{ width: '100%', mt: { xs: 2, sm: 3 }, [QHD_MQ]: { mt: 2 } }}>
              <Box
                aria-hidden="true"
                data-hero-motion="canvas-path"
                sx={{
                  width: '2px', height: { xs: 14, sm: 20 }, bgcolor: HUMAN_SIGNAL.steelMist, mx: 'auto', opacity: isReviewCapture ? 1 : 0,
                  transformOrigin: 'top center',
                  [QHD_MQ]: { height: 14 },
                  animation: { xs: anim('heroPathGrow', 0.2, 0.42), md: anim('heroPathGrow', 0.24, 0.58) },
                }}
              />
              <Typography sx={{
                fontFamily: 'monospace', fontSize: '0.6875rem', letterSpacing: '0.06em', color: HUMAN_SIGNAL.brightOrangeOnDark,
                mb: 1, opacity: isReviewCapture ? 1 : 0,
                animation: { xs: anim('heroNodeIn', 0.2, 0.46), md: anim('heroNodeIn', 0.24, 0.62) },
              }}>
                PROOF
              </Typography>
              <Box
                data-hero-motion="proof"
                sx={{
                  width: '100%', borderRadius: '10px', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.softWhite,
                  boxShadow: '0 24px 50px rgba(0,0,0,0.32)', position: 'relative',
                  opacity: isReviewCapture ? 1 : 0,
                  clipPath: isReviewCapture ? 'inset(0 0% 0 0)' : undefined,
                  animation: { xs: anim('heroMediaDesktopInMobile', 0.4, 0.48), md: anim('heroMediaDesktopIn', 0.55, 0.64) },
                }}
              >
                <Box sx={{ display: 'flex', gap: '6px', alignItems: 'center', height: 24, px: 1.5, bgcolor: HUMAN_SIGNAL.warmPaper }}>
                  <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: HUMAN_SIGNAL.brightOrange }} />
                  <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: HUMAN_SIGNAL.mutedSage }} />
                  <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: HUMAN_SIGNAL.steelMist }} />
                </Box>
                {/* Human Signal Phase 3C 2차 재검토: 이 이미지는 Hero 최초 뷰포트 안에
                 * 항상 보이는 above-the-fold 콘텐츠라 loading="lazy"가 맞지 않았다 —
                 * reveal 애니메이션(컨테이너 opacity/clip-path)은 고정 타이머로
                 * 완료되는데, 이미지 자체는 브라우저의 lazy 판단에 따라 로딩이
                 * 늦어질 수 있어 애니메이션은 끝났지만 실제 비트맵은 아직 없는
                 * 상태가 재현됐다(diag-clip.png로 확인: opacity 1인데 이미지 미표시).
                 * 즉시 로드하도록 eager로 바꾼다. */}
                <Box component="img" src={jobflow.thumbnailUrl} alt="JobFlow 업무 대시보드 실제 화면" loading="eager"
                  sx={{ width: '100%', height: 'auto', objectFit: 'contain', p: 1, bgcolor: HUMAN_SIGNAL.softWhite }} />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
