import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckIcon from '@mui/icons-material/Check';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SectionWrapper from '../ui/SectionWrapper';

const Row = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

// ─── 기본 Menu ────────────────────────────────────────────────────
const BasicMenu = () => {
  const [anchor, setAnchor] = useState(null);
  const [last,   setLast]   = useState(null);

  const handleClick = (label) => { setLast(label); setAnchor(null); };

  return (
    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
      <Button
        variant="contained"
        endIcon={<KeyboardArrowDownIcon />}
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        메뉴 열기
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <MenuItem onClick={() => handleClick('수정')}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>수정</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleClick('복사')}>
          <ListItemIcon><ContentCopyIcon fontSize="small" /></ListItemIcon>
          <ListItemText>복사</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleClick('공유')}>
          <ListItemIcon><ShareIcon fontSize="small" /></ListItemIcon>
          <ListItemText>공유</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleClick('다운로드')}>
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText>다운로드</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleClick('삭제')} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>삭제</ListItemText>
        </MenuItem>
      </Menu>
      {last && (
        <Typography variant="body2" color="primary.main">
          선택: <strong>{last}</strong>
        </Typography>
      )}
    </Stack>
  );
};

// ─── 더보기 아이콘 Menu ───────────────────────────────────────────
const IconMenu = () => {
  const [anchor, setAnchor] = useState(null);

  return (
    <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
      {['항목 A', '항목 B', '항목 C'].map((item) => (
        <Paper
          key={item}
          variant="outlined"
          sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: 160 }}
        >
          <Typography variant="body2">{item}</Typography>
          <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Paper>
      ))}
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem dense onClick={() => setAnchor(null)}>수정</MenuItem>
        <MenuItem dense onClick={() => setAnchor(null)}>복제</MenuItem>
        <Divider />
        <MenuItem dense onClick={() => setAnchor(null)} sx={{ color: 'error.main' }}>삭제</MenuItem>
      </Menu>
    </Stack>
  );
};

