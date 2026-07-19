import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../hooks/useAuth";
import { useDemoData } from "../../context/DemoDataContext";
import { formatDistanceToNow } from "../../utils/timeFormat";
import sampleFallback from "../../assets/samples/sample-fallback.svg";
import CommentModal from "./CommentModal";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const { guestIdentity } = useAuth();
  const { toggleLike, deletePost } = useDemoData();

  const [commentOpen, setCommentOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isOwner = post.user_id === guestIdentity.id;

  const handleLike = () => toggleLike(post.id);

  const handleDelete = () => {
    setAnchorEl(null);
    deletePost(post.id);
  };

  return (
    <>
      <Card
        sx={{
          mx: 2,
          mb: { xs: 1.5, md: 2 },
          borderRadius: "22px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
        }}
      >
        {/* 상단: 프로필 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            pt: 1,
            pb: 0.65,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              src={post.profiles?.profile_image_url}
              sx={{ width: 38, height: 38 }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.6 }}>
                <Typography variant="body2" fontWeight={700}>
                  {post.profiles?.nickname}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ flexShrink: 0 }}
                >
                  · {formatDistanceToNow(post.created_at)}
                </Typography>
              </Box>
              {post.location && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationOnOutlinedIcon
                    sx={{ fontSize: 12, color: "text.secondary", mr: 0.3 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {post.location}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          {isOwner && (
            <>
              <IconButton
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                aria-label="게시물 더보기"
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    navigate(`/edit/${post.id}`, { state: { post } });
                  }}
                >
                  수정
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                  삭제
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* 이미지 */}
        <Box
          component="img"
          src={post.image_url}
          alt={`${post.profiles?.nickname ?? "작성자"}의 게시물 이미지`}
          loading="lazy"
          onClick={() => post.image_url && setImageModalOpen(true)}
          onError={(e) => {
            e.target.src = sampleFallback;
          }}
          sx={{
            width: "100%",
            aspectRatio: "1 / 1",
            objectFit: "cover",
            display: "block",
            cursor: post.image_url ? "pointer" : "default",
          }}
        />

        {/* 하단: 반응 */}
        <CardContent sx={{ px: 2, py: 1, "&:last-child": { pb: 1.4 } }}>
          {/* 좋아요 / 댓글 버튼 */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.4 }}>
            <IconButton
              onClick={handleLike}
              sx={{ p: 1.25, m: -1.25 }}
              aria-label={post.liked ? "좋아요 취소" : "좋아요"}
            >
              {post.liked ? (
                <FavoriteIcon sx={{ color: "error.main", fontSize: 24 }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 24 }} />
              )}
            </IconButton>
            <Typography variant="body2" fontWeight={600}>
              {post.likes_count}
            </Typography>
            <IconButton
              onClick={() => setCommentOpen(true)}
              sx={{ p: 1.4, m: -1.4, ml: 0.1 }}
              aria-label="댓글 보기"
            >
              <ForumOutlinedIcon sx={{ fontSize: 22 }} />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {post.comments.length}
            </Typography>
          </Box>

          {/* 캡션 */}
          <Box sx={{ mb: 0.5 }}>
            <Typography
              component="span"
              variant="body2"
              fontWeight={700}
              sx={{ mr: 1 }}
            >
              {post.profiles?.nickname}
            </Typography>
            <Typography
              component="span"
              variant="body2"
              sx={{ lineHeight: 1.55 }}
            >
              {post.caption}
            </Typography>
          </Box>

          {/* 해시태그 */}
          {post.hashtag && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 0.5 }}>
              {post.hashtag
                .split(/\s+/)
                .filter(Boolean)
                .map((tag, i) => (
                  <Chip
                    key={i}
                    label={tag.startsWith("#") ? tag : `#${tag}`}
                    size="small"
                    sx={{
                      bgcolor: "secondary.main",
                      color: "primary.dark",
                      fontWeight: 500,
                      fontSize: "0.68rem",
                      height: 20,
                    }}
                  />
                ))}
            </Box>
          )}

          {/* 최근 댓글 1개 */}
          {post.comments.slice(-1).map((c) => (
            <Box key={c.id} sx={{ display: "flex", gap: 0.6, mb: 0.3 }}>
              <Typography variant="caption" fontWeight={700}>
                {c.profiles?.nickname}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ lineHeight: 1.5 }}
              >
                {c.content}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>

      <CommentModal
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        postId={post.id}
        comments={post.comments}
      />

      {/* 이미지 확대 모달 */}
      <Modal
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: { timeout: 300, sx: { bgcolor: "rgba(0,0,0,0.85)" } },
        }}
      >
        <Fade in={imageModalOpen}>
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              px: { xs: 0, sm: 2 },
              "&:focus": { outline: "none" },
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 480,
                maxHeight: "100dvh",
                bgcolor: "background.paper",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  px: 1,
                  py: 0.5,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  flexShrink: 0,
                }}
              >
                <IconButton
                  onClick={() => setImageModalOpen(false)}
                  aria-label="이미지 모달 닫기"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box
                component="img"
                src={post.image_url}
                alt={`${post.profiles?.nickname ?? "작성자"}의 게시물 확대 이미지`}
                sx={{
                  width: "100%",
                  maxHeight: "60dvh",
                  objectFit: "contain",
                  bgcolor: "#000",
                  flexShrink: 0,
                }}
              />
              <Box sx={{ p: 2, overflowY: "auto" }}>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
                  {post.profiles?.nickname}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {post.caption}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <FavoriteIcon sx={{ fontSize: 18, color: "error.main" }} />
                    <Typography variant="caption">
                      {post.likes_count}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <ForumOutlinedIcon
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                    <Typography variant="caption">
                      {post.comments.length}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default PostCard;
