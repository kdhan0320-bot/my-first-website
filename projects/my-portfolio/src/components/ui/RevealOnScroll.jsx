import { useRef } from 'react';
import { Box } from '@mui/material';
import useInViewOnce from '../../hooks/useInViewOnce';

/**
 * 스크롤 등장 애니메이션 래퍼
 * - IntersectionObserver 1회 감지 후 fade-up 트랜지션
 * - prefers-reduced-motion: 즉시 표시 (opacity:0 플래시 없음)
 * - review 캡처 모드(data-review-mode="true", React 마운트 전에 addInitScript로
 *   심어짐): 즉시 표시 — site-audit-kit이 캡처하는 순간 RevealOnScroll이 중간
 *   opacity 상태로 잡히던 문제(Phase 2A-1 audit에서 확인됨)를 없앤다.
 * - delay prop으로 카드 stagger 구현
 * - sx prop으로 레이아웃 오버라이드 가능
 * - API(children/delay/y/duration/threshold/sx)는 그대로 유지한다.
 */
const RevealOnScroll = ({
  children,
  delay = 0,
  y = 20,
  duration = 0.55,
  threshold = 0.08,
  sx: sxProp,
}) => {
  const skipAnimation = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  // window.__PORTFOLIO_REVIEW_MODE__ 또는 기존 data-review-mode 속성 중 하나만
  // true여도 review 캡처로 판단한다(HeroSection.jsx와 동일한 이유).
  const isReviewCapture = useRef(
    (typeof window !== 'undefined' && window.__PORTFOLIO_REVIEW_MODE__ === true) ||
      (typeof document !== 'undefined' && document.documentElement?.getAttribute('data-review-mode') === 'true'),
  );
  const [ref, isVisible] = useInViewOnce(threshold);
  const show = skipAnimation.current || isReviewCapture.current || isVisible;

  const mobileY = Math.round(y * 0.6);
  const effectiveDuration = isReviewCapture.current ? 0 : duration;

  return (
    <Box
      ref={ref}
      sx={[
        {
          opacity: show ? 1 : 0,
          transform: show
            ? 'translateY(0)'
            : { xs: `translateY(${mobileY}px)`, md: `translateY(${y}px)` },
          transition: (skipAnimation.current || isReviewCapture.current)
            ? 'none'
            : `opacity ${effectiveDuration}s ease-out ${delay}s, transform ${effectiveDuration}s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
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
