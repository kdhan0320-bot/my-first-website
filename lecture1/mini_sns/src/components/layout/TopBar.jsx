import { AppBar, Toolbar, Typography, IconButton, Box, Badge } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

const TopBar = () => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid rgba(21,101,192,0.12)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 56 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SportsEsportsIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography
            variant="h3"
            sx={{
              color: 'primary.main',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              fontSize: '1.3rem',
            }}
          >
            겜스타그램
          </Typography>
        </Box>
        <IconButton size="small">
          <Badge badgeContent={3} color="error">
            <NotificationsNoneIcon sx={{ color: 'text.secondary' }} />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
