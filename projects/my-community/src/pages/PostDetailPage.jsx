import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, TextField, Avatar,
  IconButton, Chip, Divider, Skeleton,
  Alert, Collapse, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Snackbar,
} from '@mui/material';
import {
  Favorite, FavoriteBorder, ChatBubble,
  AccessTime, Send, Reply,
  Edit, Delete, Check, Close,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { SAMPLE_POSTS, SAMPLE_COMMENTS, getCategoryLabel, getStatusBadge } from '../constants/samplePosts';
import SubPageHeader from '../components/SubPageHeader';

const formatRelativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return '방금 전';
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
};

// ── 댓글/대댓글 인라인 수정 버튼 ──
const EditDeleteButtons = ({ onEdit, onDelete, size = 'small' }) => (
  <Box sx={{ display: 'flex', gap: 0.2 }}>
    <IconButton size={size} onClick={onEdit} sx={{ p: 0.3, color: 'text.disabled', '&:hover': { color: 'primary.main' } }} aria-label="수정">
      <Edit sx={{ fontSize: size === 'small' ? 13 : 11 }} />
    </IconButton>
    <IconButton size={size} onClick={onDelete} sx={{ p: 0.3, color: 'text.disabled', '&:hover': { color: 'error.main' } }} aria-label="삭제">
      <Delete sx={{ fontSize: size === 'small' ? 13 : 11 }} />
    </IconButton>
  </Box>
);

// ── 인라인 편집 폼 ──
const InlineEditField = ({ value, onSave, onCancel }) => {
  const [text, setText] = useState(value);
  return (
    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
      <TextField
        size="small"
        value={text}
        onChange={(e) => setText(e.target.value)}
        fullWidth
        multiline
        maxRows={4}
        autoFocus
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && text.trim()) { e.preventDefault(); onSave(text.trim()); } }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
        <IconButton size="small" color="primary" onClick={() => text.trim() && onSave(text.trim())} sx={{ p: 0.4 }} aria-label="저장">
          <Check sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton size="small" onClick={onCancel} sx={{ p: 0.4 }} aria-label="취소">
          <Close sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

