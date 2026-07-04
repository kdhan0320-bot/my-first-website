import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Card, CardActionArea,
  CardContent, Grid, Chip, Avatar, Skeleton,
  Divider, InputAdornment, TextField, Alert, Link,
  Select, MenuItem, FormControl,
} from '@mui/material';
import {
  Add, Favorite, ChatBubble, Visibility,
  AccessTime, Search,
} from '@mui/icons-material';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { SAMPLE_POSTS, CATEGORIES, getCategoryLabel, getStatusBadge } from '../constants/samplePosts';
import Header from '../components/Header';

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

const PostCard = ({ post, onClick }) => {
  const category = getCategoryLabel(post);
  const status = getStatusBadge(post);

  return (
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {category && (
            <Chip label={category} size="small" variant="outlined"
              sx={{ fontSize: '0.68rem', height: 20, borderColor: 'divider', color: 'text.secondary' }} />
          )}
          <Chip label={status.label} size="small"
            sx={{ fontSize: '0.68rem', height: 20, bgcolor: `${status.color}1A`, color: status.color, fontWeight: 700 }} />
        </Box>

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
};

const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'likes', label: '인기순' },
  { value: 'comments', label: '댓글 많은 순' },
  { value: 'views', label: '조회수 순' },
];

const PostListPage = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('전체');
  const [sortBy, setSortBy] = useState('latest');

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
    if (q) {
      list = list.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.content || '').toLowerCase().includes(q) ||
        (p.profiles?.username || '').toLowerCase().includes(q) ||
        p.hashtags?.some(t => t.toLowerCase().includes(q))
      );
    }
    const sorted = [...list];
    if (sortBy === 'likes') sorted.sort((a, b) => (b.like_count ?? 0) - (a.like_count ?? 0));
    else if (sortBy === 'comments') sorted.sort((a, b) => (b.comment_count ?? 0) - (a.comment_count ?? 0));
    else if (sortBy === 'views') sorted.sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0));
    else sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return sorted;
  }, [posts, query, activeCategory, sortBy]);

  const stats = useMemo(() => ({
    pending: posts.filter(p => getStatusBadge(p).label === '피드백 요청중').length,
    answered: posts.filter(p => getStatusBadge(p).label === '답변 완료').length,
    job: posts.filter(p => getCategoryLabel(p) === '취업 준비').length,
    ai: posts.filter(p => getCategoryLabel(p) === 'AI Coding').length,
  }), [posts]);

  const handleWriteClick = () => {
    if (user || isGuest) {
      navigate('/write');
    } else {
      navigate('/login');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero 영역 */}
        <Box sx={{
          mb: 4, p: { xs: 3, sm: 4 }, borderRadius: 3,
          bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
        }}>
          <Typography variant="h1" sx={{ mb: 1 }}>Portfolio Feedback Hub</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5, maxWidth: 560 }}>
            포트폴리오를 공유하고, UX/UI·취업 관점의 피드백을 주고받는 커뮤니티입니다.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleWriteClick}
              aria-label="새 게시글 작성"
              sx={{ px: 3, py: 1.2, minHeight: 44 }}
            >
              피드백 요청하기
            </Button>
            {!user && !isGuest && (
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{ px: 3, py: 1.2, minHeight: 44 }}
              >
                게스트로 둘러보기 / 테스트 계정으로 체험하기
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1.5 }}>
            {[
              { label: '피드백 요청', value: stats.pending },
              { label: '답변 완료', value: stats.answered },
              { label: '취업 준비 글', value: stats.job },
              { label: 'AI 활용 질문', value: stats.ai },
            ].map(({ label, value }) => (
              <Box key={label} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h3">{value}개</Typography>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
              </Box>
            ))}
          </Box>
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
            데모 데이터 기준 통계입니다.
          </Typography>
        </Box>

        {/* 검색 */}
        <TextField
          fullWidth
          placeholder="제목, 내용, 태그로 피드백 글 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          inputProps={{ 'aria-label': '게시글 검색' }}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper', borderRadius: 2, fontSize: '0.95rem' } }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search sx={{ color: 'text.disabled', fontSize: 22 }} /></InputAdornment>,
          }}
        />

        {/* 카테고리 필터 + 정렬 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
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
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              inputProps={{ 'aria-label': '정렬 기준' }}
              sx={{ bgcolor: 'background.paper' }}
            >
              {SORT_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
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
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
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
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                <PostCard post={post} onClick={() => navigate(`/posts/${post.id}`)} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* 포트폴리오용 푸터 */}
        <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: 'text.secondary', mb: 0.5 }}>
            Portfolio Feedback Hub
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled', lineHeight: 1.6, mb: 1 }}>
            이 프로젝트는 React, MUI, Supabase로 구현한 포트폴리오 피드백 커뮤니티입니다. Claude를 활용해 라우팅, UI 구조, 게시글 흐름 구현을 보조받은 학습 목적의 데모 프로젝트입니다.
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
