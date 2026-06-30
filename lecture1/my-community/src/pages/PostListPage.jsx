import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Card, CardActionArea,
  CardContent, Grid, Chip, Avatar, Skeleton, AppBar, Toolbar,
  IconButton, Tooltip, Divider, InputAdornment, TextField, Alert, Link,
} from '@mui/material';
import {
  Add, Logout, Favorite, ChatBubble, Visibility,
  AccessTime, Search, Login,
} from '@mui/icons-material';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { SAMPLE_POSTS, CATEGORIES } from '../constants/samplePosts';

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
  const { user, profile, signOut, isGuest, exitGuestMode } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('전체');

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
      setPosts(normalized.length > 0 ? normalized : SAMPLE_POSTS);
    } catch {
      setPosts(SAMPLE_POSTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const filtered = useMemo(() => {
    let list = posts;
    if (activeCategory !== '전체') {
      list = list.filter(p => p.category === activeCategory || p.hashtags?.includes(activeCategory));
    }
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.content || '').toLowerCase().includes(q) ||
      (p.profiles?.username || '').toLowerCase().includes(q) ||
      p.hashtags?.some(t => t.toLowerCase().includes(q))
    );
  }, [posts, query, activeCategory]);

  const handleLogout = async () => {
    if (isGuest) {
      exitGuestMode();
    } else {
      await signOut();
    }
    navigate('/login');
  };

  const handleWriteClick = () => {
    if (user || isGuest) {
      navigate('/write');
    } else {
      navigate('/login');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, minWidth: 0 }}>
            <Box sx={{
              width: 32, height: 32, borderRadius: '8px', flexShrink: 0,
              bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ForumOutlinedIcon sx={{ color: '#fff', fontSize: '1.1rem' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.3px', display: { xs: 'none', sm: 'block' } }}>
              my-community
            </Typography>
            {isGuest && (
              <Chip label="게스트 모드" size="small" sx={{ bgcolor: 'rgba(37,99,235,0.12)', color: 'primary.main', fontSize: '0.68rem', height: 22 }} />
            )}
          </Box>
          <Tooltip title="포트폴리오로 돌아가기">
            <Button
              component="a"
              href="https://kdhan0320-bot.github.io/my-first-website/my-portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ fontSize: '0.72rem', color: 'text.secondary', display: { xs: 'none', md: 'inline-flex' } }}
              aria-label="포트폴리오로 돌아가기"
            >
              ← Portfolio
            </Button>
          </Tooltip>
          {(user || isGuest) ? (
            <Tooltip title={isGuest ? '로그인 페이지로' : '로그아웃'}>
              <IconButton color="inherit" onClick={handleLogout} aria-label={isGuest ? '로그인 페이지로 이동' : '로그아웃'}>
                {isGuest ? <Login fontSize="small" /> : <Logout fontSize="small" />}
              </IconButton>
            </Tooltip>
          ) : (
            <Button size="small" variant="outlined" onClick={() => navigate('/login')} sx={{ fontSize: '0.78rem', minHeight: 32 }}>
              로그인
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 헤더 영역 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h2" sx={{ mb: 0.5 }}>게시판</Typography>
              <Typography variant="body2" color="text.secondary">
                포트폴리오 피드백, UX/UI 질문, 취업 준비 정보를 자유롭게 나눠보세요.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleWriteClick}
              aria-label="새 게시글 작성"
              sx={{ px: 3, py: 1.2, minHeight: 44 }}
            >
              글쓰기
            </Button>
          </Box>
        </Box>

        {/* 검색 */}
        <TextField
          fullWidth
          placeholder="제목, 내용, 작성자, 태그로 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          inputProps={{ 'aria-label': '게시글 검색' }}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper', borderRadius: 2, fontSize: '0.95rem' } }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search sx={{ color: 'text.disabled', fontSize: 22 }} /></InputAdornment>,
          }}
        />

        {/* 카테고리 필터 */}
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 3 }}>
          {CATEGORIES.map(cat => (
            <Chip
              key={cat}
              label={cat}
              clickable
              onClick={() => setActiveCategory(cat)}
              variant={activeCategory === cat ? 'filled' : 'outlined'}
              sx={{
                fontWeight: activeCategory === cat ? 700 : 400,
                bgcolor: activeCategory === cat ? 'primary.main' : 'transparent',
                color: activeCategory === cat ? '#fff' : 'text.secondary',
                borderColor: activeCategory === cat ? 'primary.main' : 'divider',
                '&:hover': { bgcolor: activeCategory === cat ? 'primary.dark' : 'action.hover' },
              }}
            />
          ))}
        </Box>

        {(query || activeCategory !== '전체') && !loading && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {filtered.length}개의 게시글
            {query && ` — "${query}" 검색 결과`}
          </Typography>
        )}

        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <ForumOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary" sx={{ mb: 0.5 }}>검색 결과가 없습니다.</Typography>
            <Typography variant="body2" color="text.disabled">다른 키워드나 카테고리를 선택해보세요.</Typography>
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

        {/* 포트폴리오용 푸터 */}
        <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: 'text.secondary', mb: 0.5 }}>
            AI-assisted Community Board
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled', lineHeight: 1.6, mb: 1 }}>
            Claude를 활용해 게시판 라우팅, UI 구조, 게시글 목록/상세/작성 흐름 구현을 보조받은 학습 목적의 프론트엔드 프로젝트입니다.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="https://github.com/kdhan0320-bot/my-first-website/tree/main/lecture1/my-community" target="_blank" rel="noopener noreferrer" variant="caption" underline="hover" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main' } }}>
              GitHub →
            </Link>
            <Link href="https://kdhan0320-bot.github.io/my-first-website/my-portfolio/" target="_blank" rel="noopener noreferrer" variant="caption" underline="hover" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main' } }}>
              ← 포트폴리오로 돌아가기
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PostListPage;
