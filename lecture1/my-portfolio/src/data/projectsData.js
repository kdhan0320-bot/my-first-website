/* 포트폴리오 공유 프로젝트 데이터 (ProjectsSection + ProjectsPage 공통)
 * 썸네일 URL은 import.meta.env.BASE_URL 의존성이 있어
 * 이 파일은 Vite 환경에서만 정상 동작합니다.
 * Node 환경 테스트용으로는 projectsFallbackData.js 를 사용하세요.
 */
import { fallbackProjects, FALLBACK_FILTER_TABS } from './projectsFallbackData';

const BASE = import.meta.env.BASE_URL;

const THUMB_MAP = {
  jobflow:      `${BASE}jobflow-thumb.svg`,
  'feedback-hub': `${BASE}thumbnails/community.png`,
  gamstagram:   `${BASE}thumbnails/minisns.png`,
  'ott-service': `${BASE}thumbnails/ott-service.png`,
};

export const ALL_PROJECTS = fallbackProjects.map((p) => ({
  ...p,
  thumbnailUrl: THUMB_MAP[p.id] ?? p.thumbnailUrl ?? null,
  detail: {
    overview:       p.overview,
    problem:        p.problem,
    goal:           p.goal,
    targetUser:     p.targetUser     ?? null,
    designPoint:    p.designPoint,
    process:        p.process        ?? null,
    result:         p.result         ?? null,
    aiContribution: p.aiContribution ?? null,
    limitation:     p.limitation     ?? null,
    nextStep:       p.nextStep,
  },
}));

export const FILTER_TABS = FALLBACK_FILTER_TABS;
