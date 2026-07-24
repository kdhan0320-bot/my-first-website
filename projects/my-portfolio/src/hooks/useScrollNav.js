import { useState, useEffect, useRef } from 'react';

const SECTION_IDS = ['home', 'about', 'projects', 'contact'];
const HIDE_THRESHOLD = 80; // 이 위치 이하에서만 헤더 숨김 트리거
const STICKY_COMPACT_THRESHOLD = 24; // 이 위치를 넘으면 Header가 Sticky Compact 상태로 전환

// ── 0. Human Signal Header: Sticky Compact 전환 감지 ─────────────────
// Ordered Signal의 hide-on-scroll(useScrollDirection)과 달리 Header를
// 숨기지 않는다 — 스크롤 위치에 따라 top/sticky-compact 두 상태만 오간다.
export const useStickyCompact = () => {
  const [atTop, setAtTop] = useState(true);
  const [compact, setCompact] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      const currentY = window.scrollY;
      setAtTop(currentY < 10);
      setCompact(currentY > STICKY_COMPACT_THRESHOLD);
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(update);
        ticking.current = true;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { atTop, compact };
};

// ── 1. 스크롤 방향 감지 (Ordered Signal 잔재) ────────────────────────
// TODO(Human Signal 전환): Navbar.jsx는 이제 hide-on-scroll 대신 위
// useStickyCompact를 쓴다. 이 훅을 더 이상 어디서도 쓰지 않는다면 삭제
// 후보이지만, 이번 회차는 "삭제·이동 없음" 범위라 임의로 지우지 않고
// 남겨둔다 — 사용자 확인 후 다음 회차에서 삭제 여부를 정한다.
export const useScrollDirection = (drawerOpen) => {
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const drawerOpenRef = useRef(drawerOpen);

  useEffect(() => { drawerOpenRef.current = drawerOpen; }, [drawerOpen]);

  useEffect(() => {
    const update = () => {
      const currentY = window.scrollY;

      setAtTop(currentY < 10);

      if (!drawerOpenRef.current) {
        if (currentY < 10) {
          setHidden(false);
        } else if (currentY > lastScrollY.current && currentY > HIDE_THRESHOLD) {
          setHidden(true);
        } else if (currentY < lastScrollY.current) {
          setHidden(false);
        }
      }

      lastScrollY.current = currentY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(update);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 드로어가 열리면 즉시 헤더 표시
  useEffect(() => {
    if (drawerOpen) setHidden(false);
  }, [drawerOpen]);

  return { hidden, atTop };
};

// ── 2. 읽기 진행률 ──────────────────────────────────────────────────
export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return progress;
};

// ── 3. 현재 보이는 섹션 감지 (스크롤 위치 기반) ───────────────────────
// 화면 상단 기준선(OFFSET)을 통과한 섹션 중 가장 마지막(아래) 섹션을 active로 판단.
// 섹션 높이가 뷰포트보다 큰 경우(예: Hero)에도 정확하게 동작한다.
const ACTIVE_OFFSET = 140;

export const useActiveSection = (pathname) => {
  const [activeSection, setActiveSection] = useState('');
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      let current = '';
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= ACTIVE_OFFSET) {
          current = id;
        }
      }
      setActiveSection(current);
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(update);
        ticking.current = true;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  return activeSection;
};

// ── 4. 섹션으로 스크롤 유틸 ──────────────────────────────────────────
export const scrollToSection = (sectionId) => {
  const el = document.getElementById(sectionId);
  if (!el) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HEADER_OFFSET = 84;
  const top = el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;

  window.scrollTo({ top, behavior: reducedMotion ? 'instant' : 'smooth' });
};
