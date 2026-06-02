# New Project Guide

## 새 프로젝트 빠른 시작

### 1. 템플릿 복사
`_template_settings` 폴더를 새 프로젝트 이름으로 복사합니다.

```powershell
# PowerShell
Copy-Item -Path "lecture1\_template_settings" -Destination "lecture1\새프로젝트명" -Recurse
```

### 2. 프로젝트 이름 변경
복사된 폴더의 `package.json` 에서 `name` 필드를 수정합니다.

```json
{
  "name": "새프로젝트명"
}
```

### 3. 의존성 재설치
```bash
cd 새프로젝트명
npm install
```

### 4. 개발 서버 실행
```bash
npm run dev
# http://localhost:5173 에서 확인
```

---

## 기본 파일 구조 세팅

새 프로젝트 시작 시 `src/` 안에 다음 폴더를 먼저 생성합니다.

```
src/
├── components/
│   ├── common/
│   └── layout/
├── pages/
├── hooks/
├── utils/
└── constants/
```

```powershell
# 폴더 일괄 생성 (PowerShell)
New-Item -ItemType Directory -Force src/components/common, src/components/layout, src/pages, src/hooks, src/utils, src/constants
```

---

## 라우터 기본 설정

### App.jsx 수정
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
```

### 첫 페이지 생성 (src/pages/HomePage.jsx)
```jsx
import { Container, Typography, Box } from '@mui/material';

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h1">홈 페이지</Typography>
        <Typography variant="body1" color="text.secondary">
          프로젝트를 시작해보세요.
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
```

---

## 네비게이션 바 추가

### src/components/layout/Navbar.jsx
```jsx
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
        >
          내 앱
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="inherit" onClick={() => navigate('/')}>홈</Button>
          <Button color="inherit" onClick={() => navigate('/about')}>소개</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
```

### main.jsx 또는 App.jsx에 추가
```jsx
import Navbar from './components/layout/Navbar';

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      {/* 라우트 */}
    </Routes>
  </BrowserRouter>
);
```

---

## 자주 쓰는 컴포넌트 패턴

### 데이터 로딩 화면
```jsx
import { CircularProgress, Box, Typography } from '@mui/material';

const LoadingScreen = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
    <CircularProgress />
    <Typography sx={{ mt: 2 }} color="text.secondary">불러오는 중...</Typography>
  </Box>
);
```

### 에러 화면
```jsx
import { Alert, Button, Box } from '@mui/material';

const ErrorMessage = ({ message, onRetry }) => (
  <Box sx={{ p: 2 }}>
    <Alert
      severity="error"
      action={onRetry && <Button color="inherit" size="small" onClick={onRetry}>재시도</Button>}
    >
      {message}
    </Alert>
  </Box>
);
```

### 빈 상태 화면
```jsx
import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

const EmptyState = ({ message = '데이터가 없습니다' }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, color: 'text.disabled' }}>
    <InboxIcon sx={{ fontSize: 64, mb: 2 }} />
    <Typography variant="body1">{message}</Typography>
  </Box>
);
```

---

## 테마 커스터마이징

`src/theme.js` 에서 프로젝트별로 색상을 변경합니다.

```js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#여기에색상코드',  // 예: '#1976d2' (파랑), '#2e7d32' (초록)
    },
    secondary: {
      main: '#여기에색상코드',
    },
  },
  // 폰트 크기 전체 조정
  typography: {
    fontSize: 14,  // 기본 16px → 14px
  },
  // 컴포넌트 기본 스타일 재정의
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,  // 버튼 그림자 제거
      },
      styleOverrides: {
        root: {
          borderRadius: 8,  // 버튼 둥글기
        },
      },
    },
  },
});

export default theme;
```

---

## 빌드 및 배포

### 빌드
```bash
npm run build
# dist/ 폴더에 결과물 생성
```

### 빌드 미리보기
```bash
npm run preview
# http://localhost:4173 에서 빌드 결과 확인
```

### GitHub Pages 배포
```bash
# 1. vite.config.js에 base 설정 추가
# base: '/레포지토리명/'

# 2. 빌드
npm run build

# 3. dist 폴더를 gh-pages 브랜치에 푸시
npx gh-pages -d dist
```

---

## 자주 발생하는 문제

### 포트 충돌
```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // 기본 5173에서 변경
  },
});
```

### MUI 버전 호환 오류
```bash
npm install --legacy-peer-deps
```

### 환경변수 사용
```bash
# 프로젝트 루트에 .env 파일 생성
VITE_API_URL=https://api.example.com
```
```js
// 코드에서 사용 (VITE_ 접두사 필수)
const apiUrl = import.meta.env.VITE_API_URL;
```
