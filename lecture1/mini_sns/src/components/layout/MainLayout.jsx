import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const { isGuest, exitGuestMode } = useAuth();

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
        {isGuest && (
          <Box sx={{
            bgcolor: 'primary.main',
            px: 2, py: 0.8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5,
          }}>
            <Typography variant="caption" sx={{ color: '#fff' }}>
              게스트 모드로 둘러보는 중이에요
            </Typography>
            <Button
              size="small"
              variant="outlined"
              sx={{
                color: '#fff', borderColor: 'rgba(255,255,255,0.6)',
                py: 0, px: 1.2, fontSize: '0.7rem', minHeight: 24,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: '#fff' },
              }}
              onClick={() => { exitGuestMode(); navigate(ROUTES.LOGIN); }}
            >
              로그인하기
            </Button>
          </Box>
        )}
        {children}
      </Box>
      <BottomNav />
    </Box>
  );
};

export default MainLayout;
