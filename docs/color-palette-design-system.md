# 컬러 팔레트 디자인 시스템

## 프로젝트 정보

- **출처 웹사이트**: PiCKCARE (pickcare.com)
- **분석 날짜**: 2026-06-08
- **상태**: 참고용 레퍼런스 분석 문서입니다. **실제로 적용된 프로젝트는 없습니다**
  (2026-07-18 기준 소스코드 전수 검색 확인). my-portfolio에 실제 적용된 팔레트는
  cyan/blue/emerald/violet 4역할 시스템이며, `projects/my-portfolio/docs/design-reference.md`를
  참고하세요. 이 문서는 향후 다른 프로젝트에서 참고할 범용 레퍼런스로 남겨둡니다.

---

## CSS 변수 정의

```css
:root {
  /* Primary Colors */
  --color-primary:       #1E9BD7;   /* 브랜드 메인 블루 */
  --color-primary-light: #4DB8E8;   /* 호버, 배경 강조 */
  --color-primary-dark:  #1578AA;   /* 활성 상태, 눌린 버튼 */

  /* Secondary Colors */
  --color-secondary:     #7F8FA4;   /* 스틸 블루-그레이 */
  --color-accent:        #FFB800;   /* 골드 강조 */

  /* Background Colors */
  --color-bg-primary:    #8A9BB5;   /* 메인 배경 */
  --color-bg-secondary:  #6B7D96;   /* 섹션 구분 배경 */
  --color-bg-white:      #FFFFFF;   /* 카드, 모달 배경 */
  --color-bg-dark:       #1A1A2E;   /* 다크 섹션 배경 */

  /* Text Colors */
  --color-text-primary:   #1A1A2E;  /* 제목, 기본 텍스트 */
  --color-text-secondary: #555555;  /* 본문 보조 텍스트 */
  --color-text-muted:     #8A9BB5;  /* 힌트, 비활성 텍스트 */
  --color-text-white:     #FFFFFF;  /* 어두운 배경 위 텍스트 */

  /* Border / Outline */
  --color-border:         #E0E4EA;  /* 기본 테두리 */
  --color-border-input:   #C8D0DB;  /* 입력 필드 테두리 */

  /* Interactive Colors */
  --color-button-primary: #1E9BD7;  /* 주요 CTA 버튼 */
  --color-button-hover:   #1578AA;  /* 버튼 호버 상태 */
  --color-button-accent:  #FFB800;  /* 보조 강조 버튼 */
  --color-button-accent-hover: #E6A500; /* 골드 버튼 호버 */

  /* Link Colors */
  --color-link:       #1E9BD7;   /* 기본 링크 */
  --color-link-hover: #1578AA;   /* 링크 호버 상태 */
}
```

---

## 컬러 사용 가이드

### 언제 어떤 색상을 쓸까?

| 상황 | 사용 색상 | 이유 |
|------|----------|------|
| 페이지 메인 CTA 버튼 | `--color-button-primary` (`#1E9BD7`) | 가장 눈에 띄어야 할 행동 유도 |
| 보조 버튼 / 프리미엄 배지 | `--color-accent` (`#FFB800`) | 차별화된 강조 필요 시 |
| 네비게이션 링크 | `--color-link` (`#1E9BD7`) | 브랜드 컬러 일관성 유지 |
| 섹션 배경 구분 | `--color-bg-primary` / `--color-bg-secondary` | 시각적 영역 분리 |
| 카드, 모달 | `--color-bg-white` (`#FFFFFF`) | 콘텐츠 가독성 최우선 |
| 제목 텍스트 | `--color-text-primary` (`#1A1A2E`) | 높은 명도 대비 확보 |
| 본문 설명 텍스트 | `--color-text-secondary` (`#555555`) | 제목보다 덜 강조 |
| 비활성 / 플레이스홀더 | `--color-text-muted` (`#8A9BB5`) | 입력 전 안내 텍스트 |
| 테두리, 구분선 | `--color-border` (`#E0E4EA`) | 레이아웃 구조 표현 |

### 금지 조합 (접근성 WCAG 기준)

