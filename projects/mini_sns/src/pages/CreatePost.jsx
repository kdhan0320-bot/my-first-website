import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useDemoData, getRandomSampleImage } from "../context/DemoDataContext";
import sampleFallback from "../assets/samples/sample-fallback.svg";
import { ROUTES } from "../constants/routes";

const CreatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editPost = location.state?.post;
  const { addPost, updatePost } = useDemoData();

  const [caption, setCaption] = useState(editPost?.caption || "");
  const [hashtag, setHashtag] = useState(editPost?.hashtag || "");
  const [postLocation, setPostLocation] = useState(editPost?.location || "");
  const [imageUrl, setImageUrl] = useState(
    editPost?.image_url || getRandomSampleImage(),
  );
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refreshImage = () => setImageUrl(getRandomSampleImage());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caption.trim()) {
      setError("게시물 내용을 입력해주세요.");
      return;
    }
    setError("");

    if (editPost) {
      const success = updatePost(editPost.id, {
        caption: caption.trim(),
        hashtag: hashtag.trim(),
        location: postLocation.trim(),
        image_url: imageUrl,
      });
      if (!success) {
        setError("이 게시글은 수정할 권한이 없습니다.");
        return;
      }
      setNotice("데모 게시글이 수정되었습니다. 새로고침하면 초기화됩니다.");
    } else {
      addPost({
        caption: caption.trim(),
        hashtag: hashtag.trim(),
        location: postLocation.trim(),
        image_url: imageUrl,
      });
      setNotice("데모 게시글이 추가되었습니다. 새로고침하면 초기화됩니다.");
    }
    setTimeout(() => navigate(ROUTES.HOME), 1200);
  };

  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: "auto",
        minHeight: "100vh",
        bgcolor: "background.default",
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
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {editPost ? "게시물 수정" : "새 게시물"}
        </Typography>
        <Box sx={{ width: 40 }} />
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ pb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ m: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        {notice && (
          <Alert severity="info" sx={{ m: 2, borderRadius: 2 }}>
            {notice}
          </Alert>
        )}

        {/* 이미지 미리보기 */}
        <Box sx={{ position: "relative" }}>
          <Box
            component="img"
            src={imageUrl}
            alt="게시물 미리보기 이미지"
            loading="lazy"
            onError={(e) => {
              e.target.src = sampleFallback;
            }}
            sx={{
              width: "100%",
              aspectRatio: "1/1",
              objectFit: "cover",
              display: "block",
            }}
          />
          <Button
            startIcon={<RefreshIcon />}
            onClick={refreshImage}
            size="small"
            sx={{
              position: "absolute",
              bottom: 12,
              right: 12,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              borderRadius: 2,
            }}
          >
            이미지 변경
          </Button>
        </Box>

        {/* 입력 폼 */}
        <Box sx={{ px: 2, pt: 2 }}>
          <TextField
            label="게시물 내용 (캡션)"
            multiline
            rows={3}
            fullWidth
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="오늘의 작업 기록이나 스터디 내용을 공유해보세요"
            sx={{ mb: 2 }}
          />
          <TextField
            label="해시태그"
            fullWidth
            value={hashtag}
            onChange={(e) => setHashtag(e.target.value)}
            placeholder="#작업기록 #스터디 #React"
            helperText="띄어쓰기로 구분"
            sx={{ mb: 2 }}
          />
          <TextField
            label="위치"
            fullWidth
            value={postLocation}
            onChange={(e) => setPostLocation(e.target.value)}
            placeholder="서울, 대한민국"
            sx={{ mb: 3 }}
          />

          {/* 하단 등록 버튼 */}
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleSubmit}
            sx={{
              py: 1.6,
              borderRadius: 3,
              fontWeight: 700,
              fontSize: "1rem",
              mb: 1,
            }}
          >
            {editPost ? "수정하기" : "게시물 등록하기"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreatePost;
