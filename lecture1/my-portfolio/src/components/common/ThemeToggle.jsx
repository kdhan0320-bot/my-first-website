import { IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from '../../context/ThemeModeContext';

const ThemeToggle = ({ sx: sxProp }) => {
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <Tooltip title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'} placement="bottom">
      <IconButton
        onClick={toggleMode}
        aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
        aria-pressed={isDark}
        size="small"
        sx={[
          {
            border: '1px solid',
            borderColor: isDark ? 'rgba(148,163,184,0.25)' : 'rgba(21,120,170,0.22)',
            borderRadius: 1.5,
            width: 36,
            height: 36,
            color: isDark ? '#94A3B8' : '#7F8FA4',
            transition: 'color 0.2s, border-color 0.2s, background-color 0.2s, transform 0.15s',
            '&:hover': {
              color: isDark ? '#E5E7EB' : '#1578AA',
              borderColor: isDark ? '#94A3B8' : '#1578AA',
              bgcolor: isDark ? 'rgba(148,163,184,0.08)' : 'rgba(21,120,170,0.05)',
              transform: 'scale(1.06)',
            },
            '&:active': { transform: 'scale(0.94)' },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: isDark ? '#38BDF8' : '#1578AA',
              outlineOffset: '2px',
            },
          },
          ...(Array.isArray(sxProp) ? sxProp : sxProp ? [sxProp] : []),
        ]}
      >
        {isDark
          ? <LightModeIcon sx={{ fontSize: 17 }} />
          : <DarkModeIcon  sx={{ fontSize: 17 }} />
        }
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
