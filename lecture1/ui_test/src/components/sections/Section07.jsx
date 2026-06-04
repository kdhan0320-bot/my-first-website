import { useState } from 'react';
import {
  Box,
  Grid,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import SectionWrapper from '../ui/SectionWrapper';

const Row = ({ label, children }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

const TEMP_MARKS = [
  { value: 0,   label: '0°'   },
  { value: 25,  label: '25°'  },
  { value: 50,  label: '50°'  },
  { value: 75,  label: '75°'  },
  { value: 100, label: '100°' },
];

const Section07 = () => {
  const [volume,      setVolume]      = useState(40);
  const [brightness,  setBrightness]  = useState(70);
  const [range,       setRange]       = useState([20, 60]);
  const [price,       setPrice]       = useState([10000, 80000]);
  const [temperature, setTemperature] = useState(37);

  const handlePriceChange = (_, newValue) => {
    if (newValue[1] - newValue[0] >= 10000) setPrice(newValue);
  };

  return (
    <SectionWrapper number={7} title="Slider" description="MUI Slider의 기본, 범위, 마크, 색상, 수직 방향을 확인합니다.">
      <Stack spacing={5}>

        {/* 기본 Slider — 0~100 · 실시간 값 표시 */}
        <Row label="기본 Slider — 0~100 범위 · 실시간 값 표시">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <VolumeDownIcon color="action" />
                  <Slider
                    value={volume}
                    min={0}
                    max={100}
                    onChange={(_, v) => setVolume(v)}
                    valueLabelDisplay="auto"
                  />
                  <VolumeUpIcon color="action" />
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">볼륨</Typography>
                  <Typography variant="caption" color="primary.main" fontWeight={600}>
                    {volume} / 100
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <BrightnessLowIcon color="action" />
                  <Slider
                    value={brightness}
                    min={0}
                    max={100}
                    onChange={(_, v) => setBrightness(v)}
                    valueLabelDisplay="auto"
                    color="warning"
                  />
                  <BrightnessHighIcon color="action" />
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">밝기</Typography>
                  <Typography variant="caption" color="warning.main" fontWeight={600}>
                    {brightness} / 100
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Row>

        {/* 범위 Slider */}
        <Row label="범위 Slider (Range)">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Slider
                  value={range}
                  min={0}
                  max={100}
                  onChange={(_, v) => setRange(v)}
                  valueLabelDisplay="auto"
                  disableSwap
                />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">기본 범위</Typography>
                  <Typography variant="caption" color="primary.main" fontWeight={600}>
                    {range[0]} — {range[1]}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Slider
                  value={price}
                  min={0}
                  max={200000}
                  step={1000}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(v) => `${v.toLocaleString()}원`}
                  color="secondary"
                  disableSwap
                />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">가격 범위 (최소 간격 1만원)</Typography>
                  <Typography variant="caption" color="secondary.main" fontWeight={600}>
                    {price[0].toLocaleString()}원 — {price[1].toLocaleString()}원
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Row>

        {/* Step · Marks */}
        <Row label="Step · Marks">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Slider defaultValue={50} step={10} marks valueLabelDisplay="auto" />
                <Typography variant="caption" color="text.secondary">step=10, marks</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Slider
                  value={temperature}
                  onChange={(_, v) => setTemperature(v)}
                  marks={TEMP_MARKS}
                  valueLabelDisplay="on"
                  color="error"
                />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">온도 (커스텀 마크)</Typography>
                  <Typography variant="caption" color="error.main" fontWeight={600}>
                    {temperature}°C
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Row>

        {/* 색상 */}
        <Row label="Color">
          <Grid container spacing={3}>
            {['primary', 'secondary', 'success', 'warning', 'error', 'info'].map((color) => (
              <Grid item xs={12} sm={4} key={color}>
                <Stack spacing={0.5}>
                  <Slider defaultValue={60} color={color} valueLabelDisplay="auto" />
                  <Typography variant="caption" color="text.secondary">{color}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Row>

        {/* Size · Disabled */}
        <Row label="Size · Disabled">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <Stack spacing={0.5}>
                <Slider defaultValue={40} size="small" valueLabelDisplay="auto" />
                <Typography variant="caption" color="text.secondary">small</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Stack spacing={0.5}>
                <Slider defaultValue={40} size="medium" valueLabelDisplay="auto" />
                <Typography variant="caption" color="text.secondary">medium (기본)</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Stack spacing={0.5}>
                <Slider defaultValue={40} disabled />
                <Typography variant="caption" color="text.secondary">disabled</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Row>

        {/* 수직 Slider */}
        <Row label='수직 Slider (orientation="vertical")'>
          <Stack direction="row" spacing={5} sx={{ height: 160 }} alignItems="flex-end">
            {[
              { color: 'primary',   value: 30 },
              { color: 'secondary', value: 55 },
              { color: 'success',   value: 80 },
              { color: 'warning',   value: 45 },
              { color: 'error',     value: 65 },
            ].map(({ color, value }) => (
              <Stack key={color} alignItems="center" spacing={1} sx={{ height: '100%' }}>
                <Slider
                  orientation="vertical"
                  defaultValue={value}
                  color={color}
                  valueLabelDisplay="auto"
                  sx={{ height: '100%' }}
                />
                <Typography variant="caption" color="text.secondary">{color}</Typography>
              </Stack>
            ))}
          </Stack>
        </Row>

      </Stack>
    </SectionWrapper>
  );
};

export default Section07;
