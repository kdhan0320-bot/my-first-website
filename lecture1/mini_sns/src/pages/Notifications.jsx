import { useState } from 'react';
import {
  Box, Typography, List, ListItem, ListItemAvatar, Avatar,
  ListItemText, Divider, IconButton, Chip,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ForumIcon from '@mui/icons-material/Forum';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventIcon from '@mui/icons-material/Event';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MainLayout from '../components/layout/MainLayout';
import { heroSurfaceSx } from '../components/layout/PageHeroHeader';
import { getRandomProfileAvatar } from '../hooks/useAuth';
import sampleCardUi from '../assets/samples/sample-card-ui.svg';
import sampleStudy from '../assets/samples/sample-study.svg';
import sampleChatUx from '../assets/samples/sample-chat-ux.svg';
import sampleProfileUi from '../assets/samples/sample-profile-ui.svg';

const MOCK_NOTIFICATIONS = [
  {
    id: 1, type: 'comment', read: false,
    avatar: getRandomProfileAvatar('프론트러너'),
    user: '프론트러너', content: '"카드 그림자 톤이 훨씬 차분해졌네요!"', time: '방금 전',
    postImage: sampleCardUi,
  },
  {
    id: 2, type: 'meetup', read: false,
    avatar: getRandomProfileAvatar('모바일 UI 스터디'),
    user: '모바일 UI 스터디', content: '모임이 시작되었습니다. 채팅방을 확인하세요.', time: '5분 전',
    postImage: null,
  },
  {
    id: 3, type: 'like', read: false,
    avatar: getRandomProfileAvatar('스터디메이트'),
    user: '스터디메이트', content: '회원님의 게시물을 좋아합니다.', time: '30분 전',
    postImage: sampleStudy,
  },
  {
    id: 4, type: 'comment', read: true,
    avatar: getRandomProfileAvatar('디자인메이트'),
    user: '디자인메이트', content: '"아바타 톤이 잘 어울려요."', time: '2시간 전',
    postImage: sampleProfileUi,
  },
  {
    id: 5, type: 'follow', read: true,
    avatar: getRandomProfileAvatar('모바일UX'),
    user: '모바일UX', content: '회원님을 팔로우하기 시작했습니다.', time: '5시간 전',
    postImage: null,
  },
  {
    id: 6, type: 'like', read: true,
    avatar: getRandomProfileAvatar('UX러너'),
    user: 'UX러너', content: '회원님의 채팅 UI 게시물을 좋아합니다.', time: '어제',
    postImage: sampleChatUx,
  },
];

const TYPE_CONFIG = {
  like: { icon: <FavoriteIcon sx={{ fontSize: 12 }} />, color: '#e53935', bg: '#fce4e4' },
  comment: { icon: <ForumIcon sx={{ fontSize: 12 }} />, color: '#4F46E5', bg: '#EEF2FF' },
  follow: { icon: <PersonAddIcon sx={{ fontSize: 12 }} />, color: '#2e7d32', bg: '#e8f5e9' },
  meetup: { icon: <EventIcon sx={{ fontSize: 12 }} />, color: '#0891B2', bg: '#ECFEFF' },
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <MainLayout>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100%', ...heroSurfaceSx }}>
        {/* 헤더 */}
        <Box sx={{
          px: 2, py: 2.75,
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 60%, #4F46E5 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h2" sx={{ fontWeight: 800, color: '#fff' }}>활동 알림</Typography>
                  {unreadCount > 0 && (
                    <Chip
                      label={`새 알림 ${unreadCount}개`}
                      size="small"
                      sx={{ bgcolor: 'error.main', color: '#fff', fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                    />
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: '#C7D2FE', mt: 0.3 }}>
                  댓글, 좋아요, 모임 소식을 확인하세요
                </Typography>
              </Box>
              {unreadCount > 0 && (
                <IconButton size="small" onClick={markAllRead} aria-label="모두 읽음으로 표시" sx={{ color: '#E0E7FF' }}>
                  <DoneAllIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.25 }}>
              <Chip label="모임 소식" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.16)', color: '#fff', fontWeight: 600, fontSize: '0.68rem', border: '1px solid rgba(255,255,255,0.22)' }} />
            </Box>
            <Box sx={{ mt: 1.25, pt: 1.1, borderTop: '1px solid rgba(255,255,255,0.14)' }}>
              <Typography variant="caption" sx={{ color: '#A5B4FC', fontWeight: 700, display: 'block', mb: 0.25, fontSize: '0.68rem', letterSpacing: '0.02em' }}>
                알림 흐름
              </Typography>
              <Typography variant="caption" sx={{ color: '#E0E7FF', fontSize: '0.74rem', lineHeight: 1.4 }}>
                피드 반응과 모임 업데이트를 빠르게 확인합니다
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 알림 목록 */}
        <List sx={{ p: 0, bgcolor: 'background.paper' }}>
          {notifications.map((notif, idx) => {
            const config = TYPE_CONFIG[notif.type];
            return (
              <Box key={notif.id}>
                <ListItem
                  onClick={() => markRead(notif.id)}
                  sx={{
                    px: 2, py: 1.5,
                    bgcolor: notif.read ? 'background.paper' : 'rgba(99,102,241,0.06)',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    alignItems: 'flex-start',
                  }}
                >
                  <ListItemAvatar sx={{ mt: 0.5, minWidth: 56 }}>
                    <Box sx={{ position: 'relative', width: 44, height: 44 }}>
                      <Avatar src={notif.avatar} sx={{ width: 44, height: 44 }} />
                      <Box sx={{
                        position: 'absolute', bottom: -2, right: -2,
                        width: 20, height: 20, borderRadius: '50%',
                        bgcolor: config.bg, border: '2px solid #fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: config.color,
                      }}>
                        {config.icon}
                      </Box>
                    </Box>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Box>
                        <Typography component="span" variant="body2" fontWeight={700}>{notif.user}</Typography>
                        <Typography component="span" variant="body2"> {notif.content}</Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">{notif.time}</Typography>
                    }
                  />

                  {notif.postImage && (
                    <Box
                      component="img"
                      src={notif.postImage}
                      alt="관련 게시물 이미지"
                      sx={{ width: 44, height: 44, borderRadius: 1, objectFit: 'cover', ml: 1, flexShrink: 0 }}
                    />
                  )}

                  {!notif.read && (
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', ml: 1, mt: 2, flexShrink: 0 }} />
                  )}
                </ListItem>
                {idx < notifications.length - 1 && <Divider />}
              </Box>
            );
          })}
        </List>

        {notifications.length === 0 && (
          <Box sx={{ textAlign: 'center', pt: 8, px: 3 }}>
            <Typography variant="h3" gutterBottom>알림이 없어요 🔔</Typography>
            <Typography variant="body2" color="text.secondary">
              새로운 알림이 오면 여기에 표시됩니다.
            </Typography>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
};

export default Notifications;
