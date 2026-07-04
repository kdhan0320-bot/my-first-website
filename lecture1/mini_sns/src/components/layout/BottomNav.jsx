import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper, Fab, Box } from '@mui/material';
import {
  Home, HomeOutlined, People, PeopleOutlined,
  Forum, ForumOutlined, AccountCircle, AccountCircleOutlined, Add,
} from '@mui/icons-material';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

const NavIcon = ({ active, activeIcon, icon }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 40, height: 26, borderRadius: '13px',
    bgcolor: active ? 'secondary.main' : 'transparent',
    transition: 'background-color 0.2s ease',
  }}>
    {active ? activeIcon : icon}
  </Box>
);

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isGuest, isDemo } = useAuth();
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
            icon={
              <NavIcon
                active={isActive(ROUTES.HOME)}
                activeIcon={<Home color="primary" sx={{ fontSize: 22 }} />}
                icon={<HomeOutlined sx={{ color: 'text.secondary', fontSize: 22 }} />}
              />
            }
            onClick={() => navigate(ROUTES.HOME)}
            sx={{ minWidth: 0 }}
          />
          <BottomNavigationAction
            aria-label="모임 목록으로 이동"
            icon={
              <NavIcon
                active={isActive(ROUTES.MEETUP)}
                activeIcon={<People color="primary" sx={{ fontSize: 22 }} />}
                icon={<PeopleOutlined sx={{ color: 'text.secondary', fontSize: 22 }} />}
              />
            }
            onClick={() => navigate(ROUTES.MEETUP)}
            sx={{ minWidth: 0 }}
          />
          {/* 중앙 게시물 작성 버튼 자리 (Fab는 아래 오버레이로 표시) */}
          <BottomNavigationAction disabled sx={{ minWidth: 0, opacity: 0, pointerEvents: 'none' }} />
          <BottomNavigationAction
            aria-label="채팅 목록으로 이동"
            icon={
              <NavIcon
                active={isActive(ROUTES.CHAT)}
                activeIcon={<Forum color="primary" sx={{ fontSize: 22 }} />}
                icon={<ForumOutlined sx={{ color: 'text.secondary', fontSize: 22 }} />}
              />
            }
            onClick={() => navigate(ROUTES.CHAT)}
            sx={{ minWidth: 0 }}
          />
          <BottomNavigationAction
            aria-label="프로필로 이동"
            icon={
              <NavIcon
                active={isActive(ROUTES.PROFILE)}
                activeIcon={<AccountCircle color="primary" sx={{ fontSize: 22 }} />}
                icon={<AccountCircleOutlined sx={{ color: 'text.secondary', fontSize: 22 }} />}
              />
            }
            onClick={() => navigate(ROUTES.PROFILE)}
            sx={{ minWidth: 0 }}
          />
        </BottomNavigation>

        {/* 중앙 게시물 작성 버튼 */}
        <Fab
          size="medium" color="primary"
          onClick={() => navigate(isGuest && !isDemo ? ROUTES.LOGIN : ROUTES.CREATE_POST)}
          aria-label="새 게시물 작성"
          sx={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 4px 14px rgba(79,70,229,0.4)', width: 48, height: 48,
          }}
        >
          <Add />
        </Fab>
      </Box>
    </Paper>
  );
};

export default BottomNav;
