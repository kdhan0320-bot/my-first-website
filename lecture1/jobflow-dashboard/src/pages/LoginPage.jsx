import { useState } from 'react';
import {
  Box, Container, Paper, Typography, TextField, Button,
  Alert, Divider, Chip, Tab, Tabs,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, enterGuestMode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 0) {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || '오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    enterGuestMode();
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 56, height: 56, borderRadius: 2,
              bgcolor: 'primary.main', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center', mb: 2,
            }}
          >
            <WorkIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            JobFlow Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            취업 준비 관리 대시보드
          </Typography>
        </Box>

        {/* 데모 버튼 - 최상단 CTA */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleGuest}
          size="large"
          sx={{ py: 1.75, mb: 2, fontSize: '1rem', fontWeight: 700, borderRadius: 2 }}
          aria-label="로그인 없이 데모 대시보드 체험하기"
        >
          데모로 둘러보기 (로그인 불필요)
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mb: 3 }}>
          회원가입 없이 샘플 데이터로 대시보드를 바로 체험할 수 있습니다
        </Typography>

        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(''); }} sx={{ mb: 3 }}>
            <Tab label="로그인" sx={{ flex: 1, fontWeight: 600 }} />
            <Tab label="회원가입" sx={{ flex: 1, fontWeight: 600 }} />
          </Tabs>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {tab === 1 && (
              <TextField
                label="이름"
                fullWidth
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="홍길동"
              />
            )}
            <TextField
              label="이메일"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="example@email.com"
              inputProps={{ 'aria-label': '이메일' }}
            />
            <TextField
              label="비밀번호"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              placeholder="6자 이상"
              inputProps={{ 'aria-label': '비밀번호' }}
            />
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              disabled={loading}
              sx={{ mb: 2, py: 1.5 }}
            >
              {loading ? '처리 중...' : tab === 0 ? '로그인' : '회원가입'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
