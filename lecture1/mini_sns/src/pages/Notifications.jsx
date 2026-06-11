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

const MOCK_NOTIFICATIONS = [
  {
    id: 1, type: 'like', read: false,
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=mario',
    user: '롤마스터99', content: '회원님의 게시물을 좋아합니다.', time: '방금 전',
    postImage: 'https://picsum.photos/seed/game42/48/48',
  },
  {
    id: 2, type: 'comment', read: false,
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=sonic',
    user: '겜덕후2024', content: '"저도 이 게임 완전 공감해요! 꿀잼ㅋㅋ"', time: '5분 전',
    postImage: 'https://picsum.photos/seed/game7/48/48',
  },
  {
    id: 3, type: 'follow', read: false,
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=link',
    user: 'ProGamer_KR', content: '회원님을 팔로우하기 시작했습니다.', time: '30분 전',
    postImage: null,
  },
  {
    id: 4, type: 'meetup', read: true,
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=room1',
    user: '발로란트팀#1', content: '새 모임에 초대되었습니다: 발로란트 대회 팀원 구함', time: '2시간 전',
    postImage: null,
  },
  {
    id: 5, type: 'like', read: true,
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=kirby',
    user: '마크장인94', content: '회원님의 게시물을 좋아합니다.', time: '5시간 전',
    postImage: 'https://picsum.photos/seed/game15/48/48',
  },
  {
    id: 6, type: 'comment', read: true,
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=pikachu',
    user: 'GamerPro123', content: '"대박 정보 감사합니다! 저도 한번 해봐야겠어요"', time: '어제',
    postImage: 'https://picsum.photos/seed/game3/48/48',
  },
  {
    id: 7, type: 'like', read: true,
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=cloud',
    user: 'GameHunter_Z', content: '회원님의 게시물을 좋아합니다.', time: '어제',
    postImage: 'https://picsum.photos/seed/game22/48/48',
  },
];

const TYPE_CONFIG = {
  like: { icon: <FavoriteIcon sx={{ fontSize: 12 }} />, color: '#e53935', bg: '#fce4e4' },
  comment: { icon: <ForumIcon sx={{ fontSize: 12 }} />, color: '#1565c0', bg: '#e3f2fd' },
  follow: { icon: <PersonAddIcon sx={{ fontSize: 12 }} />, color: '#2e7d32', bg: '#e8f5e9' },
  meetup: { icon: <EventIcon sx={{ fontSize: 12 }} />, color: '#6a1b9a', bg: '#f3e5f5' },
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
      <Box sx={{ bgcolor: 'background.default', minHeight: '100%' }}>
        {/* 헤더 */}
        <Box sx={{
          px: 2, py: 1.5,
          bgcolor: 'background.paper',
          borderBottom: '1px solid', borderColor: 'divider',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h3">알림</Typography>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount}개 미읽음`}
                size="small"
                sx={{ bgcolor: 'error.main', color: '#fff', fontWeight: 700, fontSize: '0.65rem', height: 20 }}
              />
            )}
          </Box>
          {unreadCount > 0 && (
            <IconButton size="small" onClick={markAllRead} title="모두 읽음">
              <DoneAllIcon fontSize="small" />
            </IconButton>
          )}
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
                    bgcolor: notif.read ? 'background.paper' : 'rgba(21,120,170,0.04)',
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
