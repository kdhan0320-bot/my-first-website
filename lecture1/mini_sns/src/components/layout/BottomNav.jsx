import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper, Fab, Box } from '@mui/material';
import {
  Home, HomeOutlined, People, PeopleOutlined,
  Forum, ForumOutlined, AccountCircle, AccountCircleOutlined, Add,
} from '@mui/icons-material';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isGuest } = useAuth();
  const path = location.pathname;

  const isActive = (route) => path === route || (route === ROUTES.CHAT && path.startsWith('/chat/'));

  return (
    <Paper
      sx={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        maxWidth: 480, mx: 'auto',
      }}
      elevation={0}
    >
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <BottomNavigation
          sx={{ width: '100%', bgcolor: 'background.paper', height: 60 }}
        >
          <BottomNavigationAction
            aria-label="홈 피드로 이동"
            icon={isActive(ROUTES.HOME) ? <Home color="primary" /> : <HomeOutlined sx={{ color: 'text.secondary' }} />}
            onClick={() => navigate(ROUTES.HOME)}
            sx={{ minWidth: 0 }}
          />
          <BottomNavigationAction
            aria-label="모임 목록으로 이동"
            icon={isActive(ROUTES.MEETUP) ? <People color="primary" /> : <PeopleOutlined sx={{ color: 'text.secondary' }} />}
            onClick={() => navigate(ROUTES.MEETUP)}
            sx={{ minWidth: 0 }}
          />
          {/* 중앙 게시물 작성 버튼 자리 (Fab는 아래 오버레이로 표시) */}
          <BottomNavigationAction disabled sx={{ minWidth: 0, opacity: 0, pointerEvents: 'none' }} />
          <BottomNavigationAction
            aria-label="채팅 목록으로 이동"
            icon={isActive(ROUTES.CHAT) ? <Forum color="primary" /> : <ForumOutlined sx={{ color: 'text.secondary' }} />}
            onClick={() => navigate(ROUTES.CHAT)}
            sx={{ minWidth: 0 }}
          />
          <BottomNavigationAction
            aria-label="프로필로 이동"
            icon={isActive(ROUTES.PROFILE) ? <AccountCircle color="primary" /> : <AccountCircleOutlined sx={{ color: 'text.secondary' }} />}
            onClick={() => navigate(ROUTES.PROFILE)}
            sx={{ minWidth: 0 }}
          />
        </BottomNavigation>

        {/* 중앙 게시물 작성 버튼 */}
        <Fab
          size="medium" color="primary"
          onClick={() => navigate(isGuest ? ROUTES.LOGIN : ROUTES.CREATE_POST)}
          aria-label="새 게시물 작성"
          sx={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 4px 14px rgba(21,101,192,0.4)', width: 48, height: 48,
          }}
        >
          <Add />
        </Fab>
      </Box>
    </Paper>
  );
};

export default BottomNav;
