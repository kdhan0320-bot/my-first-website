import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SectionWrapper from '../ui/SectionWrapper';

const Row = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

// ─── 드래그 정렬 목록 ────────────────────────────────────────────
const INITIAL_ITEMS = [
  { id: 1, label: 'React',      color: '#61dafb' },
  { id: 2, label: 'TypeScript', color: '#3178c6' },
  { id: 3, label: 'MUI',        color: '#1976d2' },
  { id: 4, label: 'Vite',       color: '#646cff' },
  { id: 5, label: 'Node.js',    color: '#339933' },
];

const SortableList = () => {
  const [items,     setItems]     = useState(INITIAL_ITEMS);
  const [overIndex, setOverIndex] = useState(null);
  const dragIndex = useRef(null);

  const handleDragStart = (i)    => { dragIndex.current = i; };
  const handleDragOver  = (e, i) => { e.preventDefault(); setOverIndex(i); };
  const handleDragEnd   = ()     => { dragIndex.current = null; setOverIndex(null); };

  const handleDrop = (i) => {
    const from = dragIndex.current;
    if (from === null || from === i) { setOverIndex(null); return; }
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(i, 0, moved);
    setItems(next);
    dragIndex.current = null;
    setOverIndex(null);
  };

  return (
    <Box sx={{ maxWidth: 360 }}>
      <Stack spacing={1}>
        {items.map((item, i) => (
          <Paper
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={() => handleDrop(i)}
            onDragEnd={handleDragEnd}
            elevation={overIndex === i ? 6 : 1}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1.5,
              cursor: 'grab',
              border: '2px solid',
              borderColor: overIndex === i ? 'primary.main' : 'transparent',
              transform: overIndex === i ? 'scale(1.02)' : 'none',
              transition: 'all 0.15s',
              userSelect: 'none',
              '&:active': { cursor: 'grabbing' },
            }}
          >
            <DragIndicatorIcon sx={{ color: 'text.disabled', flexShrink: 0 }} />
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
            <Typography variant="body2" fontWeight={500}>{item.label}</Typography>
            <Typography variant="caption" color="text.disabled" sx={{ ml: 'auto' }}>#{i + 1}</Typography>
          </Paper>
        ))}
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        드래그하여 순서를 변경하세요.
      </Typography>
    </Box>
  );
};

// ─── 칸반 보드 ────────────────────────────────────────────────────
const COLUMNS = {
  todo:  { label: 'TODO',   color: 'default', bgcolor: 'grey.100'   },
  doing: { label: '진행 중', color: 'warning', bgcolor: 'warning.50' },
  done:  { label: '완료',   color: 'success', bgcolor: 'success.50' },
};

