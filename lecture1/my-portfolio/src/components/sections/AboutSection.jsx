import { Box, Container, Typography, Grid } from '@mui/material';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import DevicesIcon from '@mui/icons-material/Devices';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RevealOnScroll from '../ui/RevealOnScroll';

const SKILL_CARDS = [
  {
    icon: <DesignServicesIcon sx={{ fontSize: 22 }} />,
    title: 'UX/UI 디자인',
    color: '#38BDF8',
    items: ['사용자 흐름 분석', '와이어프레임', '화면 설계', '컴포넌트 정리'],
  },
  {
    icon: <DevicesIcon sx={{ fontSize: 22 }} />,
    title: '웹 구현',
    color: '#A78BFA',
    items: ['HTML/CSS', 'JavaScript', 'React 기반 화면 구현', '반응형 레이아웃'],
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 22 }} />,
    title: 'AI 도구 활용',
    color: '#818CF8',
    items: ['아이디어 정리', '코드 보조', '웹 프로토타입 제작', '코드 리뷰 보조'],
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
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>

        {/* 섹션 헤더 */}
        <RevealOnScroll>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.72rem',
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
              01 소개
            </Typography>
            <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 800 }}>
              소개 및 역량
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
              복잡한 기능을 많이 넣기보다, 사용자가 어디에서 막히는지 먼저 정리하고 화면 우선순위를 잡는 방식으로 작업합니다. 개인 프로젝트에서는 문제 정의, 화면 설계, 반응형 구현, 링크 점검까지 직접 반복하며 완성도를 높였습니다.
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75, mt: 1.5 }}>
              AI 도구는 요구사항 정리, 문장 점검, 코드 개선안 검토에 보조적으로 활용했습니다. 최종 구조와 표현, 구현 범위 판단은 직접 검토했습니다.
            </Typography>

            {/* 강점 요약 — 소개문 바로 아래, 2열 메타 리스트 */}
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

        {/* 역량 카드 */}
        <RevealOnScroll delay={0.1}>
          <Box sx={{ position: 'relative', mb: { xs: 1, md: 4 } }}>
            <Grid container spacing={3} sx={{ position: 'relative', zIndex: 2 }}>
              {SKILL_CARDS.map((card) => (
                <Grid key={card.title} size={{ xs: 12, sm: 4 }}>
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
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px ${card.color}28`,
                      },
                    }}
                  >
                    {/* 아이콘 */}
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
                        mb: 2,
                        boxShadow: `0 0 12px ${card.color}22`,
                      }}
                    >
                      {card.icon}
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
                      {card.title}
                    </Typography>

                    <Box component="ul" sx={{ m: 0, pl: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {card.items.map((item) => (
                        <Box key={item} component="li" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <Box
                            sx={{
                              width: 4,
                              height: 4,
                              borderRadius: '50%',
                              bgcolor: card.color,
                              flexShrink: 0,
                              mt: '7px',
                              opacity: 0.8,
                            }}
                          />
                          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65, fontSize: '0.875rem' }}>
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </RevealOnScroll>

      </Container>
    </Box>
  );
};

export default AboutSection;
