import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Button, Alert, Chip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import MainLayout from '../components/layout/MainLayout';
import PageHeroHeader, { heroChipSx, heroSurfaceSx } from '../components/layout/PageHeroHeader';
import PostCard from '../components/ui/PostCard';
import { supabase } from '../utils/supabase';
import { useAuth, getRandomProfileAvatar } from '../hooks/useAuth';
import sampleCardUi from '../assets/samples/sample-card-ui.svg';
import sampleStudy from '../assets/samples/sample-study.svg';
import sampleChatUx from '../assets/samples/sample-chat-ux.svg';
import sampleProfileUi from '../assets/samples/sample-profile-ui.svg';
import sampleFlowUi from '../assets/samples/sample-flow-ui.svg';

const GUEST_POSTS = [
  {
    id: 'guest-1',
    user_id: 'guest',
    profiles: { nickname: 'UX러너', profile_image_url: getRandomProfileAvatar('UX러너') },
    image_url: sampleCardUi,
    caption: '오늘 홈 피드 카드 컴포넌트를 정리했습니다. 이미지 클릭 모달까지 연결해봤어요.',
    hashtag: '#작업기록 #모바일UI #React',
    likes_count: 24, comments_count: 7, user_liked: false,
    recent_comments: [
      { id: 'c1', profiles: { nickname: '프론트러너' }, content: '카드 그림자 톤이 훨씬 차분해졌네요!' },
      { id: 'c2', profiles: { nickname: '디자인메이트' }, content: '이미지 모달 UX 저도 참고할게요.' },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    location: null,
  },
  {
    id: 'guest-2',
    user_id: 'guest',
    profiles: { nickname: '스터디메이트', profile_image_url: getRandomProfileAvatar('스터디메이트') },
    image_url: sampleStudy,
    caption: '이번 주 모바일 UI 스터디 참여하실 분 모집합니다. 하단 탭 UX 사례를 같이 비교해봐요.',
    hashtag: '#스터디 #모바일앱 #UX',
    likes_count: 18, comments_count: 5, user_liked: false,
    recent_comments: [
      { id: 'c3', profiles: { nickname: 'UX러너' }, content: '참여하고 싶어요! 시간대 알려주세요.' },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    location: null,
  },
  {
    id: 'guest-3',
    user_id: 'guest',
    profiles: { nickname: '프론트러너', profile_image_url: getRandomProfileAvatar('프론트러너') },
    image_url: sampleChatUx,
    caption: '채팅방 입력창이 모바일에서 잘리지 않도록 100dvh 기준으로 레이아웃을 수정했습니다.',
    hashtag: '#프론트엔드 #채팅UI #반응형',
    likes_count: 41, comments_count: 12, user_liked: false,
    recent_comments: [
      { id: 'c4', profiles: { nickname: '모바일UX' }, content: '안전영역 패딩까지 적용하신 거죠?' },
      { id: 'c5', profiles: { nickname: '스터디메이트' }, content: '저도 이 이슈로 고생했는데 도움 되네요.' },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    location: null,
  },
  {
    id: 'guest-4',
    user_id: 'guest',
    profiles: { nickname: '디자인메이트', profile_image_url: getRandomProfileAvatar('디자인메이트') },
    image_url: sampleProfileUi,
    caption: '아바타와 프로필 문구를 더 차분하게 정리하니 앱 분위기가 훨씬 안정적으로 보입니다.',
    hashtag: '#프로필UI #디자인개선',
    likes_count: 15, comments_count: 9, user_liked: false,
    recent_comments: [
      { id: 'c6', profiles: { nickname: '프론트러너' }, content: '이니셜 아바타 톤이 잘 어울려요.' },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    location: null,
  },
  {
    id: 'guest-5',
    user_id: 'guest',
    profiles: { nickname: '모바일UX', profile_image_url: getRandomProfileAvatar('모바일UX') },
    image_url: sampleFlowUi,
    caption: '모임 참가 후 채팅방으로 이동하는 흐름을 연결했습니다. 화면 간 목적이 더 분명해졌어요.',
    hashtag: '#사용자흐름 #모임 #채팅',
    likes_count: 12, comments_count: 4, user_liked: false,
    recent_comments: [
      { id: 'c7', profiles: { nickname: 'UX러너' }, content: '모임에서 바로 채팅으로 넘어가니 훨씬 자연스러워요.' },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
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
      <Box sx={{ bgcolor: 'background.default', minHeight: '100%', ...heroSurfaceSx }}>
        <PageHeroHeader
          title="작업 피드"
          subtitle="오늘의 작업 기록과 스터디 소식을 확인하세요"
          chips={
            <>
              {isGuest && <Chip label="데모 피드" size="small" sx={heroChipSx} />}
              <Chip label={`작업 기록 ${posts.length}개`} size="small" sx={heroChipSx} />
              <Chip label="모임 연결" size="small" sx={heroChipSx} />
            </>
          }
        />
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
              첫 번째 작업 기록을 남겨보세요.
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
