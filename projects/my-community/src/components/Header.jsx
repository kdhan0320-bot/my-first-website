import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Container, Box, Typography, Chip, IconButton, Button, Tooltip,
} from '@mui/material';
import { Logout, Login } from '@mui/icons-material';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const navigate = useNavigate();
  const { user, isGuest, signOut, exitGuestMode } = useAuth();

  const handleLogout = async () => {
    if (isGuest) {
      exitGuestMode();
    } else {
      await signOut();
    }
    navigate('/login');
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, minWidth: 0 }}>
            <Box sx={{
              width: 32, height: 32, borderRadius: '8px', flexShrink: 0,
              bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ForumOutlinedIcon sx={{ color: '#fff', fontSize: '1.1rem' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, letterSpacing: '-0.3px', whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Portfolio Feedback Hub</Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>PFH</Box>
            </Typography>
            {isGuest && (
              <Chip
                label="게스트 모드"
                size="small"
                sx={{ bgcolor: 'rgba(37,99,235,0.12)', color: 'primary.main', fontSize: '0.68rem', height: 22, flexShrink: 0, display: { xs: 'none', sm: 'inline-flex' } }}
              />
            )}
          </Box>

          {(user || isGuest) ? (
            <Tooltip title={isGuest ? '로그인 페이지로' : '로그아웃'}>
              <IconButton color="inherit" onClick={handleLogout} aria-label={isGuest ? '로그인 페이지로 이동' : '로그아웃'}>
                {isGuest ? <Login fontSize="small" /> : <Logout fontSize="small" />}
              </IconButton>
            </Tooltip>
          ) : (
            <Button size="small" variant="outlined" onClick={() => navigate('/login')} sx={{ fontSize: '0.78rem', minHeight: 32, flexShrink: 0 }}>
              로그인
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
