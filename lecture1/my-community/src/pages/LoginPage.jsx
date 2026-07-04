import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Container, Typography, TextField, Button,
  Alert, InputAdornment, IconButton, Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, enterGuestMode } = useAuth();
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

  const handleGuestMode = () => {
    enterGuestMode();
    navigate('/');
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signIn({ username: 'demo', password: 'demo1234!' });
      navigate('/');
    } catch {
      setError('테스트 계정 로그인에 실패했습니다. 게스트로 둘러보기를 이용해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="xs">

        {/* 로고 */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.2, mb: 1.5 }}>
            <Box
              sx={{
                width: 40, height: 40,
                borderRadius: '12px',
                bgcolor: 'primary.main',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ForumOutlinedIcon sx={{ color: '#fff', fontSize: '1.3rem' }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: 'text.primary', letterSpacing: '-0.3px' }}>
              Portfolio Feedback Hub
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            포트폴리오 피드백과 취업 준비 정보를 공유하고 피드백을 주고받는 커뮤니티 게시판 데모입니다.
          </Typography>
        </Box>

        {/* 게스트 버튼 — 최상단 Primary CTA */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleGuestMode}
          aria-label="로그인 없이 게스트로 게시판 둘러보기"
          sx={{ mb: 1, py: 1.6, borderRadius: 2.5, fontWeight: 700, fontSize: '1rem', minHeight: 48 }}
        >
          게스트로 둘러보기
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mb: 1.5 }}>
          별도 회원가입 없이 샘플 게시글로 주요 화면을 확인할 수 있습니다.
        </Typography>

        {/* 테스트 계정 체험 */}
        <Button
          variant="outlined"
          fullWidth
          onClick={handleDemoLogin}
          disabled={loading}
          aria-label="테스트 계정으로 로그인 체험하기"
          sx={{ mb: 1, py: 1.2, borderRadius: 2.5, fontWeight: 600, minHeight: 44 }}
        >
          테스트 계정으로 체험하기
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mb: 3 }}>
          테스트 계정이 준비된 경우 로그인 흐름을 체험할 수 있습니다. 로그인이 실패해도 게스트 모드로 주요 화면을 확인할 수 있습니다.
        </Typography>

        {/* 로그인 폼 */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            p: { xs: 3, sm: 4 },
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
          }}
        >
          <Divider sx={{ mb: 2.5 }}>
            <Typography variant="caption" color="text.disabled">계정으로 로그인</Typography>
          </Divider>

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
            slotProps={{ htmlInput: { 'aria-label': '아이디' } }}
          />
          <TextField
            label="비밀번호"
            name="password"
            type={showPw ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2.5 }}
            autoComplete="current-password"
            slotProps={{
              htmlInput: { 'aria-label': '비밀번호' },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPw(p => !p)}
                      edge="end"
                      size="small"
                      aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 표시'}
                    >
                      {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="outlined"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mb: 1.5, py: 1.3, borderRadius: 2.5, fontWeight: 700, minHeight: 44 }}
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
                sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 700 }}
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
