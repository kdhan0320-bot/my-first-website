# 코드 컨벤션 가이드

## 네이밍 규칙

### 파일 및 컴포넌트
- 컴포넌트 파일: PascalCase → `UserCard.jsx`, `NavBar.jsx`
- 유틸리티/훅 파일: camelCase → `useAuth.js`, `formatDate.js`
- 상수 파일: camelCase → `constants.js`, `apiConfig.js`

### 변수 및 함수
```js
// 변수: camelCase
const userName = 'Hong';
const isLoggedIn = true;

// 상수: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// 함수: camelCase, 동사 시작
const fetchUserData = async () => {};
const handleButtonClick = () => {};
const formatCurrency = (amount) => {};
```

---

## 폴더 구조

```
src/
├── components/       공용 재사용 컴포넌트
│   ├── ui/          기본 UI 컴포넌트 (Button, Modal 등)
│   └── layout/      레이아웃 컴포넌트 (Header, Footer 등)
├── pages/           페이지 컴포넌트 (라우트 단위)
├── hooks/           커스텀 React 훅
├── utils/           유틸리티 함수
├── constants/       상수 정의
├── theme.js         MUI 테마 설정
├── App.jsx          루트 컴포넌트 + 라우팅
└── main.jsx         진입점
```

---

## 컴포넌트 패턴

### 기본 컴포넌트 구조
```jsx
import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const UserCard = ({ name, email, onEdit }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="h4">{name}</Typography>
      <Typography variant="body2" color="text.secondary">{email}</Typography>
      <Button onClick={handleExpand} size="small" sx={{ mt: 1 }}>
        {expanded ? '접기' : '펼치기'}
      </Button>
    </Box>
  );
};

export default UserCard;
```

### 금지 사항
```jsx
// ❌ 인라인 style 사용 금지
<Box style={{ padding: '16px', color: '#1976d2' }}>

// ✅ sx prop 사용
<Box sx={{ p: 2, color: 'primary.main' }}>

// ❌ 클래스형 컴포넌트 금지
class MyComponent extends React.Component {}

// ✅ 함수형 컴포넌트 사용
const MyComponent = () => {};
```

---

## Props 패턴

```jsx
// Props 구조분해 권장
const ProfileCard = ({ user, onDelete, isAdmin = false }) => {
  // ...
};

// 복잡한 props는 객체로 묶기
const UserList = ({ users, pagination, onPageChange }) => {
  // users: 배열, pagination: { page, limit, total }, onPageChange: 함수
};
```

---

## 이벤트 핸들러 네이밍

```jsx
// 컴포넌트 내부: handle + 행위
const handleSubmit = () => {};
const handleInputChange = () => {};
const handleModalClose = () => {};

// Props로 받는 함수: on + 행위
<Form onSubmit={handleSubmit} onChange={handleInputChange} />
```

---

## 조건부 렌더링

```jsx
// 단순 조건: &&
{isLoading && <CircularProgress />}

// 양자택일: 삼항 연산자
{isLoggedIn ? <Dashboard /> : <Login />}

// 복잡한 조건: 변수로 분리
const content = (() => {
  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  return <DataList items={data} />;
})();

return <Box>{content}</Box>;
```

---

## Import 순서

```jsx
// 1. React
import { useState, useEffect } from 'react';

// 2. 라이브러리
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

// 3. 내부 컴포넌트
import UserCard from '../components/UserCard';

// 4. 유틸/훅
import { formatDate } from '../utils/formatDate';
import useAuth from '../hooks/useAuth';

// 5. 타입/상수
import { ROUTES } from '../constants';
```
