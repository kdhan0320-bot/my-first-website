import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Alert, Avatar, Stack,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { user, isGuest, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [displayName, setDisplayName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const profileWarning = location.state?.profileWarning ?? '';

  useEffect(() => {
    if (!user || isGuest) return undefined;

    let cancelled = false;

    const loadProfile = async () => {
      const { data, error: profileError } = await supabase
        .from('jobflow_profiles')
        .select('display_name, target_role')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (profileError) {
        setError(profileError.message);
        return;
      }

      setDisplayName(data?.display_name ?? '');
      setTargetRole(data?.target_role ?? '');
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user, isGuest]);

  const handleSave = async () => {
    if (!user || isGuest) return;
    setError('');
    const { error: err } = await supabase.from('jobflow_profiles').upsert({
      id: user.id,
      email: user.email,
      display_name: displayName,
      target_role: targetRole,
      updated_at: new Date().toISOString(),
    });
    if (err) {
      setError(err.message);
      return;
    }

    setSaved(true);

    if (location.state?.profileWarning) {
      navigate(location.pathname, { replace: true, state: {} });
    }

    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (isGuest) {
    return (
      <Box>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>마이페이지 / 설정</Typography>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'warning.main', mx: 'auto', mb: 2, fontSize: 28 }}>G</Avatar>
            <Typography variant="h6" fontWeight={700}>게스트 모드</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              회원가입 후 로그인하면 개인 설정을 저장할 수 있습니다.
            </Typography>
            <Button variant="contained" onClick={handleLogout}>
              로그인 / 회원가입하기
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>마이페이지 / 설정</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          {profileWarning && <Alert severity="warning" sx={{ mb: 3 }}>{profileWarning}</Alert>}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: 24 }}>
              {(displayName || user?.email || '?')[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>{displayName || '이름 미설정'}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
            </Box>
          </Box>

          {saved && <Alert severity="success" sx={{ mb: 2 }}>저장되었습니다!</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Stack spacing={2}>
            <TextField
              label="이름"
              fullWidth
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="홍길동"
            />
            <TextField
              label="목표 직무"
              fullWidth
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="예: UX/UI 디자이너"
            />
            <TextField
              label="이메일"
              fullWidth
              value={user?.email ?? ''}
              disabled
              helperText="이메일은 변경할 수 없습니다"
            />
            <Button variant="contained" onClick={handleSave} sx={{ alignSelf: 'flex-start' }}>
              저장
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>계정 관리</Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SettingsPage;
