import { Box, Container, Typography, Grid } from '@mui/material';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import DevicesIcon from '@mui/icons-material/Devices';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RevealOnScroll from '../common/RevealOnScroll';
import StarField from '../common/StarField';

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
  { label: '화면 설계', desc: '사용자 흐름을 정리하고 Figma로 구조화합니다.' },
  { label: '사용자 흐름 개선', desc: '불편한 흐름을 찾아 화면 우선순위를 정리합니다.' },
  { label: 'React 웹 구현', desc: 'HTML/CSS, JavaScript, React로 화면을 구현합니다.' },
  { label: 'AI 도구 활용', desc: '아이디어 정리와 코드 보조에 AI를 활용합니다.' },
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
        py: { xs: 6, md: 8 },
      }}
    >
      {/* 옅은 별 배경 — 전체 콘셉트 통일 */}
      <StarField count={18} sx={{ opacity: 0.5 }} />

      {/* 섹션 구분 gradient line */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.08), rgba(124,58,237,0.08), transparent)',
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
              사용자의 불편한 흐름을 발견하고, Figma 기반 화면 설계와 웹 구현으로 개선하는
              UX/UI·웹 퍼블리싱 학습자{' '}
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>
                김도한
              </Box>
              입니다.
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
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '0.85rem' }}>
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

        {/* 별자리 연결 카드 */}
        <RevealOnScroll delay={0.1}>
          <Box sx={{ position: 'relative', mb: { xs: 5, md: 7 } }}>
            {/* 별자리 연결선 (데스크톱) */}
            <Box
              aria-hidden="true"
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'absolute',
                top: '42px',
                left: 'calc(16.67% + 22px)',
                right: 'calc(16.67% + 22px)',
                height: '1px',
                background: 'linear-gradient(90deg, rgba(56,189,248,0.4), rgba(167,139,250,0.4), rgba(129,140,248,0.4))',
                zIndex: 0,
              }}
            />
            {/* 연결선 위 작은 점들 */}
            {[33, 50, 67].map((pos) => (
              <Box
                key={pos}
                aria-hidden="true"
                sx={{
                  display: { xs: 'none', md: 'block' },
                  position: 'absolute',
                  top: '38px',
                  left: `${pos}%`,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: 'rgba(148,163,184,0.5)',
                  transform: 'translateX(-50%)',
                  zIndex: 1,
                }}
              />
            ))}

            <Grid container spacing={3} sx={{ position: 'relative', zIndex: 2 }}>
              {SKILL_CARDS.map((card) => (
                <Grid key={card.title} size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ position: 'relative', height: '100%' }}>
                    {/* 카드 뒤 orbit ring */}
                    <Box
                      component="svg"
                      viewBox="0 0 120 120"
                      aria-hidden="true"
                      sx={{
                        position: 'absolute',
                        top: -18,
                        right: -18,
                        width: 110,
                        height: 110,
                        pointerEvents: 'none',
                        opacity: 0.18,
                        zIndex: 0,
                        color: card.color,
                      }}
                    >
                      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 8" />
                      <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeWidth="0.6" />
                    </Box>

                  <Box
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                      height: '100%',
                      p: { xs: 2.5, md: 3 },
                      bgcolor: 'rgba(255,255,255,0.04)',
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
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </RevealOnScroll>

      </Container>

      {/* 하단 구분 gradient line */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.06), rgba(124,58,237,0.06), transparent)',
        }}
      />
    </Box>
  );
};

export default AboutSection;
