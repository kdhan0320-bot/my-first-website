import { useMemo } from 'react';
import { Box } from '@mui/material';
import { useThemeMode } from '../../context/ThemeModeContext';

const StarField = ({ count = 45, sx = {} }) => {
  const { mode } = useThemeMode();

  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: Math.random() < 0.72 ? 1 : Math.random() < 0.9 ? 1.8 : 2.5,
        op: 0.22 + Math.random() * 0.48,
      })),
    [count],
  );

  if (mode !== 'dark') {
    /* 라이트 모드: 아주 은은한 dot 패턴만 */
    return (
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
          ...sx,
        }}
      >
        {stars.slice(0, 20).map((s) => (
          <Box
            key={s.id}
            sx={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: 2,
              height: 2,
              borderRadius: '50%',
              bgcolor: 'rgba(37,99,235,0.18)',
              opacity: s.op * 0.4,
            }}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
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
          }}
        />
      ))}
    </Box>
  );
};

export default StarField;
