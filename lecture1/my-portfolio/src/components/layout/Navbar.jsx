import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  IconButton, Drawer, List, ListItem, ListItemButton, ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useScrollDirection,
  useScrollProgress,
  useActiveSection,
  scrollToSection,
} from '../../hooks/useScrollNav';

const GITHUB_URL = 'https://github.com/kdhan0320-bot';

const NAV_ITEMS = [
  { label: 'Home',     sectionId: 'home',     path: '/'         },
  { label: 'About Me', sectionId: 'about',    path: '/about'    },
  { label: 'Skills',   sectionId: 'skills',   path: null        },
  { label: 'Projects', sectionId: 'projects', path: '/projects' },
  { label: 'Contact',  sectionId: 'contact',  path: null        },
];

const LogoSymbol = () => (
  <Box
    aria-hidden="true"
    sx={{
      width: 32, height: 32,
      borderRadius: '10px',
      bgcolor: '#1578AA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <Typography sx={{ color: '#FFF', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
      DK
    </Typography>
  </Box>
);

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  const isHome = location.pathname === '/';
  const { hidden, atTop } = useScrollDirection(drawerOpen);
  const progress = useScrollProgress();
  const activeSection = useActiveSection(location.pathname);

  // 현재 active 메뉴 레이블 결정
  const getActiveLabel = () => {
    if (!isHome) {
      const matched = NAV_ITEMS.find((item) => item.path && location.pathname === item.path);
      return matched?.label ?? '';
    }
    const matched = NAV_ITEMS.find((item) => item.sectionId === activeSection);
    return matched?.label ?? '';
  };
  const activeLabel = getActiveLabel();

  // 메뉴 클릭 핸들러
  const handleNavClick = (item) => {
    setDrawerOpen(false);

    if (isHome) {
      scrollToSection(item.sectionId);
    } else if (item.path && item.path === location.pathname) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.path) {
      navigate(item.path);
    } else {
      // Skills / Contact: 홈으로 이동 후 해당 섹션으로 스크롤
      navigate('/', { state: { scrollTo: item.sectionId } });
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (isHome) {
      scrollToSection('home');
    } else {
      navigate('/');
    }
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
          transform: effectiveHidden ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
          bgcolor: atTop ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.94)',
          backdropFilter: atTop ? 'none' : 'blur(12px)',
          WebkitBackdropFilter: atTop ? 'none' : 'blur(12px)',
          boxShadow: atTop ? 'none' : '0 1px 10px rgba(26,26,46,0.08)',
          borderBottom: atTop ? '1px solid transparent' : '1px solid rgba(30,155,215,0.10)',
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
          },
        }}
      >
        {/* ── 읽기 진행률 바 ── */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 3,
            bgcolor: 'rgba(30,155,215,0.12)',
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '100%',
              bgcolor: '#1E9BD7',
              transformOrigin: 'left center',
              transform: `scaleX(${progress / 100})`,
              transition: 'transform 0.1s linear',
            }}
          />
        </Box>

        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ justifyContent: 'space-between', minHeight: '64px !important' }}
          >
            {/* ── 로고 ── */}
            <Box
              component="a"
              href={isHome ? '#home' : '/'}
              onClick={handleLogoClick}
              aria-label="Dohan.K 홈으로 이동"
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.2,
                textDecoration: 'none', cursor: 'pointer',
                '&:focus-visible': { outline: '2px solid #1578AA', outlineOffset: '4px', borderRadius: '4px' },
              }}
            >
              <LogoSymbol />
              <Typography
                sx={{
                  color: '#1A1A2E',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  letterSpacing: '-0.2px',
                  fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',
                }}
              >
                Dohan.K
              </Typography>
            </Box>

            {/* ── 데스크톱 메뉴 ── */}
            <Box
              component="nav"
              aria-label="주요 메뉴"
              sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeLabel === item.label;
                return (
                  <Button
                    key={item.label}
                    onClick={() => handleNavClick(item)}
                    aria-current={isActive ? 'page' : undefined}
                    sx={{
                      color: isActive ? '#1578AA' : '#7F8FA4',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.875rem',
                      borderBottom: isActive ? '2px solid #1578AA' : '2px solid transparent',
                      borderRadius: 0,
                      px: 2,
                      py: 1,
                      minHeight: 44,
                      transition: 'color 0.2s, border-color 0.2s',
                      '&:hover': {
                        color: '#1578AA',
                        backgroundColor: 'transparent',
                        borderBottom: isActive ? '2px solid #1578AA' : '2px solid rgba(21,120,170,0.4)',
                      },
                      '&:focus-visible': { outline: '2px solid #1578AA', outlineOffset: '2px' },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}

              {/* GitHub 링크 */}
              <Button
                component="a"
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub 프로필 새 탭에서 열기"
                startIcon={<GitHubIcon aria-hidden="true" sx={{ fontSize: '1rem !important' }} />}
                sx={{
                  ml: 1,
                  color: '#7F8FA4',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  border: '1px solid rgba(21,120,170,0.22)',
                  borderRadius: 2,
                  px: 2,
                  py: 0.75,
                  minHeight: 38,
                  transition: 'color 0.2s, border-color 0.2s, background-color 0.2s, transform 0.2s',
                  '&:hover': { color: '#1578AA', borderColor: '#1578AA', bgcolor: 'rgba(21,120,170,0.05)', transform: 'translateY(-1px)' },
                  '&:active': { transform: 'translateY(0)' },
                  '&:focus-visible': { outline: '2px solid #1578AA', outlineOffset: '2px' },
                }}
              >
                GitHub
              </Button>
            </Box>

            {/* ── 모바일 햄버거 ── */}
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#1A1A2E' }}
              onClick={() => setDrawerOpen(true)}
              aria-label="메뉴 열기"
              aria-expanded={drawerOpen}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* ── 모바일 Drawer ── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: { bgcolor: '#FFFFFF', width: 240, borderLeft: '1px solid #E0E4EA' },
          },
        }}
      >
        {/* Drawer 헤더 */}
        <Box
          sx={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            p: 2, borderBottom: '1px solid #E0E4EA',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LogoSymbol />
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#1A1A2E' }}>
              Dohan.K
            </Typography>
          </Box>
          <IconButton
            sx={{ color: '#7F8FA4' }}
            onClick={() => setDrawerOpen(false)}
            aria-label="메뉴 닫기"
          >
            <CloseIcon fontSize="small" aria-hidden="true" />
          </IconButton>
        </Box>

        {/* 메뉴 항목 */}
        <List component="nav" aria-label="모바일 메뉴" sx={{ pt: 1 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeLabel === item.label;
            return (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={() => handleNavClick(item)}
                  aria-current={isActive ? 'page' : undefined}
                  sx={{
                    color: isActive ? '#1578AA' : '#7F8FA4',
                    borderLeft: isActive ? '3px solid #1578AA' : '3px solid transparent',
                    pl: 3,
                    minHeight: 52,
                    '&:hover': { color: '#1578AA', bgcolor: '#EAF6FC' },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: { fontWeight: isActive ? 700 : 400, fontSize: '0.9rem', color: 'inherit' },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ mx: 2 }} />

        {/* GitHub 링크 */}
        <Box sx={{ p: 2 }}>
          <Button
            component="a"
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub 프로필 새 탭에서 열기"
            startIcon={<GitHubIcon aria-hidden="true" />}
            fullWidth
            variant="outlined"
            sx={{
              color: '#7F8FA4',
              borderColor: '#E0E4EA',
              justifyContent: 'flex-start',
              pl: 2,
              minHeight: 48,
              '&:hover': { color: '#1578AA', borderColor: '#1578AA', bgcolor: '#EAF6FC' },
            }}
          >
            GitHub 보기
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
