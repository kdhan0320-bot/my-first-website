import { useState, useEffect, useRef } from 'react';

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'contact', 'guestbook'];
const HIDE_THRESHOLD = 80; // 이 위치 이하에서만 헤더 숨김 트리거

// ── 1. 스크롤 방향 감지 ──────────────────────────────────────────────
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

// ── 3. 현재 보이는 섹션 감지 (IntersectionObserver) ─────────────────
export const useActiveSection = (pathname) => {
  const [activeSection, setActiveSection] = useState('');
  const visibilityMap = useRef({});

  useEffect(() => {
    setActiveSection('');
    visibilityMap.current = {};

    const observers = [];

    const getTopVisible = () => {
      for (const id of SECTION_IDS) {
        if (visibilityMap.current[id]) return id;
      }
      return '';
    };

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      visibilityMap.current[id] = false;

      const observer = new IntersectionObserver(
        ([entry]) => {
          visibilityMap.current[id] = entry.isIntersecting;
          setActiveSection(getTopVisible());
        },
        { rootMargin: '-64px 0px -50% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [pathname]);

  return activeSection;
};

// ── 4. 섹션으로 스크롤 유틸 ──────────────────────────────────────────
export const scrollToSection = (sectionId) => {
  const el = document.getElementById(sectionId);
  if (!el) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HEADER_OFFSET = 68;
  const top = el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;

  window.scrollTo({ top, behavior: reducedMotion ? 'instant' : 'smooth' });
};
