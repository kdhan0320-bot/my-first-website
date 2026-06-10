import { useState, useEffect, useRef } from 'react';
import {
  Drawer, Box, Typography, Avatar, TextField, Button,
  List, ListItem, Divider, IconButton, CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../hooks/useAuth';
import { formatDistanceToNow } from '../../utils/timeFormat';

const CommentModal = ({ open, onClose, postId }) => {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (open && postId) fetchComments();
  }, [open, postId]);

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(nickname, profile_image_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    setComments(data || []);
  };

  const handleSubmit = async () => {
    if (!text.trim() || !user) return;
    setLoading(true);
    await supabase.from('comments').insert({
      post_id: postId, user_id: user.id, content: text.trim(),
    });
    setText('');
    await fetchComments();
    setLoading(false);
    setTimeout(() => listRef.current?.scrollTo(0, listRef.current.scrollHeight), 100);
  };

  const handleDelete = async (commentId) => {
    await supabase.from('comments').delete().eq('id', commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleEdit = async (commentId) => {
    if (!editText.trim()) return;
    await supabase.from('comments').update({ content: editText.trim() }).eq('id', commentId);
    setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, content: editText } : c));
    setEditId(null);
    setEditText('');
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxWidth: 480, mx: 'auto', borderRadius: '16px 16px 0 0',
          maxHeight: '80vh', display: 'flex', flexDirection: 'column',
        },
      }}
      sx={{ '& .MuiBackdrop-root': { bgcolor: 'rgba(0,0,0,0.5)' } }}
    >
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h4">댓글 {comments.length}개</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
      </Box>

      {/* 댓글 목록 */}
      <List ref={listRef} sx={{ flex: 1, overflowY: 'auto', px: 1 }}>
        {comments.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            첫 댓글을 남겨보세요! 🎮
          </Typography>
        )}
        {comments.map((comment, idx) => (
          <Box key={comment.id}>
            <ListItem alignItems="flex-start" sx={{ px: 1, py: 1.5 }}>
              <Avatar
                src={comment.profiles?.profile_image_url}
                sx={{ width: 32, height: 32, mr: 1.5, mt: 0.5 }}
              />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="caption" fontWeight={700} sx={{ mr: 1 }}>
                      {comment.profiles?.nickname}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDistanceToNow(comment.created_at)}
                    </Typography>
                  </Box>
                  {user?.id === comment.user_id && (
                    <Box>
                      <IconButton size="small" onClick={() => { setEditId(comment.id); setEditText(comment.content); }}>
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(comment.id)}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                {editId === comment.id ? (
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <TextField
                      size="small" fullWidth value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <Button size="small" variant="contained" onClick={() => handleEdit(comment.id)}>저장</Button>
                    <Button size="small" onClick={() => setEditId(null)}>취소</Button>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>{comment.content}</Typography>
                )}
              </Box>
            </ListItem>
            {idx < comments.length - 1 && <Divider variant="inset" component="li" />}
          </Box>
        ))}
      </List>

      {/* 댓글 입력 */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1, alignItems: 'center' }}>
        <Avatar src={profile?.profile_image_url} sx={{ width: 32, height: 32 }} />
        <TextField
          placeholder="댓글을 입력하세요..."
          size="small"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          sx={{ bgcolor: 'background.default', borderRadius: 2 }}
        />
        <IconButton color="primary" onClick={handleSubmit} disabled={loading || !text.trim()}>
          {loading ? <CircularProgress size={20} /> : <SendIcon />}
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default CommentModal;
