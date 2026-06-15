import { Box, Container, Typography, Grid, Card, CardContent, Chip, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';

const ICON_MAP = {
  html:       { text: 'H',  color: '#C84B17', bg: '#FFF3EF' },
  css:        { text: 'C',  color: '#1E56D0', bg: '#EEF3FF' },
  javascript: { text: 'JS', color: '#9A7D00', bg: '#FFFCE8' },
  react:      { text: 'Re', color: '#087EA4', bg: '#E7F8FE' },
  mui:        { text: 'M',  color: '#007FFF', bg: '#E8F4FF' },
  figma:      { text: 'Fi', color: '#9747FF', bg: '#F5EEFF' },
  database:   { text: 'SB', color: '#059669', bg: '#EDFAF5' },
  github:     { text: 'GH', color: '#333333', bg: '#F0F0F0' },
  ai:         { text: 'AI', color: '#B45309', bg: '#FFFBEB' },
};

const CATEGORY_COLORS = {
  'Frontend':     { color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
  'Framework':    { color: '#4338CA', bg: '#EEF2FF', border: '#C7D2FE' },
  'Design':       { color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  'Backend / DB': { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  'Tool':         { color: '#4B5563', bg: '#F9FAFB', border: '#D1D5DB' },
  'Workflow':     { color: '#92400E', bg: '#FFFBEB', border: '#FDE68A' },
};

const STATUS_COLORS = {
  '프로젝트 적용':   { color: '#047857', bg: '#ECFDF5', border: '#6EE7B7' },
  '학습 및 적용 중': { color: '#1578AA', bg: '#EAF6FC', border: '#BAE6FD' },
  '기초 적용':      { color: '#4B5563', bg: '#F3F4F6', border: '#D1D5DB' },
  '적극 활용':      { color: '#B45309', bg: '#FFFBEB', border: '#FCD34D' },
};

const HomeSkillCard = ({ skill }) => {
  const icon = ICON_MAP[skill.icon] ?? { text: skill.name.slice(0, 2), color: '#1578AA', bg: '#EAF6FC' };
  const catColor = CATEGORY_COLORS[skill.category] ?? CATEGORY_COLORS['Tool'];
  const statusColor = STATUS_COLORS[skill.status] ?? STATUS_COLORS['기초 적용'];

  return (
    <Card
      sx={{
        width: '100%',
        border: '1px solid #E0E4EA',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(26,26,46,0.05)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': { boxShadow: '0 6px 20px rgba(26,26,46,0.10)', transform: 'translateY(-2px)' },
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>

        {/* 아이콘 + 기술명 + 카테고리 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            aria-hidden="true"
            sx={{
              width: 48, height: 48, borderRadius: 2, flexShrink: 0,
              bgcolor: icon.bg, color: icon.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.82rem',
            }}
          >
            {icon.text}
          </Box>
          <Box>
            <Typography variant="h5" sx={{ color: '#1A1A2E', fontWeight: 700, lineHeight: 1.2 }}>
              {skill.name}
            </Typography>
            <Chip
              label={skill.category ?? '기타'}
              size="small"
              sx={{
                mt: 0.5, height: 20, fontSize: '0.68rem', fontWeight: 600,
                color: catColor.color, bgcolor: catColor.bg,
                border: `1px solid ${catColor.border}`,
                '& .MuiChip-label': { px: 1 },
              }}
            />
          </Box>
        </Box>

        {/* 상태 */}
        <Chip
          label={skill.status ?? '미분류'}
          size="small"
          sx={{
            fontSize: '0.72rem', fontWeight: 600,
            color: statusColor.color, bgcolor: statusColor.bg,
            border: `1px solid ${statusColor.border}`,
          }}
        />

      </CardContent>
    </Card>
  );
};

const SkillTreeSection = () => {
  const navigate = useNavigate();
  const { homeData } = usePortfolio();
  const skills = homeData.skills; // priority 기준 상위 4개 (Context에서 처리됨)

  return (
    <Box sx={{ bgcolor: '#F6F8FB', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">

        {/* 섹션 헤더 */}
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography
            sx={{ color: '#7F8FA4', letterSpacing: 6, fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', mb: 1.5 }}
          >
            SKILLS
          </Typography>
          <Typography variant="h2" sx={{ color: '#1A1A2E', fontWeight: 800, mt: 1 }}>
            주요 기술
          </Typography>
          <Box sx={{ width: 44, height: 3, bgcolor: '#1578AA', mx: 'auto', mt: 2, borderRadius: 2 }} />
          <Typography variant="body2" sx={{ color: '#64748B', mt: 2 }}>
            현재 학습하고 프로젝트에 적용해본 핵심 기술입니다.
          </Typography>
        </Box>

        {/* 스킬 카드 4개 */}
        <Grid container spacing={3}>
          {skills.map((skill) => (
            <Grid item xs={12} sm={6} md={3} key={skill.id} sx={{ display: 'flex' }}>
              <HomeSkillCard skill={skill} />
            </Grid>
          ))}
        </Grid>

        {/* 전체 스킬 보기 CTA */}
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/about')}
            aria-label="About Me 페이지에서 전체 스킬 보기"
            sx={{
              borderColor: '#1578AA', color: '#1578AA',
              '&:hover': { bgcolor: '#EAF6FC', borderColor: '#1E9BD7', color: '#1E9BD7' },
            }}
          >
            전체 스킬 보기
          </Button>
        </Box>

      </Container>
    </Box>
  );
};

export default SkillTreeSection;
