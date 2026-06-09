import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Card, CardActionArea,
  CardContent, Grid, Chip, Avatar, Skeleton, AppBar, Toolbar,
  IconButton, Tooltip, Divider,
} from '@mui/material';
import {
  Add, Logout, Favorite, ChatBubble, Visibility,
  SportsEsports, AccessTime,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const formatRelativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return '방금 전';
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  return `${d}일 전`;
};

const PostCard = ({ post, onClick }) => (
  <Card sx={{ height: '100%', transition: 'transform 0.15s, box-shadow 0.15s', '&:hover': { transform: 'translateY(-3px)', boxShadow: 6 } }}>
    <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
      {post.image_url && (
        <Box
          component="img"
          src={post.image_url}
          alt="썸네일"
          sx={{ width: '100%', height: 160, objectFit: 'cover' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      <CardContent>
        {post.hashtags?.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {post.hashtags.slice(0, 3).map(tag => (
              <Chip key={tag} label={`#${tag}`} size="small" sx={{ fontSize: '0.68rem', height: 20, bgcolor: 'rgba(0,180,216,0.12)', color: 'primary.light' }} />
            ))}
          </Box>
        )}

        <Typography variant="h6" sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
          {post.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.content}
        </Typography>

        <Divider sx={{ mb: 1.5 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'secondary.dark' }}>
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
  const { profile, signOut } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('posts')
      .select(`*, profiles(username), post_likes(user_id), comments(id)`)
      .order('created_at', { ascending: false });

    const normalized = (data || []).map(p => ({
      ...p,
      like_count: p.post_likes?.length ?? 0,
      comment_count: p.comments?.length ?? 0,
    }));
    setPosts(normalized);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* 네비게이션 바 */}
      <AppBar position="sticky">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <SportsEsports sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 1.5, fontStyle: 'italic', background: 'linear-gradient(90deg, #00b4d8, #7b2ff7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              GAME HUB
            </Typography>
          </Box>
          <Tooltip title="로그아웃">
            <IconButton color="inherit" onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 헤더 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="h2" sx={{ mb: 0.5 }}>게시물 목록</Typography>
            <Typography variant="body2" color="text.secondary">
              {profile?.username}님 환영해요! 👋
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/write')}
            sx={{ px: 3, py: 1.2 }}
          >
            게시물 추가
          </Button>
        </Box>

        {/* 게시물 그리드 */}
        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <SportsEsports sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">아직 게시물이 없어요. 첫 번째 게시물을 작성해보세요!</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {posts.map(post => (
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
