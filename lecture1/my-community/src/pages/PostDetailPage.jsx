import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, TextField, Avatar,
  IconButton, Chip, AppBar, Toolbar, Divider, Skeleton,
  Alert, Collapse,
} from '@mui/material';
import {
  ArrowBack, Favorite, FavoriteBorder, ChatBubble,
  Visibility, AccessTime, Send, Reply,
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
  return `${Math.floor(h / 24)}일 전`;
};

const CommentItem = ({ comment, currentUserId, onReply, onLike, likedCommentIds }) => {
  const [showReply, setShowReply] = useState(false);
  const liked = likedCommentIds.has(comment.id);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1.5, py: 1.5 }}>
        <Avatar sx={{ width: 34, height: 34, fontSize: '0.8rem', bgcolor: 'secondary.dark', flexShrink: 0 }}>
          {comment.profiles?.username?.[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {comment.profiles?.username}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {formatRelativeTime(comment.created_at)}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 0.5, whiteSpace: 'pre-wrap' }}>
            {comment.content}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={() => onLike(comment.id, liked)} sx={{ p: 0.3 }}>
              {liked
                ? <Favorite sx={{ fontSize: 14, color: 'error.main' }} />
                : <FavoriteBorder sx={{ fontSize: 14, color: 'text.disabled' }} />}
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              {comment.comment_likes?.[0]?.count ?? 0}
            </Typography>
            <Button
              size="small"
              startIcon={<Reply sx={{ fontSize: 14 }} />}
              onClick={() => setShowReply(p => !p)}
              sx={{ fontSize: '0.72rem', py: 0, px: 0.5, color: 'text.secondary', minWidth: 0 }}
            >
              답글
            </Button>
          </Box>

          {/* 대댓글 입력 */}
          <Collapse in={showReply}>
            <ReplyInput
              onSubmit={(content) => {
                onReply(comment.id, content);
                setShowReply(false);
              }}
            />
          </Collapse>

          {/* 대댓글 목록 */}
          {comment.replies?.map(reply => (
            <Box key={reply.id} sx={{ display: 'flex', gap: 1.5, mt: 1.5, pl: 1, borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
              <Avatar sx={{ width: 26, height: 26, fontSize: '0.7rem', bgcolor: 'primary.dark', flexShrink: 0 }}>
                {reply.profiles?.username?.[0]?.toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{reply.profiles?.username}</Typography>
                  <Typography variant="caption" color="text.disabled">{formatRelativeTime(reply.created_at)}</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>{reply.content}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                  <IconButton size="small" onClick={() => onLike(reply.id, likedCommentIds.has(reply.id))} sx={{ p: 0.2 }}>
                    {likedCommentIds.has(reply.id)
                      ? <Favorite sx={{ fontSize: 12, color: 'error.main' }} />
                      : <FavoriteBorder sx={{ fontSize: 12, color: 'text.disabled' }} />}
                  </IconButton>
                  <Typography variant="caption" color="text.secondary">
                    {reply.comment_likes?.[0]?.count ?? 0}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Divider />
    </Box>
  );
};

const ReplyInput = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  return (
    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
      <TextField
        size="small"
        placeholder="답글을 입력하세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        multiline
        maxRows={3}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && content.trim()) { e.preventDefault(); onSubmit(content.trim()); setContent(''); } }}
      />
      <IconButton color="primary" onClick={() => { if (content.trim()) { onSubmit(content.trim()); setContent(''); } }}>
        <Send sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
};

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likedCommentIds, setLikedCommentIds] = useState(new Set());
  const [commentInput, setCommentInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPost = useCallback(async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(username)')
      .eq('id', id)
      .single();
    if (data) {
      setPost(data);
      await supabase.rpc('increment_view_count', { p_post_id: Number(id) });
    }
  }, [id]);

  const fetchLikes = useCallback(async () => {
    const { count } = await supabase.from('post_likes').select('*', { count: 'exact' }).eq('post_id', id);
    setLikeCount(count ?? 0);
    if (user) {
      const { data } = await supabase.from('post_likes').select('user_id').eq('post_id', id).eq('user_id', user.id).single();
      setLiked(!!data);
    }
  }, [id, user]);

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(username), comment_likes(count)')
      .eq('post_id', id)
      .is('parent_id', null)
      .order('created_at', { ascending: true });

    const topLevel = data || [];
    const allIds = topLevel.map(c => c.id);

    const { data: replies } = await supabase
      .from('comments')
      .select('*, profiles(username), comment_likes(count)')
      .in('parent_id', allIds.length > 0 ? allIds : [-1])
      .order('created_at', { ascending: true });

    const withReplies = topLevel.map(c => ({
      ...c,
      replies: (replies || []).filter(r => r.parent_id === c.id),
    }));
    setComments(withReplies);

    if (user) {
      const allCommentIds = [...topLevel.map(c => c.id), ...(replies || []).map(r => r.id)];
      if (allCommentIds.length > 0) {
        const { data: myLikes } = await supabase.from('comment_likes').select('comment_id').eq('user_id', user.id).in('comment_id', allCommentIds);
        setLikedCommentIds(new Set((myLikes || []).map(l => l.comment_id)));
      }
    }
  }, [id, user]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchPost(), fetchLikes(), fetchComments()]);
      setLoading(false);
    };
    init();
  }, [fetchPost, fetchLikes, fetchComments]);

  const handlePostLike = async () => {
    if (!user) return;
    if (liked) {
      await supabase.from('post_likes').delete().eq('post_id', id).eq('user_id', user.id);
      setLiked(false);
      setLikeCount(p => p - 1);
    } else {
      await supabase.from('post_likes').insert({ post_id: Number(id), user_id: user.id });
      setLiked(true);
      setLikeCount(p => p + 1);
    }
  };

  const handleCommentLike = async (commentId, isLiked) => {
    if (!user) return;
    if (isLiked) {
      await supabase.from('comment_likes').delete().eq('comment_id', commentId).eq('user_id', user.id);
      setLikedCommentIds(prev => { const next = new Set(prev); next.delete(commentId); return next; });
    } else {
      await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: user.id });
      setLikedCommentIds(prev => new Set([...prev, commentId]));
    }
    fetchComments();
  };

  const handleAddComment = async () => {
    if (!commentInput.trim() || !user) return;
    await supabase.from('comments').insert({ post_id: Number(id), user_id: user.id, content: commentInput.trim() });
    setCommentInput('');
    fetchComments();
  };

  const handleReply = async (parentId, content) => {
    if (!user) return;
    await supabase.from('comments').insert({ post_id: Number(id), user_id: user.id, parent_id: parentId, content });
    fetchComments();
  };

  if (loading) return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 8 }}>
      <Container maxWidth="md"><Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} /></Container>
    </Box>
  );

  if (!post) return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 8 }}>
      <Container maxWidth="md"><Alert severity="error">게시물을 찾을 수 없습니다.</Alert></Container>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>게시물 상세</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* 게시물 본문 */}
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 4, mb: 3, border: '1px solid rgba(255,255,255,0.07)' }}>
          {/* 해시태그 */}
          {post.hashtags?.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {post.hashtags.map(tag => (
                <Chip key={tag} label={`#${tag}`} size="small" sx={{ bgcolor: 'rgba(0,180,216,0.12)', color: 'primary.light' }} />
              ))}
            </Box>
          )}

          <Typography variant="h2" sx={{ mb: 2 }}>{post.title}</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.dark' }}>
                {post.profiles?.username?.[0]?.toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{post.profiles?.username}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime sx={{ fontSize: 12, color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.disabled">{formatRelativeTime(post.created_at)}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Visibility sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.secondary">{post.view_count}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ChatBubble sx={{ fontSize: 14, color: 'primary.main' }} />
                <Typography variant="caption" color="text.secondary">{comments.length}</Typography>
              </Box>
            </Box>
          </Box>

          {post.image_url && (
            <Box
              component="img"
              src={post.image_url}
              alt="게시물 이미지"
              sx={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 2, mb: 3 }}
            />
          )}

          <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap', mb: 3 }}>
            {post.content}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* 좋아요 버튼 */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant={liked ? 'contained' : 'outlined'}
              color="error"
              startIcon={liked ? <Favorite /> : <FavoriteBorder />}
              onClick={handlePostLike}
              sx={{ px: 4, py: 1, borderRadius: 5 }}
            >
              좋아요 {likeCount}
            </Button>
          </Box>
        </Box>

        {/* 댓글 섹션 */}
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3, border: '1px solid rgba(255,255,255,0.07)' }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            댓글 {comments.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0)}개
          </Typography>

          {/* 댓글 입력 */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.dark', flexShrink: 0 }}>
              {user?.email?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
              <TextField
                placeholder="댓글을 입력하세요..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                fullWidth
                multiline
                maxRows={4}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
              />
              <IconButton color="primary" onClick={handleAddComment} disabled={!commentInput.trim()}>
                <Send />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* 댓글 목록 */}
          {comments.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <ChatBubble sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">첫 댓글을 남겨보세요!</Typography>
            </Box>
          ) : (
            comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
                onReply={handleReply}
                onLike={handleCommentLike}
                likedCommentIds={likedCommentIds}
              />
            ))
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default PostDetailPage;
