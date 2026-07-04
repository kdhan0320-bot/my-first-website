import { Box, Typography } from '@mui/material';

const dashboardCardSx = {
  flex: 1,
  minWidth: 0,
  p: '13px 14px',
  borderRadius: '18px',
  bgcolor: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.22)',
};

const DashboardCard = ({ label, text }) => (
  <Box sx={dashboardCardSx}>
    <Typography variant="caption" sx={{ color: '#A5B4FC', fontWeight: 700, display: 'block', mb: 0.35, fontSize: '0.68rem', letterSpacing: '0.02em' }}>
      {label}
    </Typography>
    <Typography variant="caption" sx={{ color: '#E0E7FF', fontSize: '0.74rem', lineHeight: 1.4 }}>
      {text}
    </Typography>
  </Box>
);

const PageHeroHeader = ({
  title, subtitle, chips, action,
  flowLabel, flowText,
  featureLabel = '볼 수 있는 기능', featureText,
}) => (
  <Box sx={{
    px: 2, pt: 2.75, pb: 2.5,
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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: flowText ? 1.5 : 0 }}>{chips}</Box>
    )}
    {flowText && (
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
        <DashboardCard label={flowLabel} text={flowText} />
        {featureText && <DashboardCard label={featureLabel} text={featureText} />}
      </Box>
    )}
  </Box>
);

export const heroChipSx = {
  bgcolor: 'rgba(255,255,255,0.16)',
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.68rem',
  border: '1px solid rgba(255,255,255,0.22)',
};

export const heroSurfaceSx = {
  backgroundImage:
    'radial-gradient(circle at 15% 0%, rgba(99,102,241,0.08) 0%, transparent 42%), radial-gradient(circle at 100% 10%, rgba(6,182,212,0.07) 0%, transparent 38%)',
  backgroundRepeat: 'no-repeat',
};

export const cardCanvasSx = {
  bgcolor: '#F8FAFC',
  backgroundImage:
    'radial-gradient(circle at 10% 22%, rgba(99,102,241,0.055) 0%, transparent 40%), radial-gradient(circle at 92% 68%, rgba(6,182,212,0.05) 0%, transparent 38%)',
  backgroundRepeat: 'no-repeat',
};

export const cardShelfSx = {
  position: 'relative', mt: '-16px',
  borderRadius: '20px 20px 0 0',
  boxShadow: '0 -8px 16px -8px rgba(15,23,42,0.10)',
  pt: '16px',
  ...cardCanvasSx,
};

export default PageHeroHeader;
