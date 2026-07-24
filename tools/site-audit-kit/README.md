# Site Audit Kit

## 목적
Playwright로 실제 브라우저를 열어 배포된 사이트의 스크린샷·콘솔 오류·링크·
반응형 화면을 점검하고, 결과를 `audit-output/report.md`와 스크린샷 PNG로
기록한 뒤 ZIP으로 묶어 ChatGPT 검토용으로 업로드하는 도구다.

## 원칙
- 실제 Playwright 브라우저로 대상 사이트를 열고 검사한다(모킹·생략 금지).
- 실제 결과 대신 placeholder 스크린샷·검사 결과를 만들지 않는다.
- 자동 검사 통과와 수동 시각 QA는 구분한다(아래 "자동 검사와 수동 QA" 참고).
- 다른 프로젝트를 검사할 때는 대상별 selector·flow가 필요하다(아래 "다른
  프로젝트 검사 방법" 참고).

## 기본 검사 대상
`tests/target.ts`의 `SECTIONS`와 기본 audit spec은 **my-portfolio** 구조
(Hero/Projects/About/Contact·Footer 섹션, 텍스트 기준)에 맞춰져
있다. 다른 프로젝트를 그대로 검사 대상으로 바꿔 기본 테스트를 실행해도
"성공"으로 보고하지 않는다 — 자세한 내용은 아래 "다른 프로젝트 검사 방법" 참고.

## 설치 전제
`tools/site-audit-kit`에 `@playwright/test`(Chromium 포함)가 이미 설치돼
있다는 전제로 명령을 실행한다. 새로 설치가 필요하면 먼저 사용자에게 확인한다.

## 실행 명령
```powershell
npm run audit                 # 전체 점검 (playwright test) - 5개 기본 viewport
npm run audit:headed          # 브라우저 화면을 보면서 실행
npm run audit:ui              # Playwright UI 모드
npm run audit:detailed        # 9개 viewport(390~2560) 상세 점검
npm run audit:detailed:headed # 위 상세 점검을 브라우저 화면 보면서 실행
npm run audit:routes          # 6개 route(회귀) + 200% equivalent reflow proxy (390/1440/2560)
npm run audit:projects        # /projects 전용 6개 viewport(390~2560) — Featured/More Works 공개 사실성·QHD index·link semantics
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
- 기본(`audit`, 5개): PC 1440x900 / PC Full HD 1920x1080 / PC QHD 2560x1440 /
  Mobile 390x844 / Tablet 820x1180
- 상세(`audit:detailed`, 14개): 390 / 430 / 768 / 820 / 1024 / 1366 / 1440 /
  1707 / 1920 / 2048 / 2133 / 2304 / 2480 / 2560 — `tests/detailed-target.ts`의
  `DETAILED_VIEWPORTS`가 기준. 1707/2048/2133/2304/2480은 Phase 5A-R에서 추가한
  QHD scaling proxy(실제 2560 모니터도 OS 배율 125%/150%를 걸면 CSS viewport가
  이 구간으로 내려간다)와 `QHD_DECORATION_MIN_WIDTH`(2480) 경계값이다.
- route 회귀(`audit:routes`, 3개): 390 / 1440 / 2560.
- Projects 전용(`audit:projects`, 11개): 390 / 768 / 1024 / 1440 / 1707 / 1920 /
  2048 / 2133 / 2304 / 2480 / 2560 — `tests/projects-target.ts`의
  `PROJECTS_VIEWPORTS` 기준. QHD index geometry는 2480/2560에서만 visible이고
  index/label rect가 viewport 안에 완전히 들어와야 한다(부분 잘림도 FAIL),
  나머지는 hidden을 확인한다.

## button/link semantics와 N/A·FAIL 기준
Header PROJECTS, Home 상세 CTA 3개, 전체 프로젝트 보기는 실제 URL 이동이라
`<a>`(React Router `Link`)로 구현돼 있다 — 검사는 `getByRole('button', ...)`가
아니라 `getByRole('link', ...)`로 찾는다(`tests/portfolio-audit.spec.ts`의
`getNavLink`). 이 필수 항목들을 못 찾으면 N/A로 조용히 넘기지 않고 **FAIL**로
기록하며 `expect.soft()`로 테스트 결과에도 남긴다(다른 검사는 계속 진행).
N/A는 "이 viewport에는 원래 없는 게 정상"인 항목에만 쓴다(예: desktop에서
모바일 햄버거, mobile에서 desktop 전용 nav).

## route 회귀 (`npm run audit:routes`)
`/`, `#/projects`, `#/projects/jobflow`, `#/projects/bus-arrival`,
`#/projects/feedback-hub`, `#/this-route-does-not-exist` 6개 route를
`page.goto()`로 직접 열어 console error/failed request/가로 스크롤/h1 개수/
404 화면 표시/홈 복귀 링크를 확인한다(390/1440/2560). 결과:
`audit-output/route-regression-results.ndjson`.

같은 spec에 "200% equivalent reflow proxy"도 포함돼 있다 — 실제 브라우저
zoom을 제어할 수 없어 720/640/320 effective width로 overflow·header 가림·
메뉴 접근성을 대신 확인한다(2560 project에서 1회만 실행). "200% 확대
완료"라고 쓰지 않고 이 명칭 그대로 보고에 쓴다.

## 결과물
- `audit-output/report.md` — 점검 결과 보고서
- `audit-output/screenshots/*.png` — 섹션별 viewport 스크린샷 +
  `mobile-menu-open.png`
- `audit-output/projects-results.ndjson` — `audit:projects` 원시 결과(NDJSON, report.md
  없이 raw 기록만 남김 — main landmark/h1/Featured·More Works 카운트/Mini SNS 텍스트
  카운트/QHD index geometry/navigation semantics/console·failed request)
- `site-audit-result.zip` — 위 결과물을 묶은 압축 파일(`npm run zip`)

## 포트폴리오 검토용 리뷰 생성 (`npm run review:build`)
```powershell
npm run review:build
```
my-portfolio 메인 화면과 대표 프로젝트(JobFlow/버스 도착정보 앱/Portfolio
Feedback Hub)를 실제 Chromium으로 캡처해서, ChatGPT 업로드용 검토 HTML/PDF/
스크린샷을 생성하는 명령이다.

- 결과 경로: `audit-output/portfolio-review/`(`index.html`,
  `portfolio-review.pdf`, `assets/*.png`)
- 재생성 가능한 로컬 산출물이며, 이 폴더는 `.gitignore`의 `audit-output/`
  규칙으로 Git 추적·GitHub Pages 배포 대상에서 제외된다.
- 실행 전 `projects/my-portfolio`의 dependency 설치(`npm install`)와
  `tools/site-audit-kit`의 Chromium(`@playwright/test`)이 필요하다.

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
7. **ZIP 생성이 실패하는 경우** — `scripts/create-zip.ps1`이 대상 폴더를 `Resolve-Path`로
   먼저 확인하므로 존재하지 않는 경로면 바로 에러를 던진다. 백슬래시 엔트리가 남아 있으면
   (정상적으로는 발생하지 않아야 함) script 자체가 실패로 끝난다 — 이 경우 대상 폴더를
   다시 확인한다.

오류를 고친 뒤에는 항상 아래 순서로 재검증한다: `npm run clean` → `npm run audit:headed` →
스크린샷 파일 목록 확인 → `report.md` 확인 → `npm run zip` → `site-audit-result.zip` 생성 확인.

## ZIP 생성
```powershell
npm run zip
```
`package.json`의 `zip` 스크립트는 `scripts/create-zip.ps1` 한 곳만 호출한다 — 이 저장소에서
ZIP을 만드는 유일한 공식 경로이며, 다른 곳에 `Compress-Archive` 명령을 따로 복사해 적지
않는다(Windows PowerShell 기본 `Compress-Archive`는 ZIP 엔트리 경로 구분자로 백슬래시를
그대로 저장하는 문제가 있어 Phase 4E에서 실제로 재현·확인됐다 — `create-zip.ps1`은 .NET
`System.IO.Compression.ZipArchive`로 직접 엔트리를 만들어 항상 `/` 구분자를 쓰고, 생성 직후
백슬래시 엔트리 0건을 자체 검증한다). 기본 인자는 `audit-output` → `site-audit-result.zip`이고,
`-SourceDir`/`-DestinationZip` 인자로 다른 폴더(예: Desktop handoff 패키지)에도 재사용할 수
있다. 결과 ZIP은 ChatGPT 업로드용이며, 저장소에 커밋하지 않는다.

## 주의사항
- 이 도구가 만드는 산출물(`audit-output/`, `*.zip`)은 재생성 가능한 로컬
  결과물이며 Git 추적 대상이 아니다.
- 프로젝트 외부 사이트는 내부 디자인/기능을 평가하지 않고 접속 가능 여부만
  기록한다.
- 실제로 실행하지 않은 검사 결과를 만들어 쓰지 않는다.
