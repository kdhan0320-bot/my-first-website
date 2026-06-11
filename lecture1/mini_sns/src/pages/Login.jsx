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
    } catch {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
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
      }}
    >
      {/* 로고 */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Box
          sx={{
            width: 72, height: 72,
            borderRadius: '20px',
            bgcolor: '#EAF6FC',
            border: '2px solid #B8DFF2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 2,
          }}
        >
          <SportsEsportsIcon sx={{ fontSize: 36, color: '#1578AA' }} />
        </Box>
        <Typography
          sx={{
            color: '#1A1A2E',
            fontWeight: 800,
            fontSize: '1.5rem',
            letterSpacing: '-0.4px',
            lineHeight: 1.2,
          }}
        >
          겜스타그램
        </Typography>
        <Typography variant="body2" sx={{ color: '#7F8FA4', mt: 0.5 }}>
          게임 리뷰 &amp; 모임 SNS
        </Typography>
      </Box>

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
    </Box>
  );
};

export default Login;
