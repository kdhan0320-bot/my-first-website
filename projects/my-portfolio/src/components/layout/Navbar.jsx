import { useState, useEffect, useRef } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Container,
  IconButton, Drawer, Fade,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  useStickyCompact,
  useActiveSection,
  scrollToSection,
} from '../../hooks/useScrollNav';
import { GITHUB_PROFILE_URL, CONTACT_EMAIL } from '../../constants/site';
import { FONT_MONO, HUMAN_SIGNAL, ULTRAWIDE_CONTENT_MAX_WIDTH, HOME_WIDE_MAX_WIDTH } from '../../theme';
import DMark from '../brand/DMark';
import ActionIcon from '../ui/ActionIcon';

/* Human Signal Header (Figma Interaction/Navigation States 220:7, Phase 4A
 * 재확인). Ordered Signal 시절의 hide-on-scroll을 없애고 Top / Sticky Compact
 * 두 상태만 오간다 — Header는 항상 화면에 남아 있는다.
 *
 * Human Signal Phase 3B: 채용 담당자의 실제 행동(대표작 보기 → 자료 받기 →
 * 코드 보기 → 연락하기) 중심으로 ABOUT 항목을 뺐다. Home이 one-page 구조라
 * About는 자연스럽게 스크롤해서 보이고, Hero의 "기술 역량 보기" CTA가 같은
 * 이동을 이미 제공한다(`id="about"` 섹션과 `/about` redirect는 유지).
 *
 * Phase 4A: 최신 Figma는 `PORTFOLIO_PDF_URL`이 없어도(실제 PDF 파일이 아직
 * 없어도) "PORTFOLIO PDF" + "SOON" 배지를 항상 비활성 상태로 보여준다
 * (220:21 "Hit Area / PORTFOLIO PDF — Disabled", DEFAULT/HOVER/ACTIVE/FOCUS/
 * STICKY COMPACT 5개 상태 전부 동일). 그래서 PDF 항목은 조건부로 사라지는
 * `type: 'link'`이 아니라, `PORTFOLIO_PDF_URL`이 생기기 전까지 늘 나타나는
 * 별도 `disabled: true` 항목으로 고정한다 — 링크·버튼이 아닌 비인터랙티브
 * 그룹이라 button/a를 쓰지 않고 aria-disabled와 tab 순서 제외로만 표현한다
 * (Implementation Notes 220:94 "ORDER" 항목도 PDF를 건너뛰고
 * Logo → Projects → GitHub → Mail 순서만 정의한다). */
const NAV_ITEMS = [
  { key: 'projects', label: 'PROJECTS', type: 'route', to: '/projects' },
  { key: 'pdf', label: 'PORTFOLIO PDF', type: 'disabled', disabledNote: 'SOON' },
  {
    key: 'github', label: 'GITHUB', type: 'link', href: GITHUB_PROFILE_URL,
    external: true, ariaLabel: 'GitHub 프로필 새 탭에서 열기',
  },
  {
    key: 'mail', label: 'MAIL', type: 'mail', href: `mailto:${CONTACT_EMAIL}`,
    ariaLabel: '이메일 보내기',
  },
];

/* 모바일 drawer에는 MAIL 항목을 두지 않는다 — drawer 하단에 이미 큰 "메일
 * 보내기" CTA가 있어 바로 위에 같은 동작을 하는 목록 항목을 또 두면
 * 390px PNG에서 두 요소가 맞닿아 명백한 중복으로 보였다(실측 확인,
 * mobile-menu-before-390.png). 지시서 6-2가 제시한 두 대안 중 "list의
 * MAIL을 제거" 쪽을 선택한다.
 * PDF는 Figma Mobile Menu Open(221:27)에서 목록 02번 자리에 "준비 중 ·
 * 비활성" 설명과 함께 항상 보이되(221:48/221:49), 다른 항목과 달리 클릭·
 * 포커스 대상이 아니다 — desktop과 같은 disabled 표현을 쓴다. */
const MOBILE_NAV_ITEMS = [
  { key: 'projects', label: 'PROJECTS', desc: '전체 작업', type: 'route', to: '/projects' },
  { key: 'pdf', label: 'PORTFOLIO PDF', desc: '준비 중 · 비활성', type: 'disabled' },
  {
    key: 'github', label: 'GITHUB', desc: '코드 보기', iconVariant: 'external', type: 'link', href: GITHUB_PROFILE_URL,
    external: true, ariaLabel: 'GitHub 프로필 새 탭에서 열기',
  },
];

