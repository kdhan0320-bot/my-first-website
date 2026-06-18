/* ==============================================
   STREAMIX — main.js
   인터랙션: ① 헤더 스크롤 ② 카드 hover(CSS)
             ③ 장르 필터  ④ 예고편 모달
   ============================================== */

'use strict';

// ──────────────────────────────────────────────
// 1. 헤더 스크롤 시 배경 변경
// ──────────────────────────────────────────────
const header = document.getElementById('header');

function handleScroll() {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // 초기 실행


// ──────────────────────────────────────────────
// 2. 모바일 햄버거 메뉴
// ──────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
});

// 모바일 메뉴 링크 클릭 시 닫기
document.querySelectorAll('.mobile-nav__link').forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
}


// ──────────────────────────────────────────────
// 3. 장르 필터 버튼 클릭 → 카드 필터링
// ──────────────────────────────────────────────
const filterBtns  = document.querySelectorAll('.filter-btn');
const contentCards = document.querySelectorAll('#contentsGrid .card');
const noResults    = document.getElementById('noResults');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const selectedFilter = btn.dataset.filter;

    // 버튼 상태 업데이트
    filterBtns.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    // 카드 표시/숨김
    let visibleCount = 0;

    contentCards.forEach((card, index) => {
      const cardGenre = card.dataset.genre;
      const isMatch   = selectedFilter === 'all' || cardGenre === selectedFilter;

      if (isMatch) {
        card.classList.remove('hidden');
        // 순차 등장 애니메이션
        card.style.animation = 'none';
        // eslint-disable-next-line no-unused-expressions
        card.offsetHeight; // reflow 강제
        card.style.animation = `fadeUp 0.4s ease ${visibleCount * 0.07}s both`;
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    // 결과 없음 메시지
    noResults.style.display = visibleCount === 0 ? 'flex' : 'none';
  });
});


// ──────────────────────────────────────────────
// 4. 예고편 모달 열기 / 닫기
// ──────────────────────────────────────────────
const trailerModal   = document.getElementById('trailerModal');
const trailerBtn     = document.getElementById('trailerBtn');
const heroTrailerBtn = document.getElementById('heroTrailerBtn');
const modalClose     = document.getElementById('modalClose');
const modalBackdrop  = document.getElementById('modalBackdrop');

let lastFocused = null; // 접근성: 모달 닫은 후 포커스 복원

function openModal(triggerEl) {
  lastFocused = triggerEl || document.activeElement;
  trailerModal.classList.add('open');
  trailerModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // 포커스 이동 (접근성)
  requestAnimationFrame(() => {
    modalClose.focus();
  });
}

function closeModal() {
  trailerModal.classList.remove('open');
  trailerModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // 포커스 복원
  if (lastFocused) {
    lastFocused.focus();
    lastFocused = null;
  }
}

trailerBtn.addEventListener('click',     () => openModal(trailerBtn));
heroTrailerBtn.addEventListener('click', () => openModal(heroTrailerBtn));
modalClose.addEventListener('click',     closeModal);
modalBackdrop.addEventListener('click',  closeModal);

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && trailerModal.classList.contains('open')) {
    closeModal();
  }
});

// 모달 내 포커스 트랩 (Tab 키)
trailerModal.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;

  const focusableSelectors =
    'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusable = Array.from(trailerModal.querySelectorAll(focusableSelectors));
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});


// ──────────────────────────────────────────────
// 5. 스크롤 감지로 네비 링크 active 상태 전환
// ──────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  },
  { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
);

sections.forEach((sec) => sectionObserver.observe(sec));


// ──────────────────────────────────────────────
// 6. 카드 키보드 접근성 (Enter / Space → 재생)
// ──────────────────────────────────────────────
document.querySelectorAll('.card, .rec-card').forEach((card) => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const playBtn =
        card.querySelector('.card__play-btn') ||
        card.querySelector('.rec-card__btn');
      if (playBtn) playBtn.click();
    }
  });
});
