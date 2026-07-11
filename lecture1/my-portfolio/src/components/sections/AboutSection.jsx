import { Box, Container, Typography, Grid } from '@mui/material';
import TroubleshootOutlinedIcon from '@mui/icons-material/TroubleshootOutlined';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RevealOnScroll from '../ui/RevealOnScroll';
import DMark from '../ui/DMark';

/* Home용 About Snapshot — /about 페이지의 핵심만 축약해 Home 한 화면 흐름 안에서 보여준다 */
const APPLICATION_FOCUS = ['UX/UI', 'Web Publishing', 'React/MUI', 'Responsive QA'];

const TOOL_LINE = 'Figma · React/MUI · HTML/CSS/JavaScript · GitHub · Supabase · AI Tools';

const InlineRow = ({ label, children }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 1, mt: 2 }}>
    <Typography
      variant="caption"
      sx={{ color: 'text.disabled', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}
    >
      {label}
    </Typography>
    {children}
  </Box>
);

/* mini process strip — 정리→설계→구현→검증. SKILL_CARDS와 같은 순서/컬러를 재사용해
 * intro 카드 안(요약)과 아래 4장 카드(상세) 두 자리가 같은 흐름을 가리키게 한다. */
const PROCESS_STEPS = [
  { step: '01', label: '정리', color: '#38BDF8' },
  { step: '02', label: '설계', color: '#A78BFA' },
  { step: '03', label: '구현', color: '#60A5FA' },
  { step: '04', label: '검증', color: '#A7F3D0' },
];

const SKILL_CARDS = [
  {
    index: '01',
    icon: <TroubleshootOutlinedIcon sx={{ fontSize: 22 }} />,
    title: '문제 정리',
    color: '#38BDF8',
    body: '요구사항과 사용자 흐름을 정리하고, 화면에서 먼저 보여야 할 정보를 구분합니다.',
  },
  {
    index: '02',
    icon: <DesignServicesOutlinedIcon sx={{ fontSize: 22 }} />,
    title: '화면 설계',
    color: '#A78BFA',
    body: 'Figma에서 와이어프레임과 컴포넌트 구조를 잡고, 모바일/태블릿 기준까지 함께 검토합니다.',
  },
  {
    index: '03',
    icon: <DevicesOutlinedIcon sx={{ fontSize: 22 }} />,
    title: '웹 구현',
    color: '#60A5FA',
    body: 'React/MUI, HTML/CSS, JavaScript로 카드, 모달, 반응형 레이아웃을 구현합니다.',
  },
  {
    index: '04',
    icon: <FactCheckOutlinedIcon sx={{ fontSize: 22 }} />,
    title: '검증과 보완',
    color: '#A7F3D0',
    body: '링크, 접근성, 모바일 화면, 프로젝트 한계를 확인하며 제출 가능한 상태로 다듬습니다.',
  },
];

