import { useState, useMemo } from 'react';
import {
  Box, Button, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Card, CardContent, Typography, Chip, Stack, IconButton,
  Skeleton, Alert, useMediaQuery, useTheme, InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import useApplications from '../hooks/useApplications';
import { useAuth } from '../context/AuthContext';
import { APPLICATION_STATUSES } from '../constants';
import StatusChip from '../components/ui/StatusChip';
import EmptyState from '../components/ui/EmptyState';

const ApplicationsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isGuest } = useAuth();
  const { applications, loading, error, remove } = useApplications();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filtered = useMemo(() => {
    let list = [...applications];
    if (search) list = list.filter((a) => a.company_name.includes(search) || a.position?.includes(search) || a.memo?.includes(search));
    if (statusFilter) list = list.filter((a) => a.status === statusFilter);
    if (sortBy === 'newest') list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    if (sortBy === 'oldest') list.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
    if (sortBy === 'company') list.sort((a, b) => a.company_name.localeCompare(b.company_name));
    return list;
  }, [applications, search, statusFilter, sortBy]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (isGuest) return;
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try { await remove(id); } catch { /* ignore */ }
  };

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>지원 회사 목록</Typography>
        {!isGuest && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/applications/new')}
            sx={{ minWidth: { xs: 44, sm: 'auto' } }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>지원 회사 추가</Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>추가</Box>
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ pb: '16px !important' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              placeholder="회사명, 직무 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>상태 필터</InputLabel>
              <Select value={statusFilter} label="상태 필터" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="">전체</MenuItem>
                {APPLICATION_STATUSES.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>정렬</InputLabel>
              <Select value={sortBy} label="정렬" onChange={(e) => setSortBy(e.target.value)}>
                <MenuItem value="newest">최신순</MenuItem>
                <MenuItem value="oldest">오래된순</MenuItem>
                <MenuItem value="company">회사명순</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      {loading ? (
        <Stack spacing={1}>
          {[...Array(4)].map((_, i) => <Skeleton key={i} height={60} variant="rounded" />)}
        </Stack>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search || statusFilter ? '해당 조건의 지원 내역이 없습니다' : '지원 내역이 없습니다'}
          description={search || statusFilter ? '다른 검색어나 필터를 선택해보세요.' : '첫 번째 지원 회사를 등록해보세요.'}
          action={!isGuest && !search && !statusFilter ? () => navigate('/applications/new') : undefined}
          actionLabel="지원 회사 추가"
        />
      ) : isMobile ? (
        <Stack spacing={1.5}>
          {filtered.map((app) => (
            <Card
              key={app.id}
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
              onClick={() => navigate(`/applications/${app.id}`)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1, mr: 1 }}>
                    <Typography variant="body1" fontWeight={700}>{app.company_name}</Typography>
                    <Typography variant="caption" color="text.secondary">{app.position}</Typography>
                    {app.location && <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>• {app.location}</Typography>}
                  </Box>
                  <StatusChip status={app.status} />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'flex-end' }}>
                  {!isGuest && (
                    <>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/applications/${app.id}/edit`); }} aria-label="수정">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={(e) => handleDelete(app.id, e)} aria-label="삭제" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>회사명</TableCell>
                <TableCell>직무</TableCell>
                <TableCell>지역</TableCell>
                <TableCell>지원일</TableCell>
                <TableCell>상태</TableCell>
                <TableCell align="center">우선순위</TableCell>
                {!isGuest && <TableCell align="center">관리</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((app) => (
                <TableRow
                  key={app.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/applications/${app.id}`)}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{app.company_name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{app.position || '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{app.location || '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{app.applied_date || '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    <StatusChip status={app.status} />
                  </TableCell>
                  <TableCell align="center">
                    {app.priority && (
                      <Chip
                        label={app.priority}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          color: app.priority === '높음' ? '#EF4444' : app.priority === '보통' ? '#F59E0B' : '#94A3B8',
                        }}
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  {!isGuest && (
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); navigate(`/applications/${app.id}/edit`); }}
                        aria-label="수정"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={(e) => handleDelete(app.id, e)} aria-label="삭제" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ApplicationsPage;
