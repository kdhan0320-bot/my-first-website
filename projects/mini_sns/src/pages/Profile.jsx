import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Modal,
  Backdrop,
  Fade,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import MainLayout from "../components/layout/MainLayout";
import PageHeroHeader, {
  heroChipSx,
  heroSurfaceSx,
  cardShelfSx,
} from "../components/layout/PageHeroHeader";
import PostCard from "../components/ui/PostCard";
import sampleFallback from "../assets/samples/sample-fallback.svg";
import { useAuth } from "../hooks/useAuth";
import { useDemoData } from "../context/DemoDataContext";
import { ROUTES } from "../constants/routes";

const GUEST_INTEREST_TAGS = ["작업기록", "스터디", "모바일UI", "React"];

const Profile = () => {
  const { guestIdentity, exitGuestMode } = useAuth();
  const { posts } = useDemoData();
  const navigate = useNavigate();
  const [selectedPostId, setSelectedPostId] = useState(null);

  const ownerPosts = posts.filter((post) => post.user_id === guestIdentity.id);
  const selectedPost =
    ownerPosts.find((post) => post.id === selectedPostId) ?? null;

  const handleExitDemo = () => {
    exitGuestMode();
    navigate(ROUTES.LOGIN);
  };

  return (
    <MainLayout>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100%",
          ...heroSurfaceSx,
        }}
      >
        <PageHeroHeader
          title="내 작업 기록"
          subtitle="데모 프로필과 활동 흐름을 확인하세요"
          chips={
            <>
              <Chip label="데모 프로필" size="small" sx={heroChipSx} />
              <Chip
                label={`게시물 ${ownerPosts.length}개`}
                size="small"
                sx={heroChipSx}
              />
            </>
          }
          flowLabel="흐름"
          flowText="기록한 작업과 참여 모임을 한 곳에서 확인합니다"
          featureText="프로필 정보 / 활동 요약 / 작성 기록"
        />
        <Box sx={cardShelfSx}>
          <Box
            sx={{
              bgcolor: "background.paper",
              mx: 2,
              borderRadius: "18px",
              px: 2,
              pt: 2,
              pb: 3,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton
                size="small"
                onClick={handleExitDemo}
                color="default"
                aria-label="데모 종료"
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
              <Avatar
                src={guestIdentity.profile_image_url}
                sx={{
                  width: 80,
                  height: 80,
                  border: "3px solid",
                  borderColor: "primary.main",
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" sx={{ mb: 0.5 }}>
                  {guestIdentity.nickname}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {guestIdentity.handle}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 0.5, color: "text.secondary" }}
                >
                  {guestIdentity.bio}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 2 }}>
              {GUEST_INTEREST_TAGS.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  size="small"
                  sx={{
                    bgcolor: "secondary.main",
                    color: "primary.main",
                    fontSize: "0.72rem",
                  }}
                />
              ))}
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 4,
                justifyContent: "center",
                py: 1.5,
                bgcolor: "background.default",
                borderRadius: 2,
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" color="primary.main">
                  {ownerPosts.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  게시물
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" color="primary.main">
                  2
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  참여 모임
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" color="primary.main">
                  7
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  저장한 글
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", textAlign: "center", mt: 1 }}
            >
              게시물 수를 제외한 값은 데모용 예시 수치입니다.
            </Typography>
          </Box>

          {/* 게시물 그리드 */}
          {ownerPosts.length === 0 ? (
            <Box sx={{ textAlign: "center", pt: 6 }}>
              <Typography variant="body1" color="text.secondary">
                아직 게시물이 없어요.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 0.5,
                p: 0.5,
              }}
            >
              {ownerPosts.map((post) => (
                <Box
                  key={post.id}
                  component="img"
                  src={post.image_url}
                  alt="썸네일"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = sampleFallback;
                  }}
                  onClick={() => setSelectedPostId(post.id)}
                  sx={{
                    width: "100%",
                    aspectRatio: "1/1",
                    objectFit: "cover",
                    cursor: "pointer",
                    transition: "opacity 0.15s",
                    "&:hover": { opacity: 0.85 },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* 게시물 전체화면 모달 */}
      <Modal
        open={Boolean(selectedPost)}
        onClose={() => setSelectedPostId(null)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: { timeout: 300, sx: { bgcolor: "rgba(0,0,0,0.75)" } },
        }}
      >
        <Fade in={Boolean(selectedPost)}>
          <Box
            sx={{
              position: "fixed",
              top: 56,
              left: 0,
              right: 0,
              bottom: 60,
              maxWidth: 480,
              mx: "auto",
              overflowY: "auto",
              bgcolor: "background.default",
              "&:focus": { outline: "none" },
            }}
          >
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                display: "flex",
                justifyContent: "flex-end",
                bgcolor: "background.paper",
                px: 1,
                py: 0.5,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <IconButton
                onClick={() => setSelectedPostId(null)}
                aria-label="닫기"
              >
                <CloseIcon />
              </IconButton>
            </Box>
            {selectedPost && <PostCard post={selectedPost} />}
          </Box>
        </Fade>
      </Modal>
    </MainLayout>
  );
};

export default Profile;
