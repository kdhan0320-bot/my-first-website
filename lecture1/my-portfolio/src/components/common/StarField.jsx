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
        duration: 34 + Math.random() * 26,
        delay: -(Math.random() * 50),
        drift: 26 + Math.random() * 30,
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
        /* 아주 느리게 위로 흐르며 경계에서 사라졌다 나타나 끊김 없이 이어짐 */
        '@keyframes starDrift': {
          '0%':   { transform: 'translateY(0)',           opacity: 0 },
          '12%':  { opacity: 'var(--op)' },
          '88%':  { opacity: 'var(--op)' },
          '100%': { transform: 'translateY(var(--drift))', opacity: 0 },
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
            '--op': s.op,
            '--drift': `-${s.drift}px`,
            animation: `starDrift ${s.duration}s linear ${s.delay}s infinite`,
          }}
        />
      ))}
    </Box>
  );
};

export default StarField;
