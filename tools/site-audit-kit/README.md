# Site Audit Kit

## 목적
Playwright로 실제 브라우저를 열어 배포된 사이트의 스크린샷·콘솔 오류·링크·
반응형 화면을 점검하고, 결과를 `audit-output/report.md`와 스크린샷 PNG로
기록한 뒤 ZIP으로 묶어 ChatGPT 검토용으로 업로드하는 도구다.

## 기본 검사 대상
`tests/target.ts`의 `SECTIONS`와 기본 audit spec은 **my-portfolio** 구조
(Hero/Projects/About·Skills/Contact·Footer 섹션, 텍스트 기준)에 맞춰져
있다. 다른 프로젝트를 그대로 검사 대상으로 바꿔 기본 테스트를 실행해도
"성공"으로 보고하지 않는다 — 자세한 내용은 아래 "다른 프로젝트 검사 방법" 참고.

## 설치 전제
`tools/site-audit-kit`에 `@playwright/test`(Chromium 포함)가 이미 설치돼
있다는 전제로 명령을 실행한다. 새로 설치가 필요하면 먼저 사용자에게 확인한다.

## 실행 명령
```powershell
npm run audit                 # 전체 점검 (playwright test)
npm run audit:headed          # 브라우저 화면을 보면서 실행
npm run audit:ui              # Playwright UI 모드
npm run audit:detailed        # 대형 화면(2560~375px) 상세 점검
npm run audit:detailed:headed # 위 상세 점검을 브라우저 화면 보면서 실행
npm run zip                    # audit-output -> site-audit-result.zip
npm run clean                  # audit-output/screenshots 와 report.md 초기화
```

## TARGET_URL 사용
```powershell
$env:TARGET_URL="https://example.com"; npm run audit
```
`TARGET_URL`을 지정하지 않고 실행하면 `tests/target.ts`/`tests/detailed-target.ts`가
즉시 에러를 던진다(설정 로드 자체는 막지 않고, 실제 URL이 필요한 시점에만
검증한다).

## viewport
- PC: 1440x900 / PC Full HD: 1920x1080 / PC QHD: 2560x1440
- Mobile: 390x844 / Tablet: 820x1180
- 상세 점검(`audit:detailed`)은 2560/1440/1280/1024/834/430/390/375px까지
  추가로 확인한다.

## 결과물
- `audit-output/report.md` — 점검 결과 보고서
- `audit-output/screenshots/*.png` — 섹션별 viewport 스크린샷 +
  `mobile-menu-open.png`
- `site-audit-result.zip` — 위 결과물을 묶은 압축 파일(`npm run zip`)

## 자동 검사와 수동 QA
자동 점검 통과(스크린샷 생성 성공, 콘솔 에러 없음, 링크 200 등)는 "완료"의
필요조건이지 충분조건이 아니다. 생성된 PNG를 실제로 열어 레이아웃·가독성·
정렬을 눈으로 확인해야 완료로 보고할 수 있다. report.md의 모든 결과는
확인함(✅)/실패(❌)/확인 불가(⚠️) 세 가지로만 표기하며, 확인하지 못한 항목을
확인했다고 쓰지 않는다.

## 다른 프로젝트 검사 방법
기본 `tests/`는 my-portfolio 전용이므로, jobflow-dashboard·my-community·
mini_sns·OTT Service 등 다른 프로젝트를 검사할 때는 다음 중 하나로 진행한다.
- 대상 프로젝트의 실제 섹션/텍스트/버튼에 맞는 selector·flow를 새로
  정의한다.
- 또는 저장소 밖의 임시 Playwright 스크립트로 별도 검사한다.

어느 경우든 기본 spec을 그대로 돌려 나온 결과를 그 프로젝트의 검사 결과로
보고하지 않고, 실제로 무엇을 검사했는지 범위를 명시한다.

## 문제 해결
오류가 발생하면 테스트를 삭제하거나 대충 통과시키지 말고 원인을 고친다.
placeholder 이미지를 만들지 않고, 실패한 항목은 report.md에 실패로 기록한다.
selector를 못 찾았다고 성공으로 처리하지 않고, 실행하지 않은 검사를 완료로
기록하지 않는다.

1. **selector를 못 찾는 경우** — 특정 id에만 의존하지 않는다. id → 텍스트 기반 locator → 스크롤 위치 비율
   순서로 fallback한다 (`tests/portfolio-audit.spec.ts`의 `captureSection`, `tests/target.ts`의
   `SECTIONS[].textFallback`/`scrollRatio`에 이미 구현됨). 그래도 못 찾으면 report.md 비고에
   "id/텍스트 모두 없음 - 스크롤 위치 비율로 대체 캡처"라고 남긴다.
2. **로딩 문제** — `waitUntil: 'networkidle'`만 믿지 않는다. GitHub Pages 같은 SPA는 이후에도
   `waitForTimeout`을 함께 조합해야 한다 (`gotoHome` 참고). 필요하면 특정 텍스트/요소가 보일 때까지
   기다리는 로직을 추가한다.
3. **모달 버튼을 못 찾는 경우** — "작업 과정 보기", "상세 보기", "과정 보기", "View", "Detail" 등
   여러 텍스트 후보를 정규식으로 함께 찾는다. 그래도 못 찾으면 실패시키지 말고 "모달 버튼 확인
   불가"로 기록한 뒤 다음 테스트를 계속 진행한다.
4. **모바일 메뉴를 못 찾는 경우** — aria-label(`메뉴 열기`), role button, 텍스트를 함께 탐색한다.
   없으면 "메뉴 버튼 없음/확인 불가"로 기록하고 전체 테스트를 실패시키지 않는다.
5. **새 탭 링크 테스트가 실패하는 경우** — 현재는 `target="_blank"` 구조 확인 + `request.get()` 접속
   가능 여부로 판정한다(팝업 타이밍에 덜 취약함). 이 방식이 안 맞으면 `page.waitForEvent('popup')`
   방식이나 현재 탭 URL 변화 확인으로 대체할 수 있다. 외부 사이트 내부 디자인/기능은 평가하지 않는다.
6. **스크린샷이 흰 화면으로 저장되는 경우** — 캡처 전 대상 요소가 visible인지 확인하고,
   필요하면 대기 시간을 늘린다(현재 300ms, 필요 시 1000~1500ms로 조정). fullPage와 viewport 캡처를
   구분해서 원인을 좁힌다.
7. **ZIP 생성이 실패하는 경우** — Windows PowerShell `Compress-Archive` 경로에 공백이 있을 수
   있으므로 항상 따옴표로 감싼다(아래 "ZIP 생성" 참고).

오류를 고친 뒤에는 항상 아래 순서로 재검증한다: `npm run clean` → `npm run audit:headed` →
스크린샷 파일 목록 확인 → `report.md` 확인 → `npm run zip` → `site-audit-result.zip` 생성 확인.

## ZIP 생성
```powershell
npm run zip
```
`package.json`의 `zip` 스크립트는 `Compress-Archive -Path 'audit-output' -DestinationPath 'site-audit-result.zip' -Force`를
따옴표로 감싸 실행한다. 결과 ZIP은 ChatGPT 업로드용이며, 저장소에 커밋하지 않는다.

## 주의사항
- 이 도구가 만드는 산출물(`audit-output/`, `*.zip`)은 재생성 가능한 로컬
  결과물이며 Git 추적 대상이 아니다.
- 프로젝트 외부 사이트는 내부 디자인/기능을 평가하지 않고 접속 가능 여부만
  기록한다.
- 실제로 실행하지 않은 검사 결과를 만들어 쓰지 않는다.
