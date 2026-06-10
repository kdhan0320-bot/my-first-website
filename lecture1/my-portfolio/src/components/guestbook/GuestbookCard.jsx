import { useState } from 'react';
import {
  Box, Typography, Card, CardContent, IconButton,
  TextField, Rating, Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../../lib/supabase';
import { getToken, removeToken } from '../../lib/guestbookTokens';

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

const GuestbookCard = ({ entry, onDeleted, onUpdated }) => {
  const token = getToken(entry.id);
  const isOwner = Boolean(token);
  const [editing, setEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(entry.message);
  const [editKeyword, setEditKeyword] = useState(entry.keyword || '');
  const [saving, setSaving] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('방명록을 삭제하시겠습니까?')) return;
    const { error } = await supabase
      .from('guestbook')
      .delete()
      .eq('id', entry.id)
      .eq('edit_token', token);
    if (!error) {
      removeToken(entry.id);
      onDeleted(entry.id);
    }
  };

  const handleSave = async () => {
    if (!editMessage.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from('guestbook')
      .update({ message: editMessage.trim(), keyword: editKeyword.trim() || null })
      .eq('id', entry.id)
      .eq('edit_token', token);
    if (!error) {
      setEditing(false);
      onUpdated(entry.id, { message: editMessage.trim(), keyword: editKeyword.trim() || null });
    }
    setSaving(false);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditMessage(entry.message);
    setEditKeyword(entry.keyword || '');
  };

  return (
    <Card sx={{
      bgcolor: '#1A1A1A',
      border: '1px solid #252525',
      borderRadius: 2,
      height: '100%',
      transition: 'border-color 0.2s',
      '&:hover': { borderColor: '#3A3A3A' },
    }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        {/* 헤더: 이모지 + 이름 + 액션 버튼 */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Typography sx={{ fontSize: '1.75rem', lineHeight: 1, flexShrink: 0 }}>
              {entry.emoji || '😊'}
            </Typography>
            <Box>
              <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600, lineHeight: 1.3 }}>
                {entry.author_name}
              </Typography>
              {entry.affiliation && (
                <Typography variant="caption" sx={{ color: '#777777', lineHeight: 1.2 }}>
                  {entry.affiliation}
                </Typography>
              )}
            </Box>
          </Box>

          {isOwner && (
            <Box sx={{ display: 'flex', gap: 0.25, flexShrink: 0 }}>
              {!editing ? (
                <>
                  <IconButton
                    size="small"
                    onClick={() => setEditing(true)}
                    sx={{ color: '#555555', '&:hover': { color: '#AAAAAA' } }}
                  >
                    <EditIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleDelete}
                    sx={{ color: '#555555', '&:hover': { color: '#ff6b6b' } }}
                  >
                    <DeleteIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    size="small"
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ color: '#4caf50', '&:hover': { color: '#81c784' } }}
                  >
                    <CheckIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleCancelEdit}
                    sx={{ color: '#555555', '&:hover': { color: '#AAAAAA' } }}
                  >
                    <CloseIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </>
              )}
            </Box>
          )}
        </Box>

        {/* 메시지 */}
        {editing ? (
          <TextField
            value={editMessage}
            onChange={(e) => setEditMessage(e.target.value)}
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            size="small"
            InputProps={{ style: { color: '#DDDDDD', fontSize: '0.875rem' } }}
            sx={{
              mb: 1,
              flex: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#444444' },
                '&.Mui-focused fieldset': { borderColor: '#AAAAAA' },
              },
            }}
          />
        ) : (
          <Typography
            variant="body2"
            sx={{ color: '#CCCCCC', lineHeight: 1.65, wordBreak: 'break-word', flex: 1, mb: 2 }}
          >
            {entry.message}
          </Typography>
        )}

        {/* 하단: 키워드 + 이메일 + 별점 + 날짜 */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {editing ? (
              <TextField
                value={editKeyword}
                onChange={(e) => setEditKeyword(e.target.value)}
                placeholder="키워드"
                variant="outlined"
                size="small"
                InputProps={{ style: { color: '#DDDDDD', fontSize: '0.75rem' } }}
                sx={{
                  width: 100,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#444444' },
                    '& input': { py: 0.5 },
                  },
                }}
              />
            ) : (
              entry.keyword && (
                <Chip
                  label={entry.keyword}
                  size="small"
                  sx={{
                    bgcolor: '#222222',
                    color: '#999999',
                    fontSize: '0.7rem',
                    height: 20,
                    border: '1px solid #333333',
                  }}
                />
              )
            )}
            {entry.email_public && entry.email && (
              <Typography variant="caption" sx={{ color: '#555555', fontSize: '0.7rem' }}>
                {entry.email}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.25 }}>
            <Rating
              value={entry.star_rating}
              readOnly
              size="small"
              sx={{ color: '#FFD700', '& .MuiRating-iconEmpty': { color: '#333333' } }}
            />
            <Typography variant="caption" sx={{ color: '#555555', fontSize: '0.7rem' }}>
              {formatDate(entry.created_at)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GuestbookCard;
