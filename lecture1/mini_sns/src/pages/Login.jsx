import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert, CircularProgress,
} from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
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
    } catch (err) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: 'auto',
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
      }}
    >
      {/* 로고 영역 */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Box
          sx={{
            width: 80, height: 80, borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 2,
            boxShadow: '0 4px 20px rgba(21,101,192,0.35)',
          }}
        >
          <SportsEsportsIcon sx={{ fontSize: 44, color: '#fff' }} />
        </Box>
        <Typography variant="h1" sx={{ color: 'primary.main', fontWeight: 800, fontSize: '2rem' }}>
          겜스타그램
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          게임 리뷰 & 정보 공유 SNS
        </Typography>
      </Box>

      {/* 로그인 폼 */}
      <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
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
          sx={{ mb: 2, py: 1.5, fontSize: '1rem' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          size="large"
          onClick={() => navigate(ROUTES.SIGNUP)}
          sx={{ py: 1.5, fontSize: '1rem' }}
        >
          회원가입
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
