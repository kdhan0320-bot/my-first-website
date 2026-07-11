import { useRef } from 'react';
import { Box } from '@mui/material';
import useInViewOnce from '../../hooks/useInViewOnce';

/**
 * 스크롤 등장 애니메이션 래퍼
 * - IntersectionObserver 1회 감지 후 fade-up 트랜지션
 * - prefers-reduced-motion: 즉시 표시 (opacity:0 플래시 없음)
 * - delay prop으로 카드 stagger 구현
 * - sx prop으로 레이아웃 오버라이드 가능
 */
const RevealOnScroll = ({
  children,
  delay = 0,
  y = 20,
  duration = 0.55,
  threshold = 0.08,
  sx: sxProp,
}) => {
  const prefersReduced = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  const [ref, isVisible] = useInViewOnce(threshold);
  const show = prefersReduced.current || isVisible;

  const mobileY = Math.round(y * 0.6);

  return (
    <Box
      ref={ref}
      sx={[
        {
          opacity: show ? 1 : 0,
          transform: show
            ? 'translateY(0)'
            : { xs: `translateY(${mobileY}px)`, md: `translateY(${y}px)` },
          transition: prefersReduced.current
            ? 'none'
            : `opacity ${duration}s ease-out ${delay}s, transform ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
          willChange: show ? 'auto' : 'opacity, transform',
        },
        ...(Array.isArray(sxProp) ? sxProp : sxProp ? [sxProp] : []),
      ]}
    >
      {children}
    </Box>
  );
};

export default RevealOnScroll;
