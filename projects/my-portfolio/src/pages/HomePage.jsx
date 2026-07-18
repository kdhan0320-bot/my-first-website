import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import MoreWorksSection from '../components/sections/MoreWorksSection';
import ContactSection from '../components/sections/ContactSection';
import { scrollToSection } from '../hooks/useScrollNav';

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return;
    const timer = setTimeout(() => scrollToSection(target), 150);
    return () => clearTimeout(timer);
  }, [location.state]);

  /* 검사용 리뷰 페이지 생성 스크립트(tools/site-audit-kit)가 화면 캡처 전에
   * 기다리는 명시적 완료 신호. 화면에는 아무 영향 없음(속성만 부여, 스타일 없음).
   *
   * review 캡처 모드(data-review-mode="true", addInitScript로 미리 심어짐)에서는
   * Hero의 fadeIn 진입 애니메이션이 스킵되어 즉시 최종 상태로 렌더링되지만(HeroSection
   * 참고), "정말 화면에 보이는지"를 타이밍 추측 없이 실제 computed opacity로 확인한
   * 뒤에만 신호를 세운다. 일반 사용자 경로는 기존과 동일하게 두 번의 rAF로만 판단한다.
   *
   * 제한 시간 안에 Hero 텍스트가 실제로 보이지 않으면 data-review-ready를 세우지
   * 않고 data-review-error를 세운다 — 캡처 스크립트가 이를 감지해 즉시 실패 처리한다
   * (타임아웃을 "성공"으로 넘기지 않는다). */
  useEffect(() => {
    let cancelled = false;
    let rafId;

    const markReady = () => {
      if (!cancelled) document.documentElement.setAttribute('data-review-ready', 'true');
    };

    const isReviewMode = document.documentElement.getAttribute('data-review-mode') === 'true';

    if (!isReviewMode) {
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(markReady);
      });
      return () => {
        cancelled = true;
        cancelAnimationFrame(rafId);
      };
    }

    const startedAt = Date.now();
    const REVIEW_READY_TIMEOUT_MS = 5000;

    const markError = (message) => {
      if (cancelled) return;
      document.documentElement.setAttribute('data-review-error', message);
      console.error(`[review] ${message}`);
    };

    const checkHeroVisible = () => {
      if (cancelled) return;
      const revealEls = document.querySelectorAll('[data-hero-reveal]');
      const visibleCount = Array.from(revealEls).filter(
        (el) => parseFloat(window.getComputedStyle(el).opacity) >= 0.99
      ).length;
      const allVisible = revealEls.length > 0 && visibleCount === revealEls.length;

      if (allVisible) {
        markReady();
        return;
      }
      if (Date.now() - startedAt > REVIEW_READY_TIMEOUT_MS) {
        // 타임아웃이어도 절대 markReady()를 호출하지 않는다 - 준비되지 않은 상태를
        // 성공으로 위장하지 않고 명시적 오류만 남긴다.
        markError(
          `Hero 텍스트 가시 상태 확인 타임아웃(${REVIEW_READY_TIMEOUT_MS}ms): [data-hero-reveal] ${revealEls.length}개 중 ${visibleCount}개만 opacity>=0.99`
        );
        return;
      }
      rafId = requestAnimationFrame(checkHeroVisible);
    };

    rafId = requestAnimationFrame(checkHeroVisible);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <MoreWorksSection />
      <ContactSection />
    </>
  );
};

export default HomePage;
