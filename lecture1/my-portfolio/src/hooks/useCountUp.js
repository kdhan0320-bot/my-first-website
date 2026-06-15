import { useEffect, useRef, useState } from 'react';

/**
 * requestAnimationFrame 기반 숫자 카운팅 훅.
 * - active가 true가 되는 순간 한 번만 실행
 * - prefers-reduced-motion: 즉시 목표값으로 설정
 * - 컴포넌트 unmount 시 자동 cleanup
 */
const useCountUp = (target, duration = 900, active = false) => {
  const end = Math.max(0, Math.round(Number(target) || 0));
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!active || hasRun.current) return;
    hasRun.current = true;

    if (end === 0) {
      setCount(0);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(end);
      return;
    }

    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(eased * end));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount(end);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, end, duration]);

  return count;
};

export default useCountUp;