// ── 댓글 아이템 ──
const CommentItem = ({ comment, currentUserId, onReply, onLike, likedCommentIds, onDeleteComment, onEditComment }) => {
  const [showReply, setShowReply] = useState(false);
  const [editing, setEditing] = useState(false);
  const liked = likedCommentIds.has(comment.id);
  const isOwner = comment.user_id === currentUserId;

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1.5, py: 1.5 }}>
        <Avatar sx={{ width: 34, height: 34, fontSize: '0.8rem', bgcolor: 'secondary.dark', flexShrink: 0 }}>
          {comment.profiles?.username?.[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {comment.profiles?.username}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {formatRelativeTime(comment.created_at)}
              </Typography>
            </Box>
            {isOwner && !editing && (
              <EditDeleteButtons
                onEdit={() => setEditing(true)}
                onDelete={() => onDeleteComment(comment.id)}
              />
            )}
          </Box>

          {editing ? (
            <InlineEditField
              value={comment.content}
              onSave={(text) => { onEditComment(comment.id, text); setEditing(false); }}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <Typography variant="body2" sx={{ mb: 0.5, whiteSpace: 'pre-wrap' }}>
              {comment.content}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={() => onLike(comment.id, liked)} sx={{ p: 0.3 }}>
              {liked
                ? <Favorite sx={{ fontSize: 14, color: 'error.main' }} />
                : <FavoriteBorder sx={{ fontSize: 14, color: 'text.disabled' }} />}
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              {comment.comment_likes?.length ?? 0}
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

          <Collapse in={showReply}>
            <ReplyInput
              onSubmit={(content) => { onReply(comment.id, content); setShowReply(false); }}
            />
          </Collapse>

          {/* 대댓글 목록 */}
          {comment.replies?.map(reply => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              currentUserId={currentUserId}
              onLike={onLike}
              likedCommentIds={likedCommentIds}
              onDeleteComment={onDeleteComment}
              onEditComment={onEditComment}
            />
          ))}
        </Box>
      </Box>
      <Divider />
    </Box>
  );
};

// ── 대댓글 아이템 ──
const ReplyItem = ({ reply, currentUserId, onLike, likedCommentIds, onDeleteComment, onEditComment }) => {
  const [editing, setEditing] = useState(false);
  const isOwner = reply.user_id === currentUserId;

  return (
    <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5, pl: 1, borderLeft: '2px solid', borderColor: 'divider' }}>
      <Avatar sx={{ width: 26, height: 26, fontSize: '0.7rem', bgcolor: 'primary.dark', flexShrink: 0 }}>
        {reply.profiles?.username?.[0]?.toUpperCase()}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>{reply.profiles?.username}</Typography>
            <Typography variant="caption" color="text.disabled">{formatRelativeTime(reply.created_at)}</Typography>
          </Box>
          {isOwner && !editing && (
            <EditDeleteButtons
              onEdit={() => setEditing(true)}
              onDelete={() => onDeleteComment(reply.id)}
              size="small"
            />
          )}
        </Box>

        {editing ? (
          <InlineEditField
            value={reply.content}
            onSave={(text) => { onEditComment(reply.id, text); setEditing(false); }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <Typography variant="body2" sx={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
            {reply.content}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
          <IconButton size="small" onClick={() => onLike(reply.id, likedCommentIds.has(reply.id))} sx={{ p: 0.2 }}>
            {likedCommentIds.has(reply.id)
              ? <Favorite sx={{ fontSize: 12, color: 'error.main' }} />
              : <FavoriteBorder sx={{ fontSize: 12, color: 'text.disabled' }} />}
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            {reply.comment_likes?.length ?? 0}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// ── 대댓글 입력 ──
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
      <IconButton color="primary" onClick={() => { if (content.trim()) { onSubmit(content.trim()); setContent(''); } }} aria-label="답글 전송">
        <Send sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
};

// ── 삭제 확인 다이얼로그 ──
const ConfirmDialog = ({ open, title, description, onConfirm, onClose }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{description}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>취소</Button>
      <Button onClick={onConfirm} color="error" variant="contained">삭제</Button>
    </DialogActions>
  </Dialog>
);

// ── 메인 페이지 ──
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
  const [deletePostDialog, setDeletePostDialog] = useState(false);
  const [guestNotice, setGuestNotice] = useState(false);

  const fetchPost = useCallback(async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles!posts_user_id_fkey(username)')
      .eq('id', id)
      .single();
    if (data) {
      setPost(data);
    }
  }, [id]);

  const fetchLikes = useCallback(async () => {
    const { data: likeRows } = await supabase.from('post_likes').select('user_id').eq('post_id', id);
    setLikeCount(likeRows?.length ?? 0);
    if (user) setLiked(likeRows?.some(r => r.user_id === user.id) ?? false);
  }, [id, user]);

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles!comments_user_id_fkey(username), comment_likes(user_id)')
      .eq('post_id', id)
      .is('parent_id', null)
      .order('created_at', { ascending: true });

    const topLevel = data || [];
    const allIds = topLevel.map(c => c.id);

    const { data: replies } = await supabase
      .from('comments')
      .select('*, profiles!comments_user_id_fkey(username), comment_likes(user_id)')
      .in('parent_id', allIds.length > 0 ? allIds : [-1])
      .order('created_at', { ascending: true });

    setComments(topLevel.map(c => ({
      ...c,
      replies: (replies || []).filter(r => r.parent_id === c.id),
    })));

    if (user) {
      const allIds2 = [...topLevel.map(c => c.id), ...(replies || []).map(r => r.id)];
      if (allIds2.length > 0) {
        const { data: myLikes } = await supabase.from('comment_likes').select('comment_id').eq('user_id', user.id).in('comment_id', allIds2);
        setLikedCommentIds(new Set((myLikes || []).map(l => l.comment_id)));
      }
    }
  }, [id, user]);

  useEffect(() => {
    if (String(id).startsWith('sample')) {
      const samplePost = SAMPLE_POSTS.find(p => p.id === id);
      if (samplePost) {
        setPost(samplePost);
        setLikeCount(samplePost.like_count);
        setComments(SAMPLE_COMMENTS[id] || []);
      }
      setLoading(false);
      return;
    }
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchPost(), fetchLikes(), fetchComments()]);
      setLoading(false);
    };
    init();
  }, [fetchPost, fetchLikes, fetchComments, id]);

  // 게시물 삭제
  const handleDeletePost = async () => {
    await supabase.from('posts').delete().eq('id', id);
    navigate('/');
  };

  // 게시물 좋아요
  const handlePostLike = async () => {
    if (!user) { setGuestNotice(true); return; }
    if (liked) {
      await supabase.from('post_likes').delete().eq('post_id', id).eq('user_id', user.id);
      setLiked(false); setLikeCount(p => p - 1);
    } else {
      await supabase.from('post_likes').insert({ post_id: Number(id), user_id: user.id });
      setLiked(true); setLikeCount(p => p + 1);
    }
  };

  // 댓글 좋아요
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

  // 댓글 추가
  const handleAddComment = async () => {
    if (!commentInput.trim() || !user) return;
    await supabase.from('comments').insert({ post_id: Number(id), user_id: user.id, content: commentInput.trim() });
    setCommentInput('');
    fetchComments();
  };

  // 대댓글 추가
  const handleReply = async (parentId, content) => {
    if (!user) return;
    await supabase.from('comments').insert({ post_id: Number(id), user_id: user.id, parent_id: parentId, content });
    fetchComments();
  };

  // 댓글/대댓글 삭제
  const handleDeleteComment = async (commentId) => {
    await supabase.from('comments').delete().eq('id', commentId);
    fetchComments();
  };

  // 댓글/대댓글 수정
  const handleEditComment = async (commentId, content) => {
    await supabase.from('comments').update({ content }).eq('id', commentId);
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

  const isPostOwner = user?.id === post.user_id;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <SubPageHeader
        title="← 목록으로"
        rightActions={isPostOwner && (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              size="small"
              startIcon={<Edit sx={{ fontSize: 15 }} />}
              onClick={() => navigate(`/posts/${id}/edit`)}
              sx={{ color: 'inherit', fontSize: '0.8rem' }}
            >
              수정
            </Button>
            <Button
              size="small"
              startIcon={<Delete sx={{ fontSize: 15 }} />}
              onClick={() => setDeletePostDialog(true)}
              sx={{ color: 'error.light', fontSize: '0.8rem' }}
            >
              삭제
            </Button>
          </Box>
        )}
      />

      <Snackbar
        open={guestNotice}
        autoHideDuration={2500}
        onClose={() => setGuestNotice(false)}
        message="좋아요는 로그인 후 이용할 수 있어요"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {/* 게시물 삭제 확인 */}
      <ConfirmDialog
        open={deletePostDialog}
        title="게시물 삭제"
        description="이 게시물을 삭제하면 댓글, 좋아요 데이터도 모두 사라져요. 정말 삭제할까요?"
        onConfirm={handleDeletePost}
        onClose={() => setDeletePostDialog(false)}
      />

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* 게시물 본문 */}
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 4, mb: 3, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
            {getCategoryLabel(post) && (
              <Chip label={getCategoryLabel(post)} size="small" variant="outlined"
                sx={{ fontSize: '0.7rem', borderColor: 'divider', color: 'text.secondary' }} />
            )}
            {(() => {
              const status = getStatusBadge({
                ...post,
                comment_count: comments.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0),
              });
              return (
                <Chip label={status.label} size="small"
                  sx={{ fontSize: '0.7rem', bgcolor: `${status.color}1A`, color: status.color, fontWeight: 700 }} />
              );
            })()}
          </Box>

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
                <ChatBubble sx={{ fontSize: 14, color: 'primary.main' }} />
                <Typography variant="caption" color="text.secondary">
                  {comments.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0)}
                </Typography>
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
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            댓글 {comments.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0)}개
          </Typography>

          {!user ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              댓글을 작성하려면 로그인이 필요합니다.
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', flexShrink: 0 }}>
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
                <IconButton color="primary" onClick={handleAddComment} disabled={!commentInput.trim()} aria-label="댓글 전송">
                  <Send />
                </IconButton>
              </Box>
            </Box>
          )}

          <Divider sx={{ mb: 1 }} />

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
                onDeleteComment={handleDeleteComment}
                onEditComment={handleEditComment}
              />
            ))
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default PostDetailPage;
