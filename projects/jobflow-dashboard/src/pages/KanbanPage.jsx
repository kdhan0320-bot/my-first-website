import { useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Stack, Chip, Select,
  MenuItem, FormControl, Skeleton, Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useApplications from '../hooks/useApplications';
import { useAuth } from '../context/AuthContext';
import { APPLICATION_STATUSES } from '../constants';

const KANBAN_STATUSES = ['관심', '지원 예정', '지원 완료', '서류 진행', '면접 예정', '합격', '불합격'];

const PRIORITY_COLOR = {
  '높음': '#EF4444',
  '보통': '#F59E0B',
  '낮음': '#94A3B8',
};

const KanbanCard = ({ app, onStatusChange, isGuest }) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 }, transition: 'box-shadow 0.2s' }}
      onClick={() => navigate(`/applications/${app.id}`)}
    >
      <CardContent sx={{ pb: '12px !important', pt: 1.5, px: 1.5 }}>
        {/* 회사명 */}
        <Typography
          variant="body2"
          fontWeight={700}
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mb: 0.5 }}
        >
          {app.company_name}
        </Typography>

        {/* 직무 */}
        {app.position && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mb: 0.5 }}
          >
            {app.position}
          </Typography>
        )}

        {/* 지원일 */}
        {app.applied_date && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 1 }}
          >
            📅 {app.applied_date}
          </Typography>
        )}

        {/* 우선순위 + 상태변경 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5 }}>
          {app.priority ? (
            <Chip
              label={app.priority}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '0.6rem',
                height: 18,
                color: PRIORITY_COLOR[app.priority] ?? '#94A3B8',
                borderColor: PRIORITY_COLOR[app.priority] ?? '#94A3B8',
                '& .MuiChip-label': { px: 0.8 },
              }}
            />
          ) : <Box />}

          {!isGuest && (
            <FormControl size="small" onClick={(e) => e.stopPropagation()}>
              <Select
                value={app.status}
                onChange={(e) => onStatusChange(app.id, e.target.value)}
                variant="standard"
                disableUnderline
                sx={{ fontSize: '0.65rem', color: 'text.secondary', minWidth: 60 }}
              >
                {APPLICATION_STATUSES.map((s) => (
                  <MenuItem key={s.value} value={s.value} sx={{ fontSize: '0.8rem' }}>{s.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const KanbanPage = () => {
  const { applications, loading, error, update } = useApplications();
  const { isGuest } = useAuth();

  const columns = useMemo(() => {
    const map = {};
    KANBAN_STATUSES.forEach((s) => { map[s] = []; });
    applications.forEach((a) => {
      if (map[a.status]) map[a.status].push(a);
    });
    return map;
  }, [applications]);

  const handleStatusChange = async (id, status) => {
    try { await update(id, { status }); } catch { /* ignore */ }
  };

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>칸반 보드</Typography>

      {/* 안내 문구 */}
      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
        좌우로 스크롤하면 전체 컬럼을 볼 수 있습니다.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          overflowX: 'auto',
          pb: 2,
          minHeight: 500,
          /* 스크롤바 스타일 */
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-track': { bgcolor: 'background.default' },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 3 },
        }}
      >
        {KANBAN_STATUSES.map((status) => {
          const found = APPLICATION_STATUSES.find((s) => s.value === status);
          const items = columns[status] ?? [];
          return (
            <Box
              key={status}
              sx={{
                minWidth: 195,
                flex: '0 0 195px',
                bgcolor: found?.bg ?? 'background.default',
                borderRadius: 2,
                border: '1px solid',
                borderColor: `${found?.color ?? '#ccc'}30`,
                p: 1.5,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* 컬럼 헤더 */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ color: found?.color ?? 'text.secondary', letterSpacing: 0.3 }}
                >
                  {status}
                </Typography>
                <Chip
                  label={items.length}
                  size="small"
                  sx={{
                    height: 20,
                    minWidth: 24,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    bgcolor: `${found?.color ?? '#ccc'}15`,
                    color: found?.color ?? 'text.secondary',
                    '& .MuiChip-label': { px: 0.8 },
                  }}
                />
              </Box>

              {/* 카드 목록 */}
              {loading ? (
                <Stack spacing={1}>
                  {[...Array(2)].map((_, i) => <Skeleton key={i} height={90} variant="rounded" />)}
                </Stack>
              ) : (
                <Stack spacing={1} sx={{ flex: 1 }}>
                  {items.map((app) => (
                    <KanbanCard
                      key={app.id}
                      app={app}
                      onStatusChange={handleStatusChange}
                      isGuest={isGuest}
                    />
                  ))}
                  {items.length === 0 && (
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 80,
                        border: '1px dashed',
                        borderColor: `${found?.color ?? '#ccc'}40`,
                        borderRadius: 1.5,
                      }}
                    >
                      <Typography variant="caption" color="text.disabled">비어있음</Typography>
                    </Box>
                  )}
                </Stack>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default KanbanPage;
