import { useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import ArticleIcon from '@mui/icons-material/Article';
import ImageIcon from '@mui/icons-material/Image';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SectionWrapper from '../ui/SectionWrapper';

const Row = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

const DRAWER_WIDTH = 240;
const MINI_WIDTH   = 64;

const NAV_ITEMS = [
  { label: '홈',      icon: <HomeIcon />,      badge: null },
  { label: '대시보드', icon: <DashboardIcon />,  badge: null },
  { label: '사용자',   icon: <PeopleIcon />,     badge: 3    },
  { label: '통계',    icon: <BarChartIcon />,   badge: null },
  { label: '알림',    icon: <NotificationsIcon />, badge: 12 },
];

// ─── 임시(Temporary) Drawer ───────────────────────────────────────
const TemporaryDrawer = ({ anchor }) => {
  const [open,   setOpen]   = useState(false);
  const [active, setActive] = useState('홈');

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<MenuIcon />}
        onClick={() => setOpen(true)}
        size="small"
      >
        {anchor} Drawer
      </Button>

      <Drawer anchor={anchor} open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: DRAWER_WIDTH }}>
          {/* 헤더 */}
          <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" color="primary">My App</Typography>
            <IconButton size="small" onClick={() => setOpen(false)}>
              <ChevronLeftIcon />
            </IconButton>
          </Box>
          <Divider />

          <List>
            {NAV_ITEMS.map(({ label, icon, badge }) => (
              <ListItem key={label} disablePadding>
                <ListItemButton
                  selected={active === label}
                  onClick={() => { setActive(label); setOpen(false); }}
                  sx={{ '&.Mui-selected': { bgcolor: 'primary.50', color: 'primary.main', '& .MuiListItemIcon-root': { color: 'primary.main' } } }}
                >
                  <ListItemIcon>
                    {badge ? (
                      <Badge badgeContent={badge} color="error">{icon}</Badge>
                    ) : icon}
                  </ListItemIcon>
                  <ListItemText primary={label} />
                  {badge && <Chip label={badge} size="small" color="error" />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setOpen(false)}>
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText primary="설정" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setOpen(false)} sx={{ color: 'error.main', '& .MuiListItemIcon-root': { color: 'error.main' } }}>
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="로그아웃" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

// ─── Mini Drawer (아이콘 ↔ 전체 토글) ────────────────────────────
const MiniDrawer = () => {
  const [expanded, setExpanded] = useState(true);
  const [active,   setActive]   = useState('홈');
  const width = expanded ? DRAWER_WIDTH : MINI_WIDTH;

  return (
    <Box sx={{ display: 'flex', height: 320, border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      {/* 사이드바 */}
      <Box
        sx={{
          width,
          transition: 'width 0.25s',
          bgcolor: 'grey.900',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* 토글 버튼 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: expanded ? 'flex-end' : 'center', px: 1, py: 1 }}>
          <IconButton size="small" onClick={() => setExpanded((p) => !p)} sx={{ color: 'grey.400' }}>
            {expanded ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: 'grey.700' }} />

        <List dense sx={{ flex: 1 }}>
          {NAV_ITEMS.map(({ label, icon }) => (
            <Tooltip key={label} title={expanded ? '' : label} placement="right">
              <ListItem disablePadding>
                <ListItemButton
                  selected={active === label}
                  onClick={() => setActive(label)}
                  sx={{
                    justifyContent: expanded ? 'initial' : 'center',
                    px: expanded ? 2 : 1.5,
                    color: active === label ? 'primary.light' : 'grey.400',
                    '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.08)' },
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: expanded ? 40 : 'auto', color: 'inherit' }}>
                    {icon}
                  </ListItemIcon>
                  {expanded && <ListItemText primary={label} primaryTypographyProps={{ variant: 'body2' }} />}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Box>

      {/* 콘텐츠 영역 */}
      <Box sx={{ flex: 1, p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="h3" gutterBottom>{active}</Typography>
        <Typography variant="body2" color="text.secondary">
          {active} 페이지 콘텐츠 영역입니다.
        </Typography>
        <Button
          size="small"
          startIcon={expanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          onClick={() => setExpanded((p) => !p)}
          sx={{ mt: 2 }}
          variant="outlined"
        >
          {expanded ? '접기' : '펼치기'}
        </Button>
      </Box>
    </Box>
  );
};

// ─── 중첩 메뉴 Sidebar ────────────────────────────────────────────
const NESTED_ITEMS = [
  { label: '홈',      icon: <HomeIcon />,      children: null },
  { label: '대시보드', icon: <DashboardIcon />,  children: null },
  {
    label: '파일 관리', icon: <FolderIcon />, children: [
      { label: '문서',   icon: <ArticleIcon /> },
      { label: '이미지', icon: <ImageIcon />   },
    ],
  },
  { label: '통계', icon: <BarChartIcon />, children: null },
  { label: '설정', icon: <SettingsIcon />, children: null },
];

const NestedSidebar = () => {
  const [active,   setActive]   = useState('홈');
  const [open,     setOpen]     = useState('파일 관리');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const content = (
    <Box sx={{ width: DRAWER_WIDTH }}>
      {/* 유저 프로필 */}
      <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>K</Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600}>김개발</Typography>
          <Typography variant="caption" color="text.secondary">관리자</Typography>
        </Box>
      </Box>
      <Divider />

      <List component="nav" dense>
        {NESTED_ITEMS.map(({ label, icon, children }) => (
          <Box key={label}>
            <ListItemButton
              selected={active === label && !children}
              onClick={() => {
                if (children) { setOpen((p) => p === label ? null : label); }
                else { setActive(label); setDrawerOpen(false); }
              }}
              sx={{ '&.Mui-selected': { bgcolor: 'primary.50', color: 'primary.main', '& .MuiListItemIcon-root': { color: 'primary.main' } } }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
              <ListItemText primary={label} />
              {children && (open === label ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />)}
            </ListItemButton>

            {children && (
              <Collapse in={open === label} timeout="auto" unmountOnExit>
                <List dense disablePadding>
                  {children.map((child) => (
                    <ListItemButton
                      key={child.label}
                      selected={active === child.label}
                      onClick={() => { setActive(child.label); setDrawerOpen(false); }}
                      sx={{
                        pl: 4,
                        '&.Mui-selected': { bgcolor: 'primary.50', color: 'primary.main', '& .MuiListItemIcon-root': { color: 'primary.main' } },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>{child.icon}</ListItemIcon>
                      <ListItemText primary={child.label} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <Stack spacing={2}>
      <Button variant="outlined" startIcon={<MenuIcon />} onClick={() => setDrawerOpen(true)} sx={{ width: 180 }}>
        중첩 Sidebar 열기
      </Button>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {content}
      </Drawer>

      {/* 인라인 미리보기 */}
      <Paper variant="outlined" sx={{ overflow: 'hidden', maxWidth: DRAWER_WIDTH }}>
        {content}
      </Paper>
    </Stack>
  );
};

// ─── 섹션 ─────────────────────────────────────────────────────────
const Section14 = () => (
  <SectionWrapper number={14} title="Sidebar" description="Temporary Drawer, Mini Drawer, 중첩 메뉴 Sidebar 패턴을 확인합니다.">
    <Stack spacing={5}>

      <Row label="Temporary Drawer — 4방향 (left · right · top · bottom)">
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          {['left', 'right', 'top', 'bottom'].map((anchor) => (
            <TemporaryDrawer key={anchor} anchor={anchor} />
          ))}
        </Stack>
      </Row>

      <Row label="Mini Drawer — 아이콘 전용 ↔ 전체 메뉴 토글 (다크 테마)">
        <MiniDrawer />
      </Row>

      <Row label="중첩 메뉴 Sidebar — Collapse 서브메뉴 + 유저 프로필">
        <NestedSidebar />
      </Row>

    </Stack>
  </SectionWrapper>
);

export default Section14;
