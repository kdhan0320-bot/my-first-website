# Code Convention

## 파일 및 폴더 구조

```
src/
├── assets/          # 이미지, 폰트 등 정적 파일
├── components/      # 재사용 가능한 공통 컴포넌트
│   ├── common/      # 버튼, 입력, 모달 등 범용 컴포넌트
│   └── layout/      # 헤더, 푸터, 사이드바 등 레이아웃
├── pages/           # 라우트에 대응하는 페이지 컴포넌트
├── hooks/           # 커스텀 훅
├── utils/           # 순수 유틸리티 함수
├── constants/       # 상수 값 (API URL, 설정 등)
├── theme.js         # MUI 테마 설정
├── App.jsx          # 라우터 설정
└── main.jsx         # 앱 진입점
```

---

## 네이밍 규칙

### 파일명
| 종류 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `UserCard.jsx`, `LoginForm.jsx` |
| 페이지 | PascalCase + Page | `HomePage.jsx`, `ProfilePage.jsx` |
| 훅 | camelCase + use 접두사 | `useAuth.js`, `useFetch.js` |
| 유틸 | camelCase | `formatDate.js`, `validateEmail.js` |
| 상수 | camelCase | `apiEndpoints.js`, `routes.js` |

### 변수 및 함수
```js
// 변수 - camelCase
const userName = 'Kim';
const isLoggedIn = true;
const userList = [];

// 함수 - camelCase, 동사로 시작
const fetchUserData = async () => {};
const handleSubmit = (e) => {};
const formatPrice = (price) => {};

// 상수 - UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// 컴포넌트 - PascalCase
const UserProfile = () => {};
const LoginButton = () => {};
```

### 이벤트 핸들러
```jsx
// handle + 이벤트 + 대상 (선택)
const handleClick = () => {};
const handleSubmit = () => {};
const handleInputChange = (e) => {};
const handleModalClose = () => {};
```

---

## 컴포넌트 작성 규칙

### 기본 구조
```jsx
import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

// props는 구조분해할당으로 받기
const UserCard = ({ name, email, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">{name}</Typography>
      <Typography variant="body2" color="text.secondary">{email}</Typography>
      <Button onClick={handleToggle}>
        {isExpanded ? '접기' : '펼치기'}
      </Button>
      <Button color="error" onClick={onDelete}>삭제</Button>
    </Box>
  );
};

export default UserCard;
```

### Props 기본값
```jsx
// 기본값은 구조분해할당에서 지정
const UserCard = ({ name = '이름 없음', size = 'medium', disabled = false }) => {
  // ...
};
```

### 컴포넌트 분리 기준
- 같은 JSX 블록이 **2번 이상** 반복되면 컴포넌트로 분리
- 컴포넌트 파일이 **150줄** 초과 시 분리 검토
- 로직이 복잡해지면 커스텀 훅으로 분리

---

## MUI 스타일링 규칙

### sx prop 우선 사용
```jsx
// 좋음 - sx prop 사용
<Box sx={{ display: 'flex', gap: 2, p: 3, borderRadius: 1 }}>

// 피하기 - 인라인 style
<Box style={{ display: 'flex', gap: '16px' }}>
```

### sx 단축 속성
```jsx
// 마진/패딩 단축
m  = margin      mx = marginX    my = marginY
mt = marginTop   mb = marginBottom
ml = marginLeft  mr = marginRight

p  = padding     px = paddingX   py = paddingY
pt = paddingTop  pb = paddingBottom
pl = paddingLeft pr = paddingRight

// 크기 단축
w  = width       h  = height
minW = minWidth  maxW = maxWidth
```

### 반응형 값
```jsx
// breakpoint별 다른 값 적용
<Box sx={{
  flexDirection: { xs: 'column', md: 'row' },
  fontSize: { xs: '0.875rem', lg: '1rem' },
  display: { xs: 'none', sm: 'block' },  // 모바일 숨김
}} />
```

---

## Import 순서

```jsx
// 1. React
import React, { useState, useEffect } from 'react';

// 2. 외부 라이브러리 (알파벳 순)
import { useNavigate } from 'react-router-dom';

// 3. MUI 컴포넌트 (알파벳 순)
import { Box, Button, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

// 4. 내부 컴포넌트 (상대 경로)
import UserCard from '../components/UserCard';
import { formatDate } from '../utils/formatDate';

// 5. 스타일/에셋
import './App.css';
```

---

## 상태 관리 패턴

### 로컬 상태 (useState)
```jsx
// 단순 값
const [count, setCount] = useState(0);

// 객체 상태 - 스프레드로 업데이트
const [form, setForm] = useState({ name: '', email: '' });
const handleChange = (e) => {
  setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
};

// 배열 상태
const [items, setItems] = useState([]);
const addItem = (item) => setItems(prev => [...prev, item]);
const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));
```

### 비동기 데이터 패턴
```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetch('/api/data');
      setData(await result.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

---

## 라우팅 규칙

```jsx
// App.jsx - 라우트 정의
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);
```

```jsx
// 페이지 이동
import { useNavigate, useParams, Link } from 'react-router-dom';

const navigate = useNavigate();
navigate('/profile/123');          // 이동
navigate(-1);                       // 뒤로 가기

const { id } = useParams();        // URL 파라미터

<Link to="/about">소개</Link>      // 링크 컴포넌트
```

---

## 금지 패턴

```jsx
// 직접 DOM 조작 금지
document.getElementById('btn').style.color = 'red'; // X
// -> MUI sx 또는 state 사용

// 인덱스를 key로 사용 금지 (순서 변경 시 버그)
items.map((item, index) => <div key={index}>{item}</div>); // X
items.map((item) => <div key={item.id}>{item.name}</div>); // O

// 컴포넌트 내부에 컴포넌트 정의 금지 (리렌더마다 재생성)
const Parent = () => {
  const Child = () => <div>자식</div>; // X
  return <Child />;
};
```
