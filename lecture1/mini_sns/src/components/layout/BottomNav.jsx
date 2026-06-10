import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper, Fab, Box } from '@mui/material';
import {
  Home, HomeOutlined, People, PeopleOutlined,
  Forum, ForumOutlined, AccountCircle, AccountCircleOutlined, Add,
} from '@mui/icons-material';
import { ROUTES } from '../../constants/routes';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route) => path === route;

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
            icon={isActive(ROUTES.HOME) ? <Home color="primary" /> : <HomeOutlined sx={{ color: 'text.secondary' }} />}
            onClick={() => navigate(ROUTES.HOME)}
            sx={{ minWidth: 0 }}
          />
          <BottomNavigationAction
            icon={isActive(ROUTES.MEETUP) ? <People color="primary" /> : <PeopleOutlined sx={{ color: 'text.secondary' }} />}
            onClick={() => navigate(ROUTES.MEETUP)}
            sx={{ minWidth: 0 }}
          />
          {/* 중앙 게시물 작성 버튼 */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
            <Fab
              size="medium" color="primary"
              onClick={() => navigate(ROUTES.CREATE_POST)}
              sx={{ boxShadow: '0 4px 14px rgba(21,101,192,0.4)', width: 48, height: 48 }}
            >
              <Add />
            </Fab>
          </Box>
          <BottomNavigationAction
            icon={isActive(ROUTES.CHAT) ? <Forum color="primary" /> : <ForumOutlined sx={{ color: 'text.secondary' }} />}
            onClick={() => navigate(ROUTES.CHAT)}
            sx={{ minWidth: 0 }}
          />
          <BottomNavigationAction
            icon={isActive(ROUTES.PROFILE) ? <AccountCircle color="primary" /> : <AccountCircleOutlined sx={{ color: 'text.secondary' }} />}
            onClick={() => navigate(ROUTES.PROFILE)}
            sx={{ minWidth: 0 }}
          />
        </BottomNavigation>
      </Box>
    </Paper>
  );
};

export default BottomNav;
