import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import WorkOutlineIcon from '@mui/icons-material/WorkOutlineOutlined';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const { isGuest, isDemo, exitGuestMode } = useAuth();

  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: 'auto',
        minHeight: '100vh',
        bgcolor: 'background.default',
        position: 'relative',
      }}
    >
      <TopBar />
      <Box sx={{ pt: '56px', pb: '72px', minHeight: '100vh' }}>
        {isGuest && (
          <Box sx={{
            bgcolor: 'primary.main',
            px: 2, py: 0.8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5,
          }}>
            <Typography variant="caption" sx={{ color: '#fff' }}>
              {isDemo ? '데모 모드로 둘러보는 중이에요' : '게스트 모드로 둘러보는 중이에요'}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              sx={{
                color: '#fff', borderColor: 'rgba(255,255,255,0.6)',
                py: 0, px: 1.2, fontSize: '0.7rem', minHeight: 24,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: '#fff' },
              }}
              onClick={() => { exitGuestMode(); navigate(ROUTES.LOGIN); }}
            >
              로그인하기
            </Button>
          </Box>
        )}
        {children}

        {/* 포트폴리오용 안내 푸터 */}
        <Box sx={{ px: 2, pt: 4, pb: 2, borderTop: '1px solid', borderColor: 'divider', mt: 2 }}>
          <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: 'text.secondary', mb: 0.5 }}>
            AI-assisted Social App
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled', lineHeight: 1.6, mb: 1.5 }}>
            Claude를 활용해 라우팅, 컴포넌트 구조, 주요 UI 흐름 구현을 보조받은 학습 목적의 프론트엔드 SNS 프로젝트입니다.
          </Typography>

          <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: 'text.secondary', mb: 1 }}>
            프로젝트 링크
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
            <Button
              component="a"
              href="https://github.com/kdhan0320-bot/my-first-website/tree/main/lecture1/mini_sns"
              target="_blank" rel="noopener noreferrer"
              variant="outlined"
              size="small"
              startIcon={<GitHubIcon sx={{ fontSize: 16 }} />}
              sx={{
                flex: 1, justifyContent: 'flex-start', borderRadius: 2,
                color: 'text.secondary', borderColor: 'divider', fontSize: '0.75rem',
                '&:hover': { color: 'primary.main', borderColor: 'primary.main', bgcolor: 'transparent' },
              }}
            >
              GitHub 저장소
            </Button>
            <Button
              component="a"
              href="https://kdhan0320-bot.github.io/my-first-website/my-portfolio/"
              target="_blank" rel="noopener noreferrer"
              variant="outlined"
              size="small"
              startIcon={<WorkOutlineIcon sx={{ fontSize: 16 }} />}
              sx={{
                flex: 1, justifyContent: 'flex-start', borderRadius: 2,
                color: 'text.secondary', borderColor: 'divider', fontSize: '0.75rem',
                '&:hover': { color: 'primary.main', borderColor: 'primary.main', bgcolor: 'transparent' },
              }}
            >
              포트폴리오로 돌아가기
            </Button>
          </Box>
        </Box>
      </Box>
      <BottomNav />
    </Box>
  );
};

export default MainLayout;
