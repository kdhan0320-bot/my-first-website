import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SectionWrapper from '../ui/SectionWrapper';

const Row = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

const PALETTE = ['#ef5350','#ec407a','#ab47bc','#5c6bc0','#42a5f5','#26c6da','#26a69a','#66bb6a','#d4e157','#ffa726'];
const TAGS    = ['React','TypeScript','MUI','Vite','Node.js','Python','Docker','GraphQL','Redux','TailwindCSS','Next.js','Prisma'];

// ─── 수직 스크롤 컨테이너 ─────────────────────────────────────────
const VerticalScroll = () => (
  <Paper
    variant="outlined"
    sx={{ height: 300, overflowY: 'auto', maxWidth: 340 }}
  >
    <List dense disablePadding>
      {Array.from({ length: 20 }, (_, i) => (
        <ListItem key={i} divider>
          <ListItemAvatar>
            <Avatar
              sx={{ width: 28, height: 28, fontSize: 12, bgcolor: PALETTE[i % PALETTE.length] }}
            >
              {i + 1}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`아이템 ${i + 1}`}
            secondary={`스크롤 가능한 목록 항목입니다.`}
            primaryTypographyProps={{ variant: 'body2' }}
            secondaryTypographyProps={{ variant: 'caption' }}
          />
        </ListItem>
      ))}
    </List>
  </Paper>
);

// ─── 수평 스크롤 ──────────────────────────────────────────────────
const HorizontalScroll = () => (
  <Stack spacing={2}>
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        overflowX: 'auto',
        pb: 1,
        '&::-webkit-scrollbar': { height: 4 },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'primary.light', borderRadius: 2 },
      }}
    >
      {TAGS.map((tag) => (
        <Chip key={tag} label={tag} variant="outlined" sx={{ flexShrink: 0 }} />
      ))}
    </Box>

    <Box
      sx={{
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        pb: 1,
        '&::-webkit-scrollbar': { height: 6 },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.400', borderRadius: 3 },
        '&::-webkit-scrollbar-track': { bgcolor: 'grey.100', borderRadius: 3 },
      }}
    >
      {PALETTE.map((color, i) => (
        <Card
          key={i}
          elevation={2}
          sx={{ minWidth: 140, flexShrink: 0, borderTop: `4px solid ${color}` }}
        >
          <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Typography variant="h3">카드 {i + 1}</Typography>
            <Typography variant="caption" color="text.secondary">수평 스크롤</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  </Stack>
);

// ─── 스크롤 스냅 ──────────────────────────────────────────────────
const SNAPS = [
  { label: '슬라이드 1', bgcolor: '#e3f2fd', color: '#1565c0' },
  { label: '슬라이드 2', bgcolor: '#f3e5f5', color: '#6a1b9a' },
  { label: '슬라이드 3', bgcolor: '#e8f5e9', color: '#2e7d32' },
  { label: '슬라이드 4', bgcolor: '#fff3e0', color: '#e65100' },
];

const ScrollSnap = () => (
  <Box
    sx={{
      display: 'flex',
      overflowX: 'auto',
      scrollSnapType: 'x mandatory',
      borderRadius: 2,
      maxWidth: 480,
      '&::-webkit-scrollbar': { display: 'none' },
    }}
  >
    {SNAPS.map(({ label, bgcolor, color }) => (
      <Box
        key={label}
        sx={{
          minWidth: '100%',
          scrollSnapAlign: 'start',
          bgcolor,
          height: 160,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <Typography variant="h2" sx={{ color }}>{label}</Typography>
        <Typography variant="caption" sx={{ color, opacity: 0.7 }}>← 스크롤하여 이동 →</Typography>
      </Box>
    ))}
  </Box>
);

// ─── 무한 스크롤 ──────────────────────────────────────────────────
const PAGE_SIZE = 8;

const InfiniteScroll = () => {
  const [items,   setItems]   = useState(() => Array.from({ length: PAGE_SIZE }, (_, i) => i + 1));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => {
        const next = prev.length + PAGE_SIZE;
        if (next >= 40) setHasMore(false);
        return [...prev, ...Array.from({ length: PAGE_SIZE }, (_, i) => prev.length + i + 1)];
      });
      setLoading(false);
    }, 800);
  }, [loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { threshold: 1.0 }
    );
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [loadMore]);

  return (
    <Paper variant="outlined" sx={{ height: 300, overflowY: 'auto', maxWidth: 480 }}>
      <Grid container sx={{ p: 1.5 }} spacing={1}>
        {items.map((n) => (
          <Grid item xs={3} key={n}>
            <Paper
              elevation={1}
              sx={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: PALETTE[(n - 1) % PALETTE.length] + '22',
                border: '1px solid',
                borderColor: PALETTE[(n - 1) % PALETTE.length] + '88',
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ color: PALETTE[(n - 1) % PALETTE.length] }}
              >
                {n}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ textAlign: 'center', py: 1.5 }} ref={sentinelRef}>
        {loading  && <CircularProgress size={20} />}
        {!hasMore && <Typography variant="caption" color="text.secondary">모든 항목을 불러왔습니다.</Typography>}
      </Box>
    </Paper>
  );
};

// ─── Back to Top 버튼 ─────────────────────────────────────────────
const BackToTop = () => {
  const boxRef  = useRef(null);
  const [visible, setVisible] = useState(false);

  const handleScroll = () => {
    if (boxRef.current) setVisible(boxRef.current.scrollTop > 80);
  };

  return (
    <Box sx={{ position: 'relative', maxWidth: 340 }}>
      <Paper
        ref={boxRef}
        variant="outlined"
        onScroll={handleScroll}
        sx={{ height: 300, overflowY: 'auto', p: 2 }}
      >
        {Array.from({ length: 18 }, (_, i) => (
          <Box key={i}>
            <Typography variant="body2" color="text.secondary">
              콘텐츠 {i + 1}번째 줄 — 아래로 스크롤하면 버튼이 나타납니다.
            </Typography>
            {i < 17 && <Divider sx={{ my: 0.75 }} />}
          </Box>
        ))}
      </Paper>

      {visible && (
        <Fab
          size="small"
          color="primary"
          onClick={() => boxRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{ position: 'absolute', bottom: 12, right: 12 }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
        컨테이너를 아래로 스크롤하면 Top 버튼이 표시됩니다.
      </Typography>
    </Box>
  );
};

// ─── 섹션 ─────────────────────────────────────────────────────────
const Section11 = () => (
  <SectionWrapper number={11} title="Scroll" description="수직·수평 스크롤, 스냅, 무한 스크롤, Back to Top 패턴을 확인합니다.">
    <Stack spacing={5}>
      <Row label="수직 스크롤 컨테이너 — height: 300px / overflow-y: auto">
        <VerticalScroll />
      </Row>
      <Row label="수평 스크롤 — Chip 목록 · Card 가로 스크롤">
        <HorizontalScroll />
      </Row>
      <Row label="스크롤 스냅 (scroll-snap-type: x mandatory)">
        <ScrollSnap />
      </Row>
      <Row label="무한 스크롤 — IntersectionObserver · 하단 감지 후 8개씩 추가">
        <InfiniteScroll />
      </Row>
      <Row label="Back to Top 버튼 — 80px 이상 스크롤 시 FAB 표시">
        <BackToTop />
      </Row>
    </Stack>
  </SectionWrapper>
);

export default Section11;
