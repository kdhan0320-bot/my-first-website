import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { ALL_PROJECTS } from '../../data/projectsData';

const SITE_TITLE = '김도한 | UX/UI · 웹퍼블리싱 포트폴리오';

/* pages/ProjectDetailPage.jsx의 SLUG_TO_ID와 같은 매핑이다(그 파일은 이번
 * 회차 변경 금지 대상이라 export를 새로 만들지 않고 여기서도 동일하게
 * 정의했다) — 두 파일이 갈라지면(대표 프로젝트 slug 추가/변경 시) 함께
 * 갱신해야 한다. */
const SLUG_TO_ID = {
  jobflow: 'jobflow',
  'bus-arrival': 'bus-arrival-app',
  'feedback-hub': 'feedback-hub',
};

const resolveTitle = (pathname) => {
  if (pathname === '/') return `Home | ${SITE_TITLE}`;
  if (pathname === '/projects') return `Projects | ${SITE_TITLE}`;
  const detailMatch = pathname.match(/^\/projects\/([^/]+)$/);
  if (detailMatch) {
    const id = SLUG_TO_ID[detailMatch[1]];
    const project = id ? ALL_PROJECTS.find((p) => p.id === id) : null;
    return project ? `${project.title} | ${SITE_TITLE}` : `Projects | ${SITE_TITLE}`;
  }
  return `페이지를 찾을 수 없습니다 | ${SITE_TITLE}`;
};

/* 라우트 전환 시 문서 타이틀 갱신 + 스크롤 위치 정리를 담당한다.
 * - PUSH/REPLACE(링크 클릭 등 새 이동): 상단으로 스크롤한다.
 * - POP(브라우저/커스텀 뒤로 가기): Phase 3A — Projects에서 Detail로 들어갔다가
 *   돌아오면 원래 스크롤 위치를 복원한다. 브라우저 기본 scrollRestoration은
 *   React.lazy 라우트 청크·이미지 로딩과 타이밍이 어긋나 신뢰할 수 없어(재현
 *   확인) 'manual'로 두고 직접 pathname별 스크롤 위치를 기억한다. 복원 시점도
 *   고정 프레임 수가 아니라 "문서가 저장된 위치까지 스크롤 가능한 높이가 될
 *   때까지" 매 프레임 확인한다 — Featured 이미지가 늦게 로드되며 문서 높이가
 *   커지는 동안 너무 일찍 scrollTo를 호출하면 그 시점의 최대 스크롤 값으로
 *   clamp돼 버리는 문제(재현 확인)를 막는다. 최대 약 800ms(48프레임) 기다린
 *   뒤에는 그때까지의 값으로라도 복원한다(무한 대기 금지). */
const scrollMemory = new Map();
const MAX_RESTORE_FRAMES = 48;

const RouteEffects = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const restoreRef = useRef({ rafId: null, cancelled: false });

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    document.title = resolveTitle(location.pathname);
  }, [location.pathname]);

  // 현재 경로를 떠나기 직전 스크롤 위치를 기억해 둔다(POP으로 돌아왔을 때 복원용).
  useEffect(() => {
    const save = () => scrollMemory.set(location.pathname, window.scrollY);
    window.addEventListener('scroll', save, { passive: true });
    return () => {
      save();
      window.removeEventListener('scroll', save);
    };
  }, [location.pathname]);

  useEffect(() => {
    restoreRef.current.cancelled = true;
    if (restoreRef.current.rafId != null) cancelAnimationFrame(restoreRef.current.rafId);
    const state = { rafId: null, cancelled: false };
    restoreRef.current = state;

    if (navigationType === 'POP') {
      const saved = scrollMemory.get(location.pathname);
      if (saved != null) {
        let attempts = 0;
        const tryRestore = () => {
          if (state.cancelled) return;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (maxScroll >= saved - 4 || attempts >= MAX_RESTORE_FRAMES) {
            window.scrollTo({ top: saved, behavior: 'instant' });
            return;
          }
          attempts += 1;
          state.rafId = requestAnimationFrame(tryRestore);
        };
        state.rafId = requestAnimationFrame(tryRestore);
      }
      return () => { state.cancelled = true; };
    }

    if (navigationType === 'PUSH' || navigationType === 'REPLACE') {
      if (!location.state?.scrollTo) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }
    return undefined;
  }, [location.pathname, location.state, navigationType]);

  return null;
};

export default RouteEffects;
