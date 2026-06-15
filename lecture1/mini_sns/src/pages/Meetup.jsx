import { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Button,
  AvatarGroup, Chip, Stack, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, Alert,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MainLayout from '../components/layout/MainLayout';

const MOCK_MEETUPS = [
  {
    id: 1, title: '롤 칼바람 내전 파티', game: 'League of Legends',
    time: '오늘 오후 9시', location: '서울 강남구 1.2km',
    current: 3, max: 5, tags: ['#롤', '#내전', '#칼바람'],
    avatars: [
      'https://api.dicebear.com/7.x/pixel-art/svg?seed=a1',
      'https://api.dicebear.com/7.x/pixel-art/svg?seed=b2',
      'https://api.dicebear.com/7.x/pixel-art/svg?seed=c3',
    ],
  },
  {
    id: 2, title: '발로란트 대회 팀원 구함', game: 'Valorant',
    time: '내일 오후 3시', location: '온라인 (Discord)',
    current: 2, max: 5, tags: ['#발로란트', '#팀원모집', '#대회'],
    avatars: [
      'https://api.dicebear.com/7.x/pixel-art/svg?seed=d4',
      'https://api.dicebear.com/7.x/pixel-art/svg?seed=e5',
    ],
  },
  {
    id: 3, title: '마인크래프트 서버 같이해요', game: 'Minecraft',
    time: '주말 오후 7시', location: '서울 마포구 2.1km',
    current: 1, max: 8, tags: ['#마크', '#서바이벌', '#건축'],
    avatars: ['https://api.dicebear.com/7.x/pixel-art/svg?seed=f6'],
  },
  {
    id: 4, title: '스팀 멀티 게임 친구 구해요', game: 'Steam',
    time: '오늘 자정', location: '온라인',
    current: 4, max: 4, tags: ['#스팀', '#인디게임', '#협동'],
    avatars: [
      'https://api.dicebear.com/7.x/pixel-art/svg?seed=g7',
      'https://api.dicebear.com/7.x/pixel-art/svg?seed=h8',
      'https://api.dicebear.com/7.x/pixel-art/svg?seed=i9',
      'https://api.dicebear.com/7.x/pixel-art/svg?seed=j10',
    ],
  },
];

const MeetupCard = ({ meetup, onJoin }) => {
  const isFull = meetup.current >= meetup.max;
  return (
    <Card sx={{ mx: 2, mb: 1.5 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ mb: 0.3 }}>{meetup.title}</Typography>
            <Typography variant="caption" color="primary.main" fontWeight={600}>{meetup.game}</Typography>
          </Box>
          <Chip
            label={isFull ? '마감' : '모집중'}
            size="small"
            sx={{
              bgcolor: isFull ? 'error.main' : 'success.main',
              color: '#fff', fontWeight: 600, fontSize: '0.7rem',
            }}
          />
        </Box>

        <Stack spacing={0.5} sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">{meetup.time}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">{meetup.location}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PeopleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {meetup.current} / {meetup.max}명 참여 중
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
          {meetup.tags.map((tag) => (
            <Chip
              key={tag} label={tag} size="small"
              sx={{ bgcolor: 'secondary.light', color: 'primary.dark', fontSize: '0.68rem', height: 20 }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.7rem' } }}>
            {meetup.avatars.map((src, i) => <Avatar key={i} src={src} />)}
          </AvatarGroup>
          <Button
            variant={isFull ? 'outlined' : 'contained'}
            size="small"
            disabled={isFull}
            onClick={() => !isFull && onJoin(meetup)}
            sx={{ borderRadius: 2, minWidth: 80 }}
          >
            {isFull ? '마감됨' : '참가하기'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const Meetup = () => {
  const [meetups, setMeetups] = useState(MOCK_MEETUPS);
  const [joinTarget, setJoinTarget] = useState(null);
  const [snackOpen, setSnackOpen] = useState(false);

  const handleJoin = (meetup) => setJoinTarget(meetup);

  const handleConfirm = () => {
    setMeetups((prev) =>
      prev.map((m) =>
        m.id === joinTarget.id ? { ...m, current: m.current + 1 } : m
      )
    );
    setJoinTarget(null);
    setSnackOpen(true);
  };

  return (
    <MainLayout>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100%' }}>
        <Box sx={{ px: 2, py: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h3">내 주변 모임 찾기</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 14, color: 'primary.main', mr: 0.5 }} />
            <Typography variant="caption" color="text.secondary">서울 강남구 기준 5km 이내</Typography>
          </Box>
        </Box>

        <Box sx={{ pt: 2 }}>
          {meetups.map((meetup) => (
            <MeetupCard key={meetup.id} meetup={meetup} onJoin={handleJoin} />
          ))}
        </Box>

        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="caption" color="text.secondary">
            🚧 실시간 위치 기능은 준비 중입니다
          </Typography>
        </Box>
      </Box>

      {/* 참가 확인 다이얼로그 */}
      <Dialog
        open={Boolean(joinTarget)}
        onClose={() => setJoinTarget(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, mx: 2 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SportsEsportsIcon color="primary" />
            <Typography variant="h4">모임 참가하기</Typography>
          </Box>
        </DialogTitle>
        {joinTarget && (
          <DialogContent sx={{ pt: 1 }}>
            <Box sx={{ bgcolor: 'background.default', borderRadius: 2, p: 2, mb: 1.5 }}>
              <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>{joinTarget.title}</Typography>
              <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">{joinTarget.time}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">{joinTarget.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PeopleIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    현재 {joinTarget.current}명 / 최대 {joinTarget.max}명
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Typography variant="body2" color="text.secondary">
              이 모임에 참가 신청하시겠습니까?
            </Typography>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setJoinTarget(null)} sx={{ borderRadius: 2, flex: 1 }}>
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            sx={{ borderRadius: 2, flex: 1, fontWeight: 700 }}
          >
            참가 확정 🎮
          </Button>
        </DialogActions>
      </Dialog>

      {/* 참가 완료 스낵바 */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 8 }}
      >
        <Alert severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          참가 신청 완료! 함께 즐겨요 🎮
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default Meetup;
