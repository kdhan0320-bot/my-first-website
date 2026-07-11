import { useEffect, useRef, useState } from 'react';

/**
 * 요소가 뷰포트에 처음 들어왔을 때만 true를 반환하는 훅.
 * 스크롤로 다시 돌아와도 애니메이션이 반복되지 않음.
 */
const useInViewOnce = (threshold = 0.25) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

export default useInViewOnce;
