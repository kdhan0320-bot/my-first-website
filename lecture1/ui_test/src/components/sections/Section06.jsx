import { useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import SectionWrapper from '../ui/SectionWrapper';

const Row = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

const PLANS = [
  { value: 'free',  label: 'Free',  price: '₩0',      desc: '기본 기능 무제한',      color: 'default'   },
  { value: 'pro',   label: 'Pro',   price: '₩9,900',  desc: '고급 기능 + 우선 지원', color: 'primary'   },
  { value: 'team',  label: 'Team',  price: '₩29,900', desc: '팀 협업 + 관리 도구',   color: 'secondary' },
];

const Section06 = () => {
  const [gender,  setGender]  = useState('');
  const [size,    setSize]    = useState('md');
  const [color,   setColor]   = useState('primary');
  const [plan,    setPlan]    = useState('free');

  const selectedPlan = PLANS.find((p) => p.value === plan);

  return (
    <SectionWrapper number={6} title="Radio" description="MUI Radio · RadioGroup의 단일 선택, 색상, 크기, 카드 선택 패턴을 확인합니다.">
      <Stack spacing={4}>

        {/* 단일 선택 + 실시간 표시 */}
        <Row label="RadioGroup — 단일 선택 · FormControlLabel · 실시간 값 표시">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={5}>
              <FormControl>
                <FormLabel>성별을 선택하세요</FormLabel>
                <RadioGroup value={gender} onChange={(e) => setGender(e.target.value)}>
                  <FormControlLabel value="male"   control={<Radio />} label="남성"     />
                  <FormControlLabel value="female" control={<Radio />} label="여성"     />
                  <FormControlLabel value="other"  control={<Radio />} label="기타"     />
                  <FormControlLabel value="none"   control={<Radio />} label="응답 안함" />
                </RadioGroup>
                <FormHelperText>하나만 선택할 수 있습니다.</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={7}>
              <Box
                sx={{
                  minHeight: 80,
                  border: '1px solid',
                  borderColor: gender ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 3,
                  bgcolor: gender ? 'primary.50' : 'grey.50',
                  transition: 'all 0.2s',
                }}
              >
                {gender ? (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="h3" color="primary.main">
                      {{ male: '남성', female: '여성', other: '기타', none: '응답 안함' }[gender]}
                    </Typography>
                    <Chip label={gender} size="small" color="primary" variant="outlined" />
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.disabled">선택된 값이 없습니다</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Row>

        {/* 수평 RadioGroup */}
        <Row label="RadioGroup — 수평 (row)">
          <FormControl>
            <FormLabel>사이즈 선택</FormLabel>
            <RadioGroup row value={size} onChange={(e) => setSize(e.target.value)}>
              {['xs', 'sm', 'md', 'lg', 'xl'].map((s) => (
                <FormControlLabel key={s} value={s} control={<Radio size="small" />} label={s.toUpperCase()} />
              ))}
            </RadioGroup>
          </FormControl>
        </Row>

        {/* 색상 */}
        <Row label="Color">
          <FormControl>
            <FormLabel>색상 선택</FormLabel>
            <RadioGroup row value={color} onChange={(e) => setColor(e.target.value)}>
              {['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'].map((c) => (
                <FormControlLabel key={c} value={c} control={<Radio color={c} />} label={c} />
              ))}
            </RadioGroup>
          </FormControl>
        </Row>

        {/* 상태 */}
        <Row label="상태 — Disabled / Error">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <FormControl>
                <FormLabel>Disabled</FormLabel>
                <RadioGroup defaultValue="a">
                  <FormControlLabel value="a" control={<Radio disabled />} label="옵션 A" />
                  <FormControlLabel value="b" control={<Radio disabled />} label="옵션 B" />
                  <FormControlLabel value="c" control={<Radio disabled />} label="옵션 C" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl error>
                <FormLabel>Error 상태</FormLabel>
                <RadioGroup>
                  <FormControlLabel value="a" control={<Radio />} label="옵션 A" />
                  <FormControlLabel value="b" control={<Radio />} label="옵션 B" />
                  <FormControlLabel value="c" control={<Radio />} label="옵션 C" />
                </RadioGroup>
                <FormHelperText>항목을 선택해야 합니다.</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Row>

        {/* 카드형 플랜 선택 */}
        <Row label="카드형 선택 — 요금제 플랜">
          <Grid container spacing={2}>
            {PLANS.map(({ value, label, price, desc }) => (
              <Grid item xs={12} sm={4} key={value}>
                <Card
                  variant={plan === value ? 'elevation' : 'outlined'}
                  elevation={plan === value ? 4 : 0}
                  sx={{
                    border: '2px solid',
                    borderColor: plan === value ? 'primary.main' : 'divider',
                    transition: 'all 0.2s',
                  }}
                >
                  <CardActionArea onClick={() => setPlan(value)}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="h3" gutterBottom>{label}</Typography>
                          <Typography variant="h2" color="primary.main">{price}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{desc}</Typography>
                        </Box>
                        <Radio
                          checked={plan === value}
                          value={value}
                          onChange={(e) => setPlan(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          color="primary"
                        />
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 2,
              border: '1px solid', borderColor: 'primary.light',
            }}
          >
            <Typography variant="body2">
              선택된 플랜: <strong>{selectedPlan?.label}</strong> — {selectedPlan?.price} / {selectedPlan?.desc}
            </Typography>
          </Box>
        </Row>

      </Stack>
    </SectionWrapper>
  );
};

export default Section06;
