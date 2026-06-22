import { Box, Container, Typography, Avatar, Grid, Chip } from '@mui/material';
import { usePortfolio } from '../../context/PortfolioContext';
import RevealOnScroll from '../common/RevealOnScroll';

const STRENGTHS = ['정보 구조화', '사용자 흐름 개선', '깔끔한 UI', '반응형 웹', 'AI 도구 활용'];

const AboutSection = () => {
  const { homeData } = usePortfolio();
  const { basicInfo, sections } = homeData;

  return (
    <Box component="section" id="about" aria-label="소개" sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">

        {/* 섹션 헤더 */}
        <RevealOnScroll>
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography
              sx={{ color: 'text.secondary', letterSpacing: 6, fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1.5 }}
            >
              ABOUT ME
            </Typography>
            <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 800, mt: 1 }}>
              소개
            </Typography>
            <Box sx={{ width: 44, height: 3, bgcolor: 'primary.main', mx: 'auto', mt: 2, borderRadius: 2 }} />
          </Box>
        </RevealOnScroll>

        <Grid container spacing={{ xs: 4, md: 8 }} sx={{ alignItems: 'flex-start' }}>

          {/* 왼쪽: 프로필 카드 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <RevealOnScroll delay={0.1}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, gap: 2 }}>
                <Avatar
                  src={basicInfo.photo || undefined}
                  aria-label={`${basicInfo.name} 프로필 사진`}
                  sx={(theme) => ({
                    width: 120, height: 120,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.1)' : '#EAF6FC',
                    color: 'primary.main',
                    fontSize: '2.5rem', fontWeight: 700,
                    border: `3px solid ${theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.2)' : '#D0EEFA'}`,
                  })}
                >
                  {!basicInfo.photo && basicInfo.name.charAt(0)}
                </Avatar>

                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 800, mb: 1 }}>
                    {basicInfo.name}
                  </Typography>
                  <Chip
                    label={basicInfo.position}
                    size="small"
                    sx={(theme) => ({
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.1)' : '#EAF6FC',
                      color: 'primary.main',
                      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(56,189,248,0.2)' : '#B8DFF2'}`,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    })}
                  />
                </Box>

                {/* 핵심 문구 강조 카드 */}
                <Box
                  component="blockquote"
                  sx={(theme) => ({
                    m: 0,
                    bgcolor: theme.palette.highlight.background,
                    borderLeft: `4px solid ${theme.palette.secondary.main}`,
                    borderRadius: '0 12px 12px 0',
                    p: 2.5,
                    width: '100%',
                  })}
                >
                  <Typography sx={{ color: 'text.primary', lineHeight: 1.8, fontWeight: 600, fontSize: '1.0625rem' }}>
                    {basicInfo.summary}
                  </Typography>
                </Box>
              </Box>
            </RevealOnScroll>
          </Grid>

          {/* 오른쪽: 섹션 미리보기 + 스킬 배지 + CTA */}
          <Grid size={{ xs: 12, md: 8 }}>
            <RevealOnScroll delay={0.18}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

                {/* showInHome 섹션 요약 카드 */}
                {sections.map((section) => (
                  <Box
                    key={section.id}
                    sx={(theme) => ({
                      bgcolor: 'background.default',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      p: 3,
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 6px 20px rgba(0,0,0,0.3)'
                          : '0 6px 20px rgba(26,26,46,0.08)',
                        borderColor: theme.palette.mode === 'dark'
                          ? 'rgba(56,189,248,0.2)'
                          : 'rgba(30,155,215,0.2)',
                      },
                    })}
                  >
                    <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700, mb: 1.5 }}>
                      {section.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.85 }}>
                      {section.summary}
                    </Typography>
                  </Box>
                ))}

                {/* 강점 */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', display: 'block', mb: 1.5 }}>
                    강점
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {STRENGTHS.map((strength) => (
                      <Chip
                        key={strength}
                        label={strength}
                        sx={(theme) => ({
                          bgcolor: theme.palette.highlight.background,
                          color: 'primary.main',
                          fontWeight: 600,
                          border: `1px solid ${theme.palette.divider}`,
                        })}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </RevealOnScroll>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;
