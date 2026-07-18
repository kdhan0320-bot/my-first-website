import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Container,
  IconButton, Drawer,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useScrollDirection,
  scrollToSection,
} from '../../hooks/useScrollNav';
import { PORTFOLIO_PDF_URL, GITHUB_PROFILE_URL, CONTACT_EMAIL } from '../../constants/site';
import { FONT_MONO } from '../../theme';

/* Figma 로고는 그래픽 마크가 아니라 "D" 글자 하나 + "Dohan.K" 워드마크다
 * (42:4 Logo, 48:4 Logo) — 기존 그라디언트 배지 SVG(LogoSymbol)는 쓰지 않는다. */
const LogoMark = () => (
  <Box component="span" aria-hidden="true" sx={{ fontWeight: 700, fontSize: '1.375rem', lineHeight: 1, color: 'text.primary' }}>
    D
  </Box>
);

const NAV_ITEMS = [
  { label: 'PROJECTS', type: 'route', to: '/projects' },
  { label: 'GITHUB ↗', type: 'link', href: GITHUB_PROFILE_URL, external: true },
  ...(PORTFOLIO_PDF_URL
    ? [{ label: 'PDF PORTFOLIO ↗', type: 'link', href: PORTFOLIO_PDF_URL, external: true }]
    : []),
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  const isHome = location.pathname === '/';
  const { hidden, atTop } = useScrollDirection(menuOpen);

  const getActiveLabel = () => {
    if (location.pathname === '/projects') return 'PROJECTS';
    return '';
  };
  const activeLabel = getActiveLabel();

  const handleNavClick = (item) => {
    setMenuOpen(false);
    if (item.type === 'route') {
      navigate(item.to);
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (isHome) { scrollToSection('home'); } else { navigate('/'); }
  };

  const effectiveHidden = hidden && !hasFocus;

  return (
    <>
      <AppBar
        position="fixed"
        onFocusCapture={() => setHasFocus(true)}
        onBlurCapture={() => setHasFocus(false)}
        sx={{
          top: 0, left: 0, right: 0,
          bgcolor: 'background.default',
          transform: effectiveHidden ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          boxShadow: atTop ? 'none' : '0 1px 0 rgba(184,193,203,0.16)',
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
          },
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 3, sm: 6, md: 8 } }}>
          <Toolbar
            disableGutters
            sx={{ justifyContent: 'space-between', minHeight: { xs: '72px !important', md: '80px !important' } }}
          >
            {/* 로고 */}
            <Box
              component="a"
              href={isHome ? '#home' : '/'}
              onClick={handleLogoClick}
              aria-label="Dohan.K 홈으로 이동"
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                minHeight: 44,
                textDecoration: 'none', cursor: 'pointer',
                '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '4px', borderRadius: '4px' },
              }}
            >
              <LogoMark />
              <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '1rem' }}>
                Dohan.K
              </Typography>
            </Box>

            {/* 데스크톱 메뉴 */}
            <Box
              component="nav"
              aria-label="주요 메뉴"
              sx={{ display: { xs: 'none', md: 'flex' }, gap: 3.25, alignItems: 'center' }}
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeLabel === item.label;
                const sx = {
                  fontFamily: FONT_MONO,
                  fontSize: '0.75rem',
                  letterSpacing: '0.03em',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  minHeight: 44,
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' },
                  '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px', borderRadius: '2px' },
                };
                if (item.type === 'link') {
                  return (
                    <Box
                      key={item.label}
                      component="a"
                      aria-current={isActive ? 'page' : undefined}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      aria-label={item.label === 'GITHUB ↗' ? 'GitHub 프로필 새 탭에서 열기' : 'PDF 포트폴리오 새 탭에서 열기'}
                      sx={sx}
                    >
                      {item.label}
                    </Box>
                  );
                }
                return (
                  <Box key={item.label} component="button" type="button" aria-current={isActive ? 'page' : undefined} onClick={() => handleNavClick(item)} sx={{ ...sx, bgcolor: 'transparent', border: 0, p: 0, font: 'inherit' }}>
                    {item.label}
                  </Box>
                );
              })}

              <Box
                component="a"
                href={`mailto:${CONTACT_EMAIL}`}
                aria-label="이메일 보내기"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  height: 44,
                  minWidth: 116,
                  px: 2.5,
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 8px 20px rgba(255,107,61,0.35)' },
                  '&:active': { transform: 'translateY(0)' },
                  '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
                }}
              >
                메일 보내기 <Box component="span" aria-hidden="true" sx={{ fontFamily: FONT_MONO }}>→</Box>
              </Box>
            </Box>

            {/* 모바일 우측: 햄버거 */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
              <IconButton
                sx={{ color: 'text.primary', minWidth: 44, minHeight: 44 }}
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

      {/* 모바일 전체 화면 메뉴 (Figma 48:2) */}
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'background.default',
              width: '100%',
              maxWidth: '100%',
              display: 'flex',
              flexDirection: 'column',
              px: 3,
              pt: 2.5,
              pb: 3,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 52 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <LogoMark />
            <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: 'text.primary' }}>
              Dohan.K
            </Typography>
          </Box>
          <Box
            component="button"
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="메뉴 닫기"
            sx={{
              bgcolor: 'transparent', border: 0, cursor: 'pointer', minWidth: 44, minHeight: 44,
              fontFamily: FONT_MONO, fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary',
              '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '2px' },
            }}
          >
            CLOSE
          </Box>
        </Box>

        <Box sx={{ borderTop: '1px solid', borderColor: 'rgba(184,193,203,0.24)', mt: 2, mb: 5.5 }} />

        <Box component="nav" aria-label="모바일 메뉴" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV_ITEMS.map((item, i) => {
            const num = String(i + 1).padStart(2, '0');
            const sx = {
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              minHeight: 48, textDecoration: 'none', cursor: 'pointer',
              color: 'text.primary', fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.4,
              bgcolor: 'transparent', border: 0, width: '100%', font: 'inherit', textAlign: 'left', p: 0,
              '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
            };
            const numberEl = (
              <Box component="span" aria-hidden="true" sx={{ fontFamily: FONT_MONO, fontSize: '0.6875rem', color: 'primary.main' }}>
                {num}
              </Box>
            );
            if (item.type === 'link') {
              return (
                <Box
                  key={item.label}
                  component="a"
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  aria-label={item.label === 'GITHUB ↗' ? 'GitHub 프로필 새 탭에서 열기' : 'PDF 포트폴리오 새 탭에서 열기'}
                  sx={{ ...sx, fontFamily: 'inherit' }}
                >
                  {item.label}
                  {numberEl}
                </Box>
              );
            }
            return (
              <Box key={item.label} component="button" type="button" onClick={() => handleNavClick(item)} sx={sx}>
                {item.label}
                {numberEl}
              </Box>
            );
          })}
        </Box>

        <Box
          component="a"
          href={`mailto:${CONTACT_EMAIL}`}
          aria-label="이메일 보내기"
          sx={{
            mt: 5.5,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            height: 56,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9375rem',
            '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '3px' },
          }}
        >
          메일 보내기 <Box component="span" aria-hidden="true" sx={{ fontFamily: FONT_MONO }}>→</Box>
        </Box>

        <Box sx={{ flex: 1 }} />

        <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.6875rem', color: 'text.secondary', letterSpacing: '0.02em' }}>
          KIM DOHAN / ORDERED SIGNAL
        </Typography>
      </Drawer>
    </>
  );
};

export default Navbar;
