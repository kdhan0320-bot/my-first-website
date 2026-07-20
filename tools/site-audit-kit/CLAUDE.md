# Site Audit Kit Automation Rules

이 프로젝트는 웹사이트를 Playwright로 자동 점검하는 도구다. 실행 명령,
결과물 경로, 문제 해결 절차는 `tools/site-audit-kit/README.md`를 따르며
여기서 반복하지 않는다.

## 절대 금지
- 실제 Playwright 브라우저로 대상 사이트를 열고 검사한다(모킹·생략 금지).
- 실제 스크린샷 대신 placeholder 이미지를 만들지 않는다.
- 확인하지 못한 내용을 확인했다고 쓰지 않는다.
- 프로젝트 외부 사이트 내부 디자인/기능을 평가하지 않는다 (접속 가능 여부만 기록).
- 실제 없는 성과 수치를 만들지 않는다.
- 구현하지 않은 기능을 구현한 것처럼 쓰지 않는다.
- 오류가 나면 테스트를 삭제하거나 실패를 무조건 통과 처리하지 않는다.
  selector를 못 찾아도 성공 처리하지 않는다.

## 기본 viewport
- PC: 1440x900 / PC Full HD: 1920x1080 / PC QHD: 2560x1440
- Mobile: 390x844 / Tablet: 820x1180

(`tests/target.ts`의 `VIEWPORTS`, `tests/detailed-target.ts`의 `DETAILED_VIEWPORTS`에서
정의. 여기에 항목을 추가하면 각 `playwright*.config.ts`의 projects와 스크린샷 파일
목록에 자동 반영된다. detailed 쪽 대형 화면 완료 기준은
`projects/my-portfolio/CLAUDE.md`를 따른다.)

## 자동 검사와 수동 시각 QA는 분리한다
자동 점검 통과(스크린샷 생성 성공, 콘솔 에러 없음, 링크 200 등)는 "완료"의
필요조건이지 충분조건이 아니다. 실제 전체 페이지 PNG를 직접 열어 레이아웃/
가독성/정렬을 눈으로 확인해야 그 작업을 완료로 보고할 수 있다. 자동 결과만
보고 완료로 처리하지 않는다.

## 보고 기준
report.md의 모든 결과는 다음 네 가지로만 표기한다 (`tests/global-teardown.ts` 참고):
- 확인한 내용 (✅ 확인함): 실제로 실행/관찰하여 성공을 확인
- 실패한 내용 (❌ 실패): 실제로 실행하여 실패를 확인
- 확인 불가 (⚠️ 확인 불가): 대상이 없거나 자동 점검 범위 밖
- 추측: 만들지 않는다 (본 도구는 항상 "없음"으로 표기)

## 다른 프로젝트 검사 시 주의
`tests/target.ts`의 `SECTIONS`와 기본 audit spec은 my-portfolio의 섹션·텍스트
구조를 기준으로 만들어졌다. 다른 프로젝트(jobflow-dashboard, my-community,
mini_sns, OTT Service 등)를 검사할 때 기본 테스트를 그대로 실행해 성공했다고
보고하지 않는다. 대상별 selector·flow를 별도로 정의하거나 저장소 밖 임시
Playwright 스크립트를 사용하고, 실제로 검사한 범위를 보고서에 명시한다.
