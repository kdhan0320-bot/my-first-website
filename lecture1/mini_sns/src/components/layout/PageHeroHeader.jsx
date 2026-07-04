import { Box, Typography } from '@mui/material';

const PageHeroHeader = ({ title, subtitle, chips, action }) => (
  <Box sx={{
    px: 2, pt: 2.75, pb: 2.75,
    background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #4F46E5 100%)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h2" sx={{ fontWeight: 800, color: '#fff' }}>{title}</Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: '#C7D2FE', mt: 0.3, mb: chips ? 1.25 : 0 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
    {chips && (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>{chips}</Box>
    )}
  </Box>
);

export const heroChipSx = {
  bgcolor: 'rgba(255,255,255,0.14)',
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.68rem',
  border: '1px solid rgba(255,255,255,0.18)',
};

export const heroSurfaceSx = {
  backgroundImage:
    'radial-gradient(circle at 12% 0%, rgba(99,102,241,0.07) 0%, transparent 45%), radial-gradient(circle at 100% 15%, rgba(6,182,212,0.06) 0%, transparent 40%)',
  backgroundRepeat: 'no-repeat',
};

export default PageHeroHeader;
