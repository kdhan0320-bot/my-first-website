import { useState } from 'react';
import {
  Box, Typography, Card, CardContent, IconButton,
  TextField, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Button,
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
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    setConfirmOpen(false);
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
      .update({ message: editMessage.trim() })
      .eq('id', entry.id)
      .eq('edit_token', token);
    if (!error) {
      setEditing(false);
      onUpdated(entry.id, { message: editMessage.trim() });
    }
    setSaving(false);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditMessage(entry.message);
  };

  return (
    <Card
      sx={(theme) => ({
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        height: '100%',
        transition: 'border-color 0.2s',
        '&:hover': { borderColor: theme.palette.primary.main },
      })}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        {/* 헤더: 이모지 + 이름 + 액션 버튼 */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Typography sx={{ fontSize: '1.75rem', lineHeight: 1, flexShrink: 0 }} aria-hidden="true">
              {entry.emoji || '😊'}
            </Typography>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, lineHeight: 1.3 }}>
                {entry.author_name}
              </Typography>
              {entry.affiliation && (
                <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.2 }}>
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
                    aria-label="방명록 편집"
                    onClick={() => setEditing(true)}
                    sx={{ color: 'text.disabled', minWidth: 36, minHeight: 36, '&:hover': { color: 'primary.main' } }}
                  >
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="방명록 삭제"
                    onClick={() => setConfirmOpen(true)}
                    sx={{ color: 'text.disabled', minWidth: 36, minHeight: 36, '&:hover': { color: 'error.main' } }}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    size="small"
                    aria-label="편집 저장"
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ color: 'success.main', minWidth: 36, minHeight: 36 }}
                  >
                    <CheckIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="편집 취소"
                    onClick={handleCancelEdit}
                    sx={{ color: 'text.disabled', minWidth: 36, minHeight: 36 }}
                  >
                    <CloseIcon sx={{ fontSize: 16 }} />
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
            label="메시지"
            fullWidth
            multiline
            rows={2}
            size="small"
            sx={{ mb: 1, flex: 1 }}
          />
        ) : (
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', lineHeight: 1.65, wordBreak: 'break-word', flex: 1, mb: 2 }}
          >
            {entry.message}
          </Typography>
        )}

        {/* 하단: 이메일 + 날짜 */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1 }}>
          <Box>
            {entry.email_public && entry.email && (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                {entry.email}
              </Typography>
            )}
          </Box>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
            {formatDate(entry.created_at)}
          </Typography>
        </Box>
      </CardContent>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>방명록을 삭제하시겠습니까?</DialogTitle>
        <DialogContent>
          <DialogContentText>삭제한 방명록은 다시 복구할 수 없습니다.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>취소</Button>
          <Button onClick={handleDelete} color="error" variant="contained">삭제</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default GuestbookCard;
