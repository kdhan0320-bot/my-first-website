import { Chip } from '@mui/material';
import { APPLICATION_STATUSES } from '../../constants';

const StatusChip = ({ status, size = 'small' }) => {
  const found = APPLICATION_STATUSES.find((s) => s.value === status);
  if (!found) return <Chip label={status} size={size} />;

  return (
    <Chip
      label={found.label}
      size={size}
      sx={{
        color: found.color,
        bgcolor: found.bg,
        fontWeight: 600,
        border: `1px solid ${found.color}30`,
        minHeight: 28,
      }}
    />
  );
};

export default StatusChip;
