import { Box, Container, Typography, Grid, Chip } from '@mui/material';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import DevicesIcon from '@mui/icons-material/Devices';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RevealOnScroll from '../common/RevealOnScroll';

const SKILL_CARDS = [
  {
    icon: <DesignServicesIcon sx={{ fontSize: 24 }} />,
    title: 'UX/UI Design',
    color: '#2563EB',
    items: ['사용자 흐름 분석', '와이어프레임', 'Figma 프로토타입'],
  },
  {
    icon: <DevicesIcon sx={{ fontSize: 24 }} />,
    title: 'Web Publishing',
    color: '#7C3AED',
    items: ['HTML/CSS', 'JavaScript', 'React 기반 화면 구현'],
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 24 }} />,
    title: 'AI-assisted Workflow',
    color: '#F59E0B',
    items: ['AI 도구를 활용한 아이디어 정리', '코드 보조', '웹 프로토타입 제작'],
  },
];

const TOOLS = ['Figma', 'React', 'Vite', 'HTML/CSS', 'JavaScript', 'MUI', 'Claude', 'Supabase'];

const AboutSection = () => {
  return (
    <Box component="section" id="about" aria-label="소개" sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
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
                '&::before': {
                  content: '""',
                  display: 'block',
                  width: 24,
                  height: 1,
                  bgcolor: theme.palette.mode === 'dark' ? 'primary.main' : 'primary.main',
                  opacity: 0.5,
                },
                '&::after': {
                  content: '""',
                  display: 'block',
                  width: 24,
                  height: 1,
                  bgcolor: theme.palette.mode === 'dark' ? 'primary.main' : 'primary.main',
                  opacity: 0.5,
                },
              })}
            >
              01 About
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
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(37,99,235,0.06)' : '#EFF6FF',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.15)' : 'rgba(37,99,235,0.15)'}`,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              borderRadius: '0 12px 12px 0',
              textAlign: 'left',
            })}
          >
            <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.9, fontWeight: 500, mb: 1.5 }}>
              저는 사용자의 불편한 흐름을 발견하고, Figma와 웹 구현으로 개선하는
              UX/UI·웹 퍼블리싱 학습자 <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>김도한</Box>입니다.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.85 }}>
              앱 리디자인, 화면 설계, 웹 구현 과정을 연결해서 보여주는 포트폴리오를 만들고 있습니다.
              프로젝트를 통해 디자인과 개발의 연결 경험을 쌓고 있습니다.
            </Typography>
          </Box>
        </RevealOnScroll>

        {/* 핵심 역량 카드 3개 */}
        <RevealOnScroll delay={0.1}>
          <Grid container spacing={3} sx={{ mb: { xs: 5, md: 7 } }}>
            {SKILL_CARDS.map((card) => (
              <Grid key={card.title} size={{ xs: 12, sm: 4 }}>
                <Box
                  sx={(theme) => ({
                    height: '100%',
                    p: { xs: 3, md: 3.5 },
                    bgcolor: 'background.default',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(51,65,85,0.6)' : '#E2E8F0'}`,
                    borderTop: `3px solid ${card.color}`,
                    borderRadius: 2.5,
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 12px 32px rgba(0,0,0,0.4)'
                        : '0 12px 32px rgba(15,23,42,0.08)',
                    },
                  })}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: `${card.color}14`,
                      border: `1px solid ${card.color}28`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.color,
                      mb: 2,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
                    {card.title}
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {card.items.map((item) => (
                      <Box
                        key={item}
                        component="li"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            bgcolor: card.color,
                            flexShrink: 0,
                            opacity: 0.7,
                          }}
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '0.875rem' }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </RevealOnScroll>

        {/* 사용 도구 */}
        <RevealOnScroll delay={0.15}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', mb: 2 }}
            >
              Tools &amp; Tech
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {TOOLS.map((tool) => (
                <Chip
                  key={tool}
                  label={tool}
                  sx={(theme) => ({
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(37,99,235,0.08)' : '#EFF6FF',
                    color: 'primary.main',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.18)' : 'rgba(37,99,235,0.2)'}`,
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    height: 30,
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'translateY(-1px)' },
                  })}
                />
              ))}
            </Box>
          </Box>
        </RevealOnScroll>

      </Container>
    </Box>
  );
};

export default AboutSection;
