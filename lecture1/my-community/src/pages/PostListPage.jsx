import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Card, CardActionArea,
  CardContent, Grid, Chip, Avatar, Skeleton, AppBar, Toolbar,
  IconButton, Tooltip, Divider, InputAdornment, TextField, Alert,
} from '@mui/material';
import {
  Add, Logout, Favorite, ChatBubble, Visibility,
  AccessTime, Search, Login,
} from '@mui/icons-material';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const IMG_HEIGHT = 180;

const formatRelativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return '방금 전';
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
};

const PostCard = ({ post, onClick }) => (
  <Card sx={{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.15s, box-shadow 0.15s',
    '&:hover': { transform: 'translateY(-3px)', boxShadow: 6 },
  }}>
    <CardActionArea onClick={onClick} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <Box sx={{ width: '100%', height: IMG_HEIGHT, flexShrink: 0, overflow: 'hidden', position: 'relative', bgcolor: 'action.hover' }}>
        {post.image_url ? (
          <Box
            component="img"
            src={post.image_url}
            alt={post.title || '게시물 이미지'}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ForumOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {post.hashtags?.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {post.hashtags.slice(0, 3).map(tag => (
              <Chip key={tag} label={`#${tag}`} size="small"
                sx={{ fontSize: '0.68rem', height: 20, bgcolor: 'secondary.light', color: 'primary.dark' }} />
            ))}
          </Box>
        )}

        <Typography variant="h6" sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
          {post.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.content}
        </Typography>

        <Divider sx={{ mb: 1.5 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
              {post.profiles?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {post.profiles?.username}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <AccessTime sx={{ fontSize: 12, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.disabled">
              {formatRelativeTime(post.created_at)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Favorite sx={{ fontSize: 14, color: 'error.main' }} />
            <Typography variant="caption" color="text.secondary">{post.like_count ?? 0}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ChatBubble sx={{ fontSize: 14, color: 'primary.main' }} />
            <Typography variant="caption" color="text.secondary">{post.comment_count ?? 0}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Visibility sx={{ fontSize: 14, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.secondary">{post.view_count ?? 0}</Typography>
          </Box>
        </Box>
      </CardContent>
    </CardActionArea>
  </Card>
);

const PostListPage = () => {
  const navigate = useNavigate();
  const { profile, signOut, isGuest, exitGuestMode } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select(`*, profiles!posts_user_id_fkey(username), post_likes(user_id), comments(id)`)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const normalized = (data || []).map(p => ({
        ...p,
        like_count: p.post_likes?.length ?? 0,
        comment_count: p.comments?.length ?? 0,
      }));
      setPosts(normalized);
    } catch {
      setError('데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.content || '').toLowerCase().includes(q) ||
      p.hashtags?.some(t => t.toLowerCase().includes(q))
    );
  }, [posts, query]);

  const handleLogout = async () => {
    if (isGuest) {
      exitGuestMode();
    } else {
      await signOut();
    }
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <Box sx={{
              width: 32, height: 32, borderRadius: '8px',
              bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ForumOutlinedIcon sx={{ color: '#fff', fontSize: '1.1rem' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.3px' }}>
              Portfolio Feedback Hub
            </Typography>
          </Box>
          <Tooltip title={isGuest ? '로그인 페이지로' : '로그아웃'}>
            <IconButton
              color="inherit"
              onClick={handleLogout}
              aria-label={isGuest ? '로그인 페이지로 이동' : '로그아웃'}
            >
              {isGuest ? <Login /> : <Logout />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h2" sx={{ mb: 0.5 }}>게시물 목록</Typography>
            <Typography variant="body2" color="text.secondary">
              {isGuest
                ? '게스트 모드입니다. 게시글 작성은 로그인 후 이용 가능합니다.'
                : `${profile?.username}님 환영해요!`}
            </Typography>
          </Box>
          {!isGuest && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/write')}
              sx={{ px: 3, py: 1.2, minHeight: 44 }}
            >
              게시물 추가
            </Button>
          )}
        </Box>

        <TextField
          fullWidth
          placeholder="제목, 내용, 해시태그로 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          sx={{
            mb: 4,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
              borderRadius: 2,
              fontSize: '0.95rem',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.disabled', fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} action={
            <Button size="small" onClick={fetchPosts} color="inherit">다시 시도</Button>
          }>{error}</Alert>
        )}

        {query && !loading && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            &ldquo;{query}&rdquo; 검색 결과 {filtered.length}개
          </Typography>
        )}

        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={380} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <ForumOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">
              {query
                ? `"${query}"에 해당하는 게시물이 없습니다. 다른 키워드로 다시 검색해보세요.`
                : '아직 게시물이 없어요. 첫 번째 포트폴리오 피드백 글을 작성해보세요.'}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filtered.map(post => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <PostCard post={post} onClick={() => navigate(`/posts/${post.id}`)} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default PostListPage;
