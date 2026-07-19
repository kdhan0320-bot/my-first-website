import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Select, MenuItem, FormControl, InputLabel,
  Alert, Grid, Switch, FormControlLabel, Stack,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import useApplications from '../hooks/useApplications';
import { APPLICATION_STATUSES, PRIORITY_OPTIONS, COMPANY_SIZE_OPTIONS } from '../constants';

const INITIAL = {
  company_name: '',
  position: '',
  location: '',
  company_size: '',
  status: '관심',
  applied_date: '',
  deadline: '',
  priority: '보통',
  job_url: '',
  memo: '',
  portfolio_submitted: false,
  resume_submitted: false,
};

const ApplicationFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { applications, add, update } = useApplications();

  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (isEdit && applications.length > 0) {
      const found = applications.find((a) => a.id === id);
      if (found) setForm({ ...INITIAL, ...found });
    }
  }, [isEdit, id, applications]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.company_name.trim()) errs.company_name = '회사명은 필수입니다';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      if (isEdit) await update(id, form);
      else await add(form);
      navigate('/applications');
    } catch (err) {
      setApiError(err.message || '저장 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        {isEdit ? '지원 정보 수정' : '지원 회사 등록'}
      </Typography>

      {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="회사명 *"
                  fullWidth
                  value={form.company_name}
                  onChange={handleChange('company_name')}
                  error={Boolean(errors.company_name)}
                  helperText={errors.company_name}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="직무"
                  fullWidth
                  value={form.position}
                  onChange={handleChange('position')}
                  placeholder="예: UX/UI 디자이너"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="지역"
                  fullWidth
                  value={form.location}
                  onChange={handleChange('location')}
                  placeholder="예: 서울 강남구"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>회사 규모</InputLabel>
                  <Select value={form.company_size} label="회사 규모" onChange={handleChange('company_size')}>
                    <MenuItem value="">선택 안 함</MenuItem>
                    {COMPANY_SIZE_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>지원 상태 *</InputLabel>
                  <Select value={form.status} label="지원 상태 *" onChange={handleChange('status')}>
                    {APPLICATION_STATUSES.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>우선순위</InputLabel>
                  <Select value={form.priority} label="우선순위" onChange={handleChange('priority')}>
                    {PRIORITY_OPTIONS.map((p) => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="지원일"
                  type="date"
                  fullWidth
                  value={form.applied_date}
                  onChange={handleChange('applied_date')}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="마감일"
                  type="date"
                  fullWidth
                  value={form.deadline}
                  onChange={handleChange('deadline')}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label="공고 링크"
                  fullWidth
                  value={form.job_url}
                  onChange={handleChange('job_url')}
                  placeholder="https://"
                  type="url"
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label="메모"
                  fullWidth
                  multiline
                  rows={4}
                  value={form.memo}
                  onChange={handleChange('memo')}
                  placeholder="면접 일정, 특이사항 등을 기록하세요"
                />
              </Grid>
              <Grid size={12}>
                <Stack direction="row" spacing={2}>
                  <FormControlLabel
                    control={<Switch checked={form.resume_submitted} onChange={handleChange('resume_submitted')} />}
                    label="이력서 제출"
                  />
                  <FormControlLabel
                    control={<Switch checked={form.portfolio_submitted} onChange={handleChange('portfolio_submitted')} />}
                    label="포트폴리오 제출"
                  />
                </Stack>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => navigate(-1)} disabled={loading}>
                취소
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? '저장 중...' : isEdit ? '수정 완료' : '등록하기'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ApplicationFormPage;
