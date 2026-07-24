import { Box } from '@mui/material';
import { HUMAN_SIGNAL } from '../../theme';

/* Human Signal "Quiet Structural Depth" 배경 기반(이번 회차는 기반만 준비).
 * Figma 여러 프레임의 BG / Sage Halo, BG / Orange Halo 장식 요소(예: 404
 * 223:48·223:49, Hero 181:571·181:570)를 참고한 단순 배경 레이어다.
 * - radial-gradient 두 덩어리만 쓰고 blur는 한 겹만 적용한다(중첩 금지).
 * - pointer-events: none, aria-hidden — 콘텐츠와 상호작용을 가리지 않는다.
 * - 모바일에서는 크기/불투명도를 줄인다.
 * - 텍스트 바로 뒤에 복잡한 패턴을 두지 않는다(단순 블롭 2개로 제한).
 * 부모 요소는 position: relative(또는 absolute 배치를 받아들일 수 있는 컨테이너)여야 한다. */
const QuietSignalBackground = ({ variant = 'sageOrange' }) => {
  const sage = HUMAN_SIGNAL.mutedSage;
  const orange = HUMAN_SIGNAL.brightOrange;

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: { xs: '-15%', md: '-10%' },
          left: { xs: '-20%', md: '-8%' },
          width: { xs: 260, md: 480 },
          height: { xs: 260, md: 480 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${sage} 0%, transparent 70%)`,
          opacity: { xs: 0.14, md: 0.22 },
          filter: 'blur(48px)',
        }}
      />
      {variant === 'sageOrange' && (
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '-18%', md: '-12%' },
            right: { xs: '-15%', md: '-6%' },
            width: { xs: 220, md: 400 },
            height: { xs: 220, md: 400 },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orange} 0%, transparent 70%)`,
            opacity: { xs: 0.1, md: 0.16 },
            filter: 'blur(48px)',
          }}
        />
      )}
    </Box>
  );
};

export default QuietSignalBackground;