| 금지 조합 | 이유 |
|----------|------|
| `#8A9BB5` 배경 + `#FFFFFF` 텍스트 | 명도 대비 3:1 미만 — 소형 텍스트 부적합 |
| `#FFB800` 배경 + `#FFFFFF` 텍스트 | 골드+흰색 대비 부족 |
| `#8A9BB5` 배경 + `#555555` 텍스트 | 유사 명도로 가독성 저하 |

### 권장 조합

| 배경 | 텍스트 | 버튼 |
|------|--------|------|
| `#8A9BB5` | `#FFFFFF` | `#FFB800` (골드) |
| `#FFFFFF` | `#1A1A2E` | `#1E9BD7` (블루) |
| `#1A1A2E` | `#FFFFFF` | `#1E9BD7` (블루) |

---

## 반응형 고려사항

### 다크모드 대응

```css
/* 라이트 모드 (기본) */
:root {
  --color-bg-page:    #8A9BB5;
  --color-bg-card:    #FFFFFF;
  --color-text-main:  #1A1A2E;
  --color-text-sub:   #555555;
}

/* 다크모드 */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-page:    #1A1A2E;
    --color-bg-card:    #243044;
    --color-text-main:  #FFFFFF;
    --color-text-sub:   #A0B0C4;
    --color-border:     #3A4A60;
  }
}
```

### MUI 다크모드 테마 (React)

```js
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({ palette: { mode: 'light', /* ...위 팔레트 참고 */ } });

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4DB8E8' },       // 다크에선 더 밝은 블루
    background: {
      default: '#1A1A2E',
      paper:   '#243044',
    },
    text: {
      primary:   '#FFFFFF',
      secondary: '#A0B0C4',
    },
  },
});
```

### 화면 크기별 색상 활용

```jsx
// 모바일: 배경 단순화, 그라데이션 제거
<Box sx={{
  bgcolor: {
    xs: '#FFFFFF',          // 모바일 — 화이트 단순 배경
    md: '#8A9BB5',          // 태블릿 이상 — 스틸 블루 배경
  },
}} />

// 텍스트 크기에 따른 색상 조절 (작은 텍스트는 더 진하게)
<Typography variant="caption" sx={{ color: '#1A1A2E' }} />   /* 진한 색 필수 */
<Typography variant="h1"      sx={{ color: '#1A1A2E' }} />   /* 일반 */
```

### 접근성 체크리스트

- [ ] 모든 텍스트: 명도 대비 **4.5:1** 이상 (WCAG AA)
- [ ] 버튼 텍스트: 명도 대비 **3:1** 이상
- [ ] 포커스 링: `--color-primary` 계열로 명확히 표시
- [ ] 다크모드에서도 브랜드 아이덴티티 유지 확인

  /* Shadow */
  --shadow-sm:  0 1px 3px rgba(30, 155, 215, 0.12);
  --shadow-md:  0 4px 12px rgba(30, 155, 215, 0.18);
  --shadow-lg:  0 8px 24px rgba(30, 155, 215, 0.24);
}
```

---

## MUI 테마 설정 (React + MUI v9)

```js
// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main:          '#1E9BD7',
      light:         '#4DB8E8',
      dark:          '#1578AA',
      contrastText:  '#FFFFFF',
    },
    secondary: {
      main:          '#7F8FA4',
      light:         '#A0B0C4',
      dark:          '#5E6E82',
      contrastText:  '#FFFFFF',
    },
    warning: {
      main:          '#FFB800',
      light:         '#FFC933',
      dark:          '#E6A500',
      contrastText:  '#1A1A2E',
    },
    background: {
      default:       '#8A9BB5',
      paper:         '#FFFFFF',
    },
    text: {
      primary:       '#1A1A2E',
      secondary:     '#555555',
      disabled:      '#8A9BB5',
    },
    divider: '#E0E4EA',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(30, 155, 215, 0.18)',
        },
      },
    },
  },
});

