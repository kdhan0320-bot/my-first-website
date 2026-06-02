# 프로젝트 개발 가이드

## 역할 및 원칙
- 이 프로젝트는 React + MUI 기반 웹 개발 학습 환경입니다
- 모든 답변은 한국어로 작성
- 디자인 시스템과 코드 컨벤션을 반드시 준수하여 개발

## 참조 문서
@docs/design-system.md
@docs/code-convention.md
@docs/new_project.md

## 기술 스택
- React 18 + Vite 5
- Material-UI (MUI) v9
- React Router v7
- JavaScript (TypeScript 미사용)

## 개발 규칙 요약

### 컴포넌트
- 함수형 컴포넌트만 사용
- 파일명은 PascalCase (예: `UserCard.jsx`)
- 페이지 컴포넌트는 `pages/` 폴더에, 공용 컴포넌트는 `components/` 폴더에 배치

### 스타일링
- 인라인 style 속성 사용 금지 → MUI `sx` prop 사용
- 색상은 theme 팔레트에서 가져오기 (예: `color="primary.main"`)
- 간격은 theme.spacing 기준 (1 = 8px)

### 새 프로젝트 시작 시
- `_template_settings` 폴더를 복사해서 시작
- `docs/new_project.md` 가이드 참고

## 프로젝트 구조
```
lecture1/
├── CLAUDE.md            ← 현재 파일
├── docs/
│   ├── design-system.md   색상, 타이포그래피, 컴포넌트 가이드
│   ├── code-convention.md 네이밍, 구조, 패턴 규칙
│   └── new_project.md     새 프로젝트 시작 가이드
└── _template_settings/   MUI 테마 적용된 기본 템플릿
```
