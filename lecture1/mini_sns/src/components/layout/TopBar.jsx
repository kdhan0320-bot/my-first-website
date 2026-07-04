import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Box, Badge } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import GroupsIcon from '@mui/icons-material/Groups';
import { ROUTES } from '../../constants/routes';

const TopBar = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{ background: 'linear-gradient(135deg, #111827 0%, #312E81 100%)' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 56 }}>

        {/* 로고 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 34, height: 34,
              borderRadius: '10px',
              bgcolor: 'rgba(129,140,248,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <GroupsIcon sx={{ color: '#A5B4FC', fontSize: '1.2rem' }} />
          </Box>
          <Box>
            <Typography
              sx={{
                color: '#F8FAFC',
                fontWeight: 800,
                fontSize: '1.05rem',
                letterSpacing: '-0.4px',
                lineHeight: 1.1,
              }}
            >
              Mini SNS
            </Typography>
            <Typography sx={{ color: '#A5B4FC', fontSize: '0.65rem', lineHeight: 1 }}>
              작업 기록 · 스터디 모임
            </Typography>
          </Box>
        </Box>

        {/* 알림 버튼 */}
        <IconButton size="small" onClick={() => navigate(ROUTES.NOTIFICATIONS)} aria-label="알림 페이지로 이동">
          <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}>
            <NotificationsNoneIcon sx={{ color: '#C7D2FE', fontSize: '1.3rem' }} />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
