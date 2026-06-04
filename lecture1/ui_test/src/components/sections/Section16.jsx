import { useRef, useState } from 'react'; // useRef: SwipeCards·SwipeDeleteItem 에서 사용
import { useSwipeable } from 'react-swipeable';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StarIcon from '@mui/icons-material/Star';
import SectionWrapper from '../ui/SectionWrapper';

const Row = ({ label, hint, children }) => (
  <Box>
    <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mb: 1 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      {hint && <Typography variant="caption" color="primary.main">{hint}</Typography>}
    </Stack>
    {children}
  </Box>
);

// ─── 공통 스와이프 훅 ─────────────────────────────────────────────
const useSwipe = ({ onLeft, onRight, threshold = 60 }) => {
  const startX   = useRef(null);
  const isDragging = useRef(false);
  const [offsetX, setOffsetX] = useState(0);

  const onPointerDown = (e) => {
    startX.current = e.clientX;
    isDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    setOffsetX(e.clientX - startX.current);
  };

  const onPointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (offsetX < -threshold) onLeft?.();
    else if (offsetX > threshold) onRight?.();
    setOffsetX(0);
  };

  return { offsetX, onPointerDown, onPointerMove, onPointerUp };
};

// ─── 스와이프 카드 (Tinder 스타일) ───────────────────────────────
const CARDS = [
  { id: 1, name: '김민준', role: 'Frontend Dev',   color: '#1976d2', star: 4.8 },
  { id: 2, name: '이서연', role: 'UI/UX Designer', color: '#9c27b0', star: 4.9 },
  { id: 3, name: '박지호', role: 'Backend Dev',    color: '#2e7d32', star: 4.7 },
  { id: 4, name: '최수아', role: 'Data Engineer',  color: '#e65100', star: 4.6 },
  { id: 5, name: '정도윤', role: 'DevOps',          color: '#0288d1', star: 4.5 },
];

const SwipeCards = () => {
  const [deck,      setDeck]      = useState(CARDS);
  const [log,       setLog]       = useState([]);
  const [animating, setAnimating] = useState(null); // 'left' | 'right'

  const top = deck[deck.length - 1];

  const dismiss = (dir) => {
    if (!top || animating) return;
    setAnimating(dir);
    setTimeout(() => {
      setDeck((p) => p.slice(0, -1));
      setLog((p) => [{ name: top.name, dir }, ...p].slice(0, 4));
      setAnimating(null);
    }, 300);
  };

  const { offsetX, onPointerDown, onPointerMove, onPointerUp } = useSwipe({
    onLeft:  () => dismiss('left'),
    onRight: () => dismiss('right'),
  });

  const rotation = offsetX / 15;
  const opacity  = Math.max(0, 1 - Math.abs(offsetX) / 200);

  return (
    <Stack spacing={2}>
      <Box sx={{ position: 'relative', height: 220, width: 280 }}>
        {/* 뒤 카드들 */}
        {deck.slice(0, -1).slice(-2).map((card, i, arr) => (
          <Paper
            key={card.id}
            elevation={2}
            sx={{
              position: 'absolute',
              width: 260,
              height: 200,
              borderRadius: 3,
              top: (arr.length - 1 - i) * 6,
              left: (arr.length - 1 - i) * 4,
              bgcolor: card.color + '22',
              border: `2px solid ${card.color}44`,
              transform: `scale(${0.94 + i * 0.03})`,
            }}
          />
        ))}

        {/* 맨 위 카드 */}
        {top && (
          <Paper
            elevation={6}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            sx={{
              position: 'absolute',
              width: 260,
              height: 200,
              borderRadius: 3,
              cursor: 'grab',
              userSelect: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              bgcolor: top.color + '18',
              border: `2px solid ${top.color}`,
              transform: animating === 'left'
                ? 'translateX(-120%) rotate(-20deg)'
                : animating === 'right'
                  ? 'translateX(120%) rotate(20deg)'
                  : `translateX(${offsetX}px) rotate(${rotation}deg)`,
              transition: animating ? 'transform 0.3s ease' : 'none',
              '&:active': { cursor: 'grabbing' },
            }}
          >
            {/* 좋아요/싫어요 오버레이 */}
            {offsetX > 20 && (
              <Chip label="LIKE ✓" color="success" size="small"
                sx={{ position: 'absolute', top: 12, left: 12, fontWeight: 700, opacity: Math.min(1, offsetX / 60) }} />
            )}
            {offsetX < -20 && (
              <Chip label="NOPE ✗" color="error" size="small"
                sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700, opacity: Math.min(1, -offsetX / 60) }} />
            )}

            <Avatar sx={{ width: 56, height: 56, bgcolor: top.color, fontSize: 22 }}>{top.name[0]}</Avatar>
            <Typography variant="h3">{top.name}</Typography>
            <Typography variant="body2" color="text.secondary">{top.role}</Typography>
            <Stack direction="row" alignItems="center" spacing={0.3}>
              <StarIcon sx={{ fontSize: 14, color: 'warning.main' }} />
              <Typography variant="caption" fontWeight={600}>{top.star}</Typography>
            </Stack>
          </Paper>
        )}

        {!top && (
          <Paper elevation={1} sx={{ width: 260, height: 200, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
            <Typography variant="body2" color="text.secondary">카드가 없습니다</Typography>
          </Paper>
        )}
      </Box>

      {/* 버튼 */}
      <Stack direction="row" spacing={2} alignItems="center">
        <IconButton color="error" onClick={() => dismiss('left')} disabled={!top}
          sx={{ border: '2px solid', borderColor: 'error.main', '&:disabled': { borderColor: 'divider' } }}>
          <CancelIcon />
        </IconButton>
        <IconButton color="success" onClick={() => dismiss('right')} disabled={!top}
          sx={{ border: '2px solid', borderColor: 'success.main', '&:disabled': { borderColor: 'divider' } }}>
          <CheckCircleIcon />
        </IconButton>
        {log.length > 0 && (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {log.map((l, i) => (
              <Chip
                key={i}
                label={l.name}
                size="small"
                color={l.dir === 'right' ? 'success' : 'error'}
                variant="outlined"
              />
            ))}
          </Stack>
        )}
      </Stack>
      <Typography variant="caption" color="text.secondary">
        카드를 좌우로 드래그하거나 버튼을 누르세요. 남은 카드: {deck.length}개
      </Typography>
    </Stack>
  );
};

