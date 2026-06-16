import { useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Stack, Chip, Select,
  MenuItem, FormControl, Skeleton, Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useApplications from '../hooks/useApplications';
import { useAuth } from '../context/AuthContext';
import { APPLICATION_STATUSES } from '../constants';
import StatusChip from '../components/ui/StatusChip';

const KANBAN_STATUSES = ['관심', '지원 예정', '지원 완료', '서류 진행', '면접 예정', '합격', '불합격'];

const KanbanCard = ({ app, onStatusChange, isGuest }) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        cursor: 'pointer',
        '&:hover': { boxShadow: 4 },
        transition: 'box-shadow 0.2s',
      }}
      onClick={() => navigate(`/applications/${app.id}`)}
    >
      <CardContent sx={{ pb: '12px !important', pt: 1.5, px: 1.5 }}>
        <Typography variant="body2" fontWeight={700} noWrap>{app.company_name}</Typography>
        {app.position && (
          <Typography variant="caption" color="text.secondary" noWrap display="block">{app.position}</Typography>
        )}
        {app.applied_date && (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
            지원일: {app.applied_date}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          {app.priority && (
            <Chip
              label={app.priority}
              size="small"
              sx={{
                fontSize: '0.65rem',
                height: 20,
                color: app.priority === '높음' ? '#EF4444' : app.priority === '보통' ? '#F59E0B' : '#94A3B8',
              }}
              variant="outlined"
            />
          )}
          {!isGuest && (
            <FormControl size="small" onClick={(e) => e.stopPropagation()}>
              <Select
                value={app.status}
                onChange={(e) => onStatusChange(app.id, e.target.value)}
                variant="standard"
                disableUnderline
                sx={{ fontSize: '0.7rem', color: 'text.secondary' }}
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
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 2,
          minHeight: 400,
        }}
      >
        {KANBAN_STATUSES.map((status) => {
          const found = APPLICATION_STATUSES.find((s) => s.value === status);
          const items = columns[status] ?? [];
          return (
            <Box
              key={status}
              sx={{
                minWidth: 200,
                flex: '0 0 200px',
                bgcolor: 'background.default',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                p: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  textTransform="uppercase"
                  letterSpacing={0.5}
                  sx={{ color: found?.color ?? 'text.secondary' }}
                >
                  {status}
                </Typography>
                <Chip
                  label={items.length}
                  size="small"
                  sx={{ height: 20, fontSize: '0.7rem', bgcolor: found?.bg, color: found?.color }}
                />
              </Box>
              {loading ? (
                <Stack spacing={1}>
                  {[...Array(2)].map((_, i) => <Skeleton key={i} height={80} variant="rounded" />)}
                </Stack>
              ) : (
                <Stack spacing={1}>
                  {items.map((app) => (
                    <KanbanCard key={app.id} app={app} onStatusChange={handleStatusChange} isGuest={isGuest} />
                  ))}
                  {items.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="caption" color="text.secondary">비어있음</Typography>
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
