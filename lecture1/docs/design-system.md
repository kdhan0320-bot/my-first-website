# Design System

## 색상 팔레트 (Color Palette)

### Primary Colors
| 이름 | 값 | 용도 |
|------|-----|------|
| primary.main | `#1976d2` | 버튼, 링크, 강조 요소 |
| primary.light | `#42a5f5` | 호버 상태, 배경 강조 |
| primary.dark | `#1565c0` | 활성 상태, 눌린 버튼 |
| primary.contrastText | `#ffffff` | primary 배경 위의 텍스트 |

### Secondary Colors
| 이름 | 값 | 용도 |
|------|-----|------|
| secondary.main | `#dc004e` | 보조 강조, 알림, 배지 |
| secondary.light | `#e33371` | 호버 상태 |
| secondary.dark | `#9a0036` | 활성 상태 |

### 상태 색상 (Semantic Colors)
| 이름 | 값 | 용도 |
|------|-----|------|
| success.main | `#2e7d32` | 성공 메시지, 완료 상태 |
| warning.main | `#ed6c02` | 경고 메시지, 주의 상태 |
| error.main | `#d32f2f` | 오류 메시지, 삭제 버튼 |
| info.main | `#0288d1` | 안내 메시지, 정보 표시 |

### 중성 색상 (Neutral)
| 이름 | 값 | 용도 |
|------|-----|------|
| grey[50] | `#fafafa` | 페이지 배경 |
| grey[100] | `#f5f5f5` | 카드 배경, 입력 배경 |
| grey[300] | `#e0e0e0` | 구분선, 테두리 |
| grey[600] | `#757575` | 보조 텍스트 |
| grey[900] | `#212121` | 기본 텍스트 |

---

## 타이포그래피 (Typography)

### 폰트 패밀리
- 기본 폰트: `"Roboto", "Helvetica", "Arial", sans-serif`
- 코드 폰트: `"Roboto Mono", monospace`

### 텍스트 스케일
| 변형(Variant) | 크기 | 굵기 | 용도 |
|--------------|------|------|------|
| h1 | 2.125rem (34px) | 500 | 페이지 대제목 |
| h2 | 1.5rem (24px) | 500 | 섹션 제목 |
| h3 | 1.25rem (20px) | 500 | 카드 제목 |
| h4 | 1.125rem (18px) | 500 | 소제목 |
| h5 | 1rem (16px) | 500 | 작은 제목 |
| h6 | 0.875rem (14px) | 500 | 레이블 제목 |
| body1 | 1rem (16px) | 400 | 본문 텍스트 (기본) |
| body2 | 0.875rem (14px) | 400 | 보조 본문, 설명 |
| caption | 0.75rem (12px) | 400 | 캡션, 힌트 텍스트 |
| button | 0.875rem (14px) | 500 | 버튼 텍스트 (uppercase) |

### 사용 예시
```jsx
<Typography variant="h1">페이지 제목</Typography>
<Typography variant="body1" color="text.secondary">설명 텍스트</Typography>
<Typography variant="caption" color="error">오류 메시지</Typography>
```

---

## 간격 (Spacing)

기준 단위: **8px** (theme.spacing(1) = 8px)

| 값 | 픽셀 | 용도 |
|----|------|------|
| spacing(0.5) | 4px | 아이콘-텍스트 간격 |
| spacing(1) | 8px | 작은 내부 여백 |
| spacing(2) | 16px | 기본 내부 여백 (패딩) |
| spacing(3) | 24px | 컴포넌트 간 여백 |
| spacing(4) | 32px | 섹션 간 여백 |
| spacing(6) | 48px | 큰 섹션 여백 |
| spacing(8) | 64px | 페이지 레이아웃 여백 |

---

## 브레이크포인트 (Breakpoints)

| 이름 | 크기 | 대상 기기 |
|------|------|----------|
| xs | 0px~ | 소형 모바일 |
| sm | 600px~ | 모바일 (가로) / 태블릿 |
| md | 900px~ | 태블릿 (가로) / 작은 노트북 |
| lg | 1200px~ | 데스크탑 |
| xl | 1536px~ | 대형 모바일 |

### 사용 예시
```jsx
// sx prop 반응형
<Box sx={{ width: { xs: '100%', md: '50%' } }} />

// useMediaQuery 훅
const isMobile = useMediaQuery(theme.breakpoints.down('md'));
```

---

## 컴포넌트 가이드

### 버튼 (Button)
```jsx
// 주요 액션
<Button variant="contained" color="primary">저장하기</Button>

// 보조 액션
<Button variant="outlined" color="primary">취소</Button>

// 텍스트 버튼 (강조 없음)
<Button variant="text">더 보기</Button>

// 위험한 액션
<Button variant="contained" color="error">삭제</Button>
```

### 카드 (Card)
```jsx
<Card sx={{ borderRadius: 2, boxShadow: 2 }}>
  <CardContent>
    <Typography variant="h3" gutterBottom>카드 제목</Typography>
    <Typography variant="body2" color="text.secondary">카드 내용</Typography>
  </CardContent>
  <CardActions>
    <Button size="small">자세히 보기</Button>
  </CardActions>
</Card>
```

### 폼 입력 (Form Input)
```jsx
<TextField
  label="이름"
  variant="outlined"
  fullWidth
  helperText="실명을 입력해주세요"
/>

<TextField
  label="비밀번호"
  type="password"
  variant="outlined"
  error
  helperText="비밀번호가 일치하지 않습니다"
/>
```

### 레이아웃 그리드
```jsx
<Container maxWidth="lg">
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      {/* 모바일 전체 / 데스크탑 절반 */}
    </Grid>
    <Grid item xs={12} md={6}>
      {/* 모바일 전체 / 데스크탑 절반 */}
    </Grid>
  </Grid>
</Container>
```

---

## 아이콘 사용법

```jsx
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';

// 버튼과 함께
<Button startIcon={<SearchIcon />}>검색</Button>

// 단독 아이콘 버튼
<IconButton aria-label="홈으로">
  <HomeIcon />
</IconButton>
```

---

## 그림자 (Elevation)

| 레벨 | 용도 |
|------|------|
| elevation={0} | 배경과 동일 (구분선으로 분리) |
| elevation={1} | 기본 카드 |
| elevation={2} | 호버된 카드 |
| elevation={4} | 드롭다운, 팝업 |
| elevation={8} | 모달, 다이얼로그 |
| elevation={16} | 드래그 중인 요소 |
