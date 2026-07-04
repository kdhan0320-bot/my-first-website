import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Container, Typography, TextField, Button, Alert,
  InputAdornment, IconButton, LinearProgress, Chip,
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle, Cancel } from '@mui/icons-material';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { useAuth } from '../hooks/useAuth';

const PASSWORD_RULES = [
  { label: '8자 이상', test: (pw) => pw.length >= 8 },
  { label: '영문 포함', test: (pw) => /[a-zA-Z]/.test(pw) },
  { label: '숫자 포함', test: (pw) => /\d/.test(pw) },
  { label: '특수문자 포함', test: (pw) => /[!@#$%^&*]/.test(pw) },
];

const SignupPage = () => {
  const navigate = useNavigate();
  const { signUp, checkUsernameAvailable } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'username') setUsernameStatus(null);
  };

  const handleCheckUsername = async () => {
    if (!form.username.trim()) return;
    setCheckingUsername(true);
    try {
      const available = await checkUsernameAvailable(form.username.trim());
      setUsernameStatus(available ? 'available' : 'taken');
    } catch {
      setUsernameStatus(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const passedRules = PASSWORD_RULES.filter(r => r.test(form.password));
  const pwStrength = (passedRules.length / PASSWORD_RULES.length) * 100;
  const allPwRulesPassed = passedRules.length === PASSWORD_RULES.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (usernameStatus !== 'available') {
      setError('아이디 중복확인을 완료해주세요.');
      return;
    }
    if (!allPwRulesPassed) {
      setError('비밀번호 규칙을 모두 충족해주세요.');
      return;
    }
    setLoading(true);
    try {
      await signUp({ username: form.username.trim(), password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.message || '회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
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
        bgcolor: 'background.default',
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
            수강생과 취업준비생을 위한 피드백 공간
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            p: 4,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 2px 16px rgba(26,26,46,0.06)',
          }}
        >
          <Typography variant="h2" sx={{ mb: 3, textAlign: 'center', fontWeight: 700, fontSize: '1.25rem' }}>
            회원가입
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* 아이디 + 중복확인 */}
          <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
            <TextField
              label="아이디"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              required
              autoComplete="username"
              error={usernameStatus === 'taken'}
            />
            <Button
              variant="outlined"
              onClick={handleCheckUsername}
              disabled={checkingUsername || !form.username}
              sx={{ whiteSpace: 'nowrap', minWidth: 90 }}
            >
              중복확인
            </Button>
          </Box>
          {usernameStatus === 'available' && (
            <Typography variant="caption" color="success.main" sx={{ mb: 1.5, display: 'block' }}>
              ✓ 사용 가능한 아이디입니다
            </Typography>
          )}
          {usernameStatus === 'taken' && (
            <Typography variant="caption" color="error.main" sx={{ mb: 1.5, display: 'block' }}>
              ✗ 이미 사용 중인 아이디입니다
            </Typography>
          )}
          {!usernameStatus && <Box sx={{ mb: 1.5 }} />}

          {/* 비밀번호 */}
          <TextField
            label="비밀번호"
            name="password"
            type={showPw ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 1 }}
            autoComplete="new-password"
            disabled={usernameStatus !== 'available'}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPw(p => !p)}
                      edge="end"
                      disabled={usernameStatus !== 'available'}
                      aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 표시'}
                    >
                      {showPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* 비밀번호 강도 */}
          {form.password && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={pwStrength}
                sx={{
                  mb: 1, height: 6, borderRadius: 3,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: pwStrength <= 25 ? 'error.main' : pwStrength <= 50 ? 'warning.main' : pwStrength <= 75 ? 'primary.main' : 'success.main',
                  },
                }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {PASSWORD_RULES.map((rule) => {
                  const ok = rule.test(form.password);
                  return (
                    <Chip
                      key={rule.label}
                      label={rule.label}
                      size="small"
                      icon={ok ? <CheckCircle sx={{ fontSize: 14 }} /> : <Cancel sx={{ fontSize: 14 }} />}
                      color={ok ? 'success' : 'default'}
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}
          {!form.password && <Box sx={{ mb: 2 }} />}

          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 2, textAlign: 'center' }}>
            포트폴리오 데모 프로젝트입니다. 실제 개인정보를 입력하지 마세요.
          </Typography>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mb: 2, py: 1.5, borderRadius: 2.5, fontWeight: 700, minHeight: 44 }}
          >
            {loading ? '가입 중...' : '회원가입'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              이미 계정이 있으신가요?{' '}
              <Typography
                component={Link}
                to="/login"
                variant="body2"
                sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}
              >
                로그인
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SignupPage;
