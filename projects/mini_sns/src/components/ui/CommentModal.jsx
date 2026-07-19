import { useState, useEffect, useRef } from "react";
import {
  Drawer,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  List,
  ListItem,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../../hooks/useAuth";
import { useDemoData } from "../../context/DemoDataContext";
import { formatDistanceToNow } from "../../utils/timeFormat";

const CommentModal = ({ open, onClose, postId, comments = [] }) => {
  const { guestIdentity } = useAuth();
  const { addComment, updateComment, deleteComment } = useDemoData();
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setTimeout(
      () => listRef.current?.scrollTo(0, listRef.current.scrollHeight),
      50,
    );
  }, [open]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    addComment(postId, text.trim());
    setText("");
    setTimeout(
      () => listRef.current?.scrollTo(0, listRef.current.scrollHeight),
      100,
    );
  };

  const handleDelete = (commentId) => deleteComment(postId, commentId);

  const handleEdit = (commentId) => {
    if (!editText.trim()) return;
    updateComment(postId, commentId, editText.trim());
    setEditId(null);
    setEditText("");
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            maxWidth: 480,
            mx: "auto",
            borderRadius: "16px 16px 0 0",
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2,
        "& .MuiBackdrop-root": { bgcolor: "rgba(0,0,0,0.5)" },
      }}
    >
      {/* 헤더 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h4">댓글 {comments.length}개</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ px: 2, pt: 1, display: "block" }}
      >
        댓글은 데모 상태에서만 반영되며 새로고침하면 초기화됩니다.
      </Typography>

      {/* 댓글 목록 */}
      <List ref={listRef} sx={{ flex: 1, overflowY: "auto", px: 1 }}>
        {comments.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            첫 댓글을 남겨보세요!
          </Typography>
        )}
        {comments.map((comment, idx) => (
          <Box key={comment.id}>
            <ListItem alignItems="flex-start" sx={{ px: 1, py: 1.5 }}>
              <Avatar
                src={comment.profiles?.profile_image_url}
                sx={{ width: 32, height: 32, mr: 1.5, mt: 0.5 }}
              />
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      sx={{ mr: 1 }}
                    >
                      {comment.profiles?.nickname}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDistanceToNow(comment.created_at)}
                    </Typography>
                  </Box>
                  {comment.user_id === guestIdentity.id && (
                    <Box>
                      <IconButton
                        size="small"
                        aria-label="댓글 수정"
                        onClick={() => {
                          setEditId(comment.id);
                          setEditText(comment.content);
                        }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="댓글 삭제"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                {editId === comment.id ? (
                  <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleEdit(comment.id)}
                    >
                      저장
                    </Button>
                    <Button size="small" onClick={() => setEditId(null)}>
                      취소
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {comment.content}
                  </Typography>
                )}
              </Box>
            </ListItem>
            {idx < comments.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </Box>
        ))}
      </List>

      {/* 댓글 입력 */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <Avatar
          src={guestIdentity.profile_image_url}
          sx={{ width: 32, height: 32 }}
        />
        <TextField
          placeholder="댓글을 입력하세요..."
          size="small"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
          sx={{ bgcolor: "background.default", borderRadius: 2 }}
        />
        <IconButton
          color="primary"
          onClick={handleSubmit}
          disabled={!text.trim()}
          aria-label="댓글 전송"
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default CommentModal;
