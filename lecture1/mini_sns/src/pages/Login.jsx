import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert, CircularProgress, Avatar, Divider,
} from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

const FeedPreview = () => (
  <Box sx={{ width: '100%', mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Box sx={{
      width: 220,
      bgcolor: '#FFFFFF',
      borderRadius: 3,
      border: '2px solid #E0E4EA',
      boxShadow: '0 8px 32px rgba(26,26,46,0.14)',
      overflow: 'hidden',
    }}>
      {/* 미니 TopBar */}
      <Box sx={{
        bgcolor: '#FFFFFF', px: 1.5, py: 0.8,
        borderBottom: '1px solid #F0F0F0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 16, height: 16, borderRadius: '4px', bgcolor: '#EAF6FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SportsEsportsIcon sx={{ fontSize: '0.55rem', color: '#1578AA' }} />
          </Box>
          <Typography sx={{ fontSize: '0.5rem', fontWeight: 800, color: '#1A1A2E' }}>겜스타그램</Typography>
        </Box>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#E0E4EA' }} />
      </Box>

      {/* 게시물 1 */}
      <Box sx={{ borderBottom: '1px solid #F5F5F5' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.6 }}>
          <Avatar src="https://api.dicebear.com/7.x/pixel-art/svg?seed=mario" sx={{ width: 18, height: 18 }} />
          <Typography sx={{ fontSize: '0.48rem', fontWeight: 700, color: '#1A1A2E' }}>롤마스터99</Typography>
        </Box>
        <Box
          component="img"
          src="https://picsum.photos/seed/game42/220/220"
          alt="preview"
          sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
        />
        <Box sx={{ px: 1, py: 0.6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mb: 0.3 }}>
            <FavoriteIcon sx={{ fontSize: 9, color: '#e53935' }} />
            <Typography sx={{ fontSize: '0.43rem', fontWeight: 600 }}>42</Typography>
            <ForumOutlinedIcon sx={{ fontSize: 9, ml: 0.3, color: '#888' }} />
            <Typography sx={{ fontSize: '0.43rem', color: '#888' }}>8</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.43rem', fontWeight: 700, color: '#1A1A2E' }}>롤마스터99 </Typography>
          <Typography sx={{ fontSize: '0.43rem', color: '#555' }}>스카이림 1000시간 후기 🐉</Typography>
        </Box>
      </Box>

      {/* 게시물 2 */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.6 }}>
          <Avatar src="https://api.dicebear.com/7.x/pixel-art/svg?seed=sonic" sx={{ width: 18, height: 18 }} />
          <Typography sx={{ fontSize: '0.48rem', fontWeight: 700, color: '#1A1A2E' }}>겜덕후2024</Typography>
        </Box>
        <Box
          component="img"
          src="https://picsum.photos/seed/game7/220/220"
          alt="preview"
          sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
        />
        <Box sx={{ px: 1, py: 0.6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mb: 0.3 }}>
            <FavoriteIcon sx={{ fontSize: 9, color: '#e53935' }} />
            <Typography sx={{ fontSize: '0.43rem', fontWeight: 600 }}>17</Typography>
            <ForumOutlinedIcon sx={{ fontSize: 9, ml: 0.3, color: '#888' }} />
            <Typography sx={{ fontSize: '0.43rem', color: '#888' }}>3</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.43rem', color: '#555' }}>발로란트 다이아 달성! 🎯</Typography>
        </Box>
      </Box>
    </Box>
    <Typography variant="caption" sx={{ color: '#7F8FA4', mt: 1.5, textAlign: 'center' }}>
      게임 리뷰를 공유하고 함께 즐겨요!
    </Typography>
  </Box>
);

const Login = () => {
  const navigate = useNavigate();
  const { signIn, enterGuestMode } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError('아이디와 비밀번호를 입력해주세요.'); return; }
    setLoading(true);
    setError('');
    try {
      await signIn(username, password);
      navigate(ROUTES.HOME);
    } catch {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    enterGuestMode();
    navigate(ROUTES.HOME);
  };

  return (
    <Box
      sx={{
        maxWidth: 420,
        mx: 'auto',
        minHeight: '100vh',
        bgcolor: '#F6F8FB',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        py: 4,
      }}
    >
      {/* 로고 */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Box
          sx={{
            width: 64, height: 64,
            borderRadius: '18px',
            bgcolor: '#EAF6FC',
            border: '2px solid #B8DFF2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 1.5,
          }}
        >
          <SportsEsportsIcon sx={{ fontSize: 32, color: '#1578AA' }} />
        </Box>
        <Typography sx={{ color: '#1A1A2E', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.4px', lineHeight: 1.2 }}>
          겜스타그램
        </Typography>
        <Typography variant="body2" sx={{ color: '#7F8FA4', mt: 0.5 }}>
          게임 리뷰 &amp; 모임 SNS
        </Typography>
      </Box>

      {/* 피드 미리보기 */}
      <FeedPreview />

      {/* 로그인 폼 */}
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          width: '100%',
          bgcolor: '#FFFFFF',
          borderRadius: 3,
          p: 3.5,
          border: '1px solid #E0E4EA',
          boxShadow: '0 2px 16px rgba(26,26,46,0.06)',
        }}
      >
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <TextField
          label="아이디"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
          autoComplete="username"
        />
        <TextField
          label="비밀번호"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
          sx={{ mb: 1.5, py: 1.4, borderRadius: 2.5, fontWeight: 700, fontSize: '0.95rem' }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : '로그인'}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          size="large"
          onClick={() => navigate(ROUTES.SIGNUP)}
          sx={{ py: 1.4, borderRadius: 2.5, fontWeight: 600, fontSize: '0.95rem' }}
        >
          회원가입
        </Button>
      </Box>

      {/* 게스트 체험 */}
      <Box sx={{ width: '100%', mt: 2 }}>
        <Divider sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: '#B0B8C1' }}>또는</Typography>
        </Divider>
        <Button
          variant="text"
          fullWidth
          size="large"
          onClick={handleGuestMode}
          sx={{
            py: 1.2,
            borderRadius: 2.5,
            fontWeight: 600,
            fontSize: '0.9rem',
            color: '#7F8FA4',
            border: '1px dashed #D0D7DE',
            '&:hover': { bgcolor: '#F0F4F8', borderColor: '#A8B4C0' },
          }}
        >
          🔍 로그인 없이 구경하기
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
