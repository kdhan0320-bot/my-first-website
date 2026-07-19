import { AppBar, Toolbar, IconButton, Typography, Box, Chip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { DRAWER_WIDTH } from './Sidebar';

const PAGE_TITLES = {
  '/': '대시보드',
  '/applications': '지원 현황',
  '/applications/new': '지원 회사 등록',
  '/kanban': '전형 보드',
  '/checklist': '체크리스트',
  '/interview': '면접 메모',
  '/ai-prompt': 'AI 프롬프트',
  '/settings': '설정',
};

const Header = ({ onMenuClick }) => {
  const { signOut, isGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? 'JobFlow Dashboard';

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, sm: 64 },
          width: '100%',
          maxWidth: '1440px',
          mx: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
          aria-label="메뉴 열기"
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="h1" sx={{ flex: 1, fontWeight: 600 }}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isGuest && (
            <Chip label="게스트 모드" size="small" color="warning" variant="outlined" />
          )}
          <IconButton
            onClick={handleLogout}
            aria-label="로그아웃"
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
