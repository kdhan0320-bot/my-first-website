import { Box, Container, Typography, Avatar, Button, Grid, Chip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { ICON_MAP } from '../../constants/iconMap';

const AboutSection = () => {
  const navigate = useNavigate();
  const { homeData } = usePortfolio();
  const { basicInfo, sections, skills } = homeData;

  return (
    <Box id="about" sx={{ bgcolor: '#FFFFFF', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">

        {/* 섹션 헤더 */}
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography
            sx={{ color: '#7F8FA4', letterSpacing: 6, fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1.5 }}
          >
            ABOUT ME
          </Typography>
          <Typography variant="h2" sx={{ color: '#1A1A2E', fontWeight: 800, mt: 1 }}>
            소개
          </Typography>
          <Box sx={{ width: 44, height: 3, bgcolor: '#1578AA', mx: 'auto', mt: 2, borderRadius: 2 }} />
        </Box>

        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="flex-start">

          {/* 왼쪽: 프로필 카드 */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, gap: 2 }}>
              <Avatar
                src={basicInfo.photo || undefined}
                aria-label={`${basicInfo.name} 프로필 사진`}
                sx={{
                  width: 120, height: 120,
                  bgcolor: '#EAF6FC', color: '#1578AA',
                  fontSize: '2.5rem', fontWeight: 700,
                  border: '3px solid #D0EEFA',
                }}
              >
                {!basicInfo.photo && basicInfo.name.charAt(0)}
              </Avatar>

              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h3" sx={{ color: '#1A1A2E', fontWeight: 800, mb: 1 }}>
                  {basicInfo.name}
                </Typography>
                <Chip
                  label={basicInfo.position}
                  size="small"
                  sx={{ bgcolor: '#EAF6FC', color: '#1578AA', border: '1px solid #B8DFF2', fontWeight: 600, fontSize: '0.75rem' }}
                />
              </Box>

              {/* 한 줄 요약 */}
              <Box sx={{ bgcolor: '#F6F8FB', borderLeft: '3px solid #1578AA', borderRadius: '0 8px 8px 0', p: 2, width: '100%' }}>
                <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.85, fontStyle: 'italic' }}>
                  &ldquo;{basicInfo.summary}&rdquo;
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* 오른쪽: 섹션 미리보기 + 스킬 배지 + CTA */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

              {/* showInHome 섹션 요약 카드 */}
              {sections.map((section) => (
                <Box
                  key={section.id}
                  sx={{
                    bgcolor: '#F6F8FB',
                    border: '1px solid #E0E4EA',
                    borderRadius: 2,
                    p: 3,
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(26,26,46,0.08)',
                      borderColor: 'rgba(30,155,215,0.2)',
                    },
                  }}
                >
                  <Typography variant="h5" sx={{ color: '#1A1A2E', fontWeight: 700, mb: 1.5 }}>
                    {section.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.85 }}>
                    {section.summary}
                  </Typography>
                </Box>
              ))}

              {/* 주요 스킬 배지 (상위 4개) */}
              <Box>
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', display: 'block', mb: 1.5 }}>
                  주요 기술
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {skills.map((skill) => {
                    const icon = ICON_MAP[skill.icon] ?? { text: skill.name.slice(0, 2), color: '#1578AA', bg: '#EAF6FC' };
                    return (
                      <Box
                        key={skill.id}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 1,
                          bgcolor: '#FFFFFF', border: '1px solid #E0E4EA',
                          borderRadius: 2, px: 1.5, py: 0.75,
                          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                          '&:hover': { borderColor: 'rgba(30,155,215,0.3)', boxShadow: '0 2px 8px rgba(26,26,46,0.06)' },
                        }}
                      >
                        <Box
                          aria-hidden="true"
                          sx={{
                            width: 24, height: 24, borderRadius: 1,
                            bgcolor: icon.bg, color: icon.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.6rem', fontWeight: 700,
                          }}
                        >
                          {icon.text}
                        </Box>
                        <Typography variant="caption" sx={{ color: '#1A1A2E', fontWeight: 600 }}>
                          {skill.name}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/about')}
                aria-label="About Me 페이지에서 더 자세히 알아보기"
                sx={{
                  alignSelf: { xs: 'center', md: 'flex-start' },
                  bgcolor: '#1578AA', color: '#FFFFFF', mt: 1,
                  px: 3,
                  minHeight: 44,
                  fontWeight: 700,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
                  '&:hover': { bgcolor: '#1E9BD7', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(21,120,170,0.28)' },
                  '&:active': { transform: 'translateY(0)', boxShadow: '0 4px 12px rgba(21,120,170,0.18)' },
                  '&:focus-visible': { outline: '2px solid #1578AA', outlineOffset: '3px' },
                }}
              >
                더 알아보기
              </Button>
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;
