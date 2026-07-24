import { Box, Container, Typography } from '@mui/material';
import RevealOnScroll from '../ui/RevealOnScroll';
import DMark from '../brand/DMark';
import QhdAmbientSignal from '../ui/QhdAmbientSignal';
import QhdSectionIndex from '../ui/QhdSectionIndex';
import { FONT_MONO, HUMAN_SIGNAL, ULTRAWIDE_CONTENT_MAX_WIDTH, HOME_WIDE_MAX_WIDTH } from '../../theme';

/* Home의 유일한 About 섹션(Figma Human Signal Home v8 About 266:53). 별도의
 * /about 페이지는 존재하지 않으며, `/about` 접근은 App.jsx의 <Navigate>를
 * 통해 이 섹션으로 연결된다.
 *
 * Human Signal Phase 4A: 최신 Figma를 다시 확인한 결과 Phase 3C의 정리·연결·
 * 검증 밴드 + Capability Studio(dark 3레인) + 5단계 Working Process는 더 이상
 * 최신안에 없다 — 최신 About은 다음 두 블록뿐이다.
 * 1) Intro — 좌 헤드라인(ABOUT / CAPABILITIES) / 우 origin 배경 카드(BACKGROUND).
 * 2) Skill Matrix — Warm Paper 카드 하나 안에 좌측 소개(CAPABILITIES / VERIFIED)
 *    + 우측 3개 Skill Card(01 UX/UI·그래픽 설계 / 02 반응형 구현 / 03 품질 검증).
 * 섹션 바탕색도 Phase 3C의 Warm Paper에서 Soft White로 바뀌었다(266:53 실측,
 * Origin·Skill Matrix 카드가 그 위의 Warm Paper "종이" 표면으로 대비된다). */

/* 줄 끝 공백은 시각적으로 보이지 않지만 보조기술이 읽는 textContent에서
 * 단어가 붙지 않게 한다(Phase 4B 접근성 재검사에서 발견). */
const ABOUT_HEADLINE = ['제가 할 수 있는 일을, ', '실제 결과물 기준으로 보여드립니다.'];

const ORIGIN_TEXT =
  '생산 현장과 구매관리에서 익힌 기준 확인·누락 방지 습관이 정보 구조, 반응형 구현, 접근성 검증 기준으로 이어졌습니다.';

const SKILL_INTRO_LINES = ['설계하고, ', '구현하고, ', '검증합니다.'];
const SKILL_INTRO_BODY = '숙련도 퍼센트 대신, 결과물에서 확인 가능한 기술과 구현 범위만 적습니다.';

/* 숙련도 %·별점·전문가 표현은 넣지 않는다 — purpose/tools 문구는 Figma
 * Skill Card(318:112/119/126) visible text를 그대로 옮겼다. */
const SKILL_CARDS = [
  {
    index: '01', accent: HUMAN_SIGNAL.mutedSage,
    title: 'UX/UI·그래픽 설계',
    purpose: '정보 위계·사용자 흐름·화면 구조를 설계합니다.',
    tools: ['Figma · Photoshop · Illustrator', 'IA · Auto Layout · Prototype'],
  },
  {
    index: '02', accent: HUMAN_SIGNAL.steelMist,
    title: '반응형 구현',
    purpose: '설계를 여러 화면 폭에서 작동하는 UI로 구현합니다.',
    tools: ['HTML · CSS · JavaScript', 'React'],
  },
  {
    index: '03', accent: HUMAN_SIGNAL.brightOrange,
    title: '품질 검증',
    purpose: '상태·접근성·브라우저·회귀 문제를 확인합니다.',
    tools: ['Playwright · Build/Lint', 'Git'],
  },
];

