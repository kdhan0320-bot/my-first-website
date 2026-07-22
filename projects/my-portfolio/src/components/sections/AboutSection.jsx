import { Box, Container, Typography } from '@mui/material';
import RevealOnScroll from '../ui/RevealOnScroll';
import { FONT_MONO, HUMAN_SIGNAL, ULTRAWIDE_CONTENT_MAX_WIDTH, HOME_WIDE_MAX_WIDTH, HOME_READING_MAX_WIDTH } from '../../theme';

/* Home의 유일한 About 섹션(Figma Human Signal Home v8 About 180:546). 별도의
 * /about 페이지는 존재하지 않으며, `/about` 접근은 App.jsx의 <Navigate>를
 * 통해 이 섹션으로 연결된다.
 *
 * Human Signal Phase 3C: Phase 3B에서 배경은 Warm Paper로 바로잡았지만, 위→
 * 아래로 같은 폭 블록이 쌓이는 구조(헤드라인 stack → blockquote stack →
 * 2×2 카드 grid → 2열 텍스트 rail → 1줄 breadcrumb)가 "문서를 읽는" 느낌을
 * 남긴다는 재검토 결과에 따라(art-direction-before.md 2절) 아래를 바꾼다.
 * 1) 상단을 좌(헤드라인)/우(origin 문장) 비대칭 2단으로 바꾼다.
 * 2) 정리·연결·검증을 3개 개별 아이템에서 1개의 연속된 밴드(zone 3개)로 바꾼다.
 * 3) CAPABILITIES 카드 grid + TOOL_GROUPS 텍스트 rail을 하나의 "Capability
 *    Studio"(좌 역량 설명 + 우 DESIGN/BUILD/VERIFY 3레인, dark 표면)로 합친다.
 *    Photoshop·Illustrator를 DESIGN 레인에 "사용 가능 도구"로 추가한다(사용자
 *    확인 완료, 숙련도 과장 없음).
 * 4) 5단계 process는 이 섹션에서 가장 약한 정보로 남긴다 — 이번에는 문자
 *    화살표 대신 순수 CSS 점·선 connector를 쓴다("Arrow glyph 금지" 지시). */

const ABOUT_HEADLINE = ['화면의 모양보다,', '정보가 이해되고', '작동하는 구조를 봅니다.'];

const ORIGIN_TEXT =
  '생산 현장과 구매관리에서 배운 기준 확인과 누락 방지 습관을 바탕으로, 정보 구조를 설계하고 반응형 UI 구현과 검증으로 연결하고 있습니다.';

const SIGNATURE_TRIO = [
  { num: '01', word: '정리', accentBar: HUMAN_SIGNAL.steelMist },
  { num: '02', word: '연결', accentBar: HUMAN_SIGNAL.mutedSage },
  { num: '03', word: '검증', accentBar: HUMAN_SIGNAL.brightOrange, accent: true },
];

/* 이전 CAPABILITIES(4항목)+TOOL_GROUPS(4항목)를 사실 손실 없이 DESIGN/BUILD/
 * VERIFY 3레인으로 합친다. 근거는 그대로다: Figma 프로토타입(bus-arrival-app
 * 실제 파일), 반응형 9폭 QA, Semantic HTML/접근성 대응, React/MUI 구현+build/
 * lint/audit 검증(JobFlow·Feedback Hub·이 저장소 자체). Photoshop·Illustrator는
 * 사용자가 이번 회차에서 실사용 도구로 확인한 항목만 추가했다 — 숙련도 막대·
 * 별점·%는 넣지 않는다. */
const STUDIO_LANES = [
  {
    key: 'design',
    label: 'DESIGN',
    statement: '정보 구조와 화면 흐름을 정리하고 설계합니다.',
    tools: 'Figma · Photoshop · Illustrator',
    note: 'Auto Layout · Components · Prototype',
  },
  {
    key: 'build',
    label: 'BUILD',
    statement: 'Semantic HTML·CSS와 React/MUI로 반응형 화면을 구현합니다.',
    tools: 'HTML · CSS · JavaScript · React · MUI',
    note: 'Supabase 연동(JobFlow · Feedback Hub)',
  },
  {
    key: 'verify',
    label: 'VERIFY',
    statement: '빌드·접근성·반응형 회귀를 실제로 확인합니다.',
    tools: 'Git/GitHub · Playwright',
    note: 'ChatGPT · Claude로 검토·구현 보조',
  },
];

