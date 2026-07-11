# HTML / CSS / JS 역할 분리 설명

## 전통적인 방식 vs React/Vite 방식

전통적인 웹 개발에서는 `html/`, `css/`, `js/` 폴더를 파일 종류별로 분리합니다.
React + Vite 프로젝트에서는 파일 종류가 아닌 **역할(기능)** 단위로 폴더를 구성합니다.

---

## 1. HTML 역할

```
index.html          ← 앱의 단일 진입점 (React 앱이 마운트되는 루트 HTML)
src/pages/          ← 각 화면의 HTML 구조를 JSX로 표현 (페이지 단위)
src/components/     ← 재사용 가능한 UI 조각 (버튼, 카드, 레이아웃 등)
```

- `index.html` 하나로 SPA(Single Page Application)를 구동
- 실제 화면 마크업은 JSX 컴포넌트(`pages/`, `components/`)가 담당
- React Router가 URL에 따라 적절한 페이지 컴포넌트를 렌더링

---

## 2. CSS 역할

```
src/styles/
  global.css        ← 전역 리셋, body, root 스타일
  layout.css        ← 사이드바/메인 레이아웃 관련 CSS
  responsive.css    ← 터치 영역, 모션 감소 접근성, 반응형 유틸리티
src/theme.js        ← MUI 디자인 시스템 (색상, 폰트, 간격, 컴포넌트 스타일)
```

- 컴포넌트 스타일은 MUI `sx` prop으로 처리 (CSS-in-JS)
- 색상/폰트/간격은 `theme.js`에서 중앙 관리
- 전역 CSS는 `src/styles/` 폴더에 역할별로 분리

---

## 3. JS 역할

```
src/hooks/          ← 데이터 요청 및 상태 관리 로직 (useApplications 등)
src/utils/
  formatters.js     ← 날짜, 텍스트 포맷 함수
  statusHelpers.js  ← 상태 색상, 우선순위, 진행률 계산
  promptHelpers.js  ← AI 프롬프트 템플릿 생성
src/context/        ← 전역 상태 (AuthContext - 로그인 상태 관리)
src/lib/            ← 외부 라이브러리 설정 (Supabase 클라이언트)
src/constants/      ← 앱 전체에서 쓰는 상수 데이터 (상태값, 샘플 데이터 등)
```

---

## 4. 현재 프로젝트 전체 폴더 구조

```
jobflow-dashboard/
├── index.html                  ← HTML 진입점
├── .env.example                ← 환경변수 템플릿
├── vite.config.js              ← 빌드 설정
├── docs/
│   └── HTML_CSS_JS_STRUCTURE.md
└── src/
    ├── main.jsx                ← React 앱 마운트
    ├── App.jsx                 ← 라우팅 설정
    ├── index.css               ← styles/ import
    ├── theme.js                ← MUI 테마
    │
    ├── styles/                 ← CSS 역할
    │   ├── global.css
    │   ├── layout.css
    │   └── responsive.css
    │
    ├── utils/                  ← JS 유틸리티 역할
    │   ├── formatters.js
    │   ├── statusHelpers.js
    │   └── promptHelpers.js
    │
    ├── pages/                  ← HTML/화면 역할 (JSX)
    │   ├── LoginPage.jsx
    │   ├── DashboardPage.jsx
    │   ├── ApplicationsPage.jsx
    │   ├── ApplicationDetailPage.jsx
    │   ├── ApplicationFormPage.jsx
    │   ├── KanbanPage.jsx
    │   ├── ChecklistPage.jsx
    │   ├── InterviewPage.jsx
    │   ├── AIPromptPage.jsx
    │   └── SettingsPage.jsx
    │
    ├── components/             ← 재사용 UI 역할 (HTML)
    │   ├── layout/
    │   │   ├── Layout.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── Header.jsx
    │   └── ui/
    │       ├── StatusChip.jsx
    │       └── EmptyState.jsx
    │
    ├── hooks/                  ← JS 데이터 로직 역할
    │   ├── useApplications.js
    │   ├── useChecklist.js
    │   └── useInterviewNotes.js
    │
    ├── context/                ← JS 전역 상태 역할
    │   └── AuthContext.jsx
    │
    ├── lib/                    ← JS 외부 연동 역할
    │   └── supabase.js
    │
    └── constants/              ← JS 상수 데이터 역할
        └── index.js
```

---

## 5. 핵심 차이점 요약

| 구분 | 전통 방식 | React/Vite 방식 |
|------|-----------|-----------------|
| HTML | 페이지별 `.html` 파일 | `index.html` 1개 + JSX 컴포넌트 |
| CSS | `.css` 파일 분리 | `styles/` + MUI `sx` prop + `theme.js` |
| JS | `.js` 파일 분리 | `hooks/` + `utils/` + `context/` + `lib/` |
| 구조 기준 | 파일 타입 | 기능/역할 |
