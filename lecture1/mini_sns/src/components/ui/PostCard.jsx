import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Box, Avatar, Typography, IconButton,
  Chip, Menu, MenuItem, Snackbar, Alert,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../hooks/useAuth';
import { formatDistanceToNow } from '../../utils/timeFormat';
import CommentModal from './CommentModal';

const PostCard = ({ post, onDelete }) => {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();

  const [liked, setLiked] = useState(post.user_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [commentOpen, setCommentOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [guestSnack, setGuestSnack] = useState(false);

  const handleLike = async () => {
    if (isGuest || !user) { setGuestSnack(true); return; }
    if (liked) {
      await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', user.id);
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      await supabase.from('likes').insert({ post_id: post.id, user_id: user.id });
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleDelete = async () => {
    setAnchorEl(null);
    await supabase.from('posts').delete().eq('id', post.id);
    onDelete?.(post.id);
  };

  const isOwner = user?.id === post.user_id;

  return (
    <>
      <Card sx={{ mb: 1.5, borderRadius: 0, boxShadow: 'none', borderBottom: '1px solid', borderColor: 'divider' }}>
        {/* 상단: 프로필 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1.5, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar src={post.profiles?.profile_image_url} sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography variant="body2" fontWeight={700}>{post.profiles?.nickname}</Typography>
              {post.location && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnOutlinedIcon sx={{ fontSize: 12, color: 'text.secondary', mr: 0.3 }} />
                  <Typography variant="caption" color="text.secondary">{post.location}</Typography>
                </Box>
              )}
            </Box>
          </Box>
          {isOwner && (
            <>
              <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="게시물 더보기">
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => { setAnchorEl(null); navigate(`/edit/${post.id}`, { state: { post } }); }}>수정</MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>삭제</MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* 이미지 */}
        <Box
          component="img"
          src={post.image_url}
          alt="게시물 이미지"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${post.id}/480/480`; }}
          sx={{
            width: '100%', aspectRatio: '1 / 1',
            objectFit: 'cover', display: 'block',
          }}
        />

        {/* 하단: 반응 */}
        <CardContent sx={{ px: 2, py: 1, '&:last-child': { pb: 1.5 } }}>
          {/* 좋아요 / 댓글 버튼 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <IconButton size="small" onClick={handleLike} sx={{ p: 0.5 }} aria-label={liked ? '좋아요 취소' : '좋아요'}>
              {liked
                ? <FavoriteIcon sx={{ color: 'error.main', fontSize: 24 }} />
                : <FavoriteBorderIcon sx={{ fontSize: 24 }} />
              }
            </IconButton>
            <Typography variant="body2" fontWeight={600}>{likesCount}</Typography>
            <IconButton size="small" onClick={() => isGuest ? setGuestSnack(true) : setCommentOpen(true)} sx={{ p: 0.5, ml: 0.5 }} aria-label="댓글 보기">
              <ForumOutlinedIcon sx={{ fontSize: 22 }} />
            </IconButton>
            <Typography variant="body2" color="text.secondary">{post.comments_count || 0}</Typography>
          </Box>

          {/* 캡션 */}
          <Box sx={{ mb: 0.5 }}>
            <Typography component="span" variant="body2" fontWeight={700} sx={{ mr: 1 }}>
              {post.profiles?.nickname}
            </Typography>
            <Typography component="span" variant="body2">{post.caption}</Typography>
          </Box>

          {/* 해시태그 */}
          {post.hashtag && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
              {post.hashtag.split(/\s+/).filter(Boolean).map((tag, i) => (
                <Chip
                  key={i}
                  label={tag.startsWith('#') ? tag : `#${tag}`}
                  size="small"
                  sx={{ bgcolor: 'secondary.light', color: 'primary.dark', fontSize: '0.7rem', height: 22 }}
                />
              ))}
            </Box>
          )}

          {/* 최근 댓글 2개 */}
          {post.recent_comments?.slice(0, 2).map((c) => (
            <Box key={c.id} sx={{ display: 'flex', gap: 0.5 }}>
              <Typography variant="caption" fontWeight={700}>{c.profiles?.nickname}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap>{c.content}</Typography>
            </Box>
          ))}

          {/* 시간 */}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            {formatDistanceToNow(post.created_at)}
          </Typography>
        </CardContent>
      </Card>

      <CommentModal open={commentOpen} onClose={() => setCommentOpen(false)} postId={post.id} />

      <Snackbar
        open={guestSnack}
        autoHideDuration={2500}
        onClose={() => setGuestSnack(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 8 }}
      >
        <Alert severity="info" sx={{ width: '100%', borderRadius: 2 }}>
          로그인 후 이용할 수 있어요 🔐
        </Alert>
      </Snackbar>
    </>
  );
};

export default PostCard;
