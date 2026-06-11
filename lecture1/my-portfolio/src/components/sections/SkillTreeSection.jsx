import { Box, Container, Typography, LinearProgress, Grid, Chip, Divider } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';

const SKILLS = [
  { name: 'React',       level: 80 },
  { name: 'JavaScript',  level: 75 },
  { name: 'HTML / CSS',  level: 85 },
  { name: 'MUI',         level: 70 },
];

const TAGS = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Git', 'Figma', 'SQL'];

const SkillTreeSection = () => (
  <Box sx={{ bgcolor: '#FFFFFF', py: { xs: 8, md: 12 } }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="overline" sx={{ color: '#888888', letterSpacing: 4, fontWeight: 600 }}>
          SKILLS
        </Typography>
        <Typography variant="h2" sx={{ mt: 1, color: '#1A1A2E' }}>
          여기는 Skill Tree 섹션입니다.
        </Typography>
        <Divider sx={{ width: 60, mx: 'auto', mt: 2, borderColor: '#1578AA', borderWidth: 3 }} />
        <Typography variant="body2" sx={{ mt: 2, color: '#666666' }}>
          기술 스택을 트리나 프로그레스바로 시각화할 예정입니다.
        </Typography>
      </Box>

      <Grid container spacing={4} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 3, p: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <CodeIcon sx={{ color: '#1578AA' }} />
              <Typography variant="h4" sx={{ color: '#1A1A2E' }}>기술 숙련도</Typography>
            </Box>
            {SKILLS.map(({ name, level }) => (
              <Box key={name} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#333333', fontWeight: 600 }}>{name}</Typography>
                  <Typography variant="body2" sx={{ color: '#666666' }}>{level}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={level}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#E0E0E0',
                    '& .MuiLinearProgress-bar': { bgcolor: '#1578AA', borderRadius: 4 },
                  }}
                />
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 3, p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" sx={{ color: '#1A1A2E', mb: 1 }}>기술 태그</Typography>
            <Typography variant="body2" sx={{ color: '#888888', mb: 3 }}>
              사용 가능한 기술 스택입니다.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {TAGS.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  sx={{
                    bgcolor: '#FFFFFF',
                    color: '#1578AA',
                    border: '1px solid #1578AA',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    height: 34,
                    '&:hover': { bgcolor: '#1578AA', color: '#FFFFFF' },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default SkillTreeSection;
