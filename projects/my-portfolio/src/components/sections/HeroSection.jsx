import { useLayoutEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { scrollToSection } from '../../hooks/useScrollNav';
import {
  HERO_EYEBROW, HERO_HEADLINE_LINES, HERO_DESCRIPTION_LINES,
} from '../../data/portfolioMeta';
import { FONT_MONO, HUMAN_SIGNAL, ULTRAWIDE_CONTENT_MAX_WIDTH, HOME_WIDE_MAX_WIDTH } from '../../theme';
import DMark from '../brand/DMark';
import ActionIcon from '../ui/ActionIcon';
import QhdAmbientSignal from '../ui/QhdAmbientSignal';

/* Human Signal Phase 4A: 최신 Figma(Home Desktop 1440 254:3, Hero Motion Guide
 * 286:3, IDENTITY/SCATTER/ALIGN/SETTLE 키프레임 323:3/92/181/270)를 다시
 * 확인한 결과, Phase 3C의 "55/45 full-bleed 2-plane split(좌 Ink Navy 무배경 /
 * 우 Deep Harbor 뷰포트 끝까지)" 구조와 실제 화면(JobFlow proof window)은
 * 더 이상 최신안이 아니다. 최신 Hero는:
 * 1) 배경은 Hero 섹션 전체가 Ink Navy 단일 톤(좌우 분할 없음).
 * 2) 콘텐츠는 다른 섹션과 동일한 표준 max-width 컨테이너 안에 있다(전용
 *    100vw breakout 없음) — 우측 카드도 콘텐츠 폭 안에서 끝난다.
 * 3) 우측은 실제 화면(JobFlow)이 아니라 D2 중심 Signal Stage(동심원+격자+
 *    코너 chip 4개+점 5개+하단 3분할 signal bar) 카드다.
 * 4) 모션은 IDENTITY(0–220ms, 이름/헤드라인 등장) → SCATTER(220–720ms, 격자·
 *    점·chip이 각자 자리에 흐릿하게 등장) → ALIGN(720–1180ms, chip이 실제
 *    색으로 정렬) → SETTLE(1180–1460ms, D2와 하단 signal bar가 완성되며
 *    멈춤) 4단계, 총 약 1.46초, 최초 진입 1회, 이후 반복 없음이다.
 * review 캡처 모드(data-review-mode="true")에서는 애니메이션 없이 최종
 * 상태로 렌더링한다 — HomePage.jsx의 data-hero-reveal opacity>=0.99 계약은
 * eyebrow/H1/주 CTA 3곳에 그대로 유지한다. prefers-reduced-motion은
 * index.css의 전역 규칙(duration/delay를 0에 가깝게)이 처리한다. */
const isReviewCapture =
  (typeof window !== 'undefined' && window.__PORTFOLIO_REVIEW_MODE__ === true) ||
  (typeof document !== 'undefined' && document.documentElement?.getAttribute('data-review-mode') === 'true');

const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

const anim = (name, duration, delay, ease = EASE_OUT) =>
  isReviewCapture ? 'none' : `${name} ${duration}s ${ease} ${delay}s both`;

const SPLIT_MQ = '@media (min-width:900px)';
const QHD_MQ = '@media (min-width:1920px)';

/* Signal Stage 좌표는 Figma "Hero / Human Signal Identity Stage"(257:16,
 * 396:252 — 두 프레임 모두 548x600 동일 좌표) 노드 트리를 548x600 기준
 * %로 환산했다. 카드 자체를 aspect-ratio: 548 / 600 박스로 유지하고 그
 * 비율 안에서 절대좌표(%)로 배치하면 어떤 폭에서도 같은 구도를 유지한다. */
const STAGE_CHIPS = [
  { key: 'tl', left: '10%', top: '22%', width: '17.5%', height: '7%', tone: 'dark' },
  { key: 'tr', left: '70%', top: '18%', width: '13.9%', height: '9%', tone: 'dark' },
  { key: 'br', left: '72%', top: '64%', width: '19%', height: '7.7%', tone: 'light' },
  { key: 'bl', left: '8%', top: '68%', width: '13.5%', height: '9.7%', tone: 'dark' },
];

const STAGE_LINES = [
  { key: 'l1', left: '18%', top: '29%', width: '26%' },
  { key: 'l2', left: '58%', top: '27%', width: '16%' },
  { key: 'l3', left: '57%', top: '66%', width: '20%' },
  { key: 'l4', left: '22%', top: '68%', width: '20%' },
];

const STAGE_DOTS = [
  { key: 'd1', left: '15.3%', top: '19.3%', size: 8, color: 'mutedSage' },
  { key: 'd2', left: '81.1%', top: '15.2%', size: 10, color: 'brightOrange' },
  { key: 'd3', left: '85.2%', top: '69.3%', size: 9, color: 'brightOrange' },
  { key: 'd4', left: '13.3%', top: '75.3%', size: 8, color: 'mutedSage' },
  { key: 'd5', left: '49.5%', top: '9.5%', size: 6, color: 'steelMist' },
];

const BAR_SEGMENTS = [
  { key: 's1', color: 'mutedSage', flex: 34 },
  { key: 's2', color: 'steelMist', flex: 22 },
  { key: 's3', color: 'brightOrange', flex: 16 },
];

const HeroSignalStage = () => (
  <Box
    aria-hidden="true"
    sx={{
      position: 'relative', width: '100%', maxWidth: 460, mx: 'auto',
      aspectRatio: '548 / 600', borderRadius: '28px', overflow: 'hidden',
      bgcolor: HUMAN_SIGNAL.deepHarbor, border: `1px solid rgba(170,183,196,0.16)`,
      boxShadow: '0 30px 60px rgba(12,20,32,0.35)',
      [QHD_MQ]: { maxWidth: 500 },
      '@keyframes stageFadeIn': {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      '@keyframes stageDotIn': {
        from: { opacity: 0, transform: 'scale(0.4)' },
        to: { opacity: 1, transform: 'scale(1)' },
      },
      '@keyframes stageChipIn': {
        '0%': { opacity: 0, transform: 'translateY(8px)', filter: 'grayscale(1)' },
        '55%': { opacity: 1, transform: 'translateY(0)', filter: 'grayscale(1)' },
        '100%': { opacity: 1, transform: 'translateY(0)', filter: 'grayscale(0)' },
      },
      '@keyframes stageLineIn': {
        from: { opacity: 0, transform: 'scaleX(0)' },
        to: { opacity: 1, transform: 'scaleX(1)' },
      },
      '@keyframes stageD2In': {
        '0%': { opacity: 0, transform: 'translate(-50%, -50%) scale(0.9)', filter: 'grayscale(1)' },
        '18%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)', filter: 'grayscale(1)' },
        '80%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)', filter: 'grayscale(1)' },
        '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)', filter: 'grayscale(0)' },
      },
      '@keyframes stageBarIn': {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      '@keyframes stageSegmentIn': {
        from: { transform: 'scaleX(0)' },
        to: { transform: 'scaleX(1)' },
      },
    }}
  >
    {/* 격자 + 동심원 — SCATTER(220–720ms)에 흐릿하게 나타난다 */}
    <Box
      sx={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(to bottom, rgba(170,183,196,0.14) 0, rgba(170,183,196,0.14) 1px, transparent 1px, transparent 21%), repeating-linear-gradient(to right, rgba(170,183,196,0.14) 0, rgba(170,183,196,0.14) 1px, transparent 1px, transparent 20%)`,
        backgroundPosition: '0 10%, 18% 0',
        backgroundSize: '100% 84%, 82% 100%',
        opacity: isReviewCapture ? 1 : 0,
        animation: anim('stageFadeIn', 0.3, 0.22),
      }}
    />
    <Box sx={{
      position: 'absolute', left: '12%', top: '8%', width: '76%', height: '69.4%',
      borderRadius: '50%', border: '1px solid rgba(170,183,196,0.22)',
      opacity: isReviewCapture ? 1 : 0, animation: anim('stageFadeIn', 0.3, 0.26),
    }} />
    <Box sx={{
      position: 'absolute', left: '24%', top: '20%', width: '52%', height: '47.5%',
      borderRadius: '50%', border: '1px solid rgba(170,183,196,0.22)',
      opacity: isReviewCapture ? 1 : 0, animation: anim('stageFadeIn', 0.3, 0.3),
    }} />

    {/* 코너 chip 4개 — SCATTER에 흐리게 등장, ALIGN(720–1180ms)에 실제 색으로 정렬 */}
    {STAGE_CHIPS.map((chip, i) => (
      <Box
        key={chip.key}
        sx={{
          position: 'absolute', left: chip.left, top: chip.top, width: chip.width, height: chip.height,
          borderRadius: '10px',
          bgcolor: chip.tone === 'light' ? HUMAN_SIGNAL.softWhite : 'rgba(255,253,248,0.07)',
          border: chip.tone === 'light' ? 'none' : '1px solid rgba(170,183,196,0.22)',
          opacity: isReviewCapture ? 1 : 0,
          filter: isReviewCapture ? 'grayscale(0)' : undefined,
          animation: anim('stageChipIn', 0.9, 0.22 + i * 0.05),
        }}
      />
    ))}

    {/* 연결 stub 라인 4개 — ALIGN에 색이 붙으며 나타난다 */}
    {STAGE_LINES.map((line, i) => (
      <Box
        key={line.key}
        sx={{
          position: 'absolute', left: line.left, top: line.top, width: line.width, height: '2px',
          bgcolor: i % 2 === 0 ? HUMAN_SIGNAL.mutedSage : HUMAN_SIGNAL.brightOrange,
          transformOrigin: 'left center',
          opacity: isReviewCapture ? 1 : 0,
          transform: isReviewCapture ? 'scaleX(1)' : undefined,
          animation: anim('stageLineIn', 0.28, 0.72 + i * 0.05),
        }}
      />
    ))}

    {/* 점 5개 — SCATTER에 순서대로 등장 */}
    {STAGE_DOTS.map((dot, i) => (
      <Box
        key={dot.key}
        sx={{
          position: 'absolute', left: dot.left, top: dot.top, width: dot.size, height: dot.size,
          borderRadius: '50%', bgcolor: HUMAN_SIGNAL[dot.color],
          opacity: isReviewCapture ? 1 : 0,
          animation: anim('stageDotIn', 0.24, 0.24 + i * 0.06),
        }}
      />
    ))}

    {/* D2 signal core — IDENTITY 끝에 흐리게(grayscale) 나타나 SETTLE(1180–1460ms)에서
     * 실제 색(Soft White + Muted Sage + Bright Orange)으로 완성된 뒤 멈춘다 */}
    <Box
      sx={{
        position: 'absolute', left: '50%', top: '48.7%', width: '34%', aspectRatio: '1 / 1',
        opacity: isReviewCapture ? 1 : 0,
        filter: isReviewCapture ? 'grayscale(0)' : undefined,
        transform: isReviewCapture ? 'translate(-50%, -50%) scale(1)' : undefined,
        animation: anim('stageD2In', 1.46, 0),
      }}
    >
      <DMark size="100%" tone="onDark" sx={{ width: '100%', height: '100%' }} />
    </Box>

    {/* 하단 signal bar — ALIGN에 트랙이 나타나고, SETTLE에 3개 구간이 순서대로 채워지며 완성된다 */}
    <Box
      sx={{
        position: 'absolute', left: '18%', top: '84%', width: '64%', height: '5.5%', minHeight: 18,
        bgcolor: 'rgba(12,20,32,0.55)', borderRadius: '999px',
        display: 'flex', alignItems: 'center', gap: '10%', px: '8%',
        opacity: isReviewCapture ? 1 : 0,
        animation: anim('stageBarIn', 0.2, 0.72),
      }}
    >
      {BAR_SEGMENTS.map((seg, i) => (
        <Box
          key={seg.key}
          sx={{
            flex: seg.flex, height: 4, borderRadius: '2px', bgcolor: HUMAN_SIGNAL[seg.color],
            transformOrigin: 'left center',
            transform: isReviewCapture ? 'scaleX(1)' : 'scaleX(0)',
            animation: anim('stageSegmentIn', 0.14, 1.18 + i * 0.08),
          }}
        />
      ))}
    </Box>
  </Box>
);

/* Figma "Hero"(432:303) 실측 y=250 — 문서(document) 좌표 기준이다. Header는
 * position:fixed라 Hero section 흐름 밖에 있고(App.jsx의 NAVBAR_HEIGHT 스페이서가
 * 그 높이만큼 실제 여백을 만든다), 그 스페이서 높이를 하드코딩하면 나중에 Header
 * 높이가 바뀔 때 조용히 어긋난다 — 실제 getBoundingClientRect()로 Hero section의
 * document top을 재서 "문서 y=250"이 되도록 section-relative top을 역산한다. */
const HERO_SIGNAL_DOCUMENT_TOP = 250;

const HeroSection = () => {
  const sectionRef = useRef(null);
  const [heroSignalTop, setHeroSignalTop] = useState(null);

  useLayoutEffect(() => {
    const measure = () => {
      const section = sectionRef.current;
      if (!section) return;
      const sectionDocumentTop = section.getBoundingClientRect().top + window.scrollY;
      setHeroSignalTop(HERO_SIGNAL_DOCUMENT_TOP - sectionDocumentTop);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
  <Box
    ref={sectionRef}
    component="section"
    id="home"
    aria-label="소개"
    sx={{
      position: 'relative', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.inkNavy,
      width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw',
      py: { xs: 7, sm: 9, md: 0 },
      [SPLIT_MQ]: { display: 'flex', alignItems: 'center', minHeight: '88vh' },
      '@keyframes heroCopyIn': {
        from: { opacity: 0, transform: 'translateY(14px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
      },
      '@keyframes heroStageIn': {
        from: { opacity: 0, transform: 'translateY(18px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
      },
    }}
  >
    {/* 배경 장식 — Figma Hero 배경(BG / D2 Watermark, Alignment Rail, Orange/Sage
     * Halo, 256:2 하위)을 단순화해 재현한다. 저대비, aria-hidden, pointer-events:none.
     * QHD(1920px+)에서는 콘텐츠가 ULTRAWIDE_CONTENT_MAX_WIDTH(1312)로 고정되면서
     * 생기는 좌측 여백에 QhdAmbientSignal(Figma QHD 2560 347:383의
     * "QHD / Ambient Signal Left" 432:303 실측)을 추가로 배치한다 — 1440 균형은
     * 그대로 두고 QHD 여백만 채운다. */}
    <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <QhdAmbientSignal
        variant="hero-left"
        sx={{
          left: `calc((100vw - ${HOME_WIDE_MAX_WIDTH}px) / 2 - 470px)`,
          // 측정 전(마운트 직후 1프레임)에는 대략치로 렌더해 top:0으로 잠깐 튀지 않게 한다.
          top: heroSignalTop ?? HERO_SIGNAL_DOCUMENT_TOP,
        }}
      />
      <Box sx={{
        position: 'absolute', top: '2%', right: '4%', width: 480, height: 480, opacity: 0.05,
        [SPLIT_MQ]: { display: 'block' }, display: 'none',
      }}>
        <DMark size="100%" tone="onDark" decorative sx={{ width: '100%', height: '100%' }} />
      </Box>
      <Box sx={{
        position: 'absolute', top: '18%', right: '20%', width: 360, height: 360, borderRadius: '50%',
        background: `radial-gradient(circle, ${HUMAN_SIGNAL.brightOrange} 0%, transparent 70%)`, opacity: 0.1, filter: 'blur(60px)',
      }} />
      <Box sx={{
        position: 'absolute', top: '4%', right: '30%', width: 700, height: 700, borderRadius: '50%',
        background: `radial-gradient(circle, ${HUMAN_SIGNAL.mutedSage} 0%, transparent 70%)`, opacity: 0.06, filter: 'blur(70px)',
      }} />
    </Box>

    <Box
      sx={{
        position: 'relative', width: '100%', mx: 'auto',
        px: { xs: 3, sm: 6, md: 8 },
        maxWidth: { xl: ULTRAWIDE_CONTENT_MAX_WIDTH + 128 },
        '@media (min-width:1920px)': { maxWidth: HOME_WIDE_MAX_WIDTH, px: 8 },
        [SPLIT_MQ]: { display: 'grid', gridTemplateColumns: '55fr 45fr', columnGap: 6, alignItems: 'center' },
        [QHD_MQ]: { columnGap: 10 },
      }}
    >
      {/* 좌측 — Identity Copy: Header에 이미 있는 D2+이름을 반복하지 않고 작은
       * eyebrow 한 줄로만 정체성을 표시한다(최신 Figma 기준). */}
      <Box sx={{ position: 'relative', py: { xs: 0, sm: 0, md: 8 }, [SPLIT_MQ]: { py: 0 } }}>
        <Typography
          data-hero-reveal="true"
          sx={{
            fontFamily: FONT_MONO, color: HUMAN_SIGNAL.brightOrange,
            fontSize: '0.75rem', letterSpacing: '0.04em', mb: { xs: 2, md: 2.5 },
            opacity: isReviewCapture ? 1 : 0,
            animation: anim('heroCopyIn', 0.24, 0),
          }}
        >
          {HERO_EYEBROW}
        </Typography>

        <Typography
          variant="h1"
          component="h1"
          data-hero-reveal="true"
          sx={{
            fontWeight: 780, color: HUMAN_SIGNAL.softWhite,
            fontSize: { xs: '2.25rem', sm: '2.6rem', md: '3.1rem', lg: '3.5rem' },
            lineHeight: { xs: 1.28, md: 1.12 },
            letterSpacing: '-0.02em',
            mb: { xs: 2.5, md: 3 },
            [QHD_MQ]: { fontSize: 'clamp(4rem, 3.2vw, 5.25rem)' },
            opacity: isReviewCapture ? 1 : 0,
            animation: anim('heroCopyIn', 0.3, 0.05),
          }}
        >
          {HERO_HEADLINE_LINES.map((line) => (
            <Box key={line} component="span" sx={{ display: 'block' }}>{line}</Box>
          ))}
        </Typography>

        <Box
          sx={{
            mb: { xs: 4, md: 5 },
            opacity: isReviewCapture ? 1 : 0,
            animation: anim('heroCopyIn', 0.28, 0.09),
          }}
        >
          {HERO_DESCRIPTION_LINES.map((line) => (
            <Typography
              key={line}
              sx={{
                color: HUMAN_SIGNAL.steelMist, lineHeight: 1.75, maxWidth: 460,
                fontSize: { xs: '0.9375rem', md: '1.0625rem' },
                [QHD_MQ]: { fontSize: '1.125rem', maxWidth: 520 },
              }}
            >
              {line}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 2 }, alignItems: { xs: 'stretch', sm: 'center' } }}>
          <Box
            component="button"
            type="button"
            data-hero-reveal="true"
            onClick={() => scrollToSection('projects')}
            aria-label="대표 프로젝트 섹션으로 이동"
            sx={{
              bgcolor: HUMAN_SIGNAL.softWhite, color: HUMAN_SIGNAL.inkNavy,
              border: 0, cursor: 'pointer', height: 56, px: 3, borderRadius: '14px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
              fontWeight: 700, fontSize: '0.9375rem', fontFamily: 'inherit', whiteSpace: 'nowrap',
              opacity: isReviewCapture ? 1 : 0,
              animation: anim('heroCopyIn', 0.26, 0.16),
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
            onClick={() => scrollToSection('about')}
            aria-label="기술 역량 섹션으로 이동"
            sx={{
              bgcolor: 'transparent', border: `1px solid ${HUMAN_SIGNAL.paperDeep}`, cursor: 'pointer',
              height: 56, px: 3, borderRadius: '14px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
              color: HUMAN_SIGNAL.softWhite, fontWeight: 500, fontSize: '0.9375rem', fontFamily: 'inherit', whiteSpace: 'nowrap',
              opacity: isReviewCapture ? 1 : 0,
              animation: anim('heroCopyIn', 0.26, 0.2),
              transition: 'border-color 180ms ease, color 180ms ease',
              '&:hover': { borderColor: HUMAN_SIGNAL.softWhite, color: HUMAN_SIGNAL.brightOrangeOnDark },
              '&:focus-visible': {
                outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`, outlineOffset: '3px',
                opacity: 1, transform: 'none', animation: 'none',
              },
              '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
            }}
          >
            기술 역량 보기
            <ActionIcon variant="internal" sx={{ color: HUMAN_SIGNAL.brightOrangeOnDark }} />
          </Box>
        </Box>
      </Box>

      {/* 우측 — D2 Signal Stage. 최종 레이아웃 공간을 aspect-ratio로 처음부터
       * 확보해 CLS 없이 애니메이션이 그 안에서만 일어난다. */}
      <Box
        sx={{
          mt: { xs: 6, sm: 7, md: 0 }, [SPLIT_MQ]: { mt: 0 },
          opacity: isReviewCapture ? 1 : 0,
          animation: anim('heroStageIn', 0.4, 0.1),
        }}
      >
        <HeroSignalStage />
      </Box>
    </Box>
  </Box>
  );
};

export default HeroSection;
