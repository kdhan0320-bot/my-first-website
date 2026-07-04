/* ==============================================
   STREAMIX — main.js
   인터랙션: ① 헤더 스크롤   ② 장르 필터
             ③ 예고편 모달   ④ 찜하기 토글
             ⑤ 로그인 모달   ⑥ nav active
   ============================================== */

'use strict';

// ──────────────────────────────────────────────
// 1. 헤더 스크롤 시 배경 변경
// ──────────────────────────────────────────────
const header = document.getElementById('header');

function handleScroll() {
  header.classList.toggle('scrolled', window.scrollY > 60);
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();


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
// 3. 장르 필터 버튼 → 카드 필터링
// ──────────────────────────────────────────────
const filterBtns   = document.querySelectorAll('.filter-btn');
const contentCards = document.querySelectorAll('#contentsGrid .card');
const noResults    = document.getElementById('noResults');

// 초기 빈 상태 확실히 숨김 (CSS fallback)
noResults.style.display = 'none';

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const selected = btn.dataset.filter;

    filterBtns.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    let count = 0;
    contentCards.forEach((card) => {
      const match = selected === 'all' || card.dataset.genre === selected;
      if (match) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = `fadeUp 0.4s ease ${count * 0.07}s both`;
        count++;
      } else {
        card.classList.add('hidden');
      }
    });

    noResults.style.display = count === 0 ? 'flex' : 'none';
  });
});


// ──────────────────────────────────────────────
// 4. 예고편 모달
// ──────────────────────────────────────────────
const trailerModal   = document.getElementById('trailerModal');
const trailerBtn     = document.getElementById('trailerBtn');
const heroTrailerBtn = document.getElementById('heroTrailerBtn');
const modalClose     = document.getElementById('modalClose');
const modalBackdrop  = document.getElementById('modalBackdrop');

let lastFocused = null;

function openModal(triggerEl) {
  lastFocused = triggerEl || document.activeElement;
  trailerModal.classList.add('open');
  trailerModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => modalClose.focus());
}

function closeModal() {
  trailerModal.classList.remove('open');
  trailerModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocused) { lastFocused.focus(); lastFocused = null; }
}

trailerBtn.addEventListener('click',     () => openModal(trailerBtn));
heroTrailerBtn.addEventListener('click', () => openModal(heroTrailerBtn));
modalClose.addEventListener('click',     closeModal);
modalBackdrop.addEventListener('click',  closeModal);

// 포커스 트랩 (Tab)
trailerModal.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const sel = 'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])';
  const focusable = Array.from(trailerModal.querySelectorAll(sel));
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});


// ──────────────────────────────────────────────
// 5. 로그인 모달
// ──────────────────────────────────────────────
const loginModal        = document.getElementById('loginModal');
const loginModalClose   = document.getElementById('loginModalClose');
const loginModalBackdrop = document.getElementById('loginModalBackdrop');
const loginForm         = document.getElementById('loginForm');

let lastLoginFocused = null;

function openLoginModal(triggerEl) {
  closeMobileMenu(); // 모바일 메뉴 열려있으면 닫기
  lastLoginFocused = triggerEl || document.activeElement;
  loginModal.classList.add('open');
  loginModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => loginModalClose.focus());
}

function closeLoginModal() {
  loginModal.classList.remove('open');
  loginModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastLoginFocused) { lastLoginFocused.focus(); lastLoginFocused = null; }
}

// 무료로 시작하기 버튼 모두 연결
document.querySelectorAll('.js-start-btn').forEach((btn) => {
  btn.addEventListener('click', () => openLoginModal(btn));
});

loginModalClose.addEventListener('click',    closeLoginModal);
loginModalBackdrop.addEventListener('click', closeLoginModal);

// 폼 제출 - 데모이므로 새로고침 방지
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  closeLoginModal();
});

// 테스트 계정으로 시작하기 버튼
const demoEnterBtn = document.getElementById('demoEnterBtn');
if (demoEnterBtn) {
  demoEnterBtn.addEventListener('click', closeLoginModal);
}

// 로그인 모달 포커스 트랩
loginModal.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const sel = 'button:not([disabled]), input, a[href], [tabindex]:not([tabindex="-1"])';
  const focusable = Array.from(loginModal.querySelectorAll(sel));
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});


// ──────────────────────────────────────────────
// 6. ESC 키 — 열린 모달 닫기 (통합)
// ──────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (trailerModal.classList.contains('open')) closeModal();
  else if (loginModal.classList.contains('open')) closeLoginModal();
});


// ──────────────────────────────────────────────
// 7. 찜하기 토글 (Hero · Detail · 카드)
// ──────────────────────────────────────────────

// Hero 찜하기 버튼
const likeHeroBtn = document.getElementById('likeHeroBtn');
if (likeHeroBtn) {
  likeHeroBtn.addEventListener('click', () => {
    const isLiked = likeHeroBtn.classList.toggle('liked');
    likeHeroBtn.setAttribute('aria-pressed', String(isLiked));
    likeHeroBtn.setAttribute('aria-label', isLiked ? '찜 해제하기' : '찜하기');
    const span = likeHeroBtn.querySelector('span');
    if (span) span.textContent = isLiked ? '찜 완료' : '찜하기';
  });
}

// Detail 내 리스트 추가 버튼
const listAddBtn = document.getElementById('listAddBtn');
if (listAddBtn) {
  listAddBtn.addEventListener('click', () => {
    const isLiked = listAddBtn.classList.toggle('liked');
    listAddBtn.setAttribute('aria-pressed', String(isLiked));
    listAddBtn.setAttribute('aria-label', isLiked ? '리스트에서 제거' : '내 리스트에 추가');
    const span = listAddBtn.querySelector('span');
    if (span) span.textContent = isLiked ? '리스트 추가됨' : '내 리스트 추가';
    // 아이콘을 + → ✓ 로 변경
    const svg = listAddBtn.querySelector('svg');
    if (svg) {
      svg.innerHTML = isLiked
        ? '<polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" fill="none"/>'
        : '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>';
    }
  });
}

// 카드 찜하기 버튼 (모든 카드)
document.querySelectorAll('.card__icon-btn[aria-label="찜하기"]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 버블링 방지
    const isLiked = btn.classList.toggle('liked');
    btn.setAttribute('aria-pressed', String(isLiked));
    btn.setAttribute('aria-label', isLiked ? '찜 해제하기' : '찜하기');
  });
});


// ──────────────────────────────────────────────
// 8. 스크롤 감지 → 네비 링크 active 전환
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
// ──────────────────────────────────────────────
// Hero 상세 정보 버튼 → Original 섹션으로 스크롤
// ──────────────────────────────────────────────
const heroDetailBtn = document.getElementById('heroDetailBtn');
if (heroDetailBtn) {
  heroDetailBtn.addEventListener('click', () => {
    const target = document.getElementById('original');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}


// 9. 카드 키보드 접근성 (Enter / Space)
// ──────────────────────────────────────────────
document.querySelectorAll('.card, .rec-card').forEach((card) => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const playBtn = card.querySelector('.card__play-btn') || card.querySelector('.rec-card__btn');
      if (playBtn) playBtn.click();
    }
  });
});
