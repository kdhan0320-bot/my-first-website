import { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Checkbox, LinearProgress,
  Divider, Stack, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, IconButton, Chip, Skeleton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import useChecklist from '../hooks/useChecklist';
import { useAuth } from '../context/AuthContext';
import { CHECKLIST_CATEGORIES } from '../constants';

const ChecklistPage = () => {
  const { items, loading, toggle, add, remove } = useChecklist();
  const { isGuest } = useAuth();
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('콘텐츠');

  const progress = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.round((items.filter((i) => i.is_done).length / items.length) * 100);
  }, [items]);

  const grouped = useMemo(() => {
    const map = {};
    items.forEach((item) => {
      const cat = item.category || '기타';
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    });
    return map;
  }, [items]);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await add(newTitle.trim(), newCategory);
    setNewTitle('');
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>포트폴리오 체크리스트</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="body1" fontWeight={600}>전체 진행률</Typography>
            <Typography variant="h6" fontWeight={700} color="success.main">{progress}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            color="success"
            sx={{ height: 12, borderRadius: 6 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {items.filter((i) => i.is_done).length}/{items.length} 항목 완료
          </Typography>
        </CardContent>
      </Card>

      {!isGuest && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>항목 추가</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                placeholder="체크리스트 항목 입력"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>카테고리</InputLabel>
                <Select value={newCategory} label="카테고리" onChange={(e) => setNewCategory(e.target.value)}>
                  {CHECKLIST_CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} sx={{ whiteSpace: 'nowrap' }}>
                추가
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Stack spacing={1}>{[...Array(5)].map((_, i) => <Skeleton key={i} height={56} variant="rounded" />)}</Stack>
      ) : (
        Object.entries(grouped).map(([category, categoryItems]) => (
          <Card key={category} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Typography variant="body2" fontWeight={700}>{category}</Typography>
                <Chip
                  label={`${categoryItems.filter((i) => i.is_done).length}/${categoryItems.length}`}
                  size="small"
                  color={categoryItems.every((i) => i.is_done) ? 'success' : 'default'}
                />
              </Box>
              <Stack divider={<Divider />}>
                {categoryItems.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 1,
                      opacity: item.is_done ? 0.6 : 1,
                    }}
                  >
                    <Checkbox
                      checked={item.is_done}
                      onChange={(e) => toggle(item.id, e.target.checked)}
                      size="small"
                      color="success"
                      inputProps={{ 'aria-label': item.title }}
                      sx={{ p: 0.5, mr: 1 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ flex: 1, textDecoration: item.is_done ? 'line-through' : 'none' }}
                    >
                      {item.title}
                    </Typography>
                    {!isGuest && (
                      <IconButton
                        size="small"
                        onClick={() => remove(item.id)}
                        aria-label="항목 삭제"
                        sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default ChecklistPage;
