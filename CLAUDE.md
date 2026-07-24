# Dohan AI Workspace — Claude Rules

## Language
모든 사용자 응답, 질문, 작업 보고는 한국어로 작성한다.
코드·명령·경로·파일명처럼 영어가 필요한 부분만 영어를 사용한다.

Scope: all work under `C:\work\my_ai_web`.

This root file is the only Claude operating standard for this workspace. Do not duplicate it in skill, agent, prompt, or report.
Project/폴더별 nested `CLAUDE.md`는 만들지 않고 쓰지 않는다. 프로젝트 고유의 목적·구조·명령·디자인 스펙·현재 상태는 각 프로젝트의 `README.md` 또는 기존 docs(예: `projects/my-portfolio/docs/design-reference.md`)에서 관리하며, 이 문서들도 이 루트 파일의 안전·승인·워크플로 규칙을 완화하지 못한다.

## 목적
AI 활용 UX/UI·웹퍼블리싱 작업을 장기간 관리하는 개인 작업실이다. 취업용
포트폴리오(`projects/my-portfolio`)뿐 아니라 여러 실제/실험 프로젝트,
Figma 설계, 사이트 검사 도구를 함께 관리한다. 공통 역할 분담과 전체 작업
흐름은 ChatGPT 프로젝트 지침에서 관리하므로 여기서 반복하지 않는다.

## 작업 방식
기본적으로 한 작업에 하나의 coding agent를 쓰고, subagent나 별도
visual-verifier는 쓰지 않는다. `figma-fidelity`, `gh_cli` 스킬은 작업
지시에서 명시적으로 요청받았을 때만 쓴다.

## 폴더
- `projects`: 공개/배포 대상
- `works`: 실험·시안, 아직 대표작 아님
- `docs`: 장기 보관 문서(디자인 시스템, 기획, 협업 문서)
- `tools`: 재사용 도구(예: site-audit-kit)
- `audits`: 재생성 가능한 로컬 검사 산출물
- `assets`: 공용 자산
- `archive`: 과거 작업 보관
- `_inbox`: 미분류
- `_private`: 비공개, git 추적 제외

## Source of Truth
- 디자인: 사용자 승인된 현재 Figma 노드/export
- 코드: 현재 local working tree
- 원격: 현재 GitHub/배포/DB 상태
- 사실: 공식 출처
- 과거 보고서·핸드오프 문서는 참고용일 뿐이다. 현재 파일·실제 상태가
  과거 보고와 다르면 현재 상태를 따른다.

오래된 test가 승인된 디자인과 충돌하면 test를 재검토한다. 승인된 디자인을
test 통과만을 위해 임의로 바꾸지 않는다.

## 허용 범위 (질문 없이 진행)
- 파일 검색(Read/Grep/Glob), `git status`/`diff`/`log`
- 기존 소스코드 수정, 관련 기능 구현
- 승인된 lint/build/관련 test 실행
- localhost 및 Playwright 점검
- 위 범위 안의 일상 작업은 매번 승인을 반복해서 묻지 않는다.

## 사용자 승인 필수
- 기존 소스·자산·문서·폴더의 삭제/이동/rename
- commit, push, PR, merge, deploy
- `git reset`/`rebase`/`clean`
- package, workflow(CI/CD), DB/migration 변경
- `.env*`, `_private/**`, 토큰/secrets 열람·수정·기록

## 작업 태도
- 객관적인 사실과 문제점을 막연한 칭찬보다 먼저 보고한다.
- 큰 작업은 필요한 단계로 나누되, 위 허용 범위 안의 일상 작업마다 사용자
  승인을 반복하지 않는다.
- 현재 단계와 남은 단계를 구분한다.
- 작업 범위를 불필요하게 넓히지 않는다.
- 새 기능보다 기존 프로젝트 마감과 오류 수정을 우선한다.
- ChatGPT가 직접 확인한 사실과 사용자가 승인한 범위를 작업 기준으로 사용한다.
- 별도 요청이 없으면 임시 script, RUN, ZIP, report 시스템을 새로 만들지 않는다.
- 로컬 UI 검사는 기존 package script와 Playwright 설정(예:
  `tools/site-audit-kit`)을 우선 사용한다.
- 포트·프로세스 확인을 위해 netstat, wmic, 임시 node script, curl을
  반복적으로 사용하지 않는다.

## 보안
- `.env*`, `_private/**`, API 키·토큰 값을 코드나 보고서에 노출하지 않는다.
- 시크릿이 필요한 작업은 실제 값 대신 존재 여부만 확인한다.

## 사실성
- 실제 API/DB 연동과 demo, mock, static, 브라우저 메모리 전용 동작을
  구분해서 설명한다(`README.md`의 프로젝트별 연동 방식 참고).
- 검증하지 않은 기능·결과·수치를 만들어내지 않는다. 실행하지 않은 검사를
  PASS로 보고하지 않는다.

## 저작권·자산 라이선스
- 외부 폰트/이미지/아이콘/영상/템플릿/코드를 쓸 때는 출처와 라이선스를
  직접 확인한 뒤에만 사용을 확정한다. "무료로 보인다"는 추측만으로 확인
  완료로 처리하지 않는다.
- 프로젝트별 자산 출처·라이선스 기록은 해당 프로젝트 문서(예:
  `projects/my-portfolio/docs/asset-license-register.md`)에 남긴다.
- 확인하지 못한 자산은 `[저작권 확인 필요]`로 표시하고 공개 배포에 쓰지
  않는다.

## 보고
1. 변경한 파일
2. 핵심 변경
3. 실제 검사와 결과
4. 남은 차이·확인 불가
5. branch·HEAD·최종 status
6. commit·push·deploy 여부

`완료 후보`, `자동 검사 통과·시각 승인 필요`, `수정 필요`, `확인 불가` 중
하나로 표시한다. "완벽", "100% 동일", "문제 없음" 같은 표현은 쓰지 않는다.

## Freeze
30일 또는 실제 프로젝트 3개 동안 새 protocol/skill/agent/폴더 체계를
추가하지 않는다. 같은 문제가 두 번 반복되고 기존 규칙이 실패했으며, 변경이
실제 시간/사용량을 줄일 때만 시스템을 바꾼다.
