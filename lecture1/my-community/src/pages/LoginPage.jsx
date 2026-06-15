import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Container, Typography, TextField, Button,
  Alert, InputAdornment, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
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
        bgcolor: '#F6F8FB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="xs">

        {/* 로고 */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.2,
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                width: 40, height: 40,
                borderRadius: '12px',
                bgcolor: '#1578AA',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ForumOutlinedIcon sx={{ color: '#fff', fontSize: '1.3rem' }} />
            </Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: '1.25rem',
                color: '#1A1A2E',
                letterSpacing: '-0.3px',
              }}
            >
              Dohan Community
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#7F8FA4' }}>
            자유롭게 소통하는 커뮤니티
          </Typography>
        </Box>

        {/* 폼 카드 */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            bgcolor: '#FFFFFF',
            borderRadius: 3,
            p: { xs: 3, sm: 4 },
            border: '1px solid #E0E4EA',
            boxShadow: '0 2px 16px rgba(26,26,46,0.06)',
          }}
        >
          <Typography variant="h2" sx={{ mb: 3, textAlign: 'center', color: '#1A1A2E', fontWeight: 700, fontSize: '1.25rem' }}>
            로그인
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

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
                  <IconButton onClick={() => setShowPw(p => !p)} edge="end" size="small">
                    {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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
            sx={{ mb: 2, py: 1.4, borderRadius: 2.5, fontWeight: 700 }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#7F8FA4' }}>
              아직 계정이 없으신가요?{' '}
              <Typography
                component={Link}
                to="/signup"
                variant="body2"
                sx={{ color: '#1578AA', textDecoration: 'none', fontWeight: 700 }}
              >
                회원가입
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
