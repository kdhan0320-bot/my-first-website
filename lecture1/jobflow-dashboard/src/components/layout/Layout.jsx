import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: { md: `${DRAWER_WIDTH}px` }, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0 }}>
        <Header onMenuClick={() => setMobileOpen(true)} />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 3 }, mt: { xs: '56px', sm: '64px' } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
