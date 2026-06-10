import { Box } from '@mui/material';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

const MainLayout = ({ children }) => {
  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: 'auto',
        minHeight: '100vh',
        bgcolor: 'background.default',
        position: 'relative',
      }}
    >
      <TopBar />
      <Box sx={{ pt: '56px', pb: '72px', minHeight: '100vh' }}>
        {children}
      </Box>
      <BottomNav />
    </Box>
  );
};

export default MainLayout;
