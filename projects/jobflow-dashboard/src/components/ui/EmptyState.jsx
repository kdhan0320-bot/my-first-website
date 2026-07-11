import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

const EmptyState = ({ title = '데이터가 없습니다', description = '', action, actionLabel }) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 8,
      color: 'text.secondary',
    }}
  >
    <InboxIcon sx={{ fontSize: 48, mb: 2, opacity: 0.4 }} />
    <Typography variant="h6" gutterBottom color="text.primary">
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" sx={{ mb: 3 }}>
        {description}
      </Typography>
    )}
    {action && (
      <Button variant="contained" onClick={action} sx={{ mt: 1 }}>
        {actionLabel}
      </Button>
    )}
  </Box>
);

export default EmptyState;
