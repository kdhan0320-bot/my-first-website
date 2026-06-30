import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Button, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import MainLayout from '../components/layout/MainLayout';
import PostCard from '../components/ui/PostCard';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';

const GUEST_POSTS = [
  {
    id: 'guest-1',
    user_id: 'guest',
    profiles: { nickname: '디자인러너', profile_image_url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=designer1' },
    image_url: 'https://picsum.photos/seed/portfolio1/480/480',
    caption: '포트폴리오 대표 프로젝트 순서를 어떻게 정리하면 좋을까요? 취업 준비 중인데 Figma 프로젝트를 먼저 올려야 할지, 코딩 프로젝트를 먼저 올려야 할지 고민입니다.',
    hashtag: '#포트폴리오 #취업준비 #웹디자인',
    likes_count: 24, comments_count: 7, user_liked: false,
    recent_comments: [
      { id: 'c1', profiles: { nickname: 'UX스터디' }, content: '저는 Figma를 먼저 올렸는데 반응이 좋았어요!' },
      { id: 'c2', profiles: { nickname: '취준생모임' }, content: '채용 담당자 입장에서는 완성도가 더 중요하더라고요.' },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    location: null,
  },
  {
    id: 'guest-2',
    user_id: 'guest',
    profiles: { nickname: 'UX학습자', profile_image_url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=uxlearner' },
    image_url: 'https://picsum.photos/seed/uxui2/480/480',
    caption: 'UX/UI 디자인 피드백 받을 때 어떤 부분을 먼저 봐야 할까요? 사용성? 시각 디자인? 정보 구조?',
    hashtag: '#UXUI #피드백 #Figma',
    likes_count: 18, comments_count: 5, user_liked: false,
    recent_comments: [
      { id: 'c3', profiles: { nickname: '디자인멘토' }, content: '사용자 흐름(플로우)부터 보는 게 맞아요.' },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    location: null,
  },
  {
    id: 'guest-3',
    user_id: 'guest',
    profiles: { nickname: '김도한_dev', profile_image_url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=dohan' },
    image_url: 'https://picsum.photos/seed/dashboard3/480/480',
    caption: '취업 준비하면서 만든 대시보드 프로젝트 공유합니다. 지원 현황, 체크리스트, 면접 일정을 한 화면에서 관리할 수 있어요. AI-assisted Coding으로 제작했습니다.',
    hashtag: '#대시보드 #AIassisted #React #취업준비',
    likes_count: 41, comments_count: 12, user_liked: false,
    recent_comments: [
      { id: 'c4', profiles: { nickname: '포폴스터디' }, content: '완성도 대박이에요! 링크 공유해주실 수 있나요?' },
      { id: 'c5', profiles: { nickname: '웹디자인러너' }, content: 'AI 도구 잘 활용하셨네요 👍' },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    location: null,
  },
  {
    id: 'guest-4',
    user_id: 'guest',
    profiles: { nickname: 'Figma유저', profile_image_url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=figmauser' },
    image_url: 'https://picsum.photos/seed/mobile4/480/480',
    caption: 'Figma 모바일 앱 화면 피드백 부탁드립니다. 온보딩 플로우 3단계로 줄이는 게 맞을까요?',
    hashtag: '#Figma #모바일 #UX #온보딩',
    likes_count: 15, comments_count: 9, user_liked: false,
    recent_comments: [
      { id: 'c6', profiles: { nickname: 'UX리뷰어' }, content: '3단계도 좋은데 핵심 가치를 첫 화면에 담는 게 포인트예요.' },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    location: null,
  },
];

const Home = () => {
  const { user, isGuest } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isGuest) {
      setPosts(GUEST_POSTS);
      setLoading(false);
      return;
    }
    fetchPosts();
  }, [user, isGuest]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles(nickname, profile_image_url),
          comments(id, content, profiles(nickname))
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (fetchError) throw fetchError;

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
        comments_count: post.comments?.length || 0,
        recent_comments: (post.comments || []).slice(-2),
      }));

      setPosts(enriched);
    } catch {
      setError('데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
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
        ) : error ? (
          <Box sx={{ px: 2, pt: 4 }}>
            <Alert severity="error" action={
              <Button size="small" onClick={fetchPosts}>다시 시도</Button>
            }>
              {error}
            </Alert>
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', pt: 8, px: 3 }}>
            <Typography variant="h3" gutterBottom>아직 게시물이 없어요</Typography>
            <Typography variant="body2" color="text.secondary">
              첫 번째 게임 리뷰를 작성해보세요.
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
