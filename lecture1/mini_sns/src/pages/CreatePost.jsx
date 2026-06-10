import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, IconButton,
  CircularProgress, Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

const getRandomGameImage = () => {
  const seeds = ['game1','game2','game3','controller','pixel','quest','dragon','knight','space','neon'];
  const seed = seeds[Math.floor(Math.random() * seeds.length)];
  return `https://picsum.photos/seed/${seed}${Math.floor(Math.random()*1000)}/480/480`;
};

const CreatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editPost = location.state?.post;
  const { user } = useAuth();

  const [caption, setCaption] = useState(editPost?.caption || '');
  const [hashtag, setHashtag] = useState(editPost?.hashtag || '');
  const [postLocation, setPostLocation] = useState(editPost?.location || '');
  const [imageUrl, setImageUrl] = useState(editPost?.image_url || getRandomGameImage());
  const [imageLoading, setImageLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const refreshImage = () => {
    setImageLoading(true);
    setImageUrl(getRandomGameImage());
    setTimeout(() => setImageLoading(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim()) { setError('게시물 내용을 입력해주세요.'); return; }
    if (!user) { setError('로그인이 필요합니다.'); return; }

    setSubmitting(true);
    setError('');

    try {
      if (editPost) {
        await supabase.from('posts').update({
          caption: caption.trim(),
          hashtag: hashtag.trim(),
          location: postLocation.trim(),
          image_url: imageUrl,
        }).eq('id', editPost.id);
      } else {
        await supabase.from('posts').insert({
          user_id: user.id,
          caption: caption.trim(),
          hashtag: hashtag.trim(),
          location: postLocation.trim(),
          image_url: imageUrl,
        });
      }
      navigate(ROUTES.HOME);
    } catch (err) {
      setError('게시물 저장 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* 헤더 */}
      <Box
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 2, py: 1.5, bgcolor: 'background.paper',
          borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, zIndex: 10,
        }}
      >
        <IconButton onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
        <Typography variant="h4">{editPost ? '게시물 수정' : '새 게시물'}</Typography>
        <Button
          variant="contained" size="small" onClick={handleSubmit}
          disabled={submitting} sx={{ minWidth: 64 }}
        >
          {submitting ? <CircularProgress size={18} color="inherit" /> : editPost ? '수정' : '등록'}
        </Button>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ pb: 4 }}>
        {error && <Alert severity="error" sx={{ m: 2, borderRadius: 2 }}>{error}</Alert>}

        {/* 이미지 미리보기 */}
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={imageUrl}
            alt="게임 이미지"
            onError={(e) => { e.target.src = `https://picsum.photos/seed/game${Date.now()}/480/480`; }}
            sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
          />
          {imageLoading && (
            <Box sx={{
              position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CircularProgress color="inherit" sx={{ color: '#fff' }} />
            </Box>
          )}
          <Button
            startIcon={<RefreshIcon />}
            onClick={refreshImage}
            size="small"
            sx={{
              position: 'absolute', bottom: 12, right: 12,
              bgcolor: 'rgba(0,0,0,0.6)', color: '#fff',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
              borderRadius: 2,
            }}
          >
            이미지 변경
          </Button>
        </Box>

        {/* 입력 폼 */}
        <Box sx={{ px: 2, pt: 2 }}>
          <TextField
            label="게시물 내용 (캡션)"
            multiline
            rows={3}
            fullWidth
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="게임에 대한 리뷰나 정보를 공유해보세요 🎮"
            sx={{ mb: 2 }}
          />
          <TextField
            label="해시태그"
            fullWidth
            value={hashtag}
            onChange={(e) => setHashtag(e.target.value)}
            placeholder="#게임 #리뷰 #추천"
            helperText="띄어쓰기로 구분"
            sx={{ mb: 2 }}
          />
          <TextField
            label="위치"
            fullWidth
            value={postLocation}
            onChange={(e) => setPostLocation(e.target.value)}
            placeholder="서울, 대한민국"
            sx={{ mb: 2 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CreatePost;
