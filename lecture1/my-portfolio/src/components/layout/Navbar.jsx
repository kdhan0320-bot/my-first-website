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

const Navbar = () => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid #2A2A4E' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 700, letterSpacing: 1 }}
          >
            PORTFOLIO
          </Typography>

          {/* 데스크톱 네비게이션 */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            {NAV_ITEMS.map(({ label, path }) => {
              const isActive = location.pathname === path;
              return (
                <Button
                  key={path}
                  component={Link}
                  to={path}
                  sx={{
                    color: isActive ? '#FFFFFF' : '#AAAAAA',
                    borderBottom: isActive ? '2px solid #FFFFFF' : '2px solid transparent',
                    borderRadius: 0,
                    px: 2,
                    '&:hover': { color: '#FFFFFF', backgroundColor: 'transparent' },
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>

          {/* 모바일 햄버거 버튼 */}
          <IconButton
            sx={{ display: { xs: 'flex', sm: 'none' }, color: '#FFFFFF' }}
            onClick={() => setDrawerOpen(true)}
            aria-label="메뉴 열기"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* 모바일 드로어 */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { bgcolor: '#1A1A2E', width: 220 } } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton sx={{ color: '#FFFFFF' }} onClick={() => setDrawerOpen(false)} aria-label="메뉴 닫기">
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {NAV_ITEMS.map(({ label, path }) => {
            const isActive = location.pathname === path;
            return (
              <ListItem key={path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={path}
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    color: isActive ? '#FFFFFF' : '#AAAAAA',
                    borderLeft: isActive ? '3px solid #FFFFFF' : '3px solid transparent',
                    pl: 3,
                    '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  <ListItemText primary={label} />
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
