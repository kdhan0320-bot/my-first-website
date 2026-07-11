import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Avatar, Tooltip, Link,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ChecklistIcon from '@mui/icons-material/Checklist';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { path: '/', label: '대시보드', icon: <DashboardIcon /> },
  { path: '/applications', label: '지원 현황', icon: <WorkIcon /> },
  { path: '/kanban', label: '전형 보드', icon: <ViewKanbanIcon /> },
  { path: '/checklist', label: '체크리스트', icon: <ChecklistIcon /> },
  { path: '/interview', label: '면접 메모', icon: <QuestionAnswerIcon /> },
  { path: '/ai-prompt', label: 'AI 프롬프트', icon: <AutoAwesomeIcon /> },
  { path: '/settings', label: '설정', icon: <SettingsIcon /> },
];

const SidebarContent = ({ onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();

  const handleNavigate = (path) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2.5, pb: 2 }}>
        <Typography variant="h6" color="primary" fontWeight={700} letterSpacing={-0.5}>
          JobFlow
        </Typography>
        <Typography variant="caption" color="text.secondary">
          취업 준비 관리 대시보드
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
            {isGuest ? 'G' : (user?.email?.[0] ?? '?').toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {isGuest ? '게스트 모드' : (user?.email?.split('@')[0] ?? '사용자')}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {isGuest ? '읽기 전용' : user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              selected={active}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: active ? 'inherit' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { fontSize: '0.875rem', fontWeight: active ? 600 : 400 } }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>
          AI-assisted Dashboard
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5, mb: 1 }}>
          React/MUI 기반 취업 준비 대시보드입니다. AI 도구를 활용해 화면 구조와 기능 구현을 보조받았습니다.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Link
            href="https://github.com/kdhan0320-bot/dohan-portfolio"
            target="_blank"
            rel="noopener noreferrer"
            variant="caption"
            underline="hover"
            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
          >
            GitHub
          </Link>
          <Link
            href="https://kdhan0320-bot.github.io/dohan-portfolio/my-portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            variant="caption"
            underline="hover"
            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
          >
            포트폴리오로 돌아가기
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

const Sidebar = ({ mobileOpen, onMobileClose }) => (
  <>
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onMobileClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <SidebarContent onNavigate={onMobileClose} />
    </Drawer>
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: '1px solid', borderColor: 'divider' },
      }}
      open
    >
      <SidebarContent />
    </Drawer>
  </>
);

export { DRAWER_WIDTH };
export default Sidebar;
