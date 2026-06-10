# 새 프로젝트 시작 가이드

## 빠른 시작 (템플릿 사용)

### 1. 템플릿 복사
```bash
# lecture1 디렉토리에서 실행
cp -r _template_settings my-new-project

# 또는 Windows
xcopy /E /I _template_settings my-new-project
```

### 2. 프로젝트 이름 변경
`my-new-project/package.json`에서 `name` 필드 수정:
```json
{
  "name": "my-new-project",
  ...
}
```

### 3. 의존성 설치
```bash
cd my-new-project
npm install
```

### 4. 개발 서버 실행
```bash
npm run dev
```

---

## 프로젝트 초기 설정 체크리스트

### 필수 설정
- [ ] `package.json` 프로젝트 이름 변경
- [ ] `index.html` title 태그 수정
- [ ] `src/App.jsx` 초기 내용 정리
- [ ] `src/theme.js` 프로젝트 색상 커스터마이징

### 폴더 구조 생성
```bash
mkdir -p src/components/ui src/components/layout src/pages src/hooks src/utils src/constants
```

---

## 기본 라우터 설정

`src/App.jsx` 기본 구조:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
```

---

## 페이지 컴포넌트 기본 템플릿

`src/pages/Home.jsx`:
```jsx
import { Box, Container, Typography } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h1" gutterBottom>
          홈 페이지
        </Typography>
        <Typography variant="body1" color="text.secondary">
          여기에 내용을 추가하세요.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
```

---

## 테마 커스터마이징

`src/theme.js`에서 프로젝트 색상 변경:
```js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',   // 원하는 색상으로 변경
    },
    secondary: {
      main: '#dc004e',   // 원하는 색상으로 변경
    },
  },
});

export default theme;
```

---

## 자주 사용하는 MUI 컴포넌트

### 레이아웃
```jsx
import { Container, Box, Grid, Stack } from '@mui/material';

// 페이지 래퍼
<Container maxWidth="lg">...</Container>

// 유연한 박스
<Box sx={{ display: 'flex', gap: 2 }}>...</Box>

// 그리드
<Grid container spacing={2}>
  <Grid item xs={12} md={6}>...</Grid>
</Grid>

// 수직/수평 스택
<Stack direction="row" spacing={2}>...</Stack>
```

### 피드백
```jsx
import { Alert, Snackbar, CircularProgress, Skeleton } from '@mui/material';

// 알림
<Alert severity="success">저장되었습니다!</Alert>

// 로딩
<CircularProgress />
<Skeleton variant="rectangular" width={210} height={60} />
```

---

## 개발 팁

1. **MUI 문서 참고**: https://mui.com/components/
2. **sx prop 우선**: 인라인 style 대신 항상 sx 사용
3. **theme 활용**: 하드코딩 색상/크기 대신 theme 값 사용
4. **반응형 기본**: 모바일 먼저 설계 후 큰 화면으로 확장
