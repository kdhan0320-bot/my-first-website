# Site Audit Kit Automation Rules

이 프로젝트는 웹사이트를 Playwright로 자동 점검하는 도구다.

## 목적
- 실제 브라우저로 사이트를 열고 클릭한다.
- PC, PC Full HD, 모바일, 태블릿 화면을 실제 PNG로 저장한다.
- 기능 테스트 결과를 `audit-output/report.md`로 기록한다.
- 결과를 ZIP으로 묶어 ChatGPT에 업로드할 수 있게 한다.

## 절대 금지
- 실제 스크린샷 대신 placeholder 이미지를 만들지 않는다.
- 확인하지 못한 내용을 확인했다고 쓰지 않는다.
- 프로젝트 외부 사이트 내부 디자인/기능을 평가하지 않는다 (접속 가능 여부만 기록).
- 실제 없는 성과 수치를 만들지 않는다.
- 구현하지 않은 기능을 구현한 것처럼 쓰지 않는다.

## 기본 viewport
- PC: 1440x900
- PC Full HD: 1920x1080
- Mobile: 390x844
- Tablet: 820x1180

(`tests/target.ts`의 `VIEWPORTS`에서 정의. 여기에 항목을 추가하면 `playwright.config.ts`의
projects와 스크린샷 파일 목록에 자동 반영된다.)

## 결과물
- `audit-output/report.md`
- `audit-output/screenshots/*.png` (섹션별 5장 × viewport + `mobile-menu-open.png`)
- `site-audit-result.zip` (`npm run zip`)

## 보고 기준
report.md의 모든 결과는 다음 네 가지로만 표기한다 (`tests/global-teardown.ts` 참고):
- 확인한 내용 (✅ 확인함): 실제로 실행/관찰하여 성공을 확인
- 실패한 내용 (❌ 실패): 실제로 실행하여 실패를 확인
- 확인 불가 (⚠️ 확인 불가): 대상이 없거나 자동 점검 범위 밖
- 추측: 만들지 않는다 (본 도구는 항상 "없음"으로 표기)

## 실행
```powershell
npm run audit          # 전체 점검
npm run audit:headed   # 브라우저 화면 보면서 실행
npm run audit:ui       # Playwright UI 모드
npm run zip            # audit-output -> site-audit-result.zip
npm run clean          # audit-output/screenshots 와 report.md 초기화
$env:TARGET_URL="https://example.com"; npm run audit   # 다른 사이트 점검
```

## 오류 발생 시 대응 원칙
Playwright 실행 중 오류가 나면 테스트를 삭제하거나 대충 통과시키지 말고 원인을 고친다.
placeholder 이미지를 만들지 않고, 실패한 항목은 report.md에 실패로 기록한다.

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
   가능 여부로 판정한다 (팝업 타이밍에 덜 취약함). 이 방식이 안 맞으면 `page.waitForEvent('popup')`
   방식이나 현재 탭 URL 변화 확인으로 대체할 수 있다. 외부 사이트 내부 디자인/기능은 평가하지 않는다.
6. **스크린샷이 흰 화면으로 저장되는 경우** — 캡처 전 대상 요소가 visible인지 확인하고,
   필요하면 대기 시간을 늘린다(현재 300ms, 필요 시 1000~1500ms로 조정). fullPage와 viewport 캡처를
   구분해서 원인을 좁힌다.
7. **ZIP 생성이 실패하는 경우** — Windows PowerShell `Compress-Archive` 경로에 공백이 있을 수
   있으므로 항상 따옴표로 감싼다 (`package.json`의 `zip` 스크립트 참고).

오류를 고친 뒤에는 항상 아래 순서로 재검증한다: `npm run clean` → `npm run audit:headed` →
스크린샷 파일 목록 확인 → `report.md` 확인 → `npm run zip` → `site-audit-result.zip` 생성 확인.
