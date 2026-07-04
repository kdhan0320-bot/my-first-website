# Mini SNS

관심사 기반 게시글, 프로필, 모임, 채팅, 알림 흐름을 체험할 수 있는 프론트엔드 SNS 데모 프로젝트입니다.

배포 주소: https://kdhan0320-bot.github.io/my-first-website/mini-sns/

---

## 제작 목적

관심사가 같은 사용자가 게임 리뷰와 정보를 공유하고, 댓글과 좋아요를 통해 소통할 수 있는 서비스형 화면을 구현하는 것을 목표로 했습니다. 로그인 없이 둘러보기 기능을 제공해 방문자가 서비스 구조를 빠르게 체험할 수 있도록 설계했습니다.

---

## 주요 기능

- **로그인 / 회원가입** — Supabase Auth 기반 이메일(아이디) 로그인
- **게스트 모드** — 로그인 없이 피드 탐색 가능, 작성 기능은 제한
- **피드 게시글 조회** — Supabase 실시간 데이터 연동, 좋아요 수·댓글 수 표시
- **게시글 작성** — 이미지 업로드, 캡션, 해시태그, 위치 입력
- **댓글 / 좋아요** — 기본 SNS 상호작용 구현
- **프로필** — 내 게시물 그리드 보기, 팔로워·팔로잉 수, 로그아웃
- **모임** — 게임 모임 목록 탐색 (데모 기능)
- **채팅** — 채팅방 목록 및 메시지 UI (데모 기능, 실시간 준비 중)
- **알림** — 좋아요·댓글·팔로우·모임 알림 흐름 (데모 기능)

---

## 사용 기술

| 분류 | 기술 |
|------|------|
| Frontend | React 18, Vite |
| UI | Material-UI (MUI v9) |
| Routing | React Router v7 (HashRouter) |
| Backend / DB | Supabase (Auth, PostgreSQL) |
| 배포 | GitHub Pages |

---

## UX/UI 포인트

- 게스트 모드로 체험 진입 장벽 완화 — 로그인 없이도 피드 탐색 가능
- 피드 중심 구조로 콘텐츠 탐색 흐름 단순화
- 댓글과 좋아요로 기본 SNS 상호작용 구현
- 모임, 채팅, 알림으로 서비스 확장 흐름 구성
- 모바일 환경을 고려한 최대 너비 480px 카드형 레이아웃
- 하단 네비게이션 바로 모바일 UX 최적화

---

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# GitHub Pages 배포
npx gh-pages -d dist --dest mini-sns -r https://github.com/kdhan0320-bot/my-first-website.git -b gh-pages
```

---

## 개선 예정

- 게시글 상세 페이지 고도화
- 이미지 업로드 안정화 (Supabase Storage 연동)
- 채팅 기능 고도화 (Supabase Realtime)
- 알림 기능 실데이터 연동
- 팔로우/팔로잉 기능 고도화
- 접근성 보완

---

## 기술 스택 상세

- **React 18** + **Vite** — 컴포넌트 기반 화면 구성 및 빠른 빌드
- **MUI v9** — 디자인 시스템 기반 UI 컴포넌트 및 테마 토큰
- **React Router v7** — HashRouter 기반 SPA 라우팅 (GitHub Pages 호환)
- **Supabase** — 회원가입·로그인, 게시글·댓글·좋아요 데이터 연동
- **HashRouter** — 새로고침 후에도 라우팅 유지
