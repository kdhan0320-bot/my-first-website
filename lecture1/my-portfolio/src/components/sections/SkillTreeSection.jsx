import { Box, Container, Typography, Chip, Grid } from '@mui/material';
import RevealOnScroll from '../common/RevealOnScroll';

const SKILL_GROUPS = [
  {
    id: 'design',
    category: 'Design',
    tagColor: '#C4B5FD',
    tagBg: 'rgba(124,58,237,0.12)',
    tagBorder: 'rgba(124,58,237,0.22)',
    headerColor: '#A78BFA',
    skills: ['Figma', 'UX/UI Design', 'Wireframe', 'Design System', 'Responsive Web Design'],
  },
  {
    id: 'web',
    category: 'Web',
    tagColor: '#7DD3FC',
    tagBg: 'rgba(56,189,248,0.12)',
    tagBorder: 'rgba(56,189,248,0.22)',
    headerColor: '#38BDF8',
    skills: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
  },
  {
    id: 'ai',
    category: 'AI Tools',
    tagColor: '#5EEAD4',
    tagBg: 'rgba(13,148,136,0.12)',
    tagBorder: 'rgba(13,148,136,0.22)',
    headerColor: '#2DD4BF',
    skills: ['Claude', 'ChatGPT', 'AI-assisted Coding', 'Prompt Writing'],
  },
  {
    id: 'soft',
    category: 'Soft Skills',
    tagColor: '#CBD5E1',
    tagBg: 'rgba(100,116,139,0.12)',
    tagBorder: 'rgba(100,116,139,0.22)',
    headerColor: '#94A3B8',
    skills: ['Problem Solving', 'Structured Thinking', 'Communication', 'Feedback Reflection'],
  },
];

const SkillGroupCard = ({ group, delay }) => (
  <RevealOnScroll delay={delay} y={16} sx={{ height: '100%' }}>
    <Box
      sx={(theme) => ({
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: { xs: 2.5, md: 3 },
        height: '100%',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          borderColor: group.tagColor,
        },
      })}
    >
      {/* 카테고리 레이블 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box
          sx={{
            width: 4,
            height: 20,
            borderRadius: 2,
            bgcolor: group.headerColor,
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '0.9rem',
            color: group.headerColor,
            letterSpacing: '0.01em',
          }}
        >
          {group.category}
        </Typography>
      </Box>

      {/* 스킬 칩 목록 */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {group.skills.map((skill) => (
          <Chip
            key={skill}
            label={skill}
            size="small"
            sx={{
              bgcolor: group.tagBg,
              color: group.tagColor,
              border: `1px solid ${group.tagBorder}`,
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 26,
              '& .MuiChip-label': { px: 1.25 },
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              '&:hover': {
                transform: 'scale(1.04)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  </RevealOnScroll>
);

const SkillTreeSection = () => (
  <Box component="section" id="skills" aria-label="기술" sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
    <Container maxWidth="lg">

      {/* 섹션 헤더 */}
      <RevealOnScroll>
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography
            sx={{ color: 'text.secondary', letterSpacing: 6, fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1.5 }}
          >
            SKILLS
          </Typography>
          <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 800, mt: 1 }}>
            주요 기술
          </Typography>
          <Box sx={{ width: 44, height: 3, bgcolor: 'primary.main', mx: 'auto', mt: 2, borderRadius: 2 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
            디자인, 웹 구현, AI 도구 활용으로 연결되는 실무형 기술 스택입니다.
          </Typography>
        </Box>
      </RevealOnScroll>

      {/* 2x2 그리드 */}
      <Grid container spacing={3}>
        {SKILL_GROUPS.map((group, i) => (
          <Grid key={group.id} size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <SkillGroupCard group={group} delay={i * 0.08} />
          </Grid>
        ))}
      </Grid>

    </Container>
  </Box>
);

export default SkillTreeSection;
