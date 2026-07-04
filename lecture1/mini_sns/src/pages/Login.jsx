import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert, CircularProgress, Avatar, Divider,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
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
            <GroupsIcon sx={{ fontSize: '0.55rem', color: '#1578AA' }} />
          </Box>
          <Typography sx={{ fontSize: '0.5rem', fontWeight: 800, color: '#1A1A2E' }}>Mini SNS</Typography>
        </Box>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#E0E4EA' }} />
      </Box>

      {/* 게시물 1 */}
      <Box sx={{ borderBottom: '1px solid #F5F5F5' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.6 }}>
          <Avatar src="https://api.dicebear.com/7.x/initials/svg?seed=UX러너" sx={{ width: 18, height: 18 }} />
          <Typography sx={{ fontSize: '0.48rem', fontWeight: 700, color: '#1A1A2E' }}>UX러너</Typography>
        </Box>
        <Box sx={{ width: '100%', aspectRatio: '1/1', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: '0.5rem', color: '#93C5FD', fontWeight: 700 }}>작업 기록</Typography>
        </Box>
        <Box sx={{ px: 1, py: 0.6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mb: 0.3 }}>
            <FavoriteIcon sx={{ fontSize: 9, color: '#e53935' }} />
            <Typography sx={{ fontSize: '0.43rem', fontWeight: 600 }}>24</Typography>
            <ForumOutlinedIcon sx={{ fontSize: 9, ml: 0.3, color: '#888' }} />
            <Typography sx={{ fontSize: '0.43rem', color: '#888' }}>6</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.43rem', fontWeight: 700, color: '#1A1A2E' }}>UX러너 </Typography>
          <Typography sx={{ fontSize: '0.43rem', color: '#555' }}>오늘 피드 카드 컴포넌트를 정리했어요 ✍️</Typography>
        </Box>
      </Box>

      {/* 게시물 2 */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.6 }}>
          <Avatar src="https://api.dicebear.com/7.x/initials/svg?seed=스터디메이트" sx={{ width: 18, height: 18 }} />
          <Typography sx={{ fontSize: '0.48rem', fontWeight: 700, color: '#1A1A2E' }}>스터디메이트</Typography>
        </Box>
        <Box sx={{ width: '100%', aspectRatio: '1/1', bgcolor: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: '0.5rem', color: '#5EEAD4', fontWeight: 700 }}>스터디 모집</Typography>
        </Box>
        <Box sx={{ px: 1, py: 0.6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mb: 0.3 }}>
            <FavoriteIcon sx={{ fontSize: 9, color: '#e53935' }} />
            <Typography sx={{ fontSize: '0.43rem', fontWeight: 600 }}>17</Typography>
            <ForumOutlinedIcon sx={{ fontSize: 9, ml: 0.3, color: '#888' }} />
            <Typography sx={{ fontSize: '0.43rem', color: '#888' }}>3</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.43rem', color: '#555' }}>이번 주 모바일 UI 스터디 모집합니다 🙋</Typography>
        </Box>
      </Box>
    </Box>
    <Typography variant="caption" sx={{ color: '#7F8FA4', mt: 1.5, textAlign: 'center' }}>
      작업 기록과 스터디 모임을 함께 공유해요.
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
  const [demoLoading, setDemoLoading] = useState(false);

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

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError('');
    try {
      await signIn('demo', 'demo1234!');
      navigate(ROUTES.HOME);
    } catch {
      setError('테스트 계정 로그인에 실패했습니다. 게스트 모드로 주요 화면을 확인해주세요.');
    } finally {
      setDemoLoading(false);
    }
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
          <GroupsIcon sx={{ fontSize: 32, color: '#1578AA' }} />
        </Box>
        <Typography sx={{ color: '#0F172A', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.4px', lineHeight: 1.2 }}>
          Mini SNS
        </Typography>
        <Typography variant="body2" sx={{ color: '#475569', mt: 0.5 }}>
          작업 기록과 스터디 모임을 공유하는 모바일 소셜 앱
        </Typography>
      </Box>

      <FeedPreview />

      {/* 게스트 체험 — 최상단 Primary CTA */}
      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleGuestMode}
        aria-label="로그인 없이 게스트로 데모 체험하기"
        sx={{ py: 1.6, borderRadius: 2.5, fontWeight: 700, fontSize: '1rem', mb: 1 }}
      >
        게스트로 둘러보기
      </Button>
      <Button
        variant="outlined"
        fullWidth
        size="large"
        onClick={handleDemoLogin}
        disabled={demoLoading}
        aria-label="테스트 계정으로 데모 체험하기"
        sx={{ py: 1.4, borderRadius: 2.5, fontWeight: 700, fontSize: '0.95rem', mb: 1 }}
      >
        {demoLoading ? <CircularProgress size={20} color="inherit" /> : '테스트 계정으로 체험하기'}
      </Button>
      <Typography variant="caption" sx={{ color: '#475569', display: 'block', textAlign: 'center', mb: 3 }}>
        게스트 모드로 홈 피드, 모임, 채팅, 알림, 프로필 화면을 둘러볼 수 있습니다.
      </Typography>

      {error && <Alert severity="warning" sx={{ mb: 2, borderRadius: 2, width: '100%' }}>{error}</Alert>}

      {/* 로그인 폼 */}
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          width: '100%',
          bgcolor: '#FFFFFF',
          borderRadius: 3,
          p: 3,
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
        }}
      >
        <Divider sx={{ mb: 2.5 }}>
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>계정으로 로그인</Typography>
        </Divider>

        <TextField
          label="아이디"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
          autoComplete="username"
          slotProps={{ htmlInput: { 'aria-label': '아이디' } }}
        />
        <TextField
          label="비밀번호"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2.5 }}
          autoComplete="current-password"
          slotProps={{ htmlInput: { 'aria-label': '비밀번호' } }}
        />

        <Button
          type="submit"
          variant="outlined"
          fullWidth
          size="large"
          disabled={loading}
          sx={{ mb: 1.5, py: 1.3, borderRadius: 2.5, fontWeight: 700, fontSize: '0.95rem' }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : '로그인'}
        </Button>

        <Button
          variant="text"
          fullWidth
          size="large"
          onClick={() => navigate(ROUTES.SIGNUP)}
          sx={{ py: 1.2, borderRadius: 2.5, fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}
        >
          회원가입
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
