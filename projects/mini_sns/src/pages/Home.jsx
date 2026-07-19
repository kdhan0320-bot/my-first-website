import { Box, Typography, Chip } from "@mui/material";
import MainLayout from "../components/layout/MainLayout";
import PageHeroHeader, {
  heroChipSx,
  heroSurfaceSx,
  cardShelfSx,
} from "../components/layout/PageHeroHeader";
import PostCard from "../components/ui/PostCard";
import { useDemoData } from "../context/DemoDataContext";

const Home = () => {
  const { posts } = useDemoData();

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
          title="작업 피드"
          subtitle="오늘의 작업 기록과 스터디 소식을 확인하세요"
          chips={
            <>
              <Chip label="데모 피드" size="small" sx={heroChipSx} />
              <Chip
                label={`작업 기록 ${posts.length}개`}
                size="small"
                sx={heroChipSx}
              />
              <Chip label="모임 연결" size="small" sx={heroChipSx} />
            </>
          }
          flowLabel="흐름"
          flowText="작업 기록 → 스터디 참여 → 채팅방 연결"
          featureText="피드 카드 / 이미지 모달 / 좋아요 / 댓글"
        />
        <Box sx={cardShelfSx}>
          {posts.length === 0 ? (
            <Box sx={{ textAlign: "center", pt: 8, px: 3 }}>
              <Typography variant="h3" gutterBottom>
                아직 게시물이 없어요
              </Typography>
              <Typography variant="body2" color="text.secondary">
                첫 번째 작업 기록을 남겨보세요.
              </Typography>
            </Box>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </Box>
      </Box>
    </MainLayout>
  );
};

export default Home;
