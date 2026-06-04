import { useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  ListSubheader,
  Menu,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SectionWrapper from '../ui/SectionWrapper';

const Row = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

const LANGUAGES = [
  { value: 'js',     label: 'JavaScript', color: '#f7df1e' },
  { value: 'ts',     label: 'TypeScript', color: '#3178c6' },
  { value: 'python', label: 'Python',     color: '#3572a5' },
  { value: 'java',   label: 'Java',       color: '#b07219' },
  { value: 'go',     label: 'Go',         color: '#00add8' },
  { value: 'rust',   label: 'Rust',       color: '#dea584' },
];

const CITIES  = ['서울', '부산', '인천', '대구', '광주', '대전', '울산'];
const FRUITS  = ['사과', '바나나', '체리', '포도', '망고', '오렌지', '딸기'];
const GROUPED = [
  { group: '과일', label: '사과' },
  { group: '과일', label: '바나나' },
  { group: '과일', label: '체리' },
  { group: '채소', label: '당근' },
  { group: '채소', label: '브로콜리' },
  { group: '채소', label: '시금치' },
];

const Section04 = () => {
  const [language,    setLanguage]    = useState('');
  const [city,        setCity]        = useState('');
  const [variant,     setVariant]     = useState('');
  const [multiSelect, setMultiSelect] = useState([]);
  const [anchorEl,    setAnchorEl]    = useState(null);
  const [moreAnchor,  setMoreAnchor]  = useState(null);

  const selectedLang = LANGUAGES.find((l) => l.value === language) ?? null;

  return (
    <SectionWrapper number={4} title="Dropdown" description="Select, Menu, Autocomplete 드롭다운 패턴을 확인합니다.">
      <Stack spacing={4}>

        {/* 단일 선택 — 실시간 값 표시 */}
        <Row label="단일 선택 — 실시간 값 표시 (6개 옵션)">
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <InputLabel>언어 선택</InputLabel>
                <Select
                  value={language}
                  label="언어 선택"
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <MenuItem value=""><em>선택하세요</em></MenuItem>
                  {LANGUAGES.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>6개 언어 중 하나를 선택하세요.</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={7}>
              <Box
                sx={{
                  height: '100%',
                  minHeight: 80,
                  border: '1px solid',
                  borderColor: selectedLang ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  px: 3,
                  bgcolor: selectedLang ? 'primary.50' : 'grey.50',
                  transition: 'all 0.2s',
                }}
              >
                {selectedLang ? (
                  <>
                    <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: selectedLang.color, flexShrink: 0 }} />
                    <Typography variant="h3" color="primary.main">{selectedLang.label}</Typography>
                    <Chip label={selectedLang.value.toUpperCase()} size="small" color="primary" variant="outlined" />
                  </>
                ) : (
                  <Typography variant="body2" color="text.disabled">선택된 값이 없습니다</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Row>

        <Divider />

        {/* Select — Variant */}
        <Row label="Select — Variant">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>도시 선택 (Outlined)</InputLabel>
                <Select value={city} label="도시 선택 (Outlined)" onChange={(e) => setCity(e.target.value)}>
                  {CITIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="filled">
                <InputLabel>도시 선택 (Filled)</InputLabel>
                <Select value={city} onChange={(e) => setCity(e.target.value)}>
                  {CITIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="standard">
                <InputLabel>도시 선택 (Standard)</InputLabel>
                <Select value={city} onChange={(e) => setCity(e.target.value)}>
                  {CITIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Row>

        {/* Select — 상태 */}
        <Row label="Select — 상태">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Helper Text</InputLabel>
                <Select value={variant} label="Helper Text" onChange={(e) => setVariant(e.target.value)}>
                  <MenuItem value="a">옵션 A</MenuItem>
                  <MenuItem value="b">옵션 B</MenuItem>
                </Select>
                <FormHelperText>항목을 선택하세요.</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error>
                <InputLabel>Error 상태</InputLabel>
                <Select value="" label="Error 상태">
                  <MenuItem value="a">옵션 A</MenuItem>
                </Select>
                <FormHelperText>선택이 필요합니다.</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth disabled>
                <InputLabel>Disabled</InputLabel>
                <Select value="" label="Disabled">
                  <MenuItem value="a">옵션 A</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Row>

        {/* Multiple Select */}
        <Row label="Multiple Select (Chip)">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>과일 선택 (복수)</InputLabel>
                <Select
                  multiple
                  value={multiSelect}
                  label="과일 선택 (복수)"
                  onChange={(e) => setMultiSelect(e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((v) => <Chip key={v} label={v} size="small" />)}
                    </Box>
                  )}
                >
                  {FRUITS.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                </Select>
                <FormHelperText>여러 항목을 선택할 수 있습니다.</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Row>

        {/* Select — 그룹 */}
        <Row label="Select — 그룹 (ListSubheader)">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>카테고리 선택</InputLabel>
                <Select value="" label="카테고리 선택">
                  <ListSubheader>과일</ListSubheader>
                  <MenuItem value="apple">사과</MenuItem>
                  <MenuItem value="banana">바나나</MenuItem>
                  <MenuItem value="cherry">체리</MenuItem>
                  <Divider />
                  <ListSubheader>채소</ListSubheader>
                  <MenuItem value="carrot">당근</MenuItem>
                  <MenuItem value="broccoli">브로콜리</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Row>

        {/* Menu */}
        <Row label="Menu (버튼 트리거)">
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Box>
              <Button variant="contained" endIcon={<KeyboardArrowDownIcon />} onClick={(e) => setAnchorEl(e.currentTarget)}>
                액션 선택
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => setAnchorEl(null)}>
                  <EditIcon fontSize="small" sx={{ mr: 1 }} /> 수정
                </MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>
                  <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} /> 복사
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: 'error.main' }}>
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> 삭제
                </MenuItem>
              </Menu>
            </Box>

            <Box>
              <Button variant="outlined" startIcon={<MoreVertIcon />} onClick={(e) => setMoreAnchor(e.currentTarget)}>
                더보기
              </Button>
              <Menu
                anchorEl={moreAnchor}
                open={Boolean(moreAnchor)}
                onClose={() => setMoreAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem dense onClick={() => setMoreAnchor(null)}>프로필 보기</MenuItem>
                <MenuItem dense onClick={() => setMoreAnchor(null)}>설정</MenuItem>
                <MenuItem dense onClick={() => setMoreAnchor(null)}>공유</MenuItem>
                <Divider />
                <MenuItem dense onClick={() => setMoreAnchor(null)} sx={{ color: 'error.main' }}>로그아웃</MenuItem>
              </Menu>
            </Box>
          </Stack>
        </Row>

        {/* Autocomplete */}
        <Row label="Autocomplete (검색 가능)">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                options={CITIES}
                renderInput={(params) => <TextField {...params} label="도시 검색" />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                multiple
                options={FRUITS}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip key={option} label={option} size="small" {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => <TextField {...params} label="과일 복수 선택" />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                options={GROUPED}
                groupBy={(option) => option.group}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => <TextField {...params} label="그룹 검색" />}
              />
            </Grid>
          </Grid>
        </Row>

      </Stack>
    </SectionWrapper>
  );
};

export default Section04;
