import {
  Box, Typography, Grid, Card, CardContent,
  LinearProgress, Chip, Tooltip, Button,
} from '@mui/material';
import { usePortfolio } from '../../context/PortfolioContext';
import { ICON_MAP } from '../../constants/iconMap';
import useInViewOnce from '../../hooks/useInViewOnce';
import useCountUp from '../../hooks/useCountUp';
import RevealOnScroll from '../ui/RevealOnScroll';

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

const SkillCard = ({ skill }) => {
  const [cardRef, isVisible] = useInViewOnce(0.25);
  const safeLevel = Math.min(100, Math.max(0, Number(skill.level) || 0));
  const animCount = useCountUp(safeLevel, 900, isVisible);

  const icon = ICON_MAP[skill.icon] ?? { text: skill.name.slice(0, 2), color: '#1578AA', bg: '#EAF6FC' };
  const catColor = CATEGORY_COLORS[skill.category] ?? CATEGORY_COLORS['Tool'];
  const statusColor = STATUS_COLORS[skill.status] ?? STATUS_COLORS['기초 적용'];

  return (
    <Card
      ref={cardRef}
      tabIndex={0}
      sx={(theme) => ({
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
          transform: 'translateY(-2px)',
          borderColor: 'rgba(56,189,248,0.25)',
        },
        '&:hover .skill-icon': { transform: 'scale(1.05)' },
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: '2px',
        },
      })}
    >
      <CardContent
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3, '&:last-child': { pb: 3 } }}
      >
        {/* 아이콘 + 기술명 + 카테고리 Chip */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            aria-hidden="true"
            className="skill-icon"
            sx={{
              width: 48, height: 48,
              borderRadius: 2,
              bgcolor: icon.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              color: icon.color,
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '-0.02em',
              transition: 'transform 0.2s ease',
            }}
          >
            {icon.text}
          </Box>
          <Box>
            <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700, lineHeight: 1.2 }}>
              {skill.name}
            </Typography>
            <Chip
              label={skill.category ?? '기타'}
              size="small"
              sx={{
                mt: 0.5, height: 20,
                fontSize: '0.68rem', fontWeight: 600,
                color: catColor.color, bgcolor: catColor.bg,
                border: `1px solid ${catColor.border}`,
                '& .MuiChip-label': { px: 1 },
              }}
            />
          </Box>
        </Box>

        {/* 상태 Chip */}
        <Chip
          label={skill.status ?? '미분류'}
          size="small"
          sx={{
            alignSelf: 'flex-start', mb: 1.5,
            fontSize: '0.72rem', fontWeight: 600,
            color: statusColor.color, bgcolor: statusColor.bg,
            border: `1px solid ${statusColor.border}`,
          }}
        />

        {/* 설명 */}
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', lineHeight: 1.8, flex: 1, mb: 2.5 }}
        >
          {skill.description}
        </Typography>

        {/* 학습 적용도 프로그레스 바 */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
              학습 적용도
            </Typography>
            <Typography
              variant="caption"
              aria-hidden="true"
              sx={{ color: 'primary.main', fontSize: '0.68rem', fontWeight: 600, minWidth: '2.5ch', textAlign: 'right' }}
            >
              {animCount}%
            </Typography>
          </Box>
          <Tooltip
            title={`${skill.status} — ${skill.description}`}
            placement="top"
            arrow
            enterDelay={400}
          >
            <LinearProgress
              variant="determinate"
              value={isVisible ? safeLevel : 0}
              aria-label={`${skill.name} 학습 적용도 ${safeLevel}%`}
              aria-valuenow={safeLevel}
              aria-valuemin={0}
              aria-valuemax={100}
              sx={{
                height: 7,
                borderRadius: 4,
                bgcolor: 'rgba(56,189,248,0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  bgcolor: 'primary.main',
                  transition: isVisible
                    ? 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)'
                    : 'none',
                },
              }}
            />
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

const SkillsSection = () => {
  const { aboutMeData } = usePortfolio();
  const showAddButton = false;

  return (
    <Box sx={{ mt: 4 }}>

      {/* 섹션 헤더 */}
      <RevealOnScroll>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 700, mb: 0.75 }}>
            Skills
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
            현재 학습하고 프로젝트에 적용해본 기술들을 중심으로 정리했습니다.
          </Typography>
          <Box sx={{ width: 36, height: 3, bgcolor: 'primary.main', mt: 1.5, borderRadius: 2 }} />
        </Box>
      </RevealOnScroll>

      <Grid container spacing={3}>
        {aboutMeData.skills.map((skill, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={skill.id} sx={{ display: 'flex' }}>
            <RevealOnScroll
              delay={Math.min(i * 0.08, 0.4)}
              y={16}
              sx={{ flex: 1, display: 'flex' }}
            >
              <SkillCard skill={skill} />
            </RevealOnScroll>
          </Grid>
        ))}
      </Grid>

      {showAddButton && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            sx={(theme) => ({
              color: 'text.secondary',
              borderColor: theme.palette.divider,
              fontSize: '0.8rem',
              '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: 'rgba(56,189,248,0.06)' },
            })}
          >
            스킬 관리 데모
          </Button>
        </Box>
      )}

    </Box>
  );
};

export default SkillsSection;
