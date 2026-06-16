# JobFlow Dashboard

지원 회사, 전형 상태, 포트폴리오 체크리스트, 면접 메모를 한곳에서 관리할 수 있도록 만든 취업 준비 관리 대시보드 프로젝트입니다.

## 제작 목적

취업준비생이 여러 회사의 지원 현황과 준비해야 할 일을 한눈에 파악할 수 있도록 대시보드형 웹서비스를 구현하는 것을 목표로 했습니다. SNS나 커뮤니티가 아닌, 데이터 정리와 상태 관리에 집중한 실무형 SaaS 스타일 UI입니다.

## 주요 기능

- 로그인 / 회원가입 (Supabase Auth)
- 게스트 모드 (샘플 데이터로 기능 체험)
- 지원 회사 CRUD (등록 / 수정 / 삭제)
- 검색 / 상태 필터 / 정렬
- 전형 상태별 칸반 보드
- 포트폴리오 체크리스트 (진행률 표시)
- 면접 메모 (중요도 / 복습 완료 관리)
- AI 프롬프트 도우미 (자소서 / 면접 / 포트폴리오 / 지원동기)
- 반응형 대시보드 UI

## 사용 기술

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 18, Vite 5 |
| UI 라이브러리 | Material-UI (MUI) v9 |
| 라우팅 | React Router v7 |
| 백엔드 / DB | Supabase (Auth + PostgreSQL + RLS) |
| 배포 | GitHub Pages, GitHub Actions |

## UX/UI 포인트

- 상태 Chip으로 전형 흐름을 빠르게 파악
- 검색과 필터로 지원 회사 탐색 시간 단축
- 체크리스트로 포트폴리오 제출 전 실수 방지
- 모바일에서는 카드형 레이아웃으로 전환
- 게스트 모드로 방문자의 체험 진입 장벽 완화
- AI 프롬프트 도우미로 자소서 · 면접 준비 흐름 보조

## 폴더 구조

```
src/
├── styles/       전역 CSS (global, layout, responsive)
├── utils/        유틸 함수 (formatters, statusHelpers, promptHelpers)
├── pages/        페이지 컴포넌트
├── components/   재사용 UI 컴포넌트
├── hooks/        데이터 요청 커스텀 훅
├── context/      전역 상태 (AuthContext)
├── lib/          Supabase 클라이언트 설정
└── constants/    상수 / 샘플 데이터
```

> HTML/CSS/JS 역할 분리 상세 설명: [docs/HTML_CSS_JS_STRUCTURE.md](docs/HTML_CSS_JS_STRUCTURE.md)

## Supabase DB 구조

| 테이블 | 설명 |
|--------|------|
| profiles | 사용자 프로필 (이름, 목표 직무) |
| applications | 지원 회사 정보 |
| application_notes | 지원 회사별 메모 |
| portfolio_checklists | 포트폴리오 체크리스트 항목 |
| interview_notes | 면접 준비 메모 |
| prompt_templates | AI 프롬프트 저장 |

모든 테이블에 RLS(Row Level Security)가 적용되어 있습니다. 사용자는 자신의 데이터만 조회 · 수정 · 삭제할 수 있습니다.

## 환경변수 설정

```bash
# .env 파일 생성 후 아래 값을 채워주세요
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

- `.env` 파일은 절대 커밋하지 마세요 (`.gitignore`에 포함되어 있습니다)
- `anon key`는 공개 키이지만 RLS 정책이 실제 보안을 담당합니다
- GitHub Pages 배포 시 GitHub Actions Secrets에 환경변수를 등록해주세요

## 실행 방법

```bash
# 의존성 설치
npm install

# .env 파일 생성 (.env.example 참고)
cp .env.example .env

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 배포 링크

**데모:** https://kdhan0320-bot.github.io/my-first-website/jobflow-dashboard/

> 게스트 모드로 회원가입 없이 기능을 체험할 수 있습니다.

## 개선 예정

- 드래그앤드롭 칸반 보드
- 캘린더 일정 관리
- 통계 차트 (지원 현황 시각화)
- CSV Export
