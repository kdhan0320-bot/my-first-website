import { useMemo } from 'react';
import { Box } from '@mui/material';

const StarField = ({ count = 45, sx = {} }) => {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: Math.random() < 0.72 ? 1 : Math.random() < 0.9 ? 1.8 : 2.5,
        op: 0.22 + Math.random() * 0.48,
        duration: 22 + Math.random() * 18,
        delay: -(Math.random() * 30),
        drift: 10 + Math.random() * 14,
      })),
    [count],
  );

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        '@keyframes starDrift': {
          '0%':   { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(var(--drift))' },
        },
        ...sx,
      }}
    >
      {stars.map((s) => (
        <Box
          key={s.id}
          sx={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.r * 2,
            height: s.r * 2,
            borderRadius: '50%',
            bgcolor: 'rgba(248,250,252,0.9)',
            opacity: s.op,
            '--drift': `-${s.drift}px`,
            animation: `starDrift ${s.duration}s ease-in-out ${s.delay}s infinite alternate`,
          }}
        />
      ))}
    </Box>
  );
};

export default StarField;
