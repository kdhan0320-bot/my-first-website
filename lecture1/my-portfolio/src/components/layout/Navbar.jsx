import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  IconButton, Drawer, List, ListItem, ListItemButton, ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Home',     path: '/' },
  { label: 'About Me', path: '/about' },
  { label: 'Projects', path: '/projects' },
];

const LogoSymbol = () => (
  <Box
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: 64 }}>

          <Box
            component={Link}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', gap: 1.2, textDecoration: 'none' }}
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

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5, alignItems: 'center' }}>
            {NAV_ITEMS.map(({ label, path }) => {
              const isActive = location.pathname === path;
              return (
                <Button
                  key={path}
                  component={Link}
                  to={path}
                  sx={{
                    color: isActive ? '#1578AA' : '#7F8FA4',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.875rem',
                    borderBottom: isActive ? '2px solid #1578AA' : '2px solid transparent',
                    borderRadius: 0,
                    px: 2,
                    py: 1,
                    '&:hover': { color: '#1578AA', backgroundColor: 'transparent' },
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>

          <IconButton
            sx={{ display: { xs: 'flex', sm: 'none' }, color: '#1A1A2E' }}
            onClick={() => setDrawerOpen(true)}
            aria-label="메뉴 열기"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { bgcolor: '#FFFFFF', width: 220, borderLeft: '1px solid #E0E4EA' } } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #E0E4EA' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LogoSymbol />
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#1A1A2E' }}>Dohan.K</Typography>
          </Box>
          <IconButton sx={{ color: '#7F8FA4' }} onClick={() => setDrawerOpen(false)} aria-label="메뉴 닫기">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <List sx={{ pt: 1 }}>
          {NAV_ITEMS.map(({ label, path }) => {
            const isActive = location.pathname === path;
            return (
              <ListItem key={path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={path}
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    color: isActive ? '#1578AA' : '#7F8FA4',
                    borderLeft: isActive ? '3px solid #1578AA' : '3px solid transparent',
                    pl: 3,
                    '&:hover': { color: '#1578AA', bgcolor: '#EAF6FC' },
                  }}
                >
                  <ListItemText primary={label} slotProps={{ primary: { fontWeight: isActive ? 700 : 400, fontSize: '0.9rem' } }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
