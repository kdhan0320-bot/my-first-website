import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Stack, Chip,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Checkbox, FormControlLabel, IconButton, Divider, Skeleton, Dialog,
  DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import useInterviewNotes from '../hooks/useInterviewNotes';
import { useAuth } from '../context/AuthContext';
import { IMPORTANCE_OPTIONS } from '../constants';

const NoteCard = ({ note, onToggle, onDelete, isGuest }) => (
  <Card sx={{ opacity: note.is_reviewed ? 0.7 : 1 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
            <Chip
              label={note.importance || '보통'}
              size="small"
              sx={{
                color: note.importance === '높음' ? '#EF4444' : note.importance === '보통' ? '#F59E0B' : '#94A3B8',
                fontWeight: 700,
                height: 22,
              }}
              variant="outlined"
            />
            {note.related_project && (
              <Chip label={note.related_project} size="small" sx={{ height: 22 }} />
            )}
            {note.is_reviewed && (
              <Chip label="복습 완료" size="small" color="success" sx={{ height: 22 }} />
            )}
          </Box>
          <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>Q. {note.question}</Typography>
          {note.answer && (
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
              A. {note.answer}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
          <Checkbox
            checked={note.is_reviewed}
            onChange={(e) => onToggle(note.id, e.target.checked)}
            size="small"
            color="success"
            inputProps={{ 'aria-label': '복습 완료' }}
          />
          {!isGuest && (
            <IconButton size="small" onClick={() => onDelete(note.id)} aria-label="삭제" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const InterviewPage = () => {
  const { notes, loading, add, toggleReview, remove } = useInterviewNotes();
  const { isGuest } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '', related_project: '', importance: '보통' });

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.question.trim()) return;
    await add({ ...form, is_reviewed: false });
    setForm({ question: '', answer: '', related_project: '', importance: '보통' });
    setOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    await remove(id);
  };

  const reviewed = notes.filter((n) => n.is_reviewed);
  const unreviewed = notes.filter((n) => !n.is_reviewed);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>면접 메모</Typography>
          <Typography variant="caption" color="text.secondary">
            {notes.length}개 질문 • {reviewed.length}개 복습 완료
          </Typography>
        </Box>
        {!isGuest && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            질문 추가
          </Button>
        )}
      </Box>

      {loading ? (
        <Stack spacing={2}>{[...Array(3)].map((_, i) => <Skeleton key={i} height={120} variant="rounded" />)}</Stack>
      ) : notes.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body2" color="text.secondary">면접 메모가 없습니다</Typography>
          {!isGuest && (
            <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => setOpen(true)}>
              첫 질문 추가
            </Button>
          )}
        </Box>
      ) : (
        <>
          {unreviewed.length > 0 && (
            <>
              <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5 }}>
                미복습 ({unreviewed.length})
              </Typography>
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                {unreviewed.map((n) => (
                  <NoteCard key={n.id} note={n} onToggle={toggleReview} onDelete={handleDelete} isGuest={isGuest} />
                ))}
              </Stack>
            </>
          )}
          {reviewed.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5 }}>
                복습 완료 ({reviewed.length})
              </Typography>
              <Stack spacing={1.5}>
                {reviewed.map((n) => (
                  <NoteCard key={n.id} note={n} onToggle={toggleReview} onDelete={handleDelete} isGuest={isGuest} />
                ))}
              </Stack>
            </>
          )}
        </>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>면접 질문 추가</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="면접 질문 *"
              fullWidth
              value={form.question}
              onChange={handleChange('question')}
              placeholder="예: 자기소개를 해주세요."
              multiline
              rows={2}
            />
            <TextField
              label="예상 답변"
              fullWidth
              value={form.answer}
              onChange={handleChange('answer')}
              multiline
              rows={4}
              placeholder="답변을 미리 작성해보세요."
            />
            <TextField
              label="관련 프로젝트"
              fullWidth
              value={form.related_project}
              onChange={handleChange('related_project')}
              placeholder="예: JobFlow Dashboard"
            />
            <FormControl fullWidth>
              <InputLabel>중요도</InputLabel>
              <Select value={form.importance} label="중요도" onChange={handleChange('importance')}>
                {IMPORTANCE_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>취소</Button>
          <Button variant="contained" onClick={handleSubmit}>저장</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InterviewPage;
