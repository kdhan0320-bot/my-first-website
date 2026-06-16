# JobFlow Dashboard

지원 회사, 전형 상태, 포트폴리오 체크리스트, 면접 메모를 한곳에서 관리할 수 있도록 만든 취업 준비 관리 대시보드 프로젝트입니다.

## 제작 목적

취업준비생이 여러 회사의 지원 현황과 준비해야 할 일을 한눈에 파악할 수 있도록 대시보드형 웹서비스를 구현하는 것을 목표로 했습니다.

## 주요 기능

- 로그인 / 회원가입
- 게스트 모드 (샘플 데이터로 체험)
- 지원 회사 CRUD
- 검색 / 필터 / 정렬
- 상태별 칸반 보드
- 포트폴리오 체크리스트
- 면접 메모
- AI 프롬프트 도우미
- 반응형 대시보드 UI

## 사용 기술

React, Vite, MUI, Supabase, React Router, GitHub Pages

## UX/UI 포인트

- 상태 Chip으로 지원 흐름을 빠르게 파악
- 검색과 필터로 지원 회사 탐색 시간 단축
- 체크리스트로 제출 전 실수 방지
- 모바일에서는 카드형 레이아웃으로 전환
- 게스트 모드로 포트폴리오 방문자의 체험 진입 장벽 완화

## DB 구조

| 테이블 | 설명 |
|--------|------|
| profiles | 사용자 프로필 정보 |
| applications | 지원 회사 정보 |
| application_notes | 지원 회사별 메모 |
| portfolio_checklists | 포트폴리오 체크리스트 |
| interview_notes | 면접 준비 메모 |
| prompt_templates | AI 프롬프트 저장 |

## 실행 방법

```bash
npm install
npm run dev
```

## 배포 링크

https://kdhan0320-bot.github.io/my-first-website/jobflow-dashboard/

## 개선 예정

- 드래그앤드롭 칸반 보드
- 캘린더 일정 관리
- 차트 고도화
- CSV Export
- Open Graph 이미지 추가
