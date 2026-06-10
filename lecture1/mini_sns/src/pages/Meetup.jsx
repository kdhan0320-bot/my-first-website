import {
  Box, Typography, Card, CardContent, Avatar, Button,
  AvatarGroup, Chip, Stack,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import MainLayout from '../components/layout/MainLayout';

const MOCK_MEETUPS = [
  {
    id: 1, title: '롤 칼바람 내전 파티', game: 'League of Legends',
    time: '오늘 오후 9시', location: '서울 강남구 1.2km',
    current: 3, max: 5, tags: ['#롤', '#내전', '#칼바람'],
    avatars: ['https://api.dicebear.com/7.x/pixel-art/svg?seed=a1', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=b2', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=c3'],
  },
  {
    id: 2, title: '발로란트 대회 팀원 구함', game: 'Valorant',
    time: '내일 오후 3시', location: '온라인 (Discord)',
    current: 2, max: 5, tags: ['#발로란트', '#팀원모집', '#대회'],
    avatars: ['https://api.dicebear.com/7.x/pixel-art/svg?seed=d4', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=e5'],
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
    avatars: ['https://api.dicebear.com/7.x/pixel-art/svg?seed=g7','https://api.dicebear.com/7.x/pixel-art/svg?seed=h8','https://api.dicebear.com/7.x/pixel-art/svg?seed=i9','https://api.dicebear.com/7.x/pixel-art/svg?seed=j10'],
  },
];

const MeetupCard = ({ meetup }) => {
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
              {meetup.current} / {meetup.max}명
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
          {meetup.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small"
              sx={{ bgcolor: 'secondary.light', color: 'primary.dark', fontSize: '0.68rem', height: 20 }} />
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.7rem' } }}>
            {meetup.avatars.map((src, i) => <Avatar key={i} src={src} />)}
          </AvatarGroup>
          <Button
            variant={isFull ? 'outlined' : 'contained'}
            size="small" disabled={isFull}
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
          {MOCK_MEETUPS.map((meetup) => (
            <MeetupCard key={meetup.id} meetup={meetup} />
          ))}
        </Box>

        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="caption" color="text.secondary">
            🚧 실시간 위치 기능은 준비 중입니다
          </Typography>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default Meetup;
