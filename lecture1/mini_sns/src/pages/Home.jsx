import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import MainLayout from '../components/layout/MainLayout';
import PostCard from '../components/ui/PostCard';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        profiles(nickname, profile_image_url),
        recent_comments:comments(id, content, profiles(nickname)),
        comments_count:comments(count)
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    // 좋아요 여부 확인
    let likedPostIds = new Set();
    if (user) {
      const { data: likesData } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', user.id);
      likedPostIds = new Set(likesData?.map((l) => l.post_id) || []);
    }

    const enriched = (data || []).map((post) => ({
      ...post,
      user_liked: likedPostIds.has(post.id),
      comments_count: post.comments_count?.[0]?.count || 0,
      recent_comments: post.recent_comments?.slice(-2) || [],
    }));

    setPosts(enriched);
    setLoading(false);
  };

  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <MainLayout>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100%' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', pt: 8, px: 3 }}>
            <Typography variant="h3" gutterBottom>아직 게시물이 없어요 🎮</Typography>
            <Typography variant="body2" color="text.secondary">
              첫 번째 게임 리뷰를 올려보세요!
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 0.5 }}>
              <Button size="small" startIcon={<RefreshIcon />} onClick={fetchPosts}>
                새로고침
              </Button>
            </Box>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onDelete={handleDelete} />
            ))}
          </>
        )}
      </Box>
    </MainLayout>
  );
};

export default Home;
