import { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent,
  LinearProgress, Chip, Tooltip, Button,
} from '@mui/material';
import { usePortfolio } from '../../context/PortfolioContext';
import { ICON_MAP } from '../../constants/iconMap';

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
  const [animValue, setAnimValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimValue(skill.level ?? 0), 300);
    return () => clearTimeout(timer);
  }, [skill.level]);

  const icon = ICON_MAP[skill.icon] ?? { text: skill.name.slice(0, 2), color: '#1578AA', bg: '#EAF6FC' };
  const catColor = CATEGORY_COLORS[skill.category] ?? CATEGORY_COLORS['Tool'];
  const statusColor = STATUS_COLORS[skill.status] ?? STATUS_COLORS['기초 적용'];

  return (
    <Card
      tabIndex={0}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #E0E4EA',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(26,26,46,0.05)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          boxShadow: '0 6px 20px rgba(26,26,46,0.10)',
          transform: 'translateY(-2px)',
          borderColor: 'rgba(30,155,215,0.25)',
        },
        '&:hover .skill-icon': { transform: 'scale(1.05)' },
        '&:focus-visible': {
          outline: '2px solid #1578AA',
          outlineOffset: '2px',
          borderColor: 'rgba(30,155,215,0.25)',
        },
      }}
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
            <Typography variant="h5" sx={{ color: '#1A1A2E', fontWeight: 700, lineHeight: 1.2 }}>
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
          sx={{ color: '#64748B', lineHeight: 1.8, flex: 1, mb: 2.5 }}
        >
          {skill.description}
        </Typography>

        {/* 학습 적용도 프로그레스 바 */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.68rem' }}>
              학습 적용도
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.68rem' }}>
              {skill.level ?? 0}%
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
              value={animValue}
              aria-label={`${skill.name} 학습 적용도 ${skill.level}%`}
              sx={{
                height: 6, borderRadius: 3,
                bgcolor: '#E8EDF3',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  bgcolor: '#1578AA',
                  transition: 'transform 0.8s ease-in-out',
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ color: '#1A1A2E', fontWeight: 700, mb: 0.75 }}>
          Skills
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.7 }}>
          현재 학습하고 프로젝트에 적용해본 기술들을 중심으로 정리했습니다.
        </Typography>
        <Box sx={{ width: 36, height: 3, bgcolor: '#1578AA', mt: 1.5, borderRadius: 2 }} />
      </Box>

      {/* 스킬 카드 그리드 */}
      <Grid container spacing={3}>
        {aboutMeData.skills.map((skill) => (
          <Grid item xs={12} sm={6} md={4} key={skill.id} sx={{ display: 'flex' }}>
            <SkillCard skill={skill} />
          </Grid>
        ))}
      </Grid>

      {/* 스킬 추가 데모 버튼 — 기본값 false (방문자에게 노출 안 됨) */}
      {showAddButton && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            sx={{
              color: '#7F8FA4',
              borderColor: '#D0D7E2',
              fontSize: '0.8rem',
              '&:hover': { borderColor: '#1578AA', color: '#1578AA', bgcolor: '#EAF6FC' },
            }}
          >
            스킬 관리 데모
          </Button>
        </Box>
      )}

    </Box>
  );
};

export default SkillsSection;
