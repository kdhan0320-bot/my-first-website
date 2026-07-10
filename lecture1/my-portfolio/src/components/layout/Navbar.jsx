import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  IconButton, Drawer, List, ListItem, ListItemButton, ListItemText,
  Divider, Tooltip,
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
import LogoSymbol from '../ui/LogoSymbol';

const GITHUB_URL = 'https://github.com/kdhan0320-bot';

const NAV_ITEMS = [
  { label: '소개',     type: 'scroll', sectionId: 'about' },
  { label: '프로젝트', type: 'route',  to: '/projects' },
  { label: '연락처',   type: 'scroll', sectionId: 'contact' },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  const isHome = location.pathname === '/';
  const { hidden, atTop } = useScrollDirection(drawerOpen);
  const progress = useScrollProgress();
  const activeSection = useActiveSection(location.pathname);

  const getActiveLabel = () => {
    if (location.pathname === '/projects') return '프로젝트';
    if (isHome && activeSection === 'about') return '소개';
    if (isHome && activeSection === 'contact') return '연락처';
    return '';
  };
  const activeLabel = getActiveLabel();

  const handleNavClick = (item) => {
    setDrawerOpen(false);
    if (item.type === 'route') {
      navigate(item.to);
      return;
    }
    if (isHome) {
      scrollToSection(item.sectionId);
    } else {
      navigate('/', { state: { scrollTo: item.sectionId } });
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (isHome) { scrollToSection('home'); } else { navigate('/'); }
  };

  const effectiveHidden = hidden && !hasFocus;

  const bgTop      = 'rgba(15,23,42,0.88)';
  const bgScrolled  = 'rgba(17,24,39,0.96)';

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
          bgcolor: atTop ? bgTop : bgScrolled,
          backdropFilter: atTop ? 'none' : 'blur(12px)',
          WebkitBackdropFilter: atTop ? 'none' : 'blur(12px)',
          boxShadow: atTop ? 'none' : '0 1px 10px rgba(0,0,0,0.3)',
          borderBottom: atTop ? '1px solid transparent' : '1px solid',
          borderBottomColor: atTop ? 'transparent' : 'divider',
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
          },
        }}
      >
        {/* 읽기 진행률 바 */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 3,
            bgcolor: 'rgba(56,189,248,0.12)',
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '100%',
              bgcolor: 'primary.main',
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
            {/* 로고 */}
            <Box
              component="a"
              href={isHome ? '#home' : '/'}
              onClick={handleLogoClick}
              aria-label="Dohan.K 홈으로 이동"
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.2,
                minHeight: 44,
                textDecoration: 'none', cursor: 'pointer',
                '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '4px', borderRadius: '4px' },
              }}
            >
              <LogoSymbol />
              <Typography
                sx={{
                  color: 'text.primary',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  letterSpacing: '-0.2px',
                  fontFamily: '"Pretendard", "Noto Sans KR", sans-serif',
                }}
              >
                Dohan.K
              </Typography>
            </Box>

            {/* 데스크톱 메뉴 */}
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
                    sx={(theme) => ({
                      color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.875rem',
                      whiteSpace: 'nowrap',
                      bgcolor: isActive ? theme.palette.highlight.background : 'transparent',
                      borderRadius: '999px',
                      px: 2,
                      py: 1,
                      minHeight: 44,
                      transition: 'color 0.2s, background-color 0.2s',
                      '&:hover': {
                        color: theme.palette.primary.main,
                        bgcolor: isActive
                          ? theme.palette.highlight.background
                          : 'rgba(148,163,184,0.08)',
                      },
                      '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: '2px' },
                    })}
                  >
                    {item.label}
                  </Button>
                );
              })}

              {/* PDF 포트폴리오 버튼: 실제 PDF 파일이 public/에 준비되면 다시 추가 (portfolio.pdf 필요) */}

              {/* GitHub 링크 */}
              <Tooltip
                title="작업한 코드와 프로젝트 구조는 GitHub에서 확인할 수 있습니다."
                placement="bottom"
                arrow
              >
                <Button
                  component="a"
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub 프로필 새 탭에서 열기 — 작업한 코드와 프로젝트 구조를 확인할 수 있습니다."
                  startIcon={<GitHubIcon aria-hidden="true" sx={{ fontSize: '1rem !important' }} />}
                  sx={{
                    ml: 1,
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    whiteSpace: 'nowrap',
                    border: '1px solid rgba(148,163,184,0.22)',
                    borderRadius: 2,
                    px: 2,
                    py: 0.75,
                    minHeight: 44,
                    transition: 'color 0.2s, border-color 0.2s, background-color 0.2s, transform 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(56,189,248,0.05)',
                      transform: 'translateY(-1px)',
                    },
                    '&:active': { transform: 'translateY(0)' },
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '2px' },
                  }}
                >
                  GitHub
                </Button>
              </Tooltip>
            </Box>

            {/* 모바일 우측: 햄버거 */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 0.5 }}>
              <IconButton
                sx={{ color: 'text.primary', minWidth: 44, minHeight: 44 }}
                onClick={() => setDrawerOpen(true)}
                aria-label="메뉴 열기"
                aria-expanded={drawerOpen}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 모바일 Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: (theme) => ({
              bgcolor: 'background.paper',
              width: 240,
              borderLeft: `1px solid ${theme.palette.divider}`,
            }),
          },
        }}
      >
        {/* Drawer 헤더 */}
        <Box
          sx={(theme) => ({
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            p: 2, borderBottom: `1px solid ${theme.palette.divider}`,
          })}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LogoSymbol />
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: 'text.primary' }}>
              Dohan.K
            </Typography>
          </Box>
          <IconButton
            sx={{ color: 'text.secondary', minWidth: 44, minHeight: 44 }}
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
                  sx={(theme) => ({
                    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                    borderLeft: isActive ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
                    pl: 3,
                    minHeight: 52,
                    '&:hover': {
                      color: theme.palette.primary.main,
                      bgcolor: theme.palette.highlight.background,
                    },
                  })}
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
            sx={(theme) => ({
              color: theme.palette.text.secondary,
              borderColor: theme.palette.divider,
              justifyContent: 'flex-start',
              pl: 2,
              minHeight: 48,
              '&:hover': {
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                bgcolor: 'rgba(56,189,248,0.06)',
              },
            })}
          >
            GitHub 보기
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
