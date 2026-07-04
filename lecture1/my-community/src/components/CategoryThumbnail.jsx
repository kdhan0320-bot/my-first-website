/* eslint-disable react/prop-types -- 프로젝트 전반에서 PropTypes를 사용하지 않는 기존 컨벤션을 따름 */
import { Box, Typography } from '@mui/material';
import { getCategoryTheme } from '../constants/categoryTheme';

const CategoryThumbnail = ({ category, height = 180 }) => {
  const theme = getCategoryTheme(category);
  const Icon = theme.icon;

  return (
    <Box sx={{
      position: 'relative', width: '100%', height, flexShrink: 0, overflow: 'hidden',
      background: theme.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Box sx={{
        position: 'absolute', width: 120, height: 120, borderRadius: '50%',
        bgcolor: theme.accent || 'rgba(255,255,255,0.14)', top: -36, right: -30,
      }} />
      <Box sx={{
        position: 'absolute', width: 64, height: 64, borderRadius: '50%',
        bgcolor: 'rgba(255,255,255,0.10)', bottom: -18, left: -12,
      }} />
      <Icon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.95)' }} />
      <Typography
        variant="caption"
        sx={{
          position: 'absolute', bottom: 10, left: 12,
          color: 'rgba(255,255,255,0.9)', fontWeight: 700, letterSpacing: '0.02em', fontSize: '0.68rem',
        }}
      >
        {theme.label}
      </Typography>
    </Box>
  );
};

export default CategoryThumbnail;
