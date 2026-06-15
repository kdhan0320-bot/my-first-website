# Portfolio Feedback Hub

수강생과 취업준비생이 포트폴리오, 과제, 취업 정보를 공유하고 피드백을 주고받을 수 있도록 만든 커뮤니티형 게시판 프로젝트입니다.

배포 주소: https://kdhan0320-bot.github.io/my-first-website/my-community/

---

## 제작 목적

포트폴리오와 학습 정보를 공유하는 커뮤니티 화면을 구성하며, 게시글 작성, 검색, 댓글, 좋아요 같은 기본적인 소통 흐름을 구현하는 것을 목표로 했습니다.

---

## 주요 기능

- **로그인 / 회원가입** — Supabase Auth 기반 아이디/비밀번호 로그인
- **데모로 둘러보기** — 회원가입 없이 게시글 탐색 가능한 게스트 모드
- **게시글 목록** — 전체 게시글 카드형 그리드 표시
- **게시글 검색** — 제목, 내용, 해시태그 실시간 검색
- **게시글 작성 / 수정 / 삭제** — Supabase 데이터 연동
- **랜덤 이미지 첨부** — 게시글에 이미지 추가 가능
- **해시태그** — 최대 5개 태그 추가 및 검색 연동
- **댓글 / 대댓글** — 2단계 댓글 구조 구현
- **댓글 좋아요 / 게시글 좋아요** — 실시간 반영
- **조회수** — 게시글 상세 접속 시 자동 카운트

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

- 게스트 모드로 로그인 없이 게시글 탐색 — 포트폴리오 방문자 접근성 개선
- 카드형 게시글 UI로 목록 가독성 향상
- 제목·내용·해시태그 통합 검색으로 탐색 흐름 개선
- Skeleton UI와 오류/빈 상태 메시지로 로딩 경험 개선
- 댓글·대댓글 구조로 소통 흐름 구현
- 모바일 환경을 고려한 반응형 레이아웃

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
npx gh-pages -d dist --dest my-community -r https://github.com/kdhan0320-bot/my-first-website.git -b gh-pages
```

---

## 개선 예정

- 게시글 카테고리 필터 추가
- 이미지 업로드 방식 개선 (Supabase Storage 연동)
- 마이페이지 기능 추가
- 접근성 보완
- 포트폴리오 피드백 전용 카테고리 추가

---

## 기술 스택 상세

- **React 18** + **Vite** — 컴포넌트 기반 화면 구성 및 빠른 빌드
- **MUI v9** — 디자인 시스템 기반 UI 컴포넌트 및 테마 토큰
- **React Router v7** — HashRouter 기반 SPA 라우팅 (GitHub Pages 호환)
- **Supabase** — 회원가입·로그인, 게시글·댓글·좋아요·조회수 데이터 연동
