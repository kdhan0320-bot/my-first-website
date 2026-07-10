import { Box, Container, Typography, Grid } from '@mui/material';
import TroubleshootOutlinedIcon from '@mui/icons-material/TroubleshootOutlined';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import RevealOnScroll from '../ui/RevealOnScroll';

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

const STRENGTH_SUMMARY = [
  { label: '정보 구조 정리', desc: '흩어진 요구사항을 화면 흐름과 섹션 구조로 정리합니다.' },
  { label: 'Figma 화면 설계', desc: '와이어프레임, 컴포넌트, 반응형 기준을 고려해 화면을 설계합니다.' },
  { label: 'React 화면 구현', desc: 'HTML/CSS, JavaScript, React/MUI로 실제 웹 화면을 구현합니다.' },
  { label: 'AI 보조 활용', desc: 'AI 제안을 그대로 쓰지 않고 문장 정리, 코드 점검, 개선안 비교에 보조적으로 활용합니다.' },
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
      {/* 배경이 비어 보이지 않도록 아주 약한 radial glow — Hero보다 절제된 톤 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          top: '10%', right: '-6%',
          width: 420, height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* 카드 행 뒤 아주 약한 horizontal guide line — 4개 카드가 하나의 흐름임을 은은하게 표시 */}
      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          left: 0, right: 0, bottom: '14%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 8%, rgba(56,189,248,0.14) 50%, transparent 92%)',
          zIndex: 0,
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
              01 WORK STYLE
            </Typography>
            <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 800 }}>
              정리하고, 설계하고, 구현하는 방식
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
              border: '1px solid rgba(56,189,248,0.18)',
              borderLeft: '4px solid',
              borderLeftColor: 'primary.main',
              borderRadius: '0 12px 12px 0',
            }}
          >
            <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.85, fontWeight: 500 }}>
              새로운 기능을 추가하기 전에 사용자가 어느 지점에서 헷갈리는지부터 확인합니다. 화면의 우선순위와 컴포넌트 구조, 반응형 기준을 정리하고 실제 웹 화면으로 구현합니다.
            </Typography>

            {/* 강점 요약 — 소개문 바로 아래, 2열 메타 리스트. AI 보조 활용 언급은 여기 한 곳으로만 제한 */}
            <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid rgba(148,163,184,0.14)' }}>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', mb: 1.5 }}
              >
                강점 요약
              </Typography>
              <Grid container spacing={1.5}>
                {STRENGTH_SUMMARY.map((s) => (
                  <Grid key={s.label} size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0, mt: '8px', opacity: 0.85 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '0.875rem' }}>
                        <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>{s.label}</Box>
                        {': '}{s.desc}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </RevealOnScroll>

        {/* 역량 카드 — 카드별 개별 stagger reveal */}
        <Box sx={{ position: 'relative', mb: { xs: 1, md: 4 } }}>
          <Grid container spacing={3} sx={{ position: 'relative', zIndex: 2 }}>
            {SKILL_CARDS.map((card, i) => (
              <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <RevealOnScroll delay={0.1 + i * 0.06} y={16} sx={{ height: '100%' }}>
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