const WORK_PROCESS = ['UNDERSTAND', 'STRUCTURE', 'DESIGN', 'BUILD', 'VERIFY'];

/* 좌측 Capability Studio 설명 아래를 채우는 정리·연결·검증 → DESIGN/BUILD/VERIFY
 * 연결 목록. 위 SIGNATURE_TRIO(정리·연결·검증 band)와 우측 STUDIO_LANES를 같은
 * 어휘로 이어 붙여, 좌측 설명 하단의 빈 공간을 "채우기 위한 장식"이 아니라 두
 * 블록 사이의 관계를 보여주는 콘텐츠로 채운다(지시서: 좌측 빈 공간 감소 +
 * 정리·연결·검증의 의미를 짧게 연결). Desktop(md 이상)에서만 노출한다 — 모바일은
 * 이미 통과 수준이라 높이를 늘리지 않는다. */
const STUDIO_CONNECTORS = [
  { num: '01', word: '정리', lane: 'DESIGN' },
  { num: '02', word: '연결', lane: 'BUILD' },
  { num: '03', word: '검증', lane: 'VERIFY', accent: true },
];

const AboutSection = () => {
  return (
    <Box
      component="section"
      id="about"
      aria-label="소개"
      sx={{ position: 'relative', overflow: 'hidden', bgcolor: HUMAN_SIGNAL.warmPaper, py: { xs: 6.5, md: 10.5 } }}
    >
      <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <Box sx={{
          position: 'absolute', bottom: '-10%', left: { xs: '-30%', md: '-6%' }, width: { xs: 300, md: 420 }, height: { xs: 300, md: 420 },
          borderRadius: '50%', background: `radial-gradient(circle, ${HUMAN_SIGNAL.mutedSage} 0%, transparent 70%)`, opacity: 0.1, filter: 'blur(40px)',
        }} />
      </Box>

      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, sm: 6, md: 8 },
          maxWidth: { xl: ULTRAWIDE_CONTENT_MAX_WIDTH + 128 },
          mx: 'auto', position: 'relative',
          '@media (min-width:1920px)': { maxWidth: HOME_WIDE_MAX_WIDTH, px: 8 },
        }}
      >
        {/* 상단 비대칭 2단 — 좌 58% 헤드라인 / 우 38% origin 문장(지시서: 동일 폭
         * 스택 대신 좌/우 비대칭). 우측은 좌측 헤드라인 하단에 맞춰 정렬한다. */}
        <Box sx={{
          display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0,58fr) minmax(0,38fr)' },
          columnGap: { md: 6 }, rowGap: { xs: 4, md: 0 }, alignItems: 'end',
          '@media (min-width:1920px)': { columnGap: 9 },
        }}>
          <Box>
            <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.75rem', letterSpacing: '0.06em', mb: { xs: 2, md: 3 } }}>
              ABOUT
            </Typography>
            <RevealOnScroll y={14} duration={0.45}>
              <Typography
                component="h2"
                sx={{
                  fontWeight: 750,
                  fontSize: { xs: '2.125rem', sm: '2.6rem', md: '3rem' },
                  lineHeight: { xs: 1.28, md: 1.15 },
                  letterSpacing: '-0.025em',
                  color: HUMAN_SIGNAL.inkNavy,
                  '@media (min-width:1920px)': { fontSize: '4.25rem' },
                  '@media (min-width:2560px)': { fontSize: '4.5rem' },
                }}
              >
                {ABOUT_HEADLINE.map((line) => (
                  <Box key={line} component="span" sx={{ display: 'block' }}>{line}</Box>
                ))}
              </Typography>
            </RevealOnScroll>
          </Box>

          <RevealOnScroll y={14} duration={0.45} delay={0.08}>
            <Box
              component="blockquote"
              sx={{
                m: 0, pl: { xs: 2.5, md: 3 }, borderLeft: `3px solid ${HUMAN_SIGNAL.mutedSage}`,
                '@media (min-width:1920px)': { maxWidth: HOME_READING_MAX_WIDTH },
              }}
            >
              <Typography sx={{
                color: HUMAN_SIGNAL.inkText, fontWeight: 450,
                fontSize: { xs: '1rem', md: '1.0625rem' }, lineHeight: 1.65,
                '@media (min-width:1920px)': { fontSize: '1.1875rem' },
              }}>
                {ORIGIN_TEXT}
              </Typography>
            </Box>
          </RevealOnScroll>
        </Box>

        {/* 정리·연결·검증 — 3개 개별 아이템이 아니라 1개의 연속된 밴드(공유 테두리/
         * radius, 얇은 내부 구분선, zone별 상단 accent bar)로 통일한다. */}
        <RevealOnScroll y={14} duration={0.45} delay={0.14} sx={{ mt: { xs: 6, md: 8 } }}>
          <Box sx={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            border: `1px solid ${HUMAN_SIGNAL.paperDeep}`, borderRadius: '20px', overflow: 'hidden',
            bgcolor: HUMAN_SIGNAL.softWhite,
          }}>
            {SIGNATURE_TRIO.map((item, i) => (
              <Box
                key={item.word}
                sx={{
                  position: 'relative', p: { xs: 2.5, sm: 4 }, pt: { xs: 3.5, sm: 5 },
                  borderLeft: i > 0 ? `1px solid ${HUMAN_SIGNAL.paperDeep}` : 'none',
                }}
              >
                <Box aria-hidden="true" sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, bgcolor: item.accentBar }} />
                <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.75rem', letterSpacing: '0.04em', mb: 0.75 }}>
                  {item.num}
                </Typography>
                <Typography sx={{
                  fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05,
                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                  color: item.accent ? HUMAN_SIGNAL.brightOrange : HUMAN_SIGNAL.inkNavy,
                  '@media (min-width:1920px)': { fontSize: '4rem' },
                }}>
                  {item.word}
                </Typography>
              </Box>
            ))}
          </Box>
        </RevealOnScroll>

        {/* Capability Studio — 좌 38% 역량 설명 + 우 62% DESIGN/BUILD/VERIFY 3레인.
         * About 전체에서 유일한 dark 표면(내부 대비 지점, 지시서 요구). */}
        <RevealOnScroll y={14} duration={0.45} delay={0.18} sx={{ mt: { xs: 6, md: 8 }, '@media (min-width:1920px)': { mt: 9 } }}>
          <Box sx={{
            display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0,38fr) minmax(0,62fr)' },
            columnGap: { md: 5 }, rowGap: { xs: 3, md: 0 },
          }}>
            <Box sx={{
              display: 'flex', flexDirection: 'column', pt: { md: 1 },
              height: { md: '100%' }, justifyContent: { md: 'space-between' },
            }}>
              <Box>
                <Typography sx={{ fontFamily: FONT_MONO, color: HUMAN_SIGNAL.burntOrange, fontSize: '0.75rem', letterSpacing: '0.06em', mb: 2 }}>
                  CAPABILITY STUDIO
                </Typography>
                <Typography sx={{
                  fontWeight: 700, fontSize: { xs: '1.25rem', md: '1.5rem' }, lineHeight: 1.4,
                  color: HUMAN_SIGNAL.inkNavy, wordBreak: 'keep-all',
                  '@media (min-width:1920px)': { fontSize: '1.875rem' },
                }}>
                  요구사항과 화면 우선순위를 먼저 이해하고 정리한 뒤, 아래 세 단계로 실제 화면까지 연결합니다.
                </Typography>
              </Box>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', mt: 4 }}>
                {STUDIO_CONNECTORS.map((item, i) => (
                  <Box key={item.word}>
                    {i > 0 && (
                      <Box aria-hidden="true" sx={{ width: '1px', height: 18, bgcolor: HUMAN_SIGNAL.paperDeep, ml: '3px' }} />
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                      <Box aria-hidden="true" sx={{
                        width: 6, height: 6, borderRadius: '2px', flexShrink: 0, alignSelf: 'center',
                        bgcolor: item.accent ? HUMAN_SIGNAL.brightOrange : HUMAN_SIGNAL.mutedSage,
                      }} />
                      <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', color: HUMAN_SIGNAL.burntOrange, letterSpacing: '0.04em' }}>
                        {item.num}
                      </Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: HUMAN_SIGNAL.inkNavy }}>
                        {item.word}
                      </Typography>
                      <Typography sx={{ fontSize: '0.8125rem', color: HUMAN_SIGNAL.inkText }}>
                        · {item.lane} 단계로 연결
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{
              bgcolor: HUMAN_SIGNAL.deepHarbor, borderRadius: '20px', overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}>
              <Box sx={{
                px: { xs: 3, md: 3.5 }, pt: { xs: 2.5, md: 3 }, pb: { xs: 1, md: 1.25 },
                '@media (min-width:1920px)': { px: 5, pt: 3.5 },
              }}>
                <Typography sx={{
                  fontFamily: FONT_MONO, fontWeight: 700, color: HUMAN_SIGNAL.brightOrangeOnDark,
                  fontSize: '0.75rem', letterSpacing: '0.08em',
                  '@media (min-width:1920px)': { fontSize: '0.9375rem' },
                }}>
                  TOOLS &amp; WORKFLOW
                </Typography>
              </Box>
              {STUDIO_LANES.map((lane) => (
                <Box
                  key={lane.key}
                  sx={{
                    p: { xs: 3, md: 3.5 }, borderTop: '1px solid rgba(170,183,196,0.16)',
                    display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '96px 1fr' }, columnGap: 2, rowGap: 1,
                    '@media (min-width:1920px)': { p: 5, gridTemplateColumns: '128px 1fr', columnGap: 3 },
                  }}
                >
                  <Typography sx={{
                    fontFamily: FONT_MONO, fontWeight: 700, color: HUMAN_SIGNAL.brightOrangeOnDark, fontSize: '0.8125rem', letterSpacing: '0.06em',
                    '@media (min-width:1920px)': { fontSize: '1rem' },
                  }}>
                    {lane.label}
                  </Typography>
                  <Box>
                    <Typography sx={{
                      color: HUMAN_SIGNAL.softWhite, fontSize: { xs: '0.9375rem', md: '1rem' }, lineHeight: 1.55, wordBreak: 'keep-all', mb: 1,
                      '@media (min-width:1920px)': { fontSize: '1.3125rem', mb: 1.5 },
                    }}>
                      {lane.statement}
                    </Typography>
                    <Typography sx={{
                      color: HUMAN_SIGNAL.steelMist, fontSize: '0.875rem', lineHeight: 1.6, wordBreak: 'keep-all',
                      '@media (min-width:1920px)': { fontSize: '1.125rem' },
                    }}>
                      {lane.tools}
                    </Typography>
                    <Typography sx={{
                      color: 'rgba(170,183,196,0.72)', fontSize: '0.8125rem', lineHeight: 1.5, mt: 0.25, wordBreak: 'keep-all',
                      '@media (min-width:1920px)': { fontSize: '1rem' },
                    }}>
                      {lane.note}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          <Typography sx={{ mt: 3, fontSize: '0.9375rem', color: HUMAN_SIGNAL.inkText, lineHeight: 1.65, maxWidth: 620, wordBreak: 'keep-all' }}>
            요구사항과 최종 판단은 김도한이 주도하고, AI는 초안·구현·검사를 보조합니다.
          </Typography>
        </RevealOnScroll>

        {/* 5-step process — Capabilities보다 항상 약해야 한다. 문자 화살표 대신
         * 작은 점 + 선 connector만 쓴다(지시서: arrow glyph 금지). */}
        <RevealOnScroll y={10} duration={0.4} delay={0.24} sx={{ mt: { xs: 4, md: 5 } }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0, pt: 2, borderTop: `1px solid ${HUMAN_SIGNAL.paperDeep}` }}>
            {WORK_PROCESS.map((step, i) => (
              <Box key={step} sx={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && (
                  <Box aria-hidden="true" sx={{ width: { xs: 12, sm: 20 }, height: '1px', bgcolor: HUMAN_SIGNAL.paperDeep, mx: 1 }} />
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box aria-hidden="true" sx={{
                    width: 5, height: 5, borderRadius: '50%',
                    bgcolor: i === WORK_PROCESS.length - 1 ? HUMAN_SIGNAL.brightOrange : HUMAN_SIGNAL.mutedSage,
                  }} />
                  <Typography sx={{
                    fontFamily: FONT_MONO, fontSize: '0.625rem', letterSpacing: '0.04em',
                    color: i === WORK_PROCESS.length - 1 ? HUMAN_SIGNAL.burntOrange : HUMAN_SIGNAL.inkText,
                    fontWeight: i === WORK_PROCESS.length - 1 ? 700 : 400,
                  }}>
                    {step}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </RevealOnScroll>
      </Container>
    </Box>
  );
};

export default AboutSection;
