import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, TextField, Button, Chip,
  AppBar, Toolbar, IconButton, Alert, Paper,
} from '@mui/material';
import { ArrowBack, AddPhotoAlternate, Refresh, Tag } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const PICSUM_URL = 'https://picsum.photos/800/400?random=';

const PostWritePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', content: '', hashtags: [] });
  const [imageUrl, setImageUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRandomImage = () => {
    setImageUrl(`${PICSUM_URL}${Math.floor(Math.random() * 1000)}`);
  };

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().replace(/^#/, '');
      if (tag && !form.hashtags.includes(tag) && form.hashtags.length < 5) {
        setForm(prev => ({ ...prev, hashtags: [...prev.hashtags, tag] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => setForm(prev => ({ ...prev, hashtags: prev.hashtags.filter(t => t !== tag) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.content.trim()) {
      setError('제목과 내용을 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from('posts').insert({
        user_id: user.id,
        title: form.title.trim(),
        content: form.content.trim(),
        image_url: imageUrl || null,
        hashtags: form.hashtags,
      }).select().single();
      if (err) throw err;
      navigate(`/posts/${data.id}`);
    } catch {
      setError('게시물 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>게시물 작성</Typography>
          <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ px: 3 }}>
            {loading ? '등록 중...' : '게시물 등록'}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <TextField
            label="제목"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 3 }}
            inputProps={{ maxLength: 100 }}
          />

          <TextField
            label="내용"
            name="content"
            value={form.content}
            onChange={handleChange}
            fullWidth
            required
            multiline
            rows={10}
            sx={{ mb: 3 }}
          />

          {/* 이미지 영역 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              이미지
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Button
                variant="outlined"
                startIcon={<AddPhotoAlternate />}
                onClick={handleRandomImage}
              >
                랜덤 이미지 추가
              </Button>
              {imageUrl && (
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleRandomImage}
                >
                  다른 이미지
                </Button>
              )}
            </Box>
            {imageUrl && (
              <Box
                component="img"
                src={imageUrl}
                alt="미리보기"
                sx={{ width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}
              />
            )}
          </Box>

          {/* 해시태그 */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              해시태그 (최대 5개, Enter 또는 쉼표로 추가)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {form.hashtags.map(tag => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  onDelete={() => removeTag(tag)}
                  size="small"
                  sx={{ bgcolor: 'rgba(0,180,216,0.15)', color: 'primary.light' }}
                />
              ))}
            </Box>
            <TextField
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="#태그입력"
              size="small"
              disabled={form.hashtags.length >= 5}
              InputProps={{ startAdornment: <Tag sx={{ color: 'text.disabled', mr: 0.5, fontSize: 18 }} /> }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PostWritePage;
