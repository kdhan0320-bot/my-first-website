import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Avatar, Button, Grid, CircularProgress,
  IconButton, Modal, Backdrop, Fade, Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import MainLayout from '../components/layout/MainLayout';
import PageHeroHeader, { heroChipSx, heroSurfaceSx } from '../components/layout/PageHeroHeader';
import PostCard from '../components/ui/PostCard';
import { supabase } from '../utils/supabase';
import sampleFallback from '../assets/samples/sample-fallback.svg';
import { useAuth, getRandomProfileAvatar } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

const Profile = () => {
  const { user, profile, signOut, isGuest, isDemo, guestIdentity } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserPosts();
      fetchFollowCounts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(nickname, profile_image_url)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  const fetchFollowCounts = async () => {
    const [{ count: followers }, { count: following }] = await Promise.all([
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', user.id),
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', user.id),
    ]);
    setFollowerCount(followers || 0);
    setFollowingCount(following || 0);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.LOGIN);
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setSelectedPost(null);
  };

  if (isGuest) {
    const GUEST_INTEREST_TAGS = ['작업기록', '스터디', '모바일UI', 'React'];
    const displayName = isDemo ? guestIdentity.nickname : '게스트';
    const displayHandle = isDemo ? guestIdentity.handle : '@guest_user';
    const displayBio = isDemo ? guestIdentity.bio : '작업 기록과 스터디 활동을 정리하는 UX/UI 학습자입니다.';
    const displayAvatar = isDemo ? guestIdentity.profile_image_url : getRandomProfileAvatar('게스트');
    return (
      <MainLayout>
        <Box sx={{ bgcolor: 'background.default', minHeight: '100%', ...heroSurfaceSx }}>
          <PageHeroHeader
            title="내 작업 기록"
            subtitle="데모 프로필과 활동 흐름을 확인하세요"
            chips={
              <>
                <Chip label="데모 프로필" size="small" sx={heroChipSx} />
                <Chip label="활동 요약" size="small" sx={heroChipSx} />
              </>
            }
          />
          <Box sx={{ bgcolor: 'background.paper', px: 2, pt: 2, pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
              <Avatar
                src={displayAvatar}
                sx={{ width: 80, height: 80, border: '3px solid', borderColor: 'primary.main' }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" sx={{ mb: 0.5 }}>{displayName}</Typography>
                <Typography variant="caption" color="text.secondary">{displayHandle}</Typography>
                <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                  {displayBio}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
              {GUEST_INTEREST_TAGS.map((tag) => (
                <Chip key={tag} label={`#${tag}`} size="small"
                  sx={{ bgcolor: 'secondary.main', color: 'primary.main', fontSize: '0.72rem' }} />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', py: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary.main">4</Typography>
                <Typography variant="caption" color="text.secondary">게시물</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary.main">2</Typography>
                <Typography variant="caption" color="text.secondary">참여 모임</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary.main">7</Typography>
                <Typography variant="caption" color="text.secondary">저장한 글</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center', pt: 6, px: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {isDemo ? '데모 모드에서는 실제 데이터가 저장되지 않습니다.' : '게스트 모드에서는 프로필 수정이 제한됩니다.'}
            </Typography>
          </Box>
        </Box>
      </MainLayout>
    );
  }

  if (!user || !profile) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100%', ...heroSurfaceSx }}>
        <PageHeroHeader
          title="내 작업 기록"
          subtitle="프로필과 활동 흐름을 확인하세요"
          chips={
            <>
              <Chip label={`게시물 ${posts.length}개`} size="small" sx={heroChipSx} />
              <Chip label="활동 요약" size="small" sx={heroChipSx} />
            </>
          }
        />
        {/* 프로필 헤더 */}
        <Box
          sx={{
            bgcolor: 'background.paper', px: 2, pt: 2, pb: 3,
            borderBottom: '1px solid', borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton size="small" onClick={handleSignOut} color="default" aria-label="로그아웃">
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
            <Avatar
              src={profile.profile_image_url}
              sx={{ width: 80, height: 80, border: '3px solid', borderColor: 'primary.main' }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" sx={{ mb: 0.5 }}>{profile.nickname}</Typography>
              <Typography variant="caption" color="text.secondary">@{profile.username}</Typography>
              {profile.bio && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>{profile.bio}</Typography>
              )}
            </Box>
          </Box>

          {/* 통계 */}
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', py: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary.main">{posts.length}</Typography>
              <Typography variant="caption" color="text.secondary">게시물</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary.main">{followerCount}</Typography>
              <Typography variant="caption" color="text.secondary">팔로워</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary.main">{followingCount}</Typography>
              <Typography variant="caption" color="text.secondary">팔로잉</Typography>
            </Box>
          </Box>
        </Box>

        {/* 게시물 그리드 */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', pt: 6 }}>
            <Typography variant="body1" color="text.secondary">아직 게시물이 없어요.</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(ROUTES.CREATE_POST)}>
              첫 게시물 올리기
            </Button>
          </Box>
        ) : (
          <Grid container spacing={0.5} sx={{ p: 0.5 }}>
            {posts.map((post) => (
              <Grid item xs={4} key={post.id}>
                <Box
                  component="img"
                  src={post.image_url}
                  alt="썸네일"
                  loading="lazy"
                  onError={(e) => { e.target.src = sampleFallback; }}
                  onClick={() => setSelectedPost(post)}
                  sx={{
                    width: '100%', aspectRatio: '1/1', objectFit: 'cover',
                    cursor: 'pointer',
                    transition: 'opacity 0.15s',
                    '&:hover': { opacity: 0.85 },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* 게시물 전체화면 모달 */}
      <Modal
        open={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300, sx: { bgcolor: 'rgba(0,0,0,0.75)' } } }}
      >
        <Fade in={Boolean(selectedPost)}>
          <Box
            sx={{
              position: 'fixed', top: 56, left: 0, right: 0, bottom: 60,
              maxWidth: 480, mx: 'auto', overflowY: 'auto',
              bgcolor: 'background.default',
              '&:focus': { outline: 'none' },
            }}
          >
            <Box sx={{
              position: 'sticky', top: 0, zIndex: 10,
              display: 'flex', justifyContent: 'flex-end',
              bgcolor: 'background.paper', px: 1, py: 0.5,
              borderBottom: '1px solid', borderColor: 'divider',
            }}>
              <IconButton onClick={() => setSelectedPost(null)} aria-label="닫기">
                <CloseIcon />
              </IconButton>
            </Box>
            {selectedPost && (
              <PostCard post={selectedPost} onDelete={handleDeletePost} />
            )}
          </Box>
        </Fade>
      </Modal>
    </MainLayout>
  );
};

export default Profile;
