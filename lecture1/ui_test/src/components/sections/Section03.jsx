import { useState } from 'react';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SectionWrapper from '../ui/SectionWrapper';

const Row = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

const NAV_MENUS = [
  { label: '홈',    icon: <HomeIcon /> },
  { label: '소개',  icon: <InfoIcon /> },
  { label: '서비스', icon: <MiscellaneousServicesIcon /> },
  { label: '연락처', icon: <ContactMailIcon /> },
];

const Section03 = () => {
  const [tabValue,    setTabValue]    = useState(0);
  const [bottomNav,   setBottomNav]   = useState(0);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [activeMenu,  setActiveMenu]  = useState(null);

  const handleMenuClick = (label) => {
    setActiveMenu(label);
    alert(`"${label}" 메뉴를 클릭했습니다.`);
  };

  return (
    <SectionWrapper number={3} title="Navigation" description="AppBar, Tabs, Breadcrumbs, BottomNavigation, Drawer를 확인합니다.">
      <Stack spacing={4}>

        {/* AppBar — 반응형 햄버거 메뉴 */}
        <Row label="AppBar — 반응형 햄버거 메뉴 (화면 축소 시 버튼 → 햄버거)">
          <Stack spacing={1.5}>
            <AppBar position="static" color="primary">
              <Toolbar>
                {/* 모바일: 햄버거 버튼 표시 */}
                <IconButton
                  edge="start"
                  color="inherit"
                  sx={{ mr: 1, display: { sm: 'none' } }}
                  onClick={() => setDrawerOpen(true)}
                >
                  <MenuIcon />
                </IconButton>

                <Typography variant="h6" sx={{ flexGrow: 1 }}>My App</Typography>

                {/* 데스크탑: 메뉴 버튼 표시 */}
                <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                  {NAV_MENUS.map(({ label }) => (
                    <Button
                      key={label}
                      color="inherit"
                      onClick={() => handleMenuClick(label)}
                      sx={{ fontWeight: activeMenu === label ? 700 : 400 }}
                    >
                      {label}
                    </Button>
                  ))}
                </Box>
              </Toolbar>
            </AppBar>

            {activeMenu && (
              <Typography variant="caption" color="primary.main">
                마지막 클릭: <strong>{activeMenu}</strong>
              </Typography>
            )}
            <Typography variant="caption" color="text.disabled">
              * 브라우저 폭을 줄이면 메뉴 버튼이 햄버거 아이콘으로 전환됩니다.
            </Typography>
          </Stack>
        </Row>

        {/* Tabs */}
        <Row label="Tabs">
          <Stack spacing={2}>
            <Paper variant="outlined">
              <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
                <Tab label="홈" />
                <Tab label="프로필" />
                <Tab label="설정" />
              </Tabs>
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {['홈 콘텐츠 영역입니다.', '프로필 콘텐츠 영역입니다.', '설정 콘텐츠 영역입니다.'][tabValue]}
                </Typography>
              </Box>
            </Paper>

            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="fullWidth">
              <Tab icon={<HomeIcon />} label="홈" />
              <Tab icon={<PersonIcon />} label="프로필" />
              <Tab icon={<SettingsIcon />} label="설정" />
            </Tabs>
          </Stack>
        </Row>

        {/* Breadcrumbs */}
        <Row label="Breadcrumbs">
          <Stack spacing={1.5}>
            <Breadcrumbs>
              <Link underline="hover" color="inherit" href="#">홈</Link>
              <Link underline="hover" color="inherit" href="#">카테고리</Link>
              <Typography color="text.primary">현재 페이지</Typography>
            </Breadcrumbs>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              <Link underline="hover" color="inherit" href="#">Dashboard</Link>
              <Link underline="hover" color="inherit" href="#">Settings</Link>
              <Typography color="text.primary">Profile</Typography>
            </Breadcrumbs>
          </Stack>
        </Row>

        {/* BottomNavigation */}
        <Row label="BottomNavigation">
          <Paper variant="outlined" sx={{ maxWidth: 480 }}>
            <BottomNavigation value={bottomNav} onChange={(_, v) => setBottomNav(v)} showLabels>
              <BottomNavigationAction label="홈"     icon={<HomeIcon />}     />
              <BottomNavigationAction label="즐겨찾기" icon={<FavoriteIcon />} />
              <BottomNavigationAction label="프로필"  icon={<PersonIcon />}   />
            </BottomNavigation>
          </Paper>
        </Row>

        {/* Drawer */}
        <Row label="Drawer — 클릭 시 알림">
          <Button variant="outlined" startIcon={<MenuIcon />} onClick={() => setDrawerOpen(true)}>
            Drawer 열기
          </Button>
          <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <Box sx={{ width: 240 }} role="presentation">
              <Toolbar>
                <Typography variant="h6">메뉴</Typography>
              </Toolbar>
              <Divider />
              <List>
                {NAV_MENUS.map(({ label, icon }) => (
                  <ListItem key={label} disablePadding>
                    <ListItemButton
                      onClick={() => { handleMenuClick(label); setDrawerOpen(false); }}
                    >
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        </Row>

      </Stack>
    </SectionWrapper>
  );
};

export default Section03;
