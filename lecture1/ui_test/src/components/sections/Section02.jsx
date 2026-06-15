import { useState } from 'react';
import {
  Box,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SectionWrapper from '../ui/SectionWrapper';

const Row = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

const ROLES = ['개발자', '디자이너', '기획자', '마케터'];

const Section02 = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ name: '', email: '', password: '', role: '', bio: '' });

  const handleChange = (field) => (e) =>
    setValues((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <SectionWrapper number={2} title="Input" description="MUI TextField의 variant, 상태, 장식, 실시간 값 표시를 확인합니다.">
      <Stack spacing={4}>

        {/* Variant */}
        <Row label="Variant">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField label="Outlined" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Filled" variant="filled" fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Standard" variant="standard" fullWidth />
            </Grid>
          </Grid>
        </Row>

        {/* 실시간 값 표시 */}
        <Row label="실시간 값 표시">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                label="이름"
                value={values.name}
                onChange={handleChange('name')}
                placeholder="이름을 입력하세요"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Box
                sx={{
                  minHeight: 56,
                  border: '1px solid',
                  borderColor: values.name ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  bgcolor: values.name ? 'primary.50' : 'grey.50',
                  transition: 'all 0.2s',
                }}
              >
                {values.name ? (
                  <Typography variant="body1" color="primary.main" fontWeight={500}>
                    안녕하세요, {values.name}님!
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.disabled">
                    입력값이 여기에 표시됩니다
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Row>

        {/* Helper Text · Required · Error */}
        <Row label="Helper Text / Required / Error">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="이메일"
                helperText="실제 이메일을 입력하세요."
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="닉네임"
                required
                helperText="필수 입력 항목입니다."
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="비밀번호 확인"
                error
                helperText="비밀번호가 일치하지 않습니다."
                fullWidth
              />
            </Grid>
          </Grid>
        </Row>

        {/* Adornment */}
        <Row label="Adornment (장식)">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="검색"
                placeholder="검색어를 입력하세요"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="이메일"
                placeholder="example@email.com"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="비밀번호"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={() => setShowPassword((p) => !p)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Row>

        {/* Select */}
        <Row label="Select">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="직군 선택"
                select
                value={values.role}
                onChange={handleChange('role')}
                helperText={values.role ? `선택됨: ${values.role}` : '항목을 선택하세요.'}
                fullWidth
              >
                <MenuItem value=""><em>선택하세요</em></MenuItem>
                {ROLES.map((role) => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Row>

        {/* Multiline */}
        <Row label="Multiline (Textarea)">
          <TextField
            label="자기소개"
            multiline
            rows={4}
            value={values.bio}
            onChange={handleChange('bio')}
            placeholder="자유롭게 입력하세요."
            helperText={`${values.bio.length} / 200자`}
            inputProps={{ maxLength: 200 }}
            fullWidth
          />
        </Row>

        {/* Size · Disabled */}
        <Row label="Size · Disabled">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField label="Small" size="small" fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Medium (기본)" size="medium" fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Disabled" disabled value="수정 불가" fullWidth />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Read Only" value="읽기 전용" InputProps={{ readOnly: true }} fullWidth />
            </Grid>
          </Grid>
        </Row>

      </Stack>
    </SectionWrapper>
  );
};

export default Section02;
