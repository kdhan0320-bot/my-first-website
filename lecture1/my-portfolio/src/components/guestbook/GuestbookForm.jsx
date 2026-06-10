import { useState } from 'react';
import {
  Box, Typography, TextField, Button, ToggleButton, ToggleButtonGroup,
  FormControlLabel, Checkbox, CircularProgress, Rating,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { supabase } from '../../lib/supabase';
import { saveToken } from '../../lib/guestbookTokens';

const EMOJI_OPTIONS = ['😊', '😄', '🎉', '👍', '💪', '🌟', '✨', '🚀', '💡', '🎨', '🌈', '🤝', '💖', '🍀', '🏆'];

const DEFAULT_FORM = {
  author_name: '',
  affiliation: '',
  email: '',
  email_public: false,
  emoji: '😊',
  message: '',
  keyword: '',
  star_rating: 5,
};

const darkFieldSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#333333' },
    '&:hover fieldset': { borderColor: '#666666' },
    '&.Mui-focused fieldset': { borderColor: '#AAAAAA' },
  },
};

const GuestbookForm = ({ onSuccess }) => {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEmojiChange = (_, newEmoji) => {
    if (newEmoji) setForm(prev => ({ ...prev, emoji: newEmoji }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) {
      setError('메시지를 입력해주세요.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        author_name: form.author_name.trim() || '익명',
        message: form.message.trim(),
        affiliation: form.affiliation.trim() || null,
        email: form.email.trim() || null,
        email_public: form.email.trim() ? form.email_public : false,
        emoji: form.emoji,
        keyword: form.keyword.trim() || null,
        star_rating: form.star_rating,
      };
      const { data, error: err } = await supabase
        .from('guestbook')
        .insert(payload)
        .select('id, edit_token')
        .single();
      if (err) throw err;
      saveToken(data.id, data.edit_token);
      setForm(DEFAULT_FORM);
      onSuccess?.();
    } catch {
      setError('등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" sx={{ color: '#FFFFFF', mb: 1 }}>방명록 남기기</Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          name="author_name"
          label="이름 (비워두면 익명)"
          value={form.author_name}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          InputLabelProps={{ style: { color: '#666666' } }}
          InputProps={{ style: { color: '#FFFFFF' } }}
          sx={darkFieldSx}
        />
        <TextField
          name="affiliation"
          label="소속/직업 (선택)"
          value={form.affiliation}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          InputLabelProps={{ style: { color: '#666666' } }}
          InputProps={{ style: { color: '#FFFFFF' } }}
          sx={darkFieldSx}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          name="email"
          label="이메일 (선택, 기본 비공개)"
          value={form.email}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          InputLabelProps={{ style: { color: '#666666' } }}
          InputProps={{ style: { color: '#FFFFFF' } }}
          sx={darkFieldSx}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="email_public"
              checked={form.email_public}
              onChange={handleChange}
              disabled={!form.email.trim()}
              sx={{ color: '#555555', '&.Mui-checked': { color: '#AAAAAA' } }}
            />
          }
          label={<Typography variant="caption" sx={{ color: '#888888', whiteSpace: 'nowrap' }}>공개</Typography>}
          sx={{ flexShrink: 0 }}
        />
      </Box>

      {/* 이모지 선택 */}
      <Box>
        <Typography variant="caption" sx={{ color: '#666666', mb: 0.75, display: 'block' }}>
          이모지 선택
        </Typography>
        <ToggleButtonGroup value={form.emoji} exclusive onChange={handleEmojiChange} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          {EMOJI_OPTIONS.map((emoji) => (
            <ToggleButton
              key={emoji}
              value={emoji}
              sx={{
                border: '1px solid #2A2A2A !important',
                borderRadius: '8px !important',
                minWidth: 40,
                height: 40,
                fontSize: '1.2rem',
                lineHeight: 1,
                bgcolor: form.emoji === emoji ? '#FFFFFF !important' : 'transparent',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08) !important' },
              }}
            >
              {emoji}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <TextField
        name="message"
        label="메시지"
        value={form.message}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        required
        InputLabelProps={{ style: { color: '#666666' } }}
        InputProps={{ style: { color: '#FFFFFF' } }}
        sx={darkFieldSx}
      />

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          name="keyword"
          label="한마디 키워드 (선택)"
          value={form.keyword}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          InputLabelProps={{ style: { color: '#666666' } }}
          InputProps={{ style: { color: '#FFFFFF' } }}
          sx={darkFieldSx}
        />
        <Box sx={{ flexShrink: 0 }}>
          <Typography variant="caption" sx={{ color: '#666666', display: 'block', mb: 0.5 }}>별점</Typography>
          <Rating
            value={form.star_rating}
            onChange={(_, val) => setForm(prev => ({ ...prev, star_rating: val ?? 5 }))}
            sx={{ color: '#FFD700', '& .MuiRating-iconEmpty': { color: '#444444' } }}
          />
        </Box>
      </Box>

      {error && (
        <Typography variant="caption" sx={{ color: '#ff6b6b' }}>{error}</Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        disabled={submitting}
        endIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
        sx={{
          bgcolor: '#FFFFFF',
          color: '#111111',
          fontWeight: 700,
          '&:hover': { bgcolor: '#EEEEEE' },
          '&.Mui-disabled': { bgcolor: '#333333', color: '#666666' },
          alignSelf: 'flex-end',
          px: 4,
          py: 1.25,
        }}
      >
        {submitting ? '등록 중...' : '방명록 남기기'}
      </Button>
    </Box>
  );
};

export default GuestbookForm;
