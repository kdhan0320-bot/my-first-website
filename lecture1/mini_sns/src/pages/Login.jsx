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
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

const MiniTab = ({ icon, active }) => (
  <Box sx={{
    width: 30, height: 30, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    bgcolor: active ? '#6366F1' : 'transparent',
    color: active ? '#fff' : '#94A3B8',
  }}>
    {icon}
  </Box>
);

const AppMockup = () => (
  <Box sx={{
    width: '100%', maxWidth: 320, mx: 'auto',
    borderRadius: '32px',
    p: '10px',
    background: 'linear-gradient(160deg, #1E1B4B 0%, #312E81 55%, #4F46E5 100%)',
    boxShadow: '0 32px 64px -16px rgba(30,27,75,0.45)',
  }}>
    <Box sx={{ borderRadius: '24px', overflow: 'hidden', bgcolor: '#F8FAFC' }}>
      {/* 상단 헤더 */}
      <Box sx={{ px: 2.5, py: 2, background: 'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)' }}>
        <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>Worklog Today</Typography>
        <Typography sx={{ color: '#C7D2FE', fontSize: '0.7rem', mt: 0.2 }}>
          스터디와 작업 기록을 확인하세요
        </Typography>
      </Box>

      {/* 피드 카드 1 */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1, borderBottom: '1px solid #EEF0FA' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.8 }}>
          <Avatar src="https://api.dicebear.com/7.x/initials/svg?seed=UX러너&backgroundColor=6366F1" sx={{ width: 24, height: 24 }} />
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A' }}>UX러너</Typography>
        </Box>
        <Box sx={{ width: '100%', height: 64, borderRadius: 2, bgcolor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.8 }}>
          <Typography sx={{ fontSize: '0.7rem', color: '#6366F1', fontWeight: 700 }}>작업 기록</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <FavoriteIcon sx={{ fontSize: 12, color: '#EF4444' }} />
          <Typography sx={{ fontSize: '0.62rem', fontWeight: 600, color: '#334155' }}>24</Typography>
          <ForumOutlinedIcon sx={{ fontSize: 12, ml: 0.5, color: '#94A3B8' }} />
          <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8' }}>6</Typography>
        </Box>
      </Box>

      {/* 피드 카드 2 */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1, borderBottom: '1px solid #EEF0FA' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.8 }}>
          <Avatar src="https://api.dicebear.com/7.x/initials/svg?seed=프론트러너&backgroundColor=06B6D4" sx={{ width: 24, height: 24 }} />
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A' }}>프론트러너</Typography>
        </Box>
        <Box sx={{ width: '100%', height: 64, borderRadius: 2, bgcolor: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.8 }}>
          <Typography sx={{ fontSize: '0.7rem', color: '#06B6D4', fontWeight: 700 }}>채팅 UI</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <FavoriteIcon sx={{ fontSize: 12, color: '#EF4444' }} />
          <Typography sx={{ fontSize: '0.62rem', fontWeight: 600, color: '#334155' }}>17</Typography>
          <ForumOutlinedIcon sx={{ fontSize: 12, ml: 0.5, color: '#94A3B8' }} />
          <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8' }}>3</Typography>
        </Box>
      </Box>

      {/* 스터디 모임 카드 */}
      <Box sx={{ px: 2, py: 1.2, borderBottom: '1px solid #EEF0FA', bgcolor: '#FAFAFF' }}>
        <Box sx={{ border: '1px solid #E0E7FF', borderRadius: 2.5, p: 1.2, bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.6 }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F172A' }}>모바일 UI 스터디</Typography>
            <Chip label="모집중" size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: '#DCFCE7', color: '#16A34A' }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mb: 0.8 }}>
            <AccessTimeRoundedIcon sx={{ fontSize: 11, color: '#94A3B8' }} />
            <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8' }}>매주 수요일 저녁 8시</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex' }}>
              {['a1', 'b2', 'c3'].map((s) => (
                <Avatar key={s} src={`https://api.dicebear.com/7.x/initials/svg?seed=${s}&backgroundColor=6366F1,06B6D4,4F46E5`} sx={{ width: 18, height: 18, ml: '-4px', border: '1.5px solid #fff' }} />
              ))}
            </Box>
            <Box sx={{ border: '1px solid #6366F1', borderRadius: 1.5, px: 1, py: 0.3 }}>
              <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#6366F1' }}>참가하기</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 채팅 알림 bubble */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, px: 2, py: 1.2, bgcolor: '#F8FAFC' }}>
        <ChatBubbleOutlineIcon sx={{ fontSize: 16, color: '#6366F1' }} />
        <Typography sx={{ fontSize: '0.64rem', color: '#475569', flex: 1 }}>모임 참가 후 채팅방으로 이동했어요</Typography>
        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#EF4444' }} />
      </Box>

      {/* 하단 탭 */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        px: 1, py: 1, borderTop: '1px solid #EEF0FA', bgcolor: '#FFFFFF',
      }}>
        <MiniTab icon={<HomeRoundedIcon sx={{ fontSize: 16 }} />} active />
        <MiniTab icon={<PeopleAltRoundedIcon sx={{ fontSize: 16 }} />} />
        <MiniTab icon={<AddRoundedIcon sx={{ fontSize: 18 }} />} />
        <MiniTab icon={<ForumOutlinedIcon sx={{ fontSize: 16 }} />} />
        <MiniTab icon={<PersonRoundedIcon sx={{ fontSize: 16 }} />} />
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
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #0F172A 0%, #312E81 55%, #4F46E5 100%)',
        px: { xs: 2.5, md: 5 },
        py: { xs: 4, md: 7 },
      }}
    >
      {/* 은은한 배경 blob 애니메이션 */}
      <Box aria-hidden sx={{
        position: 'absolute', top: '-12%', left: '-10%', width: 420, height: 420,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, #818CF8 0%, transparent 70%)',
        opacity: 0.3, filter: 'blur(60px)',
        '@keyframes blobFloatA': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(70px, 55px) scale(1.12)' },
        },
        animation: 'blobFloatA 18s ease-in-out infinite',
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
      }} />
      <Box aria-hidden sx={{
        position: 'absolute', bottom: '-14%', right: '-8%', width: 420, height: 420,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)',
        opacity: 0.26, filter: 'blur(60px)',
        '@keyframes blobFloatB': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-60px, -70px) scale(1.15)' },
        },
        animation: 'blobFloatB 20s ease-in-out infinite',
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
      }} />
      <Box aria-hidden sx={{
        position: 'absolute', top: '32%', left: '46%', width: 320, height: 320,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)',
        opacity: 0.28, filter: 'blur(60px)',
        '@keyframes blobFloatC': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(50px, -60px) scale(1.1)' },
        },
        animation: 'blobFloatC 15s ease-in-out infinite',
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
      }} />

      <Box sx={{
        position: 'relative', zIndex: 1,
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        display: 'grid',
        columnGap: { md: 8 },
        rowGap: 3,
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(380px, 460px)' },
        gridTemplateAreas: {
          xs: `"brand" "cta" "mockup" "form"`,
          md: `"brand mockup" "cta mockup" "form mockup"`,
        },
        alignItems: { xs: 'start', md: 'center' },
      }}>
        {/* 브랜드 카피 */}
        <Box sx={{ gridArea: 'brand', textAlign: { xs: 'center', md: 'left' } }}>
          <Box
            sx={{
              width: 56, height: 56,
              borderRadius: '16px',
              bgcolor: 'rgba(129,140,248,0.16)',
              border: '1px solid rgba(165,180,252,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mb: 2, mx: { xs: 'auto', md: 0 },
            }}
          >
            <GroupsIcon sx={{ fontSize: 28, color: '#C7D2FE' }} />
          </Box>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '1.6rem', md: '2rem' }, letterSpacing: '-0.5px', lineHeight: 1.15, mb: 1 }}>
            Mini SNS
          </Typography>
          <Typography sx={{ color: '#C7D2FE', fontWeight: 600, fontSize: { xs: '0.95rem', md: '1.05rem' }, mb: 1.5 }}>
            작업 기록과 스터디 모임을 연결하는 모바일 소셜 앱
          </Typography>
          <Typography variant="body2" sx={{ color: '#A5B4C7', lineHeight: 1.8 }}>
            오늘 작업한 화면을 기록하고,<br />
            스터디 모임에 참여하고,<br />
            채팅방에서 흐름을 이어가세요.
          </Typography>
        </Box>

        {/* CTA */}
        <Box sx={{ gridArea: 'cta' }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleDemoMode}
            aria-label="데모 계정으로 체험하기"
            sx={{
              py: 1.6, borderRadius: 3, fontWeight: 700, fontSize: '1rem', mb: 1.25,
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)' },
            }}
          >
            데모 계정으로 체험하기
          </Button>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={handleGuestMode}
            aria-label="로그인 없이 게스트로 데모 체험하기"
            sx={{
              py: 1.4, borderRadius: 3, fontWeight: 700, fontSize: '0.95rem', mb: 1,
              color: '#E0E7FF', borderColor: 'rgba(199,210,254,0.5)',
              '&:hover': { borderColor: '#C7D2FE', bgcolor: 'rgba(199,210,254,0.08)' },
            }}
          >
            게스트로 둘러보기
          </Button>
          <Typography variant="caption" sx={{ color: '#A5B4C7', display: 'block', textAlign: 'center', lineHeight: 1.6 }}>
            Supabase 연결 없이 데모 계정으로 주요 화면을 체험할 수 있습니다.
          </Typography>
        </Box>

        {/* 앱 목업 */}
        <Box sx={{ gridArea: 'mockup', display: 'flex', alignItems: 'center', justifyContent: 'center', py: { xs: 1, md: 0 } }}>
          <AppMockup />
        </Box>

        {/* 로그인 폼 */}
        <Box sx={{ gridArea: 'form' }}>
          {error && <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              width: '100%',
              bgcolor: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(8px)',
              borderRadius: 3,
              p: 3,
              border: '1px solid rgba(199,210,254,0.18)',
            }}
          >
            <Divider sx={{ mb: 2.5, borderColor: 'rgba(199,210,254,0.25)' }}>
              <Typography variant="caption" sx={{ color: '#A5B4C7' }}>계정으로 로그인</Typography>
            </Divider>

            <TextField
              label="아이디"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2, '& .MuiInputLabel-root': { color: '#A5B4C7' }, '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.9)' } }}
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
              sx={{ mb: 2.5, '& .MuiInputLabel-root': { color: '#A5B4C7' }, '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.9)' } }}
              autoComplete="current-password"
              slotProps={{ htmlInput: { 'aria-label': '비밀번호' } }}
            />

            <Button
              type="submit"
              variant="outlined"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mb: 1.5, py: 1.3, borderRadius: 3, fontWeight: 700, fontSize: '0.95rem',
                color: '#E0E7FF', borderColor: 'rgba(199,210,254,0.5)',
                '&:hover': { borderColor: '#C7D2FE', bgcolor: 'rgba(199,210,254,0.08)' },
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : '로그인'}
            </Button>

            <Button
              variant="text"
              fullWidth
              size="large"
              onClick={() => navigate(ROUTES.SIGNUP)}
              sx={{ py: 1.2, borderRadius: 3, fontWeight: 600, fontSize: '0.9rem', color: '#A5B4C7' }}
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