export default theme;
```

---

## 색상 스와치 & 사용 가이드

### Primary — 브랜드 블루

| 이름 | Hex | 용도 |
|------|-----|------|
| primary.light | `#4DB8E8` | 호버 상태, 배경 강조 |
| primary.main  | `#1E9BD7` | 버튼, 링크, 로고 |
| primary.dark  | `#1578AA` | 활성 상태, 눌린 버튼 |

### Secondary — 스틸 블루-그레이

| 이름 | Hex | 용도 |
|------|-----|------|
| secondary.light | `#A0B0C4` | 배경 레이어 |
| secondary.main  | `#7F8FA4` | 보조 텍스트, 아이콘 |
| secondary.dark  | `#5E6E82` | 강조된 보조 요소 |

### Accent — 골드

| 이름 | Hex | 용도 |
|------|-----|------|
| accent.light | `#FFC933` | 배지, 태그 배경 |
| accent.main  | `#FFB800` | 강조 버튼, 알림 |
| accent.dark  | `#E6A500` | 호버 상태 |

### Background

| 이름 | Hex | 용도 |
|------|-----|------|
| bg.dark    | `#1A1A2E` | 다크 섹션 |
| bg.primary | `#8A9BB5` | 메인 배경 |
| bg.secondary | `#6B7D96` | 섹션 구분 |
| bg.white   | `#FFFFFF` | 카드, 모달 |

### Text

| 이름 | Hex | 용도 |
|------|-----|------|
| text.primary   | `#1A1A2E` | 제목, 기본 텍스트 |
| text.secondary | `#555555` | 본문 보조 텍스트 |
| text.muted     | `#8A9BB5` | 힌트, 비활성 |
| text.white     | `#FFFFFF` | 어두운 배경 위 |

---

## 컴포넌트 사용 예시

### 주요 버튼
```jsx
<Button variant="contained" color="primary">
  시작하기
</Button>

<Button variant="contained" color="warning">
  프리미엄
</Button>
```

### 카드
```jsx
<Card sx={{ borderRadius: 3, boxShadow: 'var(--shadow-md)' }}>
  <CardContent>
    <Typography variant="h3" color="text.primary">카드 제목</Typography>
    <Typography variant="body2" color="text.secondary">설명 텍스트</Typography>
  </CardContent>
</Card>
```

### 배경 섹션
```jsx
/* 메인 히어로 섹션 */
<Box sx={{ bgcolor: 'secondary.main', color: 'white', py: 10 }}>

/* 카드/콘텐츠 영역 */
<Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 3 }}>

/* 다크 푸터 */
<Box sx={{ bgcolor: '#1A1A2E', color: 'white', py: 4 }}>
```

---

## 컬러 사용 비율

| 색상 | Hex | 비율 | 사용 목적 |
|------|-----|------|----------|
| 스틸 블루 (배경) | `#8A9BB5` | 55% | 전체 페이지 배경 |
| 화이트 (카드) | `#FFFFFF` | 20% | 모달, 카드, 입력 필드 |
| 딥 블랙 (제품/텍스트) | `#1A1A2E` | 12% | 제목, 다크 요소 |
| 브랜드 블루 | `#1E9BD7` | 8% | 버튼, 로고, 링크 |
| 골드 (강조) | `#FFB800` | 3% | 강조 버튼, 배지 |
| 그레이 (보조) | `#555555` | 2% | 보조 텍스트 |

---

## 디자인 특징 & 브랜드 느낌

**전체 분위기**: 차분하고 신뢰감 있는 **테크 & 헬스케어** 스타일.
스틸 블루 계열 배경이 전문성과 안정감을 부여하며,
밝은 블루 포인트가 디지털·스마트 서비스 이미지를 강화합니다.
골드 액센트는 프리미엄 느낌과 함께 사용자 시선을 자연스럽게 유도합니다.

**배색 조화 원칙**:
- 블루 계열의 유사색 조화로 통일감 확보
- 골드(보색 계열)로 포인트를 줘 단조로움 방지
- 화이트 카드로 콘텐츠 가독성 극대화

**적합한 서비스 유형**: Q&A 플랫폼, 추천 서비스, 헬스케어 앱, IT 스타트업 포트폴리오
