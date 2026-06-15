import { Box, Chip, Divider, Typography } from '@mui/material';

const SectionWrapper = ({ number, title, description, children }) => {
  return (
    <Box
      component="section"
      className="section-root"
      sx={{ py: 6, px: { xs: 2, md: 6 } }}
    >
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Chip
            label={`Section ${String(number).padStart(2, '0')}`}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Typography variant="h2">{title}</Typography>
        </Box>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
        <Divider sx={{ mt: 2 }} />
      </Box>

      {children}
    </Box>
  );
};

export default SectionWrapper;
