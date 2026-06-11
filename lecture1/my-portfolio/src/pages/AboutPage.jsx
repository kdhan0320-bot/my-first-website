import { Box, Container, Typography, Divider, Chip, Grid } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import FavoriteIcon from '@mui/icons-material/Favorite';

const SKILLS = ['React', 'JavaScript', 'MUI', 'Supabase', 'Vite', 'Git', 'GitHub', 'HTML/CSS'];

const INTERESTS = ['UI/UX 디자인', '웹 성능 최적화', '사용자 경험', '오픈소스'];

const Section = ({ icon, title, children }) => (
  <Box sx={{ mb: 5 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
      <Box
        sx={{
          width: 36, height: 36, borderRadius: '10px',
          bgcolor: '#EAF6FC',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Typography variant="h4" sx={{ color: '#1A1A2E', fontWeight: 700 }}>
        {title}
      </Typography>
    </Box>
    {children}
  </Box>
);

const AboutPage = () => (
  <Box sx={{ bgcolor: '#F6F8FB', minHeight: '100vh', py: { xs: 8, md: 12 } }}>
    <Container maxWidth="md">

      {/* 헤더 */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          sx={{ color: '#7F8FA4', letterSpacing: 6, fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1.5 }}
        >
          ABOUT ME
        </Typography>
        <Typography variant="h1" sx={{ color: '#1A1A2E', fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          About Me
        </Typography>
        <Box sx={{ width: 44, height: 3, bgcolor: '#1578AA', mx: 'auto', mt: 2, borderRadius: 2 }} />
      </Box>

      {/* 카드 */}
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          border: '1px solid #E0E4EA',
          borderRadius: 3,
          p: { xs: 3.5, md: 6 },
          boxShadow: '0 2px 16px rgba(26,26,46,0.06)',
        }}
      >
        {/* 자기소개 */}
        <Section icon={<CodeIcon sx={{ color: '#1578AA', fontSize: '1.1rem' }} />} title="자기소개">
          <Typography variant="body1" sx={{ color: '#7F8FA4', lineHeight: 1.9 }}>
            사용자 경험을 중심으로 생각하는 프론트엔드 개발자 김도한입니다.
            React와 MUI를 주로 사용하며, Supabase를 활용한 풀스택 웹 서비스 개발을 공부하고 있습니다.
            깔끔하고 직관적인 UI를 만드는 것에 관심이 많습니다.
          </Typography>
        </Section>

        <Divider sx={{ my: 4 }} />

        {/* 기술 스택 */}
        <Section icon={<CodeIcon sx={{ color: '#1578AA', fontSize: '1.1rem' }} />} title="기술 스택">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {SKILLS.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                sx={{
                  bgcolor: '#EAF6FC',
                  color: '#1578AA',
                  border: '1px solid #B8DFF2',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                }}
              />
            ))}
          </Box>
        </Section>

        <Divider sx={{ my: 4 }} />

        {/* 학력 */}
        <Section icon={<SchoolIcon sx={{ color: '#1578AA', fontSize: '1.1rem' }} />} title="학력">
          <Typography variant="body1" sx={{ color: '#7F8FA4', lineHeight: 1.9 }}>
            학력 정보가 들어갈 자리입니다.
          </Typography>
        </Section>

        <Divider sx={{ my: 4 }} />

        {/* 관심 분야 */}
        <Section icon={<FavoriteIcon sx={{ color: '#1578AA', fontSize: '1.1rem' }} />} title="관심 분야">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {INTERESTS.map((item) => (
              <Chip
                key={item}
                label={item}
                sx={{
                  bgcolor: '#F6F8FB',
                  color: '#7F8FA4',
                  border: '1px solid #E0E4EA',
                  fontSize: '0.82rem',
                }}
              />
            ))}
          </Box>
        </Section>
      </Box>
    </Container>
  </Box>
);

export default AboutPage;
