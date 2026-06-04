import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Paper,
  Rating,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import SectionWrapper from '../ui/SectionWrapper';

const Row = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

// ─── 기본 호버 효과 ───────────────────────────────────────────────
const BasicHover = () => (
  <Grid container spacing={2}>
    {[
      { label: '위로 이동',   sx: { transition: 'transform 0.25s', '&:hover': { transform: 'translateY(-8px)' } }, bg: 'primary.main' },
      { label: '확대',       sx: { transition: 'transform 0.25s', '&:hover': { transform: 'scale(1.1)' } }, bg: 'secondary.main' },
      { label: '그림자',      sx: { transition: 'box-shadow 0.25s', '&:hover': { boxShadow: 12 } }, bg: 'success.main' },
      { label: '회전',       sx: { transition: 'transform 0.35s', '&:hover': { transform: 'rotate(8deg) scale(1.05)' } }, bg: 'warning.main' },
      { label: '밝기',       sx: { transition: 'filter 0.25s', '&:hover': { filter: 'brightness(1.25)' } }, bg: 'error.main' },
      { label: '기울기',      sx: { transition: 'transform 0.25s', '&:hover': { transform: 'skewX(-8deg) scale(1.05)' } }, bg: 'info.main' },
    ].map(({ label, sx, bg }) => (
      <Grid item xs={6} sm={4} md={2} key={label}>
        <Paper
          elevation={2}
          sx={{
            py: 3,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: bg,
            ...sx,
          }}
        >
          <Typography variant="body2" fontWeight={600} color="white">{label}</Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
);

// ─── 카드 오버레이 호버 ───────────────────────────────────────────
const IMAGES = [
  { seed: 'city1',   title: '도시 풍경', category: '여행' },
  { seed: 'nature1', title: '자연 경관', category: '자연' },
  { seed: 'food1',   title: '맛있는 음식', category: '푸드' },
];

const OverlayCard = ({ seed, title, category }) => {
  const [liked,   setLiked]   = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
    >
      <CardMedia
        component="img"
        height={200}
        image={`https://picsum.photos/seed/${seed}/400/200`}
        alt={title}
        sx={{
          transition: 'transform 0.4s',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
        }}
      />

      {/* 다크 오버레이 */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(0,0,0,0.45)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <Tooltip title="크게 보기">
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="새 탭">
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
            <OpenInNewIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 카테고리 배지 */}
      <Chip
        label={category}
        size="small"
        color="primary"
        sx={{ position: 'absolute', top: 10, left: 10 }}
      />

      <CardContent sx={{ pb: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h3">{title}</Typography>
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={() => setLiked((p) => !p)} color={liked ? 'error' : 'default'}>
              {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </IconButton>
            <IconButton size="small" onClick={() => setSaved((p) => !p)} color={saved ? 'primary' : 'default'}>
              {saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

// ─── 프로필 카드 호버 ─────────────────────────────────────────────
const PROFILES = [
  { name: '김민준', role: 'Frontend Dev', color: '#1976d2', rating: 4.5 },
  { name: '이서연', role: 'UI/UX Designer', color: '#9c27b0', rating: 5 },
  { name: '박지호', role: 'Backend Dev', color: '#2e7d32', rating: 4 },
];

const ProfileCard = ({ name, role, color, rating }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      elevation={hovered ? 8 : 1}
      sx={{
        textAlign: 'center',
        transition: 'all 0.3s',
        transform: hovered ? 'translateY(-6px)' : 'none',
        overflow: 'hidden',
      }}
    >
      {/* 상단 컬러 배너 */}
      <Box sx={{ height: 60, bgcolor: color, transition: 'height 0.3s', ...(hovered && { height: 80 }) }} />

      <CardContent sx={{ pt: 0, mt: -4 }}>
        <Avatar
          sx={{
            width: 64, height: 64,
            bgcolor: color,
            fontSize: 24,
            mx: 'auto',
            border: '3px solid white',
            transition: 'transform 0.3s',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          {name[0]}
        </Avatar>
        <Typography variant="h3" sx={{ mt: 1 }}>{name}</Typography>
        <Typography variant="body2" color="text.secondary">{role}</Typography>
        <Rating value={rating} precision={0.5} size="small" readOnly sx={{ mt: 0.5 }} />

        {/* 호버 시 나타나는 SNS 버튼 */}
        <Stack
          direction="row"
          justifyContent="center"
          spacing={0.5}
          sx={{
            mt: 1.5,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.3s',
          }}
        >
          <IconButton size="small" color="inherit"><GitHubIcon fontSize="small" /></IconButton>
          <IconButton size="small" sx={{ color: '#0077b5' }}><LinkedInIcon fontSize="small" /></IconButton>
          <IconButton size="small" sx={{ color: '#1da1f2' }}><TwitterIcon fontSize="small" /></IconButton>
          <IconButton size="small"><ShareIcon fontSize="small" /></IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

// ─── 버튼 호버 ────────────────────────────────────────────────────
const ButtonHover = () => (
  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
    <Button
      variant="contained"
      sx={{
        transition: 'all 0.25s',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: 6 },
      }}
    >
      위로 뜨기
    </Button>
    <Button
      variant="outlined"
      sx={{
        transition: 'all 0.25s',
        '&:hover': { transform: 'scale(1.06)', borderWidth: 2 },
      }}
    >
      확대
    </Button>
    <Button
      variant="contained"
      color="secondary"
      sx={{
        transition: 'all 0.3s',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(255,255,255,0)',
          transition: 'bgcolor 0.3s',
        },
        '&:hover::after': { bgcolor: 'rgba(255,255,255,0.15)' },
        '&:hover': { transform: 'translateY(-3px)' },
      }}
    >
      리플 오버레이
    </Button>
    <Button
      variant="outlined"
      color="error"
      sx={{
        transition: 'all 0.25s',
        '&:hover': { bgcolor: 'error.main', color: 'white', transform: 'scale(1.05)' },
      }}
    >
      색상 반전
    </Button>
    <Button
      variant="text"
      sx={{
        transition: 'all 0.25s',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 4,
          left: '50%',
          width: 0,
          height: 2,
          bgcolor: 'primary.main',
          transform: 'translateX(-50%)',
          transition: 'width 0.3s',
        },
        '&:hover::after': { width: '80%' },
      }}
    >
      언더라인 확장
    </Button>
  </Stack>
);

// ─── Tooltip 모음 ─────────────────────────────────────────────────
const TooltipDemo = () => (
  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
    {[
      { title: '위쪽 툴팁',    placement: 'top',    label: 'Top'    },
      { title: '아래쪽 툴팁',  placement: 'bottom', label: 'Bottom' },
      { title: '왼쪽 툴팁',   placement: 'left',   label: 'Left'   },
      { title: '오른쪽 툴팁',  placement: 'right',  label: 'Right'  },
    ].map(({ title, placement, label }) => (
      <Tooltip key={label} title={title} placement={placement} arrow>
        <Button variant="outlined" size="small">{label}</Button>
      </Tooltip>
    ))}
    <Tooltip
      title={
        <Box>
          <Typography variant="body2" fontWeight={600}>리치 툴팁</Typography>
          <Typography variant="caption">더 많은 정보를 표시할 수 있습니다.</Typography>
        </Box>
      }
      arrow
    >
      <Button variant="contained" size="small">Rich Tooltip</Button>
    </Tooltip>
    <Tooltip title="지연 툴팁 (500ms)" enterDelay={500} arrow>
      <Button variant="outlined" size="small" color="secondary">Delay</Button>
    </Tooltip>
  </Stack>
);

// ─── 섹션 ─────────────────────────────────────────────────────────
const Section15 = () => (
  <SectionWrapper number={15} title="Hover" description="MUI sx prop 기반 호버 효과, 오버레이 카드, 프로필 카드, 버튼, Tooltip을 확인합니다.">
    <Stack spacing={5}>
      <Row label="기본 호버 — translateY · scale · shadow · rotate · brightness · skew">
        <BasicHover />
      </Row>
      <Row label="이미지 카드 오버레이 — 호버 시 확대 + 다크 오버레이 + 액션 버튼">
        <Grid container spacing={2}>
          {IMAGES.map((img) => (
            <Grid item xs={12} sm={4} key={img.seed}>
              <OverlayCard {...img} />
            </Grid>
          ))}
        </Grid>
      </Row>
      <Row label="프로필 카드 — 호버 시 elevation · 배너 · Avatar 확대 · SNS 버튼 등장">
        <Grid container spacing={2}>
          {PROFILES.map((p) => (
            <Grid item xs={12} sm={4} key={p.name}>
              <ProfileCard {...p} />
            </Grid>
          ))}
        </Grid>
      </Row>
      <Row label="버튼 호버 — 뜨기 · 확대 · 오버레이 · 색상 반전 · 언더라인">
        <ButtonHover />
      </Row>
      <Row label="Tooltip — 방향 · Rich · Delay">
        <TooltipDemo />
      </Row>
    </Stack>
  </SectionWrapper>
);

export default Section15;
