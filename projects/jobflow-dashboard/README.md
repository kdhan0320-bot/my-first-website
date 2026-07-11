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

## 게스트 모드 안내

로그인 화면의 "데모로 둘러보기" 버튼을 누르면 회원가입 없이 샘플 데이터로 전체 화면을 체험할 수 있습니다.

- 조회, 검색/필터/정렬, 체크리스트 토글, AI 프롬프트 생성 등은 게스트 모드에서도 동작합니다.
- 등록·수정·삭제 등 실제 데이터 저장이 필요한 동작은 게스트 모드에서 제한되며, 관련 버튼은 화면에서 숨김 처리됩니다.
- 실제 데이터 저장/수정이 필요하면 회원가입 후 로그인해서 사용할 수 있습니다.

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
| applications | 지원 회사 정보 (메모 필드 포함) |
| portfolio_checklists | 포트폴리오 체크리스트 항목 |
| interview_notes | 면접 준비 메모 |

모든 테이블에 RLS(Row Level Security)가 적용되어 있어 사용자는 자신의 데이터만 조회 · 수정 · 삭제할 수 있습니다. `anon key`는 공개되어도 되는 키이지만, 실제 데이터 접근 제어는 이 RLS 정책이 담당합니다.

> AI 프롬프트 도우미는 별도 테이블 없이 클라이언트에서 템플릿 텍스트를 생성하는 방식으로 동작하며, 실제 LLM API를 호출하지 않습니다. 생성된 텍스트를 ChatGPT/Claude에 직접 붙여넣어 사용하는 구조입니다.

## 환경변수 설정

```bash
# .env 파일 생성 후 아래 값을 채워주세요
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

- `.env` 파일은 절대 커밋하지 마세요 (`.gitignore`에 포함되어 있습니다)
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

**데모:** https://kdhan0320-bot.github.io/dohan-portfolio/jobflow-dashboard/

> 게스트 모드로 회원가입 없이 기능을 체험할 수 있습니다.

## 한계 및 개선 예정

이 프로젝트는 실제 운영 서비스가 아니라 **취업 포트폴리오용 데모**입니다. 지원 현황, 체크리스트, 면접 메모는 Supabase에 실제로 저장되지만 아래 기능은 아직 없습니다.

- 실시간 알림
- 드래그앤드롭 칸반 보드
- 캘린더 일정 관리
- 통계 차트 (지원 현황 시각화)
- CSV Export