// ─── 스와이프 삭제 리스트 ─────────────────────────────────────────
const MAILS = [
  { id: 1, from: '김민준',  subject: '프로젝트 미팅 일정 안내',    time: '오전 9:00'  },
  { id: 2, from: '이서연',  subject: 'UI 디자인 피드백 요청',      time: '오전 10:30' },
  { id: 3, from: '박지호',  subject: 'API 명세서 공유드립니다',    time: '오후 1:15'  },
  { id: 4, from: '최수아',  subject: '데이터 파이프라인 오류 보고', time: '오후 3:00'  },
  { id: 5, from: '정도윤',  subject: '서버 배포 완료 알림',        time: '오후 4:45'  },
];

const SwipeDeleteItem = ({ item, onDelete }) => {
  const [offset,   setOffset]   = useState(0);
  const [deleted,  setDeleted]  = useState(false);
  const startX   = useRef(null);
  const dragging = useRef(false);

  const onPointerDown = (e) => { startX.current = e.clientX; dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); };
  const onPointerMove = (e) => { if (!dragging.current) return; setOffset(Math.min(0, e.clientX - startX.current)); };
  const onPointerUp   = () => {
    dragging.current = false;
    if (offset < -80) {
      setDeleted(true);
      setTimeout(() => onDelete(item.id), 300);
    } else {
      setOffset(0);
    }
  };

  const deleteVisible = offset < -20;

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      {/* 삭제 배경 */}
      <Box sx={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: Math.abs(offset),
        bgcolor: 'error.main',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minWidth: deleteVisible ? 60 : 0,
        transition: offset === 0 ? 'width 0.2s' : 'none',
      }}>
        {deleteVisible && <DeleteIcon sx={{ color: 'white' }} />}
      </Box>

      {/* 아이템 */}
      <Paper
        variant="outlined"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        sx={{
          px: 2, py: 1.5,
          cursor: 'grab',
          userSelect: 'none',
          position: 'relative',
          transform: deleted ? 'translateX(-100%)' : `translateX(${offset}px)`,
          transition: (offset === 0 || deleted) ? 'transform 0.25s' : 'none',
          bgcolor: 'background.paper',
          '&:active': { cursor: 'grabbing' },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: 'primary.light' }}>{item.from[0]}</Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>{item.from}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap>{item.subject}</Typography>
            </Box>
          </Stack>
          <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0, ml: 1 }}>{item.time}</Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

const SwipeDeleteList = () => {
  const [items, setItems] = useState(MAILS);
  const handleDelete = (id) => setItems((p) => p.filter((m) => m.id !== id));

  return (
    <Box sx={{ maxWidth: 480 }}>
      <Stack spacing={0.5}>
        {items.map((item) => (
          <SwipeDeleteItem key={item.id} item={item} onDelete={handleDelete} />
        ))}
      </Stack>
      {items.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
          모든 메일을 삭제했습니다.
        </Typography>
      )}
    </Box>
  );
};

// ─── 스와이프 캐러셀 (react-swipeable) ───────────────────────────
const SLIDES = [
  { label: '슬라이드 1', bgcolor: '#e3f2fd', color: '#1565c0', desc: '좌우로 스와이프하세요',    img: 'https://picsum.photos/seed/slide1/480/160' },
  { label: '슬라이드 2', bgcolor: '#f3e5f5', color: '#6a1b9a', desc: '터치 또는 마우스 드래그', img: 'https://picsum.photos/seed/slide2/480/160' },
  { label: '슬라이드 3', bgcolor: '#e8f5e9', color: '#2e7d32', desc: '버튼으로도 이동 가능',    img: 'https://picsum.photos/seed/slide3/480/160' },
  { label: '슬라이드 4', bgcolor: '#fff3e0', color: '#e65100', desc: '인디케이터로 위치 확인',  img: 'https://picsum.photos/seed/slide4/480/160' },
];

