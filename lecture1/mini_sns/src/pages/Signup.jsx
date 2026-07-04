import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert, CircularProgress,
  InputAdornment, IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../utils/supabase';
import { ROUTES } from '../constants/routes';

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [form, setForm] = useState({ username: '', password: '', nickname: '' });
  const [checks, setChecks] = useState({ username: null, nickname: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setChecks((prev) => ({ ...prev, [field === 'username' ? 'username' : field === 'nickname' ? 'nickname' : field]: null }));
  };

  const checkDuplicate = async (field) => {
    const value = form[field];
    if (!value) { setError(`${field === 'username' ? '아이디' : '닉네임'}를 입력해주세요.`); return; }
    const { data } = await supabase.from('profiles').select('id').eq(field, value).maybeSingle();
    setChecks((prev) => ({ ...prev, [field]: !data }));
  };

  const validatePassword = (pw) => pw.length >= 6 && /[!@#$%^&*(),.?":{}|<>]/.test(pw);

  const handleSignup = async (e) => {
    e.preventDefault();
    const { username, password, nickname } = form;
    if (!username || !password || !nickname) { setError('모든 항목을 입력해주세요.'); return; }
    if (checks.username !== true) { setError('아이디 중복 확인을 해주세요.'); return; }
    if (checks.nickname !== true) { setError('닉네임 중복 확인을 해주세요.'); return; }
    if (!validatePassword(password)) { setError('비밀번호에 특수문자를 하나 이상 포함해주세요.'); return; }

    setLoading(true);
    setError('');
    try {
      await signUp(username, nickname, password);
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 480, mx: 'auto', minHeight: '100vh',
        bgcolor: 'background.default', px: 3, pt: 2, pb: 4,
      }}
    >
      <IconButton onClick={() => navigate(ROUTES.LOGIN)} sx={{ mb: 1 }}>
        <ArrowBackIcon />
      </IconButton>

      <Typography variant="h2" sx={{ mb: 1, fontWeight: 700 }}>회원가입</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Mini SNS에 오신 것을 환영합니다.
      </Typography>

      <Box component="form" onSubmit={handleSignup}>
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        {/* 아이디 */}
        <TextField
          label="아이디"
          fullWidth
          value={form.username}
          onChange={handleChange('username')}
          sx={{ mb: 1 }}
          slotProps={{
            input: {
              endAdornment: checks.username === true && (
                <InputAdornment position="end">
                  <CheckCircleIcon color="success" />
                </InputAdornment>
              ),
            },
          }}
          helperText={checks.username === false ? '이미 사용 중인 아이디입니다.' : checks.username === true ? '사용 가능한 아이디입니다.' : ''}
          error={checks.username === false}
        />
        <Button
          variant="outlined" size="small" onClick={() => checkDuplicate('username')}
          sx={{ mb: 3 }}
        >
          중복 확인
        </Button>

        {/* 비밀번호 */}
        <TextField
          label="비밀번호"
          type="password"
          fullWidth
          value={form.password}
          onChange={handleChange('password')}
          sx={{ mb: 1 }}
          helperText="6자 이상, 특수문자(!@#$% 등) 하나 이상 포함"
        />

        {/* 닉네임 */}
        <TextField
          label="닉네임"
          fullWidth
          value={form.nickname}
          onChange={handleChange('nickname')}
          sx={{ mb: 1, mt: 2 }}
          slotProps={{
            input: {
              endAdornment: checks.nickname === true && (
                <InputAdornment position="end">
                  <CheckCircleIcon color="success" />
                </InputAdornment>
              ),
            },
          }}
          helperText={checks.nickname === false ? '이미 사용 중인 닉네임입니다.' : checks.nickname === true ? '사용 가능한 닉네임입니다.' : ''}
          error={checks.nickname === false}
        />
        <Button
          variant="outlined" size="small" onClick={() => checkDuplicate('nickname')}
          sx={{ mb: 4 }}
        >
          중복 확인
        </Button>

        <Button
          type="submit" variant="contained" fullWidth size="large"
          disabled={loading} sx={{ py: 1.5, fontSize: '1rem' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : '회원가입'}
        </Button>
      </Box>
    </Box>
  );
};

export default Signup;
