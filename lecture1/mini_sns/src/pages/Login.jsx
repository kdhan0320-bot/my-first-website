import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert, CircularProgress, Avatar, Divider, Chip,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

const MiniTab = ({ icon, active }) => (
  <Box sx={{
    width: 22, height: 22, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    bgcolor: active ? '#2563EB' : 'transparent',
    color: active ? '#fff' : '#94A3B8',
  }}>
    {icon}
  </Box>
);

const AppPreviewMock = () => (
  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <Box sx={{
      width: 240,
      bgcolor: '#FFFFFF',
      borderRadius: 4,
      border: '1px solid #E2E8F0',
      boxShadow: '0 24px 48px -12px rgba(30,58,95,0.28)',
      overflow: 'hidden',
    }}>
      {/* 미니 TopBar */}
      <Box sx={{
        bgcolor: '#FFFFFF', px: 1.5, py: 0.9,
        borderBottom: '1px solid #F1F5F9',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 16, height: 16, borderRadius: '5px', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GroupsIcon sx={{ fontSize: '0.55rem', color: '#2563EB' }} />
          </Box>
          <Typography sx={{ fontSize: '0.5rem', fontWeight: 800, color: '#0F172A' }}>Mini SNS</Typography>
        </Box>
        <Box sx={{ position: 'relative', width: 12, height: 12 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', border: '1.4px solid #CBD5E1' }} />
          <Box sx={{ position: 'absolute', top: -1, right: -1, width: 5, height: 5, borderRadius: '50%', bgcolor: '#EF4444' }} />
        </Box>
      </Box>

      {/* 게시물 1 */}
      <Box sx={{ borderBottom: '1px solid #F8FAFC' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.6 }}>
          <Avatar src="https://api.dicebear.com/7.x/initials/svg?seed=UX러너" sx={{ width: 17, height: 17 }} />
          <Typography sx={{ fontSize: '0.46rem', fontWeight: 700, color: '#0F172A' }}>UX러너</Typography>
        </Box>
        <Box sx={{ width: '100%', aspectRatio: '16/9', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: '0.48rem', color: '#60A5FA', fontWeight: 700 }}>작업 기록</Typography>
        </Box>
        <Box sx={{ px: 1, py: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
            <FavoriteIcon sx={{ fontSize: 8, color: '#EF4444' }} />
            <Typography sx={{ fontSize: '0.4rem', fontWeight: 600, color: '#334155' }}>24</Typography>
            <ForumOutlinedIcon sx={{ fontSize: 8, ml: 0.3, color: '#94A3B8' }} />
            <Typography sx={{ fontSize: '0.4rem', color: '#94A3B8' }}>6</Typography>
          </Box>
        </Box>
      </Box>

      {/* 게시물 2 */}
      <Box sx={{ borderBottom: '1px solid #F8FAFC' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.6 }}>
          <Avatar src="https://api.dicebear.com/7.x/initials/svg?seed=스터디메이트" sx={{ width: 17, height: 17 }} />
          <Typography sx={{ fontSize: '0.46rem', fontWeight: 700, color: '#0F172A' }}>스터디메이트</Typography>
        </Box>
        <Box sx={{ width: '100%', aspectRatio: '16/9', bgcolor: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: '0.48rem', color: '#2DD4BF', fontWeight: 700 }}>스터디 모집</Typography>
        </Box>
        <Box sx={{ px: 1, py: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
            <FavoriteIcon sx={{ fontSize: 8, color: '#EF4444' }} />
            <Typography sx={{ fontSize: '0.4rem', fontWeight: 600, color: '#334155' }}>17</Typography>
          </Box>
          <Chip label="모바일 UI 스터디" size="small" sx={{ height: 14, fontSize: '0.36rem', fontWeight: 700, bgcolor: '#EFF6FF', color: '#2563EB' }} />
        </Box>
      </Box>

      {/* 채팅 알림 bubble */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, px: 1, py: 0.7, bgcolor: '#F8FAFC' }}>
        <ChatBubbleOutlineIcon sx={{ fontSize: 11, color: '#2563EB' }} />
        <Typography sx={{ fontSize: '0.4rem', color: '#475569', flex: 1 }}>모임 참가 후 채팅방으로 이동했어요</Typography>
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#EF4444' }} />
      </Box>

      {/* 하단 탭 미니 아이콘 */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        px: 1, py: 0.8, borderTop: '1px solid #F1F5F9', bgcolor: '#FFFFFF',
      }}>
        <MiniTab icon={<HomeRoundedIcon sx={{ fontSize: 12 }} />} active />
        <MiniTab icon={<PeopleAltRoundedIcon sx={{ fontSize: 12 }} />} />
        <MiniTab icon={<AddRoundedIcon sx={{ fontSize: 13 }} />} />
        <MiniTab icon={<ForumOutlinedIcon sx={{ fontSize: 12 }} />} />
        <MiniTab icon={<PersonRoundedIcon sx={{ fontSize: 12 }} />} />
      </Box>
    </Box>
  </Box>
);

const Login = () => {
  const navigate = useNavigate();
  const { signIn, enterGuestMode, enterDemoMode } = useAuth();
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

  const handleGuestMode = () => {
    enterGuestMode();
    navigate(ROUTES.HOME);
  };

  const handleDemoMode = () => {
    enterDemoMode();
    navigate(ROUTES.HOME);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #EEF2FF 0%, #F8FAFC 45%, #ECFEFF 100%)',
        display: 'flex',
        justifyContent: 'center',
        px: { xs: 2.5, md: 4 },
        py: { xs: 4, md: 7 },
      }}
    >
      <Box sx={{
        width: '100%',
        maxWidth: 1040,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        gap: { xs: 4, md: 8 },
      }}>
        {/* 좌측: 브랜딩 + 소개 + 앱 프리뷰 */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, textAlign: { xs: 'center', md: 'left' } }}>
          <Box
            sx={{
              width: 60, height: 60,
              borderRadius: '16px',
              bgcolor: '#EFF6FF',
              border: '1px solid #DBEAFE',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mb: 2,
            }}
          >
            <GroupsIcon sx={{ fontSize: 30, color: '#2563EB' }} />
          </Box>
          <Typography sx={{ color: '#0F172A', fontWeight: 800, fontSize: { xs: '1.6rem', md: '2rem' }, letterSpacing: '-0.5px', lineHeight: 1.15, mb: 1 }}>
            Mini SNS
          </Typography>
          <Typography sx={{ color: '#334155', fontWeight: 600, fontSize: { xs: '0.95rem', md: '1.05rem' }, mb: 1.5, maxWidth: 420 }}>
            작업 기록과 스터디 모임을 연결하는 모바일 소셜 앱
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mb: { xs: 4, md: 5 }, maxWidth: 400, lineHeight: 1.7 }}>
            오늘 작업한 화면을 기록하고, 스터디 모임에 참여하고, 채팅방에서 흐름을 이어가세요.
          </Typography>

          <AppPreviewMock />
        </Box>

        {/* 우측: CTA + 로그인 폼 */}
        <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: 380 }, flexShrink: 0 }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleGuestMode}
            aria-label="로그인 없이 게스트로 데모 체험하기"
            sx={{ py: 1.6, borderRadius: 3, fontWeight: 700, fontSize: '1rem', mb: 1.25 }}
          >
            게스트로 둘러보기
          </Button>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={handleDemoMode}
            aria-label="테스트 계정으로 데모 체험하기"
            sx={{ py: 1.4, borderRadius: 3, fontWeight: 700, fontSize: '0.95rem', mb: 1 }}
          >
            테스트 계정으로 체험하기
          </Button>
          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', textAlign: 'center', mb: 3, lineHeight: 1.6 }}>
            Supabase 연결 없이 데모 계정으로 주요 화면을 체험할 수 있습니다.
          </Typography>

          {error && <Alert severity="warning" sx={{ mb: 2, borderRadius: 2, width: '100%' }}>{error}</Alert>}

          {/* 로그인 폼 */}
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              width: '100%',
              bgcolor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(6px)',
              borderRadius: 3,
              p: 3,
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 16px rgba(15,23,42,0.06)',
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
              sx={{ mb: 1.5, py: 1.3, borderRadius: 3, fontWeight: 700, fontSize: '0.95rem' }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : '로그인'}
            </Button>

            <Button
              variant="text"
              fullWidth
              size="large"
              onClick={() => navigate(ROUTES.SIGNUP)}
              sx={{ py: 1.2, borderRadius: 3, fontWeight: 600, fontSize: '0.9rem', color: '#64748B' }}
            >
              회원가입
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