const SwipeCarousel = () => {
  const [current,   setCurrent]   = useState(0);
  const [dragging,  setDragging]  = useState(false);
  const [deltaX,    setDeltaX]    = useState(0);

  const goTo = (i) => setCurrent(Math.max(0, Math.min(SLIDES.length - 1, i)));

  const handlers = useSwipeable({
    onSwiping:        ({ deltaX }) => { setDragging(true); setDeltaX(deltaX); },
    onSwipedLeft:     () => { goTo(current + 1); setDragging(false); setDeltaX(0); },
    onSwipedRight:    () => { goTo(current - 1); setDragging(false); setDeltaX(0); },
    onTouchEndOrOnMouseUp: () => { setDragging(false); setDeltaX(0); },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  return (
    <Box sx={{ maxWidth: 480 }}>
      {/* 슬라이드 인덱스 표시 */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {current + 1} / {SLIDES.length}
        </Typography>
        <Typography variant="caption" color="primary.main" fontWeight={600}>
          {SLIDES[current].label}
        </Typography>
      </Stack>

      {/* 슬라이드 영역 */}
      <Box
        {...handlers}
        sx={{ overflow: 'hidden', borderRadius: 2, cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none' }}
      >
        <Box
          sx={{
            display: 'flex',
            transform: `translateX(calc(${-current * 100}% + ${deltaX}px))`,
            transition: dragging ? 'none' : 'transform 0.35s ease',
          }}
        >
          {SLIDES.map(({ label, bgcolor, color, desc, img }) => (
            <Box
              key={label}
              sx={{
                minWidth: '100%',
                height: 180,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src={img}
                alt={label}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
              />
              {/* 텍스트 오버레이 */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'rgba(0,0,0,0.38)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                }}
              >
                <Typography variant="h2" sx={{ color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                  {label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>{desc}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 컨트롤 */}
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 1.5 }}>
        <IconButton size="small" onClick={() => goTo(current - 1)} disabled={current === 0}>
          <ChevronLeftIcon />
        </IconButton>
        {SLIDES.map((_, i) => (
          <Box
            key={i}
            onClick={() => goTo(i)}
            sx={{
              width: current === i ? 24 : 8,
              height: 8,
              borderRadius: 4,
              bgcolor: current === i ? 'primary.main' : 'grey.300',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          />
        ))}
        <IconButton size="small" onClick={() => goTo(current + 1)} disabled={current === SLIDES.length - 1}>
          <ChevronRightIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

// ─── 스와이프 탭 ──────────────────────────────────────────────────
const TAB_CONTENTS = [
  { label: '전체',   content: '모든 콘텐츠를 표시합니다.' },
  { label: '인기',   content: '인기 콘텐츠를 표시합니다.' },
  { label: '최신',   content: '최신 콘텐츠를 표시합니다.' },
  { label: '즐겨찾기', content: '즐겨찾기한 항목을 표시합니다.' },
];

const SwipeTabs = () => {
  const [tab, setTab] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft:  () => setTab((p) => Math.min(p + 1, TAB_CONTENTS.length - 1)),
    onSwipedRight: () => setTab((p) => Math.max(p - 1, 0)),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  return (
    <Box sx={{ maxWidth: 480, border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
        {TAB_CONTENTS.map(({ label }) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
      <Divider />
      <Box {...handlers} sx={{ p: 3, minHeight: 80, cursor: 'ew-resize', userSelect: 'none' }}>
        <Typography variant="body2" color="text.secondary">
          {TAB_CONTENTS[tab].content}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
          ← 좌우 스와이프로 탭 전환 →
        </Typography>
      </Box>
    </Box>
  );
};

// ─── 섹션 ─────────────────────────────────────────────────────────
const Section16 = () => (
  <SectionWrapper number={16} title="Swipe" description="Pointer Events 기반 스와이프 카드, 삭제 리스트, 캐러셀, 탭을 확인합니다.">
    <Stack spacing={5}>
      <Row label="스와이프 카드 (Tinder 스타일)" hint="← 드래그 또는 버튼 클릭">
        <SwipeCards />
      </Row>
      <Row label="스와이프 삭제 리스트" hint="← 왼쪽으로 드래그하면 삭제">
        <SwipeDeleteList />
      </Row>
      <Row label="스와이프 캐러셀" hint="← → 드래그 또는 버튼·인디케이터 클릭">
        <SwipeCarousel />
      </Row>
      <Row label="스와이프 탭" hint="← → 드래그로 탭 전환">
        <SwipeTabs />
      </Row>
    </Stack>
  </SectionWrapper>
);

export default Section16;