const focusVisibleSx = {
  '&:focus-visible': {
    outline: `2px solid ${HUMAN_SIGNAL.burntOrange}`,
    outlineOffset: '3px',
    borderRadius: '4px',
  },
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  const isHome = location.pathname === '/';
  const isProjectsArea = location.pathname.startsWith('/projects');
  // Phase 5A-F2: Figma QHD Projects header(208:2)는 본문과 같은 x=504–2056
  // (폭 1552) shell을 쓰지만, Home QHD(347:383 "Content Master / Centered
  // 1440")는 폭 1440(내부 1312)로 서로 다르다(읽기 전용으로 재확인함) — 그래서
  // Navbar 전체를 1552로 넓히지 않고 `/projects` 목록 페이지에서만 좁힌다.
  // `/projects/:slug` Detail은 아직 Figma 동기화 전이라(본문이 1312 shell을
  // 그대로 씀) 여기서 넓히면 헤더/본문 폭이 어긋나 제외한다.
  const isProjectsIndexQhd = location.pathname === '/projects';
  const { compact } = useStickyCompact();
  const activeSection = useActiveSection(location.pathname);

  // 모바일 메뉴 진입/퇴장: 기본은 MUI Drawer의 슬라이드(이동) 트랜지션을 쓰지만,
  // reduced-motion 선호 시에는 이동 없이 opacity 트랜지션(Fade)으로 바꾼다.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // ABOUT nav 항목을 제거하면서 activeSection==='about'을 어떤 nav 항목에도
  // 매칭하지 않는다 — About 자체는 여전히 존재하는 섹션이지만(스크롤로 접근),
  // 더 이상 Header에 하이라이트할 대상이 없다(dead branch 정리).
  const getActiveKey = () => {
    if (isProjectsArea) return 'projects';
    if (isHome && activeSection === 'projects') return 'projects';
    return '';
  };
  const activeKey = getActiveKey();

  // 메뉴를 닫은 뒤 메뉴 버튼으로 focus를 되돌린다(ESC/닫기 버튼/backdrop/항목
  // 선택 모두 MUI Drawer(Modal 기반) 기본 동작 + 이 effect로 처리된다).
  // menuOpen은 최초 마운트에도 false이므로, 단순히 "!menuOpen"만 보면 사용자가
  // 아무 동작도 하지 않은 최초 진입에서도 메뉴 버튼에 focus가 가버린다 — 실제로
  // true였다가 false로 바뀐 경우(open → close)에만 focus를 되돌리도록
  // 이전 값을 ref로 추적한다.
  const wasMenuOpenRef = useRef(false);
  useEffect(() => {
    if (wasMenuOpenRef.current && !menuOpen) {
      menuButtonRef.current?.focus();
    }
    wasMenuOpenRef.current = menuOpen;
  }, [menuOpen]);

  const goToSection = (sectionId) => {
    setMenuOpen(false);
    if (isHome) {
      scrollToSection(sectionId);
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  const handleNavClick = (item) => {
    if (item.type === 'route') {
      setMenuOpen(false);
      navigate(item.to);
    } else if (item.type === 'section') {
      goToSection(item.sectionId);
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (isHome) { scrollToSection('home'); } else { navigate('/'); }
  };

  const headerBg = compact ? 'rgba(242,237,227,0.97)' : HUMAN_SIGNAL.softWhite;
  const headerBorder = compact ? 'rgba(226,217,204,0.8)' : HUMAN_SIGNAL.paperDeep;

  return (
    <>
      <a href="#main-content" className="skip-link">본문으로 건너뛰기</a>

      <AppBar
        position="fixed"
        sx={{
          top: 0, left: 0, right: 0,
          bgcolor: headerBg,
          borderBottom: `1px solid ${headerBorder}`,
          boxShadow: 'none',
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      >
        {/* Phase 2D: MUI xl(1536+) 하나로 1536~2560을 뭉뚱그리지 않고, QHD 전용 shell을
         * 명시적 min-width media query로 한 단계 더 넓힌다 — Header가 2560에서 축소된
         * 사이트처럼 보이던 문제(작은 좌우 여백이 아니라 inner shell 자체가 좁았던 것)를
         * Home 섹션들과 동일한 폭 기준(HOME_WIDE_MAX_WIDTH)으로 맞춘다. */}
        <Container
          maxWidth={false}
          sx={{
            px: { xs: 3, sm: 6, md: 8 },
            maxWidth: { xl: ULTRAWIDE_CONTENT_MAX_WIDTH + 128 },
            mx: 'auto',
            '@media (min-width:1920px)': isProjectsIndexQhd
              ? { maxWidth: 1552, px: 0 }
              : { maxWidth: HOME_WIDE_MAX_WIDTH, px: 8 },
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              justifyContent: 'space-between',
              minHeight: { xs: '72px !important', md: compact ? '68px !important' : '80px !important' },
              transition: 'min-height 0.2s ease',
              '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
            }}
          >
            {/* 로고: D2 + DOHAN KIM + UX/UI · WEB PUBLISHING */}
            <Box
              component="a"
              href={isHome ? '#home' : '/'}
              onClick={handleLogoClick}
              aria-label="Dohan.K 홈으로 이동"
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                minHeight: 44,
                textDecoration: 'none', cursor: 'pointer',
                color: HUMAN_SIGNAL.inkNavy,
                ...focusVisibleSx,
              }}
            >
              <DMark
                size={compact ? 36 : 44}
                tone="onLight"
                sx={{ '@media (min-width:1920px)': { width: compact ? 40 : 48, height: compact ? 40 : 48 } }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
                <Typography sx={{ color: HUMAN_SIGNAL.inkNavy, fontWeight: 500, fontSize: '0.875rem', '@media (min-width:1920px)': { fontSize: '0.9375rem' } }}>
                  DOHAN KIM
                </Typography>
                {!compact && (
                  <Typography
                    sx={{
                      fontFamily: FONT_MONO, color: HUMAN_SIGNAL.inkNavy,
                      fontSize: '0.75rem', letterSpacing: '0.04em',
                    }}
                  >
                    UX/UI · WEB PUBLISHING
                  </Typography>
                )}
              </Box>
            </Box>

            {/* 데스크톱 메뉴 — QHD typography: 1440에서 13px, 1920+에서 15px로
             * 단계적으로 키우고(지시서 10-4), item 사이 간격도 1920+에서 30~40px
             * 범위(36px)로 넓혀 Header가 QHD에서 축소된 문서처럼 보이지 않게 한다. */}
            <Box
              component="nav"
              aria-label="주요 메뉴"
              sx={{
                display: { xs: 'none', md: 'flex' }, gap: 1.5, alignItems: 'center',
                '@media (min-width:1920px)': { gap: 4.5 },
              }}
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeKey === item.key;
                const canBeActive = item.type === 'route' || item.type === 'section';
                const itemSx = {
                  fontFamily: FONT_MONO,
                  fontSize: '0.75rem',
                  '@media (min-width:1440px)': { fontSize: '0.8125rem' },
                  '@media (min-width:1920px)': { fontSize: '0.9375rem' },
                  letterSpacing: '0.04em',
                  color: HUMAN_SIGNAL.inkNavy,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  minHeight: 44,
                  minWidth: 44,
                  px: 1.5,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'transparent',
                  border: 0,
                  font: 'inherit',
                  // hover는 Warm Paper 위 작은 텍스트라 대비가 낮은 brightOrange 대신
                  // burntOrange를 쓴다(active 기본 글자색은 Ink Navy 그대로 유지).
                  '&:hover': { color: HUMAN_SIGNAL.burntOrange },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: '50%',
                    bottom: 10,
                    transform: 'translateX(-50%)',
                    height: 2,
                    borderRadius: '1px',
                    width: isActive ? 24 : 0,
                    bgcolor: HUMAN_SIGNAL.brightOrange,
                    transition: 'width 0.15s ease',
                  },
                  '&:hover::after': canBeActive ? { width: 12, opacity: isActive ? 1 : 0.5 } : undefined,
                  '@media (prefers-reduced-motion: reduce)': { '&::after': { transition: 'none' } },
                  ...focusVisibleSx,
                };

                if (item.type === 'disabled') {
                  // 비인터랙티브 그룹 — button/a를 쓰지 않고 aria-disabled만 준다.
                  // div는 기본적으로 tab 순서에 들어가지 않으므로 별도 tabIndex 처리가
                  // 필요 없다(Implementation Notes 220:94 "ORDER"가 PDF를 건너뛴다).
                  return (
                    <Box
                      key={item.key}
                      role="group"
                      aria-disabled="true"
                      aria-label={`${item.label} — 준비 중`}
                      sx={{
                        fontFamily: FONT_MONO,
                        fontSize: '0.75rem',
                        '@media (min-width:1440px)': { fontSize: '0.8125rem' },
                        '@media (min-width:1920px)': { fontSize: '0.9375rem' },
                        letterSpacing: '0.04em',
                        color: HUMAN_SIGNAL.deepSage,
                        minHeight: 44,
                        px: 1.5,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        userSelect: 'none',
                      }}
                    >
                      {item.label}
                      <Box
                        component="span"
                        aria-hidden="true"
                        sx={{
                          fontFamily: FONT_MONO,
                          fontSize: '0.5625rem',
                          letterSpacing: '0.04em',
                          color: HUMAN_SIGNAL.steelMist,
                          bgcolor: HUMAN_SIGNAL.deepHarbor,
                          border: `1px solid ${HUMAN_SIGNAL.mutedInk}`,
                          borderRadius: '8px',
                          px: 0.75,
                          py: 0.25,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.disabledNote}
                      </Box>
                    </Box>
                  );
                }
                if (item.type === 'link' || item.type === 'mail') {
                  return (
                    <Box
                      key={item.key}
                      component="a"
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      aria-label={item.ariaLabel}
                      sx={itemSx}
                    >
                      {item.label}
                    </Box>
                  );
                }
                if (item.type === 'route') {
                  // 실제 URL 이동이라 button이 아니라 anchor semantics를 쓴다
                  // (좌클릭·Enter·우클릭 "새 탭에서 열기"가 자연스럽게 동작).
                  return (
                    <Box
                      key={item.key}
                      component={RouterLink}
                      to={item.to}
                      aria-current={isActive ? 'page' : undefined}
                      sx={itemSx}
                    >
                      {item.label}
                    </Box>
                  );
                }
                return (
                  <Box
                    key={item.key}
                    component="button"
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => handleNavClick(item)}
                    sx={itemSx}
                  >
                    {item.label}
                  </Box>
                );
              })}
            </Box>

            {/* 모바일: 햄버거 */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
              <IconButton
                ref={menuButtonRef}
                sx={{ color: HUMAN_SIGNAL.inkNavy, minWidth: 44, minHeight: 44, ...focusVisibleSx }}
                onClick={() => setMenuOpen(true)}
                aria-label="메뉴 열기"
                aria-expanded={menuOpen}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 모바일 전체 화면 메뉴 (Figma HS/Interaction/Mobile Menu 221:2, Open 221:27) */}
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        {...(prefersReducedMotion ? { TransitionComponent: Fade, transitionDuration: 0 } : {})}
        slotProps={{
          paper: {
            sx: {
              bgcolor: HUMAN_SIGNAL.deepHarbor,
              backgroundImage: 'none',
              width: '100%',
              maxWidth: '100%',
              display: 'flex',
              flexDirection: 'column',
              px: 3,
              pt: 2.25,
              pb: 3,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 44 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DMark size={36} tone="onDark" />
            <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
              <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: HUMAN_SIGNAL.softWhite }}>
                DOHAN KIM
              </Typography>
              {/* Figma Mobile / Open(221:36)은 닫힌 상태(역할 문구)와 달리 HUMAN SIGNAL로
               * 표기한다 — 열린 메뉴 안에서는 이미 이름 옆이라 직무보다 디자인 시스템/
               * 정체성 태그를 보여주는 쪽으로 구분한 것으로 판단해 그대로 따른다. */}
              <Typography
                sx={{
                  fontFamily: FONT_MONO, fontSize: '0.75rem',
                  color: HUMAN_SIGNAL.steelMist, letterSpacing: '0.04em',
                }}
              >
                HUMAN SIGNAL
              </Typography>
            </Box>
          </Box>
          <Box
            component="button"
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="메뉴 닫기"
            sx={{
              bgcolor: HUMAN_SIGNAL.deepHarbor,
              border: `1px solid ${HUMAN_SIGNAL.steelMist}`,
              borderRadius: '14px',
              cursor: 'pointer',
              width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', lineHeight: 1, color: HUMAN_SIGNAL.softWhite,
              ...focusVisibleSx,
            }}
          >
            <Box component="span" aria-hidden="true">×</Box>
          </Box>
        </Box>

        <Box sx={{ borderTop: '1px solid rgba(170,183,196,0.2)', mt: 2, mb: 3 }} />

        <Typography
          sx={{
            fontFamily: FONT_MONO, fontSize: '0.75rem', letterSpacing: '0.04em',
            // Deep Harbor(어두운 배경) 위 작은 텍스트라 brightOrangeOnDark를 쓴다.
            color: HUMAN_SIGNAL.brightOrangeOnDark, mb: 1.5,
          }}
        >
          NAVIGATION
        </Typography>

        <Box component="nav" aria-label="모바일 메뉴" sx={{ display: 'flex', flexDirection: 'column' }}>
          {MOBILE_NAV_ITEMS.map((item, i) => {
            const num = String(i + 1).padStart(2, '0');
            const isActive = activeKey === item.key;
            const isCurrentPage = (item.key === 'projects' && isProjectsArea);
            const sx = {
              display: 'flex', flexDirection: 'column', gap: 0.25,
              minHeight: 48, textDecoration: 'none', cursor: 'pointer',
              py: 2,
              borderBottom: '1px solid rgba(170,183,196,0.16)',
              bgcolor: 'transparent', border: 0, borderBottomWidth: '1px', width: '100%',
              font: 'inherit', textAlign: 'left', position: 'relative',
              ...focusVisibleSx,
            };
            const label = (
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                <Typography
                  component="span" aria-hidden="true"
                  sx={{
                    fontFamily: FONT_MONO, fontSize: '0.75rem',
                    // Deep Harbor 위 작은 텍스트라 brightOrangeOnDark를 쓴다.
                    color: isActive ? HUMAN_SIGNAL.brightOrangeOnDark : HUMAN_SIGNAL.mutedSage,
                  }}
                >
                  {num}
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: HUMAN_SIGNAL.softWhite }}>
                  {item.label}
                  {isCurrentPage && (
                    <Box component="span" sx={{ fontSize: '0.8125rem', fontWeight: 400, color: HUMAN_SIGNAL.steelMist, ml: 1.25 }}>
                      (현재 페이지)
                    </Box>
                  )}
                </Typography>
              </Box>
            );
            const desc = (
              <Typography sx={{ fontSize: '0.875rem', color: item.type === 'disabled' ? '#8E9AA6' : HUMAN_SIGNAL.steelMist, pl: '38px', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {item.desc}
                {item.iconVariant && <ActionIcon variant={item.iconVariant} sx={{ color: HUMAN_SIGNAL.brightOrangeOnDark, fontSize: '0.9375rem' }} />}
              </Typography>
            );

            if (item.type === 'disabled') {
              // Figma Mobile Menu Open(221:48/221:49) 02번 자리 — 다른 항목과 같은
              // 번호 위계로 보이되 클릭·포커스 대상이 아니다(div, aria-disabled).
              return (
                <Box
                  key={item.key}
                  role="group"
                  aria-disabled="true"
                  sx={{ ...sx, cursor: 'default' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                    <Typography component="span" aria-hidden="true" sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', color: HUMAN_SIGNAL.mutedSage }}>
                      {num}
                    </Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#788593' }}>
                      {item.label}
                    </Typography>
                  </Box>
                  {desc}
                </Box>
              );
            }
            if (item.type === 'link' || item.type === 'mail') {
              return (
                <Box
                  key={item.key}
                  component="a"
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  aria-label={item.ariaLabel}
                  sx={sx}
                >
                  {label}
                  {desc}
                </Box>
              );
            }
            if (item.type === 'route') {
              return (
                <Box
                  key={item.key}
                  component={RouterLink}
                  to={item.to}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                  sx={sx}
                >
                  {label}
                  {desc}
                </Box>
              );
            }
            return (
              <Box key={item.key} component="button" type="button" aria-current={isActive ? 'page' : undefined} onClick={() => handleNavClick(item)} sx={sx}>
                {label}
                {desc}
              </Box>
            );
          })}
        </Box>

        <Box
          component="a"
          href={`mailto:${CONTACT_EMAIL}`}
          aria-label="이메일 보내기"
          sx={{
            mt: 3,
            bgcolor: HUMAN_SIGNAL.softWhite,
            color: HUMAN_SIGNAL.inkNavy,
            height: 56,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '0.9375rem',
            ...focusVisibleSx,
          }}
        >
          메일 보내기 <ActionIcon variant="internal" sx={{ color: HUMAN_SIGNAL.burntOrange }} />
        </Box>

        <Box sx={{ flex: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}>
          <Box
            aria-hidden="true"
            sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: HUMAN_SIGNAL.mutedSage }}
          />
          <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', letterSpacing: '0.04em', color: HUMAN_SIGNAL.steelMist }}>
            OPEN TO WORK · 2026
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em', color: HUMAN_SIGNAL.steelMist, mt: 1 }}>
          ESC 또는 닫기 버튼
        </Typography>
      </Drawer>
    </>
  );
};

export default Navbar;
