import { AppBar, Toolbar, Typography } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

const Navbar = ({ bgColor = 'rgba(0,0,0,0.2)' }) => {
  return (
    <AppBar position="static" sx={{ background: bgColor, boxShadow: 'none' }}>
      <Toolbar>
        <WbSunnyIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          날씨 앱
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
