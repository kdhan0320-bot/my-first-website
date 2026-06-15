import { useEffect, useRef } from 'react';

/* 클릭 가능한 요소 셀렉터 */
const INTERACTIVE =
  'button, a, [role="button"], .MuiButton-root, .MuiIconButton-root';

/* ── 활성화 조건 확인 (CSR 전용) ──
   - hover 가능한 포인팅 기기 (마우스)
   - prefers-reduced-motion: reduce 아닌 경우 */
const checkEnabled = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CustomCursor = () => {
  /* 비활성 조건이면 렌더링 자체를 하지 않음 */
  if (!checkEnabled()) return null;

  return <CursorFollower />;
};

/* 실제 follower DOM 관리 (활성 환경에서만 마운트됨) */
const CursorFollower = () => {
  const elRef    = useRef(null);
  const follower = useRef({ x: -200, y: -200 }); // eased 좌표
  const mouse    = useRef({ x: -200, y: -200 }); // 실제 마우스 좌표
  const active   = useRef(false);                  // interactive 요소 hover 여부
  const raf      = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let revealed = false;

    /* 마우스 이동 처리 */
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      /* 처음 감지 시 follower 위치를 마우스에 스냅 (fly-in 방지) */
      if (!revealed) {
        revealed = true;
        follower.current = { x: e.clientX, y: e.clientY };
        el.style.opacity = '1';
      }

      /* interactive 요소 hover 감지 */
      const hit = !!(e.target?.closest?.(INTERACTIVE));
      if (hit !== active.current) {
        active.current = hit;
        el.style.width       = hit ? '40px' : '20px';
        el.style.height      = hit ? '40px' : '20px';
        el.style.background  = hit
          ? 'rgba(30,155,215,0.10)'
          : 'rgba(30,155,215,0.18)';
        el.style.borderColor = hit
          ? 'rgba(30,155,215,0.45)'
          : 'rgba(30,155,215,0.35)';
      }
    };

    /* 뷰포트 이탈 시 follower 숨김 */
    const onLeave = () => {
      revealed = false;
      el.style.opacity = '0';
    };

    /* RAF 루프 — transform만 업데이트 (레이아웃 계산 없음) */
    const tick = () => {
      const ease = 0.12;
      follower.current.x += (mouse.current.x - follower.current.x) * ease;
      follower.current.y += (mouse.current.y - follower.current.y) * ease;
      /* 원의 중심을 마우스 좌표에 맞추기 위해 반지름만큼 오프셋 */
      const half = active.current ? 20 : 10;
      el.style.transform =
        `translate3d(${follower.current.x - half}px, ${follower.current.y - half}px, 0)`;
      raf.current = requestAnimationFrame(tick);
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={elRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '20px',
        height:        '20px',
        borderRadius:  '50%',
        background:    'rgba(30,155,215,0.18)',
        border:        '1px solid rgba(30,155,215,0.35)',
        pointerEvents: 'none',
        zIndex:        9999,
        opacity:       0,
        transform:     'translate3d(-200px,-200px,0)',
        /* transition은 크기·색·투명도에만 적용 (transform 제외 — RAF로 직접 제어) */
        transition:    'width 0.2s ease, height 0.2s ease, background 0.2s ease, border-color 0.2s ease, opacity 0.3s ease',
        willChange:    'transform',
      }}
    />
  );
};

export default CustomCursor;
