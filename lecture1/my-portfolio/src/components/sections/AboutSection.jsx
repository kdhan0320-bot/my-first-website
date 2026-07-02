import { Box, Container, Typography, Grid } from '@mui/material';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import DevicesIcon from '@mui/icons-material/Devices';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RevealOnScroll from '../common/RevealOnScroll';

const SKILL_CARDS = [
  {
    icon: <DesignServicesIcon sx={{ fontSize: 22 }} />,
    title: 'UX/UI 디자인',
    color: '#38BDF8',
    lightColor: '#2563EB',
    items: ['사용자 흐름 분석', '와이어프레임', '화면 설계'],
  },
  {
    icon: <DevicesIcon sx={{ fontSize: 22 }} />,
    title: '웹 구현',
    color: '#A78BFA',
    lightColor: '#7C3AED',
    items: ['HTML/CSS', 'JavaScript', 'React 기반 화면 구현'],
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 22 }} />,
    title: 'AI 도구 활용',
    color: '#F59E0B',
    lightColor: '#D97706',
    items: ['아이디어 정리', '코드 보조', '웹 프로토타입 제작'],
  },
];

const STRENGTH_CHIPS = ['정보 구조화', '사용자 흐름 개선', 'Figma 화면 설계', 'AI 도구 활용'];

const AboutSection = () => {
  return (
    <Box
      component="section"
      id="about"
      aria-label="소개"
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        bgcolor: theme.palette.mode === 'dark' ? '#1E293B' : 'background.paper',
        py: { xs: 7, md: 9 },
      })}
    >
      {/* 섹션 구분 gradient line */}
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, transparent, rgba(56,189,248,0.3), rgba(124,58,237,0.3), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(37,99,235,0.2), rgba(124,58,237,0.2), transparent)',
        })}
      />

      <Container maxWidth="lg">

        {/* 섹션 헤더 */}
        <RevealOnScroll>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography
              sx={(theme) => ({
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
              })}
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
            sx={(theme) => ({
              maxWidth: 720,
              mx: 'auto',
              mb: { xs: 6, md: 8 },
              p: { xs: 3, md: 4 },
              bgcolor: theme.palette.mode === 'dark'
                ? 'rgba(56,189,248,0.05)'
                : 'rgba(37,99,235,0.04)',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.18)' : 'rgba(37,99,235,0.15)'}`,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              borderRadius: '0 12px 12px 0',
            })}
          >
            <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.85, fontWeight: 500 }}>
              사용자의 불편한 흐름을 발견하고, Figma 기반 화면 설계와 웹 구현으로 개선하는
              UX/UI·웹 퍼블리싱 학습자{' '}
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>
                김도한
              </Box>
              입니다.
            </Typography>
          </Box>
        </RevealOnScroll>

        {/* 별자리 연결 카드 */}
        <RevealOnScroll delay={0.1}>
          <Box sx={{ position: 'relative', mb: { xs: 5, md: 7 } }}>
            {/* 별자리 연결선 (데스크톱) */}
            <Box
              aria-hidden="true"
              sx={(theme) => ({
                display: { xs: 'none', md: 'block' },
                position: 'absolute',
                top: '42px',
                left: 'calc(16.67% + 22px)',
                right: 'calc(16.67% + 22px)',
                height: '1px',
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(90deg, rgba(56,189,248,0.4), rgba(167,139,250,0.4), rgba(245,158,11,0.4))'
                  : 'linear-gradient(90deg, rgba(37,99,235,0.25), rgba(124,58,237,0.25), rgba(217,119,6,0.25))',
                zIndex: 0,
              })}
            />
            {/* 연결선 위 작은 점들 */}
            {[33, 50, 67].map((pos) => (
              <Box
                key={pos}
                aria-hidden="true"
                sx={(theme) => ({
                  display: { xs: 'none', md: 'block' },
                  position: 'absolute',
                  top: '38px',
                  left: `${pos}%`,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.5)' : 'rgba(100,116,139,0.35)',
                  transform: 'translateX(-50%)',
                  zIndex: 1,
                })}
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
                      sx={(theme) => ({
                        position: 'absolute',
                        top: -18,
                        right: -18,
                        width: 110,
                        height: 110,
                        pointerEvents: 'none',
                        opacity: theme.palette.mode === 'dark' ? 0.18 : 0.1,
                        zIndex: 0,
                        color: theme.palette.mode === 'dark' ? card.color : card.lightColor,
                      })}
                    >
                      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 8" />
                      <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeWidth="0.6" />
                    </Box>

                  <Box
                    sx={(theme) => ({
                      position: 'relative',
                      zIndex: 1,
                      height: '100%',
                      p: { xs: 3, md: 3.5 },
                      bgcolor: theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.04)'
                        : '#FFFFFF',
                      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.15)' : '#E2E8F0'}`,
                      borderTop: `2px solid ${theme.palette.mode === 'dark' ? card.color : card.lightColor}`,
                      borderRadius: 2.5,
                      backdropFilter: theme.palette.mode === 'dark' ? 'blur(12px)' : 'none',
                      WebkitBackdropFilter: theme.palette.mode === 'dark' ? 'blur(12px)' : 'none',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.palette.mode === 'dark'
                          ? `0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px ${card.color}28`
                          : '0 12px 32px rgba(15,23,42,0.1)',
                      },
                    })}
                  >
                    {/* 아이콘 */}
                    <Box
                      sx={(theme) => ({
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        bgcolor: theme.palette.mode === 'dark'
                          ? `${card.color}18`
                          : `${card.lightColor}10`,
                        border: `1px solid ${theme.palette.mode === 'dark' ? `${card.color}30` : `${card.lightColor}22`}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.palette.mode === 'dark' ? card.color : card.lightColor,
                        mb: 2,
                        boxShadow: theme.palette.mode === 'dark'
                          ? `0 0 12px ${card.color}22`
                          : 'none',
                      })}
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
                            sx={(theme) => ({
                              width: 4,
                              height: 4,
                              borderRadius: '50%',
                              bgcolor: theme.palette.mode === 'dark' ? card.color : card.lightColor,
                              flexShrink: 0,
                              mt: '7px',
                              opacity: 0.8,
                            })}
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

        {/* 강점 칩 */}
        <RevealOnScroll delay={0.15}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', mb: 2 }}
            >
              강점
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 0 }}>
              {STRENGTH_CHIPS.map((chip, i) => (
                <Box key={chip} sx={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && (
                    <Typography variant="caption" sx={{ color: 'text.disabled', mx: 1.5 }}>·</Typography>
                  )}
                  <Typography
                    variant="body2"
                    sx={(theme) => ({
                      color: theme.palette.mode === 'dark' ? 'rgba(203,213,225,0.85)' : '#475569',
                      fontSize: '0.83rem',
                      fontWeight: 500,
                    })}
                  >
                    {chip}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </RevealOnScroll>

      </Container>

      {/* 하단 구분 gradient line */}
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          position: 'absolute',
          bottom: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, transparent, rgba(56,189,248,0.25), rgba(124,58,237,0.25), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(37,99,235,0.15), rgba(124,58,237,0.15), transparent)',
        })}
      />
    </Box>
  );
};

export default AboutSection;
