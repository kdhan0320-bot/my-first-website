import { Box, Container, Typography, Chip, Grid } from '@mui/material';
import RevealOnScroll from '../common/RevealOnScroll';

const SKILL_GROUPS = [
  {
    id: 'design',
    category: 'Design',
    tagColor: '#7C3AED',
    tagBg: '#F5F3FF',
    tagBorder: '#DDD6FE',
    darkTagBg: 'rgba(124,58,237,0.12)',
    darkTagBorder: 'rgba(124,58,237,0.22)',
    headerColor: '#7C3AED',
    skills: ['Figma', 'UX/UI Design', 'Wireframe', 'Design System', 'Responsive Web Design'],
  },
  {
    id: 'web',
    category: 'Web',
    tagColor: '#1D4ED8',
    tagBg: '#EFF6FF',
    tagBorder: '#BFDBFE',
    darkTagBg: 'rgba(29,78,216,0.12)',
    darkTagBorder: 'rgba(29,78,216,0.22)',
    headerColor: '#1D4ED8',
    skills: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
  },
  {
    id: 'ai',
    category: 'AI Tools',
    tagColor: '#0D9488',
    tagBg: '#F0FDFA',
    tagBorder: '#99F6E4',
    darkTagBg: 'rgba(13,148,136,0.12)',
    darkTagBorder: 'rgba(13,148,136,0.22)',
    headerColor: '#0D9488',
    skills: ['Claude', 'ChatGPT', 'AI-assisted Coding', 'Prompt Writing'],
  },
  {
    id: 'soft',
    category: 'Soft Skills',
    tagColor: '#64748B',
    tagBg: '#F8FAFC',
    tagBorder: '#CBD5E1',
    darkTagBg: 'rgba(100,116,139,0.12)',
    darkTagBorder: 'rgba(100,116,139,0.22)',
    headerColor: '#64748B',
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
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 24px rgba(0,0,0,0.3)'
            : '0 8px 24px rgba(26,26,46,0.08)',
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
            sx={(theme) => ({
              bgcolor: theme.palette.mode === 'dark' ? group.darkTagBg : group.tagBg,
              color: group.tagColor,
              border: `1px solid ${theme.palette.mode === 'dark' ? group.darkTagBorder : group.tagBorder}`,
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 26,
              '& .MuiChip-label': { px: 1.25 },
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              '&:hover': {
                transform: 'scale(1.04)',
              },
            })}
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
