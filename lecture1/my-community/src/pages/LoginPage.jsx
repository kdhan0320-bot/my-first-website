import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Container, Typography, TextField, Button,
  Alert, InputAdornment, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, SportsEsports } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(form);
      navigate('/');
    } catch {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, #0d1b3e 0%, #0a0e1a 60%)',
      }}
    >
      <Container maxWidth="xs">
        {/* 로고 */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              background: 'linear-gradient(135deg, #00b4d8, #7b2ff7)',
              borderRadius: 3,
              px: 3,
              py: 1.5,
              mb: 2,
            }}
          >
            <SportsEsports sx={{ fontSize: 36, color: '#fff' }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: '#fff',
                letterSpacing: 2,
                fontStyle: 'italic',
              }}
            >
              GAME HUB
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            게이머들을 위한 정보 공유 커뮤니티
          </Typography>
        </Box>

        {/* 폼 카드 */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            p: 4,
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <Typography variant="h2" sx={{ mb: 3, textAlign: 'center' }}>
            로그인
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            label="아이디"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
            autoComplete="username"
          />
          <TextField
            label="비밀번호"
            name="password"
            type={showPw ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 3 }}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPw(p => !p)} edge="end">
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mb: 2, py: 1.5 }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              아직 계정이 없으신가요?{' '}
              <Typography
                component={Link}
                to="/signup"
                variant="body2"
                sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}
              >
                회원가입하러 가기
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
