# 디자인 시스템 가이드

## 색상 팔레트

### Primary Colors
- `primary.main`: #1976d2 (파란색)
- `primary.light`: #42a5f5
- `primary.dark`: #1565c0

### Secondary Colors
- `secondary.main`: #dc004e (빨간색)
- `secondary.light`: #ff5c8d
- `secondary.dark`: #9a0036

### 기타 색상
- `error.main`: #d32f2f
- `warning.main`: #ed6c02
- `info.main`: #0288d1
- `success.main`: #2e7d32

### 사용법
```jsx
// sx prop으로 색상 사용
<Typography color="primary.main">텍스트</Typography>
<Box sx={{ bgcolor: 'secondary.light' }}>박스</Box>
```

---

## 타이포그래피

### 폰트
- 기본 폰트: Roboto (Google Fonts / @fontsource/roboto)

### 텍스트 계층
| Variant | 크기 | 용도 |
|---------|------|------|
| h1 | 2.125rem | 페이지 대제목 |
| h2 | 1.5rem | 섹션 제목 |
| h3 | 1.25rem | 서브 섹션 제목 |
| h4 | 1.125rem | 카드 제목 |
| body1 | 1rem | 본문 텍스트 |
| body2 | 0.875rem | 보조 텍스트 |
| caption | 0.75rem | 설명, 레이블 |

### 사용법
```jsx
<Typography variant="h1">대제목</Typography>
<Typography variant="body1">본문 내용</Typography>
<Typography variant="caption" color="text.secondary">부가 설명</Typography>
```

---

## 간격 시스템

- 기준 단위: 8px (theme.spacing(1) = 8px)
- `spacing(0.5)` = 4px
- `spacing(1)` = 8px
- `spacing(2)` = 16px
- `spacing(3)` = 24px
- `spacing(4)` = 32px

```jsx
<Box sx={{ p: 2, mt: 3, mb: 1 }}>
  {/* p: padding 16px, mt: margin-top 24px, mb: margin-bottom 8px */}
</Box>
```

---

## 공통 컴포넌트 가이드

### Button
```jsx
// 주요 액션
<Button variant="contained" color="primary">저장</Button>

// 보조 액션
<Button variant="outlined" color="secondary">취소</Button>

// 텍스트 버튼
<Button variant="text">더보기</Button>
```

### Card
```jsx
<Card sx={{ maxWidth: 345, borderRadius: 2 }}>
  <CardContent>
    <Typography variant="h4" gutterBottom>제목</Typography>
    <Typography variant="body2" color="text.secondary">설명</Typography>
  </CardContent>
  <CardActions>
    <Button size="small">자세히</Button>
  </CardActions>
</Card>
```

### TextField
```jsx
<TextField
  label="이름"
  variant="outlined"
  fullWidth
  required
/>
```

---

## 반응형 브레이크포인트

| 이름 | 크기 | 대상 |
|------|------|------|
| xs | 0px | 모바일 |
| sm | 600px | 태블릿 |
| md | 900px | 소형 데스크탑 |
| lg | 1200px | 대형 데스크탑 |
| xl | 1536px | 초대형 화면 |

```jsx
<Box sx={{
  width: { xs: '100%', sm: '50%', md: '33%' }
}}>
  반응형 박스
</Box>
```