// ─── 컨텍스트 메뉴 (우클릭) ──────────────────────────────────────
const ContextMenu = () => {
  const [anchor,   setAnchor]   = useState(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleContextMenu = (e) => {
    e.preventDefault();
    setPosition({ top: e.clientY, left: e.clientX });
    setAnchor(e.currentTarget);
  };

  return (
    <>
      <Box
        onContextMenu={handleContextMenu}
        sx={{
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          maxWidth: 400,
          cursor: 'context-menu',
          userSelect: 'none',
          bgcolor: anchor ? 'action.hover' : 'grey.50',
          transition: 'background 0.2s',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          이 영역에서 <strong>우클릭</strong>하면 컨텍스트 메뉴가 나타납니다.
        </Typography>
      </Box>
      <Menu
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorReference="anchorPosition"
        anchorPosition={position}
      >
        <MenuItem onClick={() => setAnchor(null)}>
          <ListItemIcon><ContentCopyIcon fontSize="small" /></ListItemIcon>복사
        </MenuItem>
        <MenuItem onClick={() => setAnchor(null)}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>붙여넣기
        </MenuItem>
        <MenuItem onClick={() => setAnchor(null)}>
          <ListItemIcon><ShareIcon fontSize="small" /></ListItemIcon>공유
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setAnchor(null)} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>삭제
        </MenuItem>
      </Menu>
    </>
  );
};

// ─── 선택 Menu (체크 표시) ────────────────────────────────────────
const SORT_OPTIONS = ['최신순', '인기순', '가나다순', '별점순'];

const SelectMenu = () => {
  const [anchor,   setAnchor]   = useState(null);
  const [selected, setSelected] = useState('최신순');

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Button
        variant="outlined"
        endIcon={<KeyboardArrowDownIcon />}
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        정렬: {selected}
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {SORT_OPTIONS.map((opt) => (
          <MenuItem
            key={opt}
            selected={opt === selected}
            onClick={() => { setSelected(opt); setAnchor(null); }}
          >
            <ListItemIcon>
              {opt === selected
                ? <CheckIcon fontSize="small" color="primary" />
                : <Box sx={{ width: 20 }} />
              }
            </ListItemIcon>
            {opt}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
};

// ─── 계정 Menu ────────────────────────────────────────────────────
const AccountMenu = () => {
  const [anchor,   setAnchor]   = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notif,    setNotif]    = useState(true);

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Tooltip title="계정 메뉴">
        <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>K</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { minWidth: 220 } }}
      >
        {/* 사용자 정보 */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" fontWeight={600}>김개발</Typography>
          <Typography variant="caption" color="text.secondary">dev@example.com</Typography>
        </Box>
        <Divider />

        <MenuItem onClick={() => setAnchor(null)}>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          <ListItemText>프로필</ListItemText>
          <Chip label="NEW" size="small" color="primary" sx={{ ml: 1 }} />
        </MenuItem>
        <MenuItem onClick={() => setAnchor(null)}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          <ListItemText>설정</ListItemText>
        </MenuItem>

        <Divider />

        {/* 토글 아이템 */}
        <MenuItem onClick={() => setDarkMode((p) => !p)}>
          <ListItemIcon><DarkModeIcon fontSize="small" /></ListItemIcon>
          <ListItemText>다크 모드</ListItemText>
          <Switch size="small" checked={darkMode} onChange={() => setDarkMode((p) => !p)} />
        </MenuItem>
        <MenuItem onClick={() => setNotif((p) => !p)}>
          <ListItemIcon><NotificationsIcon fontSize="small" /></ListItemIcon>
          <ListItemText>알림</ListItemText>
          <Switch size="small" checked={notif} onChange={() => setNotif((p) => !p)} />
        </MenuItem>

        <Divider />
        <MenuItem onClick={() => setAnchor(null)} sx={{ color: 'error.main' }}>
          <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>로그아웃</ListItemText>
        </MenuItem>
      </Menu>
    </Stack>
  );
};

// ─── MenuList (독립 메뉴 목록) ────────────────────────────────────
const StandaloneMenu = () => (
  <Paper variant="outlined" sx={{ maxWidth: 220 }}>
    <MenuList dense>
      <MenuItem>
        <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
        <ListItemText>수정</ListItemText>
        <Typography variant="caption" color="text.secondary">Ctrl+E</Typography>
      </MenuItem>
      <MenuItem>
        <ListItemIcon><ContentCopyIcon fontSize="small" /></ListItemIcon>
        <ListItemText>복사</ListItemText>
        <Typography variant="caption" color="text.secondary">Ctrl+C</Typography>
      </MenuItem>
      <MenuItem>
        <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
        <ListItemText>
          내보내기
          <KeyboardArrowRightIcon sx={{ fontSize: 14, ml: 0.5, verticalAlign: 'middle', color: 'text.disabled' }} />
        </ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem disabled>
        <ListItemIcon><ShareIcon fontSize="small" /></ListItemIcon>
        <ListItemText>공유 (비활성)</ListItemText>
      </MenuItem>
      <MenuItem sx={{ color: 'error.main' }}>
        <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
        <ListItemText>삭제</ListItemText>
        <Typography variant="caption" color="text.secondary">Del</Typography>
      </MenuItem>
    </MenuList>
  </Paper>
);

// ─── 섹션 ─────────────────────────────────────────────────────────
const Section13 = () => (
  <SectionWrapper number={13} title="Menu" description="기본 Menu, 컨텍스트, 선택, 계정, MenuList 패턴을 확인합니다.">
    <Stack spacing={4}>
      <Row label="기본 Menu — 아이콘 + 항목 + 클릭 시 선택값 표시">
        <BasicMenu />
      </Row>
      <Row label="더보기 아이콘 Menu (MoreVert)">
        <IconMenu />
      </Row>
      <Row label="컨텍스트 Menu — 우클릭 트리거">
        <ContextMenu />
      </Row>
      <Row label="선택 Menu — 체크 표시로 현재 선택 강조">
        <SelectMenu />
      </Row>
      <Row label="계정 Menu — Avatar 트리거, 토글 스위치 포함">
        <AccountMenu />
      </Row>
      <Row label="MenuList — 단축키 표시 · disabled · 독립 컴포넌트">
        <StandaloneMenu />
      </Row>
    </Stack>
  </SectionWrapper>
);

export default Section13;
