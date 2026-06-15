import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, List, ListItem, ListItemAvatar, Avatar,
  ListItemText, Divider, Badge, Chip, IconButton,
  Paper, TextField, InputAdornment,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import MainLayout from '../components/layout/MainLayout';

const MOCK_ROOMS = [
  { id: 1, name: '롤 내전 파티방', type: 'group', members: 5, lastMsg: '오늘 9시에 봐요!', time: '방금 전', unread: 3, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=room1' },
  { id: 2, name: '발로란트팀#1', type: 'group', members: 5, lastMsg: '맵 선택 어떻게 할까요', time: '5분 전', unread: 1, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=room2' },
  { id: 3, name: 'GamerPro123', type: 'dm', members: 2, lastMsg: '게임 같이 해요!', time: '1시간 전', unread: 0, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=user1' },
  { id: 4, name: '마크 서버방', type: 'group', members: 3, lastMsg: '접속 가능하신가요?', time: '어제', unread: 0, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=room4' },
];

const MOCK_MESSAGES = {
  1: [
    { id: 1, sender: '롤마스터', content: '오늘 내전 어때요?', time: '20:30', mine: false },
    { id: 2, sender: 'me', content: '좋아요! 9시에 모여요', time: '20:31', mine: true },
    { id: 3, sender: '다이아나', content: '저도 참가할게요', time: '20:32', mine: false },
    { id: 4, sender: 'me', content: '오늘 9시에 봐요!', time: '20:33', mine: true },
  ],
};

const ChatRoom = ({ room, onBack }) => {
  const [messages, setMessages] = useState(MOCK_MESSAGES[room.id] || []);
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, {
      id: Date.now(), sender: 'me', content: text, time: '지금', mine: true,
    }]);
    setText('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 56px - 72px)', bgcolor: '#f0f4ff' }}>
      {/* 헤더 */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1.5,
        px: 1, py: 1, bgcolor: 'background.paper',
        borderBottom: '1px solid', borderColor: 'divider',
        flexShrink: 0,
      }}>
        <IconButton size="small" onClick={onBack}><ArrowBackIcon /></IconButton>
        <Avatar src={room.avatar} sx={{ width: 36, height: 36 }} />
        <Box>
          <Typography variant="body2" fontWeight={700}>{room.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {room.type === 'group' ? `${room.members}명` : '1:1 채팅'}
          </Typography>
        </Box>
      </Box>

      {/* 메시지 목록 */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {messages.map((msg) => (
          <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.mine ? 'flex-end' : 'flex-start' }}>
            {!msg.mine && (
              <Typography variant="caption" color="text.secondary" sx={{ mr: 1, alignSelf: 'flex-end', mb: 0.5 }}>
                {msg.sender}
              </Typography>
            )}
            <Paper
              elevation={0}
              sx={{
                px: 1.5, py: 1, maxWidth: '70%',
                bgcolor: msg.mine ? 'primary.main' : 'background.paper',
                color: msg.mine ? '#fff' : 'text.primary',
                borderRadius: msg.mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              }}
            >
              <Typography variant="body2">{msg.content}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.65rem' }}>{msg.time}</Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* 입력 */}
      <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
        <TextField
          fullWidth size="small" placeholder="메시지를 입력하세요..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          InputProps={{
            sx: { borderRadius: 3 },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" color="primary" onClick={handleSend}>
                  <SendIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

const Chat = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  if (selectedRoom) {
    return (
      <MainLayout>
        <ChatRoom room={selectedRoom} onBack={() => setSelectedRoom(null)} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100%' }}>
        <Box sx={{ px: 2, py: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h3">채팅</Typography>
        </Box>

        <List sx={{ p: 0, bgcolor: 'background.paper' }}>
          {MOCK_ROOMS.map((room, idx) => (
            <Box key={room.id}>
              <ListItem
                onClick={() => setSelectedRoom(room)}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }, px: 2, py: 1.5 }}
              >
                <ListItemAvatar>
                  <Badge badgeContent={room.unread} color="error" max={9}>
                    <Avatar src={room.avatar} sx={{ width: 48, height: 48 }} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight={700}>{room.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{room.time}</Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>
                        {room.lastMsg}
                      </Typography>
                      <Chip
                        label={room.type === 'group' ? '단체' : '1:1'}
                        size="small"
                        sx={{ height: 18, fontSize: '0.62rem', bgcolor: room.type === 'group' ? 'secondary.light' : 'background.default' }}
                      />
                    </Box>
                  }
                />
              </ListItem>
              {idx < MOCK_ROOMS.length - 1 && <Divider variant="inset" component="li" />}
            </Box>
          ))}
        </List>

        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            채팅방을 선택해 대화를 시작하세요
          </Typography>
          <Typography variant="caption" sx={{ color: '#B0B8C1' }}>
            🚧 실시간 채팅은 준비 중입니다
          </Typography>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default Chat;
