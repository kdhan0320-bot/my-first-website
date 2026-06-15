import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Fade,
  Grid,
  Grow,
  LinearProgress,
  Skeleton,
  Slide,
  Stack,
  Typography,
  Zoom,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import SectionWrapper from '../ui/SectionWrapper';

const Row = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

// ─── MUI 트랜지션 ────────────────────────────────────────────────
const TransitionDemo = () => {
  const [show, setShow] = useState(false);

  const box = (
    <Card elevation={3} sx={{ width: 120, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="body2" fontWeight={600} color="primary">컴포넌트</Typography>
    </Card>
  );

  return (
    <Stack spacing={3}>
      <Button variant="outlined" onClick={() => setShow((p) => !p)} sx={{ width: 160 }}>
        {show ? '숨기기' : '보이기'}
      </Button>
      <Grid container spacing={3}>
        {[
          { label: 'Fade',     node: <Fade    in={show} timeout={600}>{box}</Fade>    },
          { label: 'Grow',     node: <Grow    in={show} timeout={600}>{box}</Grow>    },
          { label: 'Zoom',     node: <Zoom    in={show} timeout={600}>{box}</Zoom>    },
          { label: 'Slide ↑',  node: <Slide   in={show} timeout={600} direction="up">{box}</Slide>   },
          { label: 'Slide →',  node: <Slide   in={show} timeout={600} direction="right">{box}</Slide> },
          { label: 'Collapse', node: <Collapse in={show} timeout={600}>{box}</Collapse> },
        ].map(({ label, node }) => (
          <Grid item xs={6} sm={4} md={2} key={label}>
            <Stack alignItems="center" spacing={1}>
              <Box sx={{ height: 80, display: 'flex', alignItems: 'center' }}>{node}</Box>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

// ─── CSS 키프레임 애니메이션 ──────────────────────────────────────
const KeyframeDemo = () => (
  <Grid container spacing={3} alignItems="center">
    {[
      {
        label: 'spin',
        sx: { animation: 'spin 1.5s linear infinite', '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } } },
        icon: <RocketLaunchIcon color="primary" sx={{ fontSize: 40 }} />,
      },
      {
        label: 'pulse',
        sx: { animation: 'pulse 1.2s ease-in-out infinite', '@keyframes pulse': { '0%,100%': { transform: 'scale(1)', opacity: 1 }, '50%': { transform: 'scale(1.3)', opacity: 0.7 } } },
        icon: <FavoriteIcon color="error" sx={{ fontSize: 40 }} />,
      },
      {
        label: 'bounce',
        sx: { animation: 'bounce 0.8s ease infinite', '@keyframes bounce': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-16px)' } } },
        icon: <StarIcon color="warning" sx={{ fontSize: 40 }} />,
      },
      {
        label: 'shake',
        sx: { animation: 'shake 0.6s ease infinite', '@keyframes shake': { '0%,100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-8px)' }, '75%': { transform: 'translateX(8px)' } } },
        icon: <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />,
      },
      {
        label: 'fadeInOut',
        sx: { animation: 'fadeInOut 2s ease-in-out infinite', '@keyframes fadeInOut': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.1 } } },
        icon: <RocketLaunchIcon color="secondary" sx={{ fontSize: 40 }} />,
      },
    ].map(({ label, sx, icon }) => (
      <Grid item xs={4} sm={2} key={label}>
        <Stack alignItems="center" spacing={1}>
          <Box sx={{ height: 56, display: 'flex', alignItems: 'center', ...sx }}>{icon}</Box>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
        </Stack>
      </Grid>
    ))}
  </Grid>
);

// ─── 호버 인터랙션 ────────────────────────────────────────────────
const HoverDemo = () => (
  <Grid container spacing={2}>
    {[
      {
        label: '위로 이동',
        sx: { transition: 'transform 0.25s', '&:hover': { transform: 'translateY(-8px)' } },
        color: 'primary.main',
      },
      {
        label: '확대',
        sx: { transition: 'transform 0.25s', '&:hover': { transform: 'scale(1.08)' } },
        color: 'secondary.main',
      },
      {
        label: '그림자',
        sx: { transition: 'box-shadow 0.25s', boxShadow: 1, '&:hover': { boxShadow: 10 } },
        color: 'success.main',
      },
      {
        label: '회전',
        sx: { transition: 'transform 0.4s', '&:hover': { transform: 'rotate(6deg) scale(1.05)' } },
        color: 'warning.main',
      },
      {
        label: '밝기',
        sx: { transition: 'filter 0.25s', '&:hover': { filter: 'brightness(1.2)' } },
        color: 'error.main',
      },
      {
        label: '테두리',
        sx: { transition: 'border-color 0.25s, transform 0.25s', border: '2px solid transparent', '&:hover': { borderColor: 'info.main', transform: 'translateY(-4px)' } },
        color: 'info.main',
      },
    ].map(({ label, sx, color }) => (
      <Grid item xs={6} sm={4} md={2} key={label}>
        <Card
          sx={{
            textAlign: 'center',
            py: 2.5,
            cursor: 'pointer',
            bgcolor: color,
            ...sx,
          }}
        >
          <Typography variant="body2" fontWeight={600} color="white">{label}</Typography>
        </Card>
      </Grid>
    ))}
  </Grid>
);

// ─── 로딩 애니메이션 ──────────────────────────────────────────────
const LoadingDemo = () => {
  const [progress, setProgress] = useState(0);
  const [running,  setRunning]  = useState(false);

  const handleStart = () => {
    if (running) return;
    setProgress(0);
    setRunning(true);
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(timer); setRunning(false); return 100; }
        return p + 5;
      });
    }, 150);
  };

  return (
    <Stack spacing={3}>
      {/* CircularProgress */}
      <Stack direction="row" spacing={4} alignItems="center" flexWrap="wrap" useFlexGap>
        <Stack alignItems="center" spacing={0.5}>
          <CircularProgress />
          <Typography variant="caption" color="text.secondary">indeterminate</Typography>
        </Stack>
        <Stack alignItems="center" spacing={0.5}>
          <CircularProgress color="secondary" size={48} thickness={5} />
          <Typography variant="caption" color="text.secondary">secondary</Typography>
        </Stack>
        <Stack alignItems="center" spacing={0.5}>
          <CircularProgress variant="determinate" value={75} color="success" />
          <Typography variant="caption" color="text.secondary">75%</Typography>
        </Stack>
        {['error', 'warning', 'info'].map((color) => (
          <Stack key={color} alignItems="center" spacing={0.5}>
            <CircularProgress color={color} size={32} />
            <Typography variant="caption" color="text.secondary">{color}</Typography>
          </Stack>
        ))}
      </Stack>

      {/* LinearProgress */}
      <Stack spacing={1.5}>
        <Stack spacing={0.5}>
          <LinearProgress />
          <Typography variant="caption" color="text.secondary">indeterminate</Typography>
        </Stack>
        <Stack spacing={0.5}>
          <LinearProgress variant="determinate" value={60} color="secondary" />
          <Typography variant="caption" color="text.secondary">determinate 60%</Typography>
        </Stack>
        <Stack spacing={0.5}>
          <LinearProgress variant="buffer" value={progress} valueBuffer={progress + 10} color="success" />
          <Typography variant="caption" color="text.secondary">buffer</Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ flex: 1 }}>
            <LinearProgress variant="determinate" value={progress} color="primary" />
          </Box>
          <Typography variant="caption" color="primary.main" fontWeight={600} sx={{ minWidth: 36 }}>
            {progress}%
          </Typography>
          <Button size="small" variant="outlined" onClick={handleStart} disabled={running}>
            {running ? '진행 중…' : '시작'}
          </Button>
        </Stack>
      </Stack>

      {/* Skeleton */}
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
            <Skeleton variant="circular" width={40} height={40} animation="wave" />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="40%" animation="wave" />
              <Skeleton variant="text" width="25%" height={12} animation="wave" />
            </Box>
          </Stack>
          <Skeleton variant="rectangular" height={120} animation="wave" sx={{ borderRadius: 1, mb: 1 }} />
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" width="80%" animation="wave" />
        </CardContent>
      </Card>
    </Stack>
  );
};

// ─── 섹션 ─────────────────────────────────────────────────────────
const Section12 = () => (
  <SectionWrapper number={12} title="Animation" description="MUI 트랜지션, CSS 키프레임, 호버 인터랙션, 로딩 애니메이션을 확인합니다.">
    <Stack spacing={5}>
      <Row label="MUI 트랜지션 — Fade · Grow · Zoom · Slide · Collapse">
        <TransitionDemo />
      </Row>
      <Row label="CSS 키프레임 — spin · pulse · bounce · shake · fadeInOut">
        <KeyframeDemo />
      </Row>
      <Row label="호버 인터랙션 — translateY · scale · shadow · rotate · brightness · border">
        <HoverDemo />
      </Row>
      <Row label="로딩 애니메이션 — CircularProgress · LinearProgress · Skeleton">
        <LoadingDemo />
      </Row>
    </Stack>
  </SectionWrapper>
);

export default Section12;