const AboutSection = () => {
  return (
    <Box
      component="section"
      id="about"
      aria-label="소개"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
        pt: { xs: 6, md: 8 },
        pb: { xs: 3, md: 8 },
      }}
    >
      {/* Hero의 Flow Stream이 이어지는 느낌의 정적 리본 — About 밖에서는 무한 반복 모션을 쓰지 않으므로 정지 상태로 배치 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          top: '-18%', left: '-15%',
          width: '130%', height: '55%',
          background: 'linear-gradient(100deg, transparent 30%, rgba(56,189,248,0.105) 48%, rgba(129,140,248,0.08) 53%, transparent 72%)',
          filter: 'blur(30px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* 배경이 비어 보이지 않도록 radial glow — 텍스트 가독성은 유지하는 선에서 체감되게 강화 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          top: '10%', right: '-6%',
          width: 460, height: 460,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
          filter: 'blur(64px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* D 모노그램 workmark — Hero/Footer의 실물 로고와 구분되는 옅은 배경 마크 */}
      <DMark size={220} sx={{ top: '4%', right: '0%' }} />
      {/* 카드 행 뒤 process line — 4개 카드가 하나의 흐름임을 표시, 체감되게 강화 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          left: 0, right: 0, bottom: '14%',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent 8%, rgba(56,189,248,0.3) 50%, transparent 92%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Process Line — Hero 하단 커넥터와 동일한 정적 패턴, 다음 섹션(Projects)으로 흐름 연결 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          left: '50%', bottom: 0, transform: 'translateX(-50%)',
          width: '1px', height: 64,
          background: 'linear-gradient(180deg, transparent, rgba(56,189,248,0.42))',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>

        {/* 섹션 헤더 */}
        <RevealOnScroll>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                '&::before': { content: '""', display: 'block', width: 28, height: 1, bgcolor: 'primary.main', opacity: 0.45 },
                '&::after':  { content: '""', display: 'block', width: 28, height: 1, bgcolor: 'primary.main', opacity: 0.45 },
              }}
            >
              01 ABOUT / WORKFLOW
            </Typography>
            <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 800 }}>
              정리하고, 설계하고, 구현하는 사람
            </Typography>
          </Box>
        </RevealOnScroll>

        {/* 자기소개 */}
        <RevealOnScroll delay={0.05}>
          <Box
            sx={{
              maxWidth: 720,
              mx: 'auto',
              mb: { xs: 4, md: 5 },
              p: { xs: 3, md: 4 },
              bgcolor: 'rgba(56,189,248,0.05)',
              border: '1px solid rgba(148,163,184,0.16)',
              borderLeft: '4px solid',
              borderLeftColor: 'primary.main',
              borderRadius: '0 12px 12px 0',
            }}
          >
            <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.85, fontWeight: 500 }}>
              저는 화려한 그래픽보다 사용자가 화면을 이해하는 순서와 실제 구현 가능한 구조를 먼저 정리합니다. Figma에서 흐름과 컴포넌트를 잡고, React/MUI 기반으로 반응형 화면을 구현하며, 구현하지 않은 기능과 프로젝트 한계는 명확히 구분합니다.
            </Typography>

            <InlineRow label="지원 방향">
              <Box
                sx={{
                  display: { xs: 'grid', sm: 'flex' },
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)' },
                  flexWrap: { sm: 'wrap' },
                  gap: { xs: 1, sm: 0.75 },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                {APPLICATION_FOCUS.map((item) => (
                  <Box
                    key={item}
                    sx={{
                      px: 1.1, py: 0.4, borderRadius: 999,
                      bgcolor: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </InlineRow>

            <InlineRow label="사용 도구">
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', lineHeight: 1.6 }}>
                {TOOL_LINE}
              </Typography>
            </InlineRow>

            <InlineRow label="현재 한계">
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', lineHeight: 1.6 }}>
                실제 사용자 테스트와 정량 성과 데이터는 아직 부족합니다.
              </Typography>
            </InlineRow>

            {/* mini process strip — 정리→설계→구현→검증을 표가 아니라 흐름으로 보여준다 */}
            <Box
              sx={{
                mt: 2.5,
                pt: 2.25,
                borderTop: '1px solid rgba(148,163,184,0.14)',
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                gap: { xs: 1.5, sm: 0 },
              }}
            >
              {PROCESS_STEPS.map((item, i) => (
                <Box
                  key={item.step}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    justifyContent: { xs: 'flex-start', sm: i === 0 ? 'flex-start' : 'center' },
                  }}
                >
                  <Box
                    sx={{
                      width: 26, height: 26, flexShrink: 0,
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: `${item.color}18`,
                      border: `1px solid ${item.color}55`,
                    }}
                  >
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: item.color }}>
                      {item.step}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'text.primary' }}>
                    {item.label}
                  </Typography>
                  {i < PROCESS_STEPS.length - 1 && (
                    <ArrowForwardIcon
                      aria-hidden="true"
                      sx={{
                        display: { xs: 'none', sm: 'inline-flex' },
                        fontSize: 16,
                        color: 'text.disabled',
                        opacity: 0.5,
                        ml: 'auto',
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </RevealOnScroll>

        {/* 역량 카드 — 카드별 개별 stagger reveal */}
        <Box sx={{ position: 'relative', mb: { xs: 1, md: 4 } }}>
          <Grid container spacing={3} sx={{ position: 'relative', zIndex: 2 }}>
            {SKILL_CARDS.map((card, i) => (
              <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <RevealOnScroll delay={0.1 + i * 0.1} y={18} sx={{ height: '100%' }}>
                  <Box
                    sx={{
                      height: '100%',
                      p: { xs: 2.5, md: 3 },
                      bgcolor: '#111827',
                      border: '1px solid rgba(148,163,184,0.15)',
                      borderTop: `2px solid ${card.color}`,
                      borderRadius: 2.5,
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px ${card.color}28`,
                        borderColor: `${card.color}40`,
                      },
                    }}
                  >
                    {/* 아이콘 + 순번 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          bgcolor: `${card.color}18`,
                          border: `1px solid ${card.color}30`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: card.color,
                          boxShadow: `0 0 12px ${card.color}22`,
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Typography
                        sx={{ color: card.color, fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.08em', opacity: 0.7 }}
                      >
                        {card.index}
                      </Typography>
                    </Box>

                    <Typography variant="h5" component="h3" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.25 }}>
                      {card.title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65, fontSize: '0.9375rem' }}>
                      {card.body}
                    </Typography>
                  </Box>
                </RevealOnScroll>
              </Grid>
            ))}
          </Grid>
        </Box>

      </Container>
    </Box>
  );
};

export default AboutSection;