const AboutSection = () => {
  return (
    <Box
      component="section"
      id="about"
      aria-label="소개"
      sx={{ position: 'relative', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.softWhite, pt: { xs: 6.5, md: 13 }, pb: { xs: 6.5, md: 14 } }}
    >
      {/* QHD(1920+) 전용 외곽 신호 — Figma 432:313, About 콘텐츠보다 강하지 않게 저대비.
       * top:260은 Figma About Right(432:313) section-relative 실측값(y=1120, About
       * section 시작 860 기준 1120-860=260). About section 자체가 위치 기준(relative)이라
       * Hero처럼 Header 오프셋 보정이 필요 없다. */}
      <QhdAmbientSignal variant="about-right" sx={{ right: `calc((100vw - ${HOME_WIDE_MAX_WIDTH}px) / 2 - 470px)`, top: 260 }} />
      <QhdSectionIndex id="about" index="01" label="ABOUT / CAPABILITIES" side="left" indexTop={220} labelTop={380} indexOffset={502} labelOffset={434} />

      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, sm: 6, md: 8 },
          maxWidth: { xl: ULTRAWIDE_CONTENT_MAX_WIDTH + 128 },
          mx: 'auto', position: 'relative',
          '@media (min-width:1920px)': { maxWidth: HOME_WIDE_MAX_WIDTH, px: 8 },
        }}
      >
        {/* Intro — 좌 헤드라인 / 우 origin 배경 카드(Warm Paper) */}
        <Box sx={{
          display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0,58fr) minmax(0,38fr)' },
          columnGap: { md: 6 }, rowGap: { xs: 4, md: 0 }, alignItems: 'end',
          '@media (min-width:1920px)': { columnGap: 9 },
        }}>
          <Box>
            <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.75rem', letterSpacing: '0.06em', mb: { xs: 2, md: 3 } }}>
              ABOUT / CAPABILITIES
            </Typography>
            <RevealOnScroll y={14} duration={0.45}>
              <Typography
                component="h2"
                sx={{
                  fontWeight: 750,
                  fontSize: { xs: '2.125rem', sm: '2.6rem', md: '2.75rem' },
                  lineHeight: { xs: 1.28, md: 1.2 },
                  letterSpacing: '-0.02em',
                  color: HUMAN_SIGNAL.inkNavy,
                  '@media (min-width:1920px)': { fontSize: '3.75rem' },
                }}
              >
                {ABOUT_HEADLINE.map((line) => (
                  <Box key={line} component="span" sx={{ display: 'block' }}>{line}</Box>
                ))}
              </Typography>
            </RevealOnScroll>
          </Box>

          <RevealOnScroll y={14} duration={0.45} delay={0.08}>
            <Box sx={{
              bgcolor: HUMAN_SIGNAL.warmPaper, borderRadius: '18px',
              px: { xs: 2.5, md: 3 }, py: { xs: 2.25, md: 2.75 },
            }}>
              <Typography sx={{
                fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.75rem',
                letterSpacing: '0.04em', mb: 1.25,
              }}>
                BACKGROUND / WHY I WORK THIS WAY
              </Typography>
              <Typography sx={{
                color: HUMAN_SIGNAL.inkNavy, fontWeight: 450,
                fontSize: { xs: '0.9375rem', md: '1rem' }, lineHeight: 1.7,
              }}>
                {ORIGIN_TEXT}
              </Typography>
            </Box>
          </RevealOnScroll>
        </Box>

        {/* Skill Matrix — Warm Paper 카드 하나(좌 소개 + 우 Skill Card 3개) */}
        <RevealOnScroll y={16} duration={0.45} delay={0.14} sx={{ mt: { xs: 6, md: 8 }, '@media (min-width:1920px)': { mt: 9 } }}>
          <Box sx={{
            position: 'relative', overflow: 'hidden',
            bgcolor: HUMAN_SIGNAL.warmPaper, border: `1px solid ${HUMAN_SIGNAL.paperDeep}`, borderRadius: '28px',
            p: { xs: 3, sm: 4, md: 4.5 },
            display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0,240px) 1fr' },
            columnGap: { md: 5 }, rowGap: { xs: 4, md: 0 },
            '@media (min-width:1920px)': { p: 6, columnGap: 7 },
          }}>
            {/* 좌측 — CAPABILITIES / VERIFIED 소개. D2 watermark는 배경 장식용. */}
            <Box sx={{ position: 'relative', minWidth: 0 }}>
              <Box
                aria-hidden="true"
                sx={{
                  position: 'absolute', left: { xs: -12, md: 0 }, bottom: { xs: -20, md: -10 },
                  width: 160, height: 160, opacity: 0.08, pointerEvents: 'none',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                <DMark size="100%" tone="onLight" sx={{ width: '100%', height: '100%' }} />
              </Box>
              <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.75rem', letterSpacing: '0.06em', mb: 1.5, position: 'relative' }}>
                CAPABILITIES / VERIFIED
              </Typography>
              <Typography sx={{
                fontWeight: 750, fontSize: { xs: '1.5rem', md: '1.75rem' }, lineHeight: 1.25,
                color: HUMAN_SIGNAL.inkNavy, mb: 1.75, position: 'relative',
                '@media (min-width:1920px)': { fontSize: '2.125rem' },
              }}>
                {SKILL_INTRO_LINES.map((line) => (
                  <Box key={line} component="span" sx={{ display: 'block' }}>{line}</Box>
                ))}
              </Typography>
              <Typography sx={{ color: HUMAN_SIGNAL.mutedInk, fontSize: '0.875rem', lineHeight: 1.6, maxWidth: 280, position: 'relative' }}>
                {SKILL_INTRO_BODY}
              </Typography>
            </Box>

            {/* 우측 — Skill Card 3개. 카드 외곽 크기·제목 영역·설명 기준선·divider·
             * tools 시작점을 3개 카드가 반응형별로 동일하게 통일한다(동일 grid). */}
            <Box sx={{
              display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: { xs: 2, md: 2.5 },
            }}>
              {SKILL_CARDS.map((card) => (
                <Box
                  key={card.index}
                  sx={{
                    position: 'relative', bgcolor: HUMAN_SIGNAL.softWhite, border: `1px solid ${HUMAN_SIGNAL.paperDeep}`,
                    borderRadius: '22px', p: { xs: 2.5, md: 2.75 }, display: 'flex', flexDirection: 'column',
                    minHeight: { md: 300 },
                  }}
                >
                  <Typography
                    aria-hidden="true"
                    sx={{
                      fontFamily: FONT_MONO, fontWeight: 700, color: HUMAN_SIGNAL.inkNavy, opacity: 0.22,
                      fontSize: { xs: '2.25rem', md: '2.75rem' }, lineHeight: 1, mb: 1.5,
                    }}
                  >
                    {card.index}
                  </Typography>
                  <Box aria-hidden="true" sx={{ width: 48, height: 4, borderRadius: '2px', bgcolor: card.accent, mb: 2 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: HUMAN_SIGNAL.inkNavy, mb: 1, wordBreak: 'keep-all' }}>
                    {card.title}
                  </Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: HUMAN_SIGNAL.inkText, lineHeight: 1.6, wordBreak: 'keep-all', mb: 'auto' }}>
                    {card.purpose}
                  </Typography>
                  <Box sx={{ borderTop: `1px solid ${HUMAN_SIGNAL.paperDeep}`, mt: 2.5, pt: 1.5 }}>
                    {card.tools.map((line) => (
                      <Typography key={line} sx={{ fontSize: '0.75rem', color: HUMAN_SIGNAL.mutedInk, lineHeight: 1.65, wordBreak: 'keep-all' }}>
                        {line}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </RevealOnScroll>
      </Container>
    </Box>
  );
};

export default AboutSection;
