# 김도한 포트폴리오 루트 작업 규칙

## 목적
이 저장소는 김도한의 취업용 포트폴리오와 대표 프로젝트를 관리하는 작업 폴더입니다.
학원 수업용 테스트 자료, 예제 폴더, 임시 파일은 유지하지 않습니다.

## 최종 유지 대상
- `lecture1/my-portfolio` — 메인 포트폴리오 사이트 (React + Vite + MUI + Supabase)
- `lecture1/jobflow-dashboard` — JobFlow Dashboard 대표 프로젝트
- `lecture1/my-community` — Portfolio Feedback Hub 대표 프로젝트
- `lecture1/OTT Service` — OTT Service 웹퍼블리싱 프로젝트
- `lecture1/mini_sns` — 보조 프로젝트. **참조가 없으면 삭제 후보** (현재는 deploy.yml 배포 + 포트폴리오 카드 링크로 참조 중이므로 유지)

배포는 `.github/workflows/deploy.yml`이 담당하며, 각 프로젝트를 빌드해 GitHub Pages 하위 경로로 배포합니다.

## 삭제 대상 (발견 시 정리)
- 학원용 테스트 프로젝트, 예제 프로젝트
- 강사님 설정 파일
- 사용하지 않는 임시 이미지, 사용하지 않는 테스트 파일
- `node_modules`, `dist`, `.cache`, `.vite`, `.DS_Store`

## 절대 보호
`.git`, `.github`, `.env`, `.env.local`, `package.json`, `package-lock.json`, `vite.config.js`, `src`, `public`, `index.html`

## 보안 규칙
- `.env`, `.env.local` 내용은 절대 출력하지 않는다
- Supabase 키, API 키, 토큰, 비밀번호는 절대 노출하지 않는다
- GitHub push는 사용자가 직접 승인하기 전까지 하지 않는다

## GitHub 정리 규칙
- 불필요한 파일을 삭제한 뒤 `git status`로 확인한다
- 삭제 커밋은 사용자가 승인한 뒤 진행한다
- GitHub Actions workflow를 수정할 때는 어떤 프로젝트가 배포되는지 먼저 영향 분석한다

## 작업 보고
작업 후 아래만 짧게 보고한다.
1. 삭제한 파일/폴더
2. 유지한 파일/폴더
3. 수정한 설정
4. 위험 요소
5. git status 요약
6. 다음 작업

## 언어 설정
- 모든 답변은 한국어로 작성
- 정중하고 친근한 말투 사용
- 기술적 내용을 쉽게 설명

## 프로젝트별 세부 규칙
각 프로젝트 폴더의 `CLAUDE.md`(있는 경우)를 우선 따른다 (예: `lecture1/my-portfolio/CLAUDE.md`).
