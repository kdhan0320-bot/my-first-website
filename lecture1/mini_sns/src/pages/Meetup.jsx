import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Avatar, Button,
  AvatarGroup, Chip, Stack, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, Alert,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import MainLayout from '../components/layout/MainLayout';
import { chatRoomPath } from '../constants/routes';
import { getRandomProfileAvatar } from '../hooks/useAuth';

const MOCK_MEETUPS = [
  {
    id: 1, title: '모바일 UI 스터디', game: 'Mobile UI / UX',
    time: '매주 수요일 저녁 8시', location: '온라인 (Discord)',
    current: 3, max: 5, tags: ['#모바일UI', '#스터디', '#UX'],
    chatRoomId: 'mobile-ui-study',
    avatars: ['a1', 'b2', 'c3'].map((s) => getRandomProfileAvatar(s)),
  },
  {
    id: 2, title: 'React 작업 인증방', game: 'React / 작업기록',
    time: '상시 운영', location: '온라인 (카카오톡)',
    current: 8, max: 12, tags: ['#React', '#작업기록', '#프론트엔드'],
    chatRoomId: 'react-worklog',
    avatars: ['d4', 'e5', 'f6', 'g7'].map((s) => getRandomProfileAvatar(s)),
  },
  {
    id: 3, title: '포트폴리오 정리 모임', game: '작업 기록 정리',
    time: '이번 주 토요일 오후 2시', location: '온라인 (Zoom)',
    current: 4, max: 6, tags: ['#포트폴리오정리', '#작업기록'],
    chatRoomId: 'portfolio-club',
    avatars: ['h8', 'i9', 'j10', 'k11'].map((s) => getRandomProfileAvatar(s)),
  },
];

const MeetupCard = ({ meetup, joined, onJoin, onGoToChat }) => {
  const isFull = meetup.current >= meetup.max && !joined;
  return (
    <Card sx={{ mx: 2, mb: 1.5 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ mb: 0.3 }}>{meetup.title}</Typography>
            <Typography variant="caption" color="primary.main" fontWeight={600}>{meetup.game}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.68rem' }}>데모 모임</Typography>
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
            variant={joined ? 'outlined' : isFull ? 'outlined' : 'contained'}
            size="small"
            disabled={isFull}
            onClick={() => (joined ? onGoToChat(meetup) : onJoin(meetup))}
            sx={{ borderRadius: 2, minWidth: 96 }}
          >
            {isFull ? '마감됨' : joined ? '채팅방으로 이동' : '참가하기'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const Meetup = () => {
  const navigate = useNavigate();
  const [meetups, setMeetups] = useState(MOCK_MEETUPS);
  const [joinedIds, setJoinedIds] = useState([]);
  const [joinTarget, setJoinTarget] = useState(null);
  const [snackOpen, setSnackOpen] = useState(false);

  const handleJoin = (meetup) => setJoinTarget(meetup);

  const handleGoToChat = (meetup) => navigate(chatRoomPath(meetup.chatRoomId));

  const handleConfirm = () => {
    const target = joinTarget;
    setMeetups((prev) =>
      prev.map((m) =>
        m.id === target.id ? { ...m, current: m.current + 1 } : m
      )
    );
    setJoinedIds((prev) => [...prev, target.id]);
    setJoinTarget(null);
    setSnackOpen(true);
    setTimeout(() => navigate(chatRoomPath(target.chatRoomId)), 1000);
  };

  return (
    <MainLayout>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100%' }}>
        <Box sx={{ px: 2, py: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h2" sx={{ fontWeight: 800 }}>스터디 모임</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
            관심 있는 모임에 참여하고 채팅방에서 이어가세요
          </Typography>
        </Box>

        <Box sx={{ pt: 2 }}>
          {meetups.map((meetup) => (
            <MeetupCard
              key={meetup.id}
              meetup={meetup}
              joined={joinedIds.includes(meetup.id)}
              onJoin={handleJoin}
              onGoToChat={handleGoToChat}
            />
          ))}
        </Box>

        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="caption" color="text.secondary">
            실시간 위치 기능은 준비 중입니다
          </Typography>
        </Box>
      </Box>

      {/* 참가 확인 다이얼로그 */}
      <Dialog
        open={Boolean(joinTarget)}
        onClose={() => setJoinTarget(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, mx: 2 } } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupsIcon color="primary" />
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
              이 모임에 참가 신청하시겠습니까? 참가 후 연결된 채팅방으로 이동합니다.
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
            참가 확정
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
          모임에 참가했습니다. 채팅방으로 이동합니다.
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default Meetup;