const INITIAL_CARDS = {
  todo:  [
    { id: 'c1', text: '디자인 시스템 정의' },
    { id: 'c2', text: '컴포넌트 문서 작성' },
    { id: 'c3', text: '단위 테스트 추가'   },
  ],
  doing: [
    { id: 'c4', text: 'UI 섹션 개발'   },
    { id: 'c5', text: '코드 리뷰 반영' },
  ],
  done:  [
    { id: 'c6', text: '프로젝트 세팅' },
  ],
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState(INITIAL_CARDS);
  const [overCol, setOverCol] = useState(null);
  const drag = useRef({ cardId: null, fromCol: null });

  const handleCardDragStart = (cardId, colKey) => {
    drag.current = { cardId, fromCol: colKey };
  };

  const handleColDragOver = (e, colKey) => {
    e.preventDefault();
    setOverCol(colKey);
  };

  const handleColDrop = (toCol) => {
    const { cardId, fromCol } = drag.current;
    if (!cardId || fromCol === toCol) { setOverCol(null); return; }
    setColumns((prev) => {
      const card = prev[fromCol].find((c) => c.id === cardId);
      return {
        ...prev,
        [fromCol]: prev[fromCol].filter((c) => c.id !== cardId),
        [toCol]:   [...prev[toCol], card],
      };
    });
    drag.current = { cardId: null, fromCol: null };
    setOverCol(null);
  };

  const total     = Object.values(columns).flat().length;
  const doneCount = columns.done.length;

  return (
    <Box>
      <Grid container spacing={2}>
        {Object.entries(COLUMNS).map(([key, col]) => (
          <Grid item xs={12} sm={4} key={key}>
            <Box
              onDragOver={(e) => handleColDragOver(e, key)}
              onDrop={() => handleColDrop(key)}
              sx={{
                minHeight: 260,
                borderRadius: 2,
                border: '2px dashed',
                borderColor: overCol === key ? 'primary.main' : 'divider',
                bgcolor: overCol === key ? 'primary.50' : COLUMNS[key].bgcolor,
                transition: 'all 0.15s',
                p: 1.5,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <Chip
                  label={col.label}
                  size="small"
                  color={col.color}
                  variant={key === 'done' ? 'filled' : 'outlined'}
                />
                <Typography variant="caption" color="text.secondary">
                  {columns[key].length}개
                </Typography>
              </Stack>
              <Stack spacing={1}>
                {columns[key].map((card) => (
                  <Paper
                    key={card.id}
                    draggable
                    onDragStart={() => handleCardDragStart(card.id, key)}
                    elevation={2}
                    sx={{
                      px: 1.5, py: 1,
                      cursor: 'grab',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      '&:active': { cursor: 'grabbing', opacity: 0.6 },
                    }}
                  >
                    <DragIndicatorIcon sx={{ color: 'text.disabled', fontSize: 16 }} />
                    <Typography variant="body2">{card.text}</Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
        카드를 드래그하여 다른 컬럼으로 이동하세요. 완료: {doneCount} / {total}개
      </Typography>
    </Box>
  );
};

// ─── 파일 드롭존 ──────────────────────────────────────────────────
const DropZone = () => {
  const [files, setFiles] = useState([]);
  const [over,  setOver]  = useState(false);

  const handleDragOver  = (e) => { e.preventDefault(); setOver(true); };
  const handleDragLeave = ()  => setOver(false);
  const handleDrop      = (e) => {
    e.preventDefault();
    setOver(false);
    const dropped = Array.from(e.dataTransfer.files).map((f) => ({
      name: f.name,
      size: (f.size / 1024).toFixed(1) + ' KB',
    }));
    setFiles((prev) => [...prev, ...dropped]);
  };

  return (
    <Box sx={{ maxWidth: 480 }}>
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed',
          borderColor: over ? 'primary.main' : 'divider',
          borderRadius: 2,
          bgcolor: over ? 'primary.50' : 'grey.50',
          py: 5,
          textAlign: 'center',
          transition: 'all 0.2s',
          cursor: 'copy',
        }}
      >
        <Typography variant="h3" color={over ? 'primary.main' : 'text.secondary'}>
          {over ? '여기에 놓으세요!' : '파일을 드래그하여 업로드'}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
          모든 파일 형식 지원
        </Typography>
      </Box>

      {files.length > 0 && (
        <Stack spacing={0.5} sx={{ mt: 1.5 }}>
          {files.map((f, i) => (
            <Paper key={i} variant="outlined" sx={{ px: 1.5, py: 0.75 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" noWrap sx={{ flex: 1 }}>{f.name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 2, flexShrink: 0 }}>
                  {f.size}
                </Typography>
              </Stack>
            </Paper>
          ))}
          <Typography
            variant="caption"
            color="primary"
            sx={{ cursor: 'pointer', pl: 0.5 }}
            onClick={() => setFiles([])}
          >
            전체 초기화
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

// ─── 섹션 ─────────────────────────────────────────────────────────
const Section10 = () => (
  <SectionWrapper number={10} title="Drag & Drop" description="HTML5 네이티브 DnD API로 구현한 정렬, 칸반, 파일 드롭존을 확인합니다.">
    <Stack spacing={5}>
      <Row label="드래그 정렬 목록 — 순서 변경 (5개 아이템)">
        <SortableList />
      </Row>
      <Row label="칸반 보드 — TODO / 진행 중 / 완료 컬럼 간 카드 이동">
        <KanbanBoard />
      </Row>
      <Row label="파일 드롭존 — 드래그 앤 드롭 업로드">
        <DropZone />
      </Row>
    </Stack>
  </SectionWrapper>
);

export default Section10;
