import { useMemo } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, LinearProgress,
  Chip, Stack, Divider, Button, Skeleton,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventIcon from '@mui/icons-material/Event';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import useApplications from '../hooks/useApplications';
import { useAuth } from '../context/AuthContext';
import { DEMO_CHECKLISTS, APPLICATION_STATUSES } from '../constants';
import StatusChip from '../components/ui/StatusChip';

const StatCard = ({ icon, title, value, subtitle, color = 'primary.main' }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>
            {title}
          </Typography>
          <Typography variant="h3" fontWeight={700} color={color} sx={{ mt: 0.5 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ p: 1, bgcolor: `${color}15`, borderRadius: 2 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const { isGuest } = useAuth();
  const { applications, loading } = useApplications();

  const stats = useMemo(() => {
    const total = applications.length;
    const active = applications.filter((a) =>
      ['서류 진행', '면접 예정', '지원 완료', '지원 예정'].includes(a.status)
    ).length;
    const interview = applications.filter((a) => a.status === '면접 예정').length;
    const checklists = DEMO_CHECKLISTS;
    const done = checklists.filter((c) => c.is_done).length;
    const checklistRate = checklists.length > 0 ? Math.round((done / checklists.length) * 100) : 0;
    return { total, active, interview, checklistRate, done, checklistTotal: checklists.length };
  }, [applications]);

  const recentApps = applications.slice(0, 5);

  const statusSummary = useMemo(() => {
    const map = {};
    applications.forEach((a) => {
      map[a.status] = (map[a.status] || 0) + 1;
    });
    return Object.entries(map).map(([status, count]) => ({ status, count }));
  }, [applications]);

  return (
    <Box>
      {isGuest && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'warning.light', borderRadius: 2, border: '1px solid', borderColor: 'warning.main' }}>
          <Typography variant="body2" color="warning.dark" fontWeight={600}>
            게스트 모드 — 샘플 데이터로 체험 중입니다. 데이터를 저장하려면 회원가입 후 로그인하세요.
          </Typography>
        </Box>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<WorkIcon sx={{ color: 'primary.main' }} />}
            title="총 지원"
            value={loading ? '-' : stats.total}
            subtitle="개 회사"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<TrendingUpIcon sx={{ color: '#3B82F6' }} />}
            title="진행 중"
            value={loading ? '-' : stats.active}
            color="#3B82F6"
            subtitle="전형 진행"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<EventIcon sx={{ color: '#8B5CF6' }} />}
            title="면접 예정"
            value={loading ? '-' : stats.interview}
            color="#8B5CF6"
            subtitle="건"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<ChecklistIcon sx={{ color: '#22C55E' }} />}
            title="체크리스트"
            value={loading ? '-' : `${stats.checklistRate}%`}
            color="#22C55E"
            subtitle={`${stats.done}/${stats.checklistTotal} 완료`}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">최근 지원 현황</Typography>
                <Button size="small" onClick={() => navigate('/applications')}>
                  전체 보기
                </Button>
              </Box>
              {loading ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} height={48} sx={{ mb: 1 }} />)
              ) : recentApps.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">지원 내역이 없습니다</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/applications/new')}
                  >
                    첫 지원 등록
                  </Button>
                </Box>
              ) : (
                <Stack divider={<Divider />}>
                  {recentApps.map((app) => (
                    <Box
                      key={app.id}
                      sx={{ py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }, borderRadius: 1, px: 1 }}
                      onClick={() => navigate(`/applications/${app.id}`)}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{app.company_name}</Typography>
                        <Typography variant="caption" color="text.secondary">{app.position}</Typography>
                      </Box>
                      <StatusChip status={app.status} />
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>상태별 현황</Typography>
              {statusSummary.length === 0 ? (
                <Typography variant="body2" color="text.secondary">데이터 없음</Typography>
              ) : (
                statusSummary.map(({ status, count }) => {
                  const found = APPLICATION_STATUSES.find((s) => s.value === status);
                  const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <Box key={status} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" fontWeight={600}>{status}</Typography>
                        <Typography variant="caption" color="text.secondary">{count}건 ({pct}%)</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          height: 6,
                          borderRadius: 1,
                          bgcolor: `${found?.color ?? '#ccc'}20`,
                          '& .MuiLinearProgress-bar': { bgcolor: found?.color ?? 'primary.main', borderRadius: 1 },
                        }}
                      />
                    </Box>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">체크리스트 진행률</Typography>
                <Button size="small" onClick={() => navigate('/checklist')}>보기</Button>
              </Box>
              <LinearProgress
                variant="determinate"
                value={stats.checklistRate}
                sx={{ height: 10, borderRadius: 2, mb: 1 }}
                color="success"
              />
              <Typography variant="caption" color="text.secondary">
                {stats.done}/{stats.checklistTotal} 항목 완료 ({stats.checklistRate}%)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
