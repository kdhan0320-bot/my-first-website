import { useState } from 'react';
import {
  Box, Container, TextField, Typography, Chip,
  Card, CardContent, Grid, IconButton, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import Navbar from '../components/layout/Navbar';

const weatherDatabase = {
  서울: {
    city: '서울', country: 'KR', temp: 24, feelsLike: 22, humidity: 58, windSpeed: 3.2,
    description: '맑음', condition: 'sunny',
    forecast: [
      { day: '월', temp: 25, minTemp: 18, condition: 'sunny', description: '맑음' },
      { day: '화', temp: 22, minTemp: 16, condition: 'cloudy', description: '구름 많음' },
      { day: '수', temp: 19, minTemp: 14, condition: 'rainy', description: '비' },
      { day: '목', temp: 21, minTemp: 15, condition: 'cloudy', description: '흐림' },
      { day: '금', temp: 26, minTemp: 19, condition: 'sunny', description: '맑음' },
    ],
  },
  부산: {
    city: '부산', country: 'KR', temp: 27, feelsLike: 28, humidity: 72, windSpeed: 5.1,
    description: '구름 많음', condition: 'cloudy',
    forecast: [
      { day: '월', temp: 28, minTemp: 22, condition: 'cloudy', description: '구름 많음' },
      { day: '화', temp: 26, minTemp: 21, condition: 'rainy', description: '비' },
      { day: '수', temp: 24, minTemp: 20, condition: 'rainy', description: '소나기' },
      { day: '목', temp: 27, minTemp: 22, condition: 'cloudy', description: '흐림' },
      { day: '금', temp: 29, minTemp: 23, condition: 'sunny', description: '맑음' },
    ],
  },
  제주: {
    city: '제주', country: 'KR', temp: 29, feelsLike: 31, humidity: 80, windSpeed: 6.8,
    description: '맑음', condition: 'sunny',
    forecast: [
      { day: '월', temp: 30, minTemp: 24, condition: 'sunny', description: '맑음' },
      { day: '화', temp: 29, minTemp: 23, condition: 'sunny', description: '맑음' },
      { day: '수', temp: 27, minTemp: 22, condition: 'cloudy', description: '구름 조금' },
      { day: '목', temp: 28, minTemp: 23, condition: 'sunny', description: '맑음' },
      { day: '금', temp: 31, minTemp: 25, condition: 'sunny', description: '맑음' },
    ],
  },
  도쿄: {
    city: '도쿄', country: 'JP', temp: 26, feelsLike: 28, humidity: 65, windSpeed: 2.8,
    description: '흐림', condition: 'cloudy',
    forecast: [
      { day: '월', temp: 27, minTemp: 21, condition: 'rainy', description: '비' },
      { day: '화', temp: 24, minTemp: 19, condition: 'rainy', description: '비' },
      { day: '수', temp: 25, minTemp: 20, condition: 'cloudy', description: '흐림' },
      { day: '목', temp: 28, minTemp: 22, condition: 'sunny', description: '맑음' },
      { day: '금', temp: 29, minTemp: 23, condition: 'sunny', description: '맑음' },
    ],
  },
  뉴욕: {
    city: '뉴욕', country: 'US', temp: 18, feelsLike: 16, humidity: 45, windSpeed: 8.2,
    description: '맑음', condition: 'sunny',
    forecast: [
      { day: '월', temp: 20, minTemp: 12, condition: 'sunny', description: '맑음' },
      { day: '화', temp: 19, minTemp: 11, condition: 'cloudy', description: '구름 많음' },
      { day: '수', temp: 15, minTemp: 9, condition: 'rainy', description: '비' },
      { day: '목', temp: 17, minTemp: 10, condition: 'cloudy', description: '흐림' },
      { day: '금', temp: 22, minTemp: 14, condition: 'sunny', description: '맑음' },
    ],
  },
  런던: {
    city: '런던', country: 'GB', temp: 14, feelsLike: 12, humidity: 78, windSpeed: 6.5,
    description: '흐림', condition: 'rainy',
    forecast: [
      { day: '월', temp: 15, minTemp: 10, condition: 'rainy', description: '비' },
      { day: '화', temp: 13, minTemp: 9, condition: 'rainy', description: '비' },
      { day: '수', temp: 12, minTemp: 8, condition: 'cloudy', description: '흐림' },
      { day: '목', temp: 16, minTemp: 11, condition: 'cloudy', description: '구름 많음' },
      { day: '금', temp: 18, minTemp: 12, condition: 'sunny', description: '맑음' },
    ],
  },
};

const popularCities = ['서울', '부산', '제주', '도쿄', '뉴욕', '런던'];

const bgGradients = {
  sunny: 'linear-gradient(160deg, #1565c0 0%, #42a5f5 100%)',
  cloudy: 'linear-gradient(160deg, #455a64 0%, #90a4ae 100%)',
  rainy: 'linear-gradient(160deg, #263238 0%, #546e7a 100%)',
  snowy: 'linear-gradient(160deg, #4fc3f7 0%, #e1f5fe 100%)',
};

const WeatherIcon = ({ condition, size = 'medium' }) => {
  const fontSize = size === 'large' ? 88 : size === 'medium' ? 40 : 26;
  const sx = { fontSize };

  switch (condition) {
    case 'sunny': return <WbSunnyIcon sx={{ ...sx, color: '#FFD54F' }} />;
    case 'cloudy': return <CloudIcon sx={{ ...sx, color: '#B0BEC5' }} />;
    case 'rainy': return <ThunderstormIcon sx={{ ...sx, color: '#90CAF9' }} />;
    case 'snowy': return <AcUnitIcon sx={{ ...sx, color: '#E1F5FE' }} />;
    default: return <WbSunnyIcon sx={{ ...sx, color: '#FFD54F' }} />;
  }
};

const WeatherPage = () => {
  const [search, setSearch] = useState('');
  const [weather, setWeather] = useState(weatherDatabase['서울']);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (city) => {
    const result = weatherDatabase[city.trim()];
    if (result) {
      setWeather(result);
      setNotFound(false);
    } else {
      setNotFound(true);
    }
    setSearch('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch(search);
  };

  const bg = bgGradients[weather.condition] ?? bgGradients.sunny;

  return (
    <Box sx={{ minHeight: '100vh', background: bg, color: 'white' }}>
      <Navbar />

      <Container maxWidth="sm" sx={{ py: 4 }}>
        {/* 검색창 */}
        <TextField
          fullWidth
          placeholder="도시 이름을 검색하세요 (예: 서울, 도쿄)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => handleSearch(search)} sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.8)' },
              '&.Mui-focused fieldset': { borderColor: 'white' },
            },
            '& input::placeholder': { color: 'rgba(255,255,255,0.6)', opacity: 1 },
          }}
        />

        {/* 인기 도시 칩 */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
          {popularCities.map((city) => (
            <Chip
              key={city}
              label={city}
              onClick={() => handleSearch(city)}
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.4)',
                '&:hover': { background: 'rgba(255,255,255,0.15)', borderColor: 'white' },
              }}
            />
          ))}
        </Box>

        {notFound && (
          <Typography sx={{ mt: 2, textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            도시를 찾을 수 없습니다. 목록: {Object.keys(weatherDatabase).join(', ')}
          </Typography>
        )}

        {/* 현재 날씨 */}
        <Box sx={{ textAlign: 'center', mt: 5, mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 300, opacity: 0.9 }}>
            {weather.city}, {weather.country}
          </Typography>
          <Box sx={{ my: 2 }}>
            <WeatherIcon condition={weather.condition} size="large" />
          </Box>
          <Typography sx={{ fontSize: '6rem', fontWeight: 200, lineHeight: 1 }}>
            {weather.temp}°
          </Typography>
          <Typography variant="h5" sx={{ mt: 1, fontWeight: 300, opacity: 0.85 }}>
            {weather.description}
          </Typography>
        </Box>

        {/* 상세 정보 */}
        <Card sx={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
          <CardContent>
            <Grid container textAlign="center">
              <Grid item xs={4}>
                <ThermostatIcon sx={{ opacity: 0.8 }} />
                <Typography variant="caption" display="block" sx={{ opacity: 0.7 }}>체감온도</Typography>
                <Typography variant="h6">{weather.feelsLike}°C</Typography>
              </Grid>
              <Grid item xs={4} sx={{ borderLeft: '1px solid rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                <WaterDropIcon sx={{ opacity: 0.8 }} />
                <Typography variant="caption" display="block" sx={{ opacity: 0.7 }}>습도</Typography>
                <Typography variant="h6">{weather.humidity}%</Typography>
              </Grid>
              <Grid item xs={4}>
                <AirIcon sx={{ opacity: 0.8 }} />
                <Typography variant="caption" display="block" sx={{ opacity: 0.7 }}>바람</Typography>
                <Typography variant="h6">{weather.windSpeed}m/s</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 5일 예보 */}
        <Card sx={{ mt: 2, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
          <CardContent>
            <Typography variant="caption" sx={{ opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 }}>
              5일 예보
            </Typography>
            <Grid container sx={{ mt: 1 }}>
              {weather.forecast.map((f, i) => (
                <Grid
                  item xs
                  key={f.day}
                  sx={{
                    textAlign: 'center',
                    borderRight: i < 4 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                    px: 0.5,
                  }}
                >
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>{f.day}</Typography>
                  <Box sx={{ my: 0.5 }}>
                    <WeatherIcon condition={f.condition} size="small" />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{f.temp}°</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.5 }}>{f.minTemp}°</Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default WeatherPage;
