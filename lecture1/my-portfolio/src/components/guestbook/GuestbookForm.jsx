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
      setError('데이터를 등록하지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" sx={{ color: 'text.primary', mb: 1 }}>방명록 남기기</Typography>

      <TextField
        name="author_name"
        label="이름"
        helperText="비워두면 익명으로 등록됩니다"
        value={form.author_name}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        name="message"
        label="메시지"
        helperText={error || '포트폴리오를 보고 느낀 점을 자유롭게 남겨주세요'}
        error={Boolean(error)}
        value={form.message}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        required
      />

      {/* 이모지 선택 */}
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.75, display: 'block' }}>
          이모지 선택
        </Typography>
        <ToggleButtonGroup value={form.emoji} exclusive onChange={handleEmojiChange} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          {EMOJI_OPTIONS.map((emoji) => (
            <ToggleButton
              key={emoji}
              value={emoji}
              aria-label={`${emoji} 이모지 선택`}
              sx={(theme) => ({
                border: `1px solid ${theme.palette.divider} !important`,
                borderRadius: '8px !important',
                minWidth: 44,
                height: 44,
                fontSize: '1.2rem',
                lineHeight: 1,
                bgcolor: form.emoji === emoji ? `${theme.palette.highlight.background} !important` : 'transparent',
                '&:hover': { bgcolor: theme.palette.highlight.background },
              })}
            >
              {emoji}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
          포트폴리오 인상 평가 (선택)
        </Typography>
        <Rating
          value={form.star_rating}
          onChange={(_, val) => setForm(prev => ({ ...prev, star_rating: val ?? 5 }))}
          getLabelText={(value) => `포트폴리오 인상 평가 ${value}점`}
          sx={{ color: 'secondary.main' }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <TextField
          name="affiliation"
          label="소속/직업 (선택)"
          value={form.affiliation}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="keyword"
          label="한마디 키워드 (선택)"
          value={form.keyword}
          onChange={handleChange}
          fullWidth
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          name="email"
          label="이메일 (선택 입력)"
          helperText="비공개가 기본값이며, 등록 후에는 수정할 수 없습니다"
          value={form.email}
          onChange={handleChange}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              name="email_public"
              checked={form.email_public}
              onChange={handleChange}
              disabled={!form.email.trim()}
              sx={{ '&.Mui-checked': { color: 'secondary.main' } }}
            />
          }
          label={<Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>이메일을 공개합니다</Typography>}
          sx={{ flexShrink: 0, alignSelf: 'flex-start', mt: 0.5 }}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        disabled={submitting}
        endIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          fontWeight: 700,
          '&:hover': { bgcolor: 'primary.dark' },
          alignSelf: { xs: 'stretch', sm: 'flex-end' },
          px: 4,
          py: 1.25,
          minHeight: 44,
        }}
      >
        {submitting ? '등록 중...' : '방명록 남기기'}
      </Button>
    </Box>
  );
};

export default GuestbookForm;
