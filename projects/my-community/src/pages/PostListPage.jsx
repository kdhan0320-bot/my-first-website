import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Card, CardActionArea,
  CardContent, Grid, Chip, Avatar, Skeleton,
  Divider, InputAdornment, TextField, Stack,
  Select, MenuItem, FormControl,
} from '@mui/material';
import {
  Add, Favorite, ChatBubble, Visibility,
  AccessTime, Search, GitHub, ArrowOutward,
} from '@mui/icons-material';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { SAMPLE_POSTS, CATEGORIES, getCategoryLabel, getStatusBadge } from '../constants/samplePosts';
import { getCategoryTheme } from '../constants/categoryTheme';
import Header from '../components/Header';
import CategoryThumbnail from '../components/CategoryThumbnail';

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
    transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
    '&:hover': { transform: 'translateY(-4px)', boxShadow: 8, borderColor: 'primary.main' },
  }}>
    <CardActionArea onClick={onClick} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <CategoryThumbnail category={category} height={IMG_HEIGHT} />

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          <Chip label={status.label} size="small"
            sx={{ fontSize: '0.68rem', height: 20, bgcolor: `${status.color}1A`, color: status.color, fontWeight: 700 }} />
          {category && (
            <Chip label={category} size="small" variant="outlined"
              sx={{ fontSize: '0.68rem', height: 20, borderColor: 'divider', color: 'text.secondary' }} />
          )}
        </Box>

        <Typography variant="h6" sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
          {post.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.content}
        </Typography>

        {post.hashtags?.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
            {post.hashtags.slice(0, 3).map(tag => (
              <Chip key={tag} label={`#${tag}`} size="small"
                sx={{ fontSize: '0.68rem', height: 20, bgcolor: 'secondary.light', color: 'primary.dark' }} />
            ))}
            {post.hashtags.length > 3 && (
              <Chip label={`+${post.hashtags.length - 3}`} size="small"
                sx={{ fontSize: '0.68rem', height: 20, bgcolor: 'action.hover', color: 'text.disabled' }} />
            )}
          </Box>
        )}

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

  // Hero 미니 프리뷰: 서로 다른 카테고리 최대 3개를 골라 비클릭형으로 보여준다
  const heroPreview = useMemo(() => {
    const seen = new Set();
    const picked = [];
    for (const p of posts) {
      const cat = getCategoryLabel(p) || '기타';
      if (seen.has(cat)) continue;
      seen.add(cat);
      picked.push(p);
      if (picked.length === 3) break;
    }
    return picked;
  }, [posts]);

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
          background: 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%)',
          border: '1px solid', borderColor: 'divider',
        }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 4 }, alignItems: { md: 'center' } }}>
            <Box sx={{ flex: { md: '1 1 56%' }, minWidth: 0 }}>
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
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                      게스트로 둘러보기 / 테스트 계정으로 체험하기
                    </Box>
                    <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                      데모 체험하기
                    </Box>
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
                  <Box key={label} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h3">{value}개</Typography>
                    <Typography variant="caption" color="text.secondary">{label}</Typography>
                  </Box>
                ))}
              </Box>
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
                데모 데이터 기준 통계입니다.
              </Typography>
            </Box>

            {heroPreview.length > 0 && (
              <Box sx={{ flex: { md: '1 1 44%' }, width: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {heroPreview.map((p, i) => {
                  const previewCategory = getCategoryLabel(p);
                  const previewStatus = getStatusBadge(p);
                  return (
                    <Box
                      key={p.id}
                      sx={{
                        bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
                        borderRadius: 2, p: 1.5, boxShadow: '0 1px 6px rgba(15,23,42,0.05)',
                        cursor: 'default',
                        ml: { md: i % 2 === 1 ? 3 : 0 },
                        maxWidth: { md: '88%' },
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                        <Chip label={previewStatus.label} size="small"
                          sx={{ height: 18, fontSize: '0.62rem', bgcolor: `${previewStatus.color}1A`, color: previewStatus.color, fontWeight: 700 }} />
                        {previewCategory && (
                          <Chip label={previewCategory} size="small" variant="outlined"
                            sx={{ height: 18, fontSize: '0.62rem', borderColor: 'divider', color: 'text.secondary' }} />
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.title}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        </Box>

        {/* 검색 */}
        <TextField
          fullWidth
          placeholder="제목, 내용, 태그로 피드백 글 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper', borderRadius: 2, fontSize: '0.95rem' } }}
          slotProps={{
            htmlInput: { 'aria-label': '게시글 검색' },
            input: {
              startAdornment: <InputAdornment position="start"><Search sx={{ color: 'text.disabled', fontSize: 22 }} /></InputAdornment>,
            },
          }}
        />

        {/* 카테고리 필터 + 정렬 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => {
              const CatIcon = getCategoryTheme(cat).icon;
              const active = activeCategory === cat;
              return (
                <Chip
                  key={cat}
                  label={cat}
                  icon={<CatIcon fontSize="small" />}
                  clickable
                  onClick={() => setActiveCategory(cat)}
                  variant={active ? 'filled' : 'outlined'}
                  sx={{
                    fontWeight: active ? 700 : 400,
                    bgcolor: active ? 'primary.main' : 'transparent',
                    color: active ? '#fff' : 'text.secondary',
                    borderColor: active ? 'primary.main' : 'divider',
                    '& .MuiChip-icon': { color: active ? '#fff' : 'text.secondary' },
                    '&:hover': { bgcolor: active ? 'primary.dark' : 'action.hover' },
                  }}
                />
              );
            })}
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

        {/* Project Info */}
        <Box sx={{
          mt: 6, p: { xs: 3, sm: 4 }, borderRadius: 3,
          bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
        }}>
          <Typography variant="h4" sx={{ mb: 1 }}>Project Info</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.7 }}>
            이 프로젝트는 React, MUI, Supabase로 구현한 포트폴리오 피드백 커뮤니티입니다. 카테고리 필터, 검색, 정렬, 댓글, 좋아요, 조회수 기능을 통해 피드백 중심의 게시판 흐름을 설계했습니다.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<GitHub />}
              component="a"
              href="https://github.com/kdhan0320-bot/dohan-portfolio/tree/main/projects/my-community"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              GitHub 보기
            </Button>
            <Button
              variant="contained"
              startIcon={<ArrowOutward />}
              component="a"
              href="https://kdhan0320-bot.github.io/dohan-portfolio/my-portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              포트폴리오로 돌아가기
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default PostListPage;
