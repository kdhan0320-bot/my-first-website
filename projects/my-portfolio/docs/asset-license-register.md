# 자산 라이선스 등록부

이 문서는 `projects/my-portfolio`에서 쓰는 폰트/이미지/아이콘/영상/mockup/
template/외부 코드의 출처와 라이선스를 기록한다. 판단 기준은 루트
`CLAUDE.md`의 "저작권 규칙" 절을 따른다.

- 화면에 쓰이는 모든 자산(외부 배포처에서 받은 것, 프로젝트 썸네일/
  스크린샷/favicon 포함)을 이 표에 기록한다. "본인 제작으로 보인다"는
  정황만으로 저작권 확인 대상에서 자동 제외하지 않는다.
- `상태`가 `[저작권 확인 필요]` 또는 `[제작자/권리 확인 필요]`인 항목은
  사용자 확인이나 원본 근거(예: 원본 디자인 파일, 실제 제작 과정 기록)로
  확정되기 전까지 실사용(공개 배포)에 대한 최종 승인 근거로 쓰지 않는다.
- 라이선스명을 확실히 확인하지 못했다면 추측해서 적지 않고 `미확인`으로
  둔다.

| 자산 | 유형 | 출처 | 제작자 | 라이선스 | 웹/포트폴리오 이용 | 수정 | 출처표시 | 확인일 | 상태 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| IBM Plex Sans KR / IBM Plex Mono | 폰트 | fonts.googleapis.com (Google Fonts, `index.html` CDN `<link>`); 원본은 IBM Plex 공식 저장소 | IBM | SIL Open Font License 1.1 | 가능 | 가능(OFL 조건 준수) | 불필요(단순 웹 사용 시 제작자 표시를 강제하는 라이선스는 아님. 폰트 파일을 재배포할 경우 OFL 및 저작권 고지 유지 필요) | 2026-07-20 | 확인함 — 제작자 IBM, 공식 IBM Plex 저장소 기준 SIL Open Font License 1.1을 확인했다. 실제 프로젝트는 폰트 파일을 저장소에 포함하지 않고 Google Fonts CDN으로 로드한다. |
| `@mui/icons-material` (Material Icons) | 아이콘(코드 패키지) | npm 패키지, `node_modules/@mui/icons-material/package.json` | MUI(Material UI) | MIT | 가능 | 가능 | 불필요 | 2026-07-19 | 확인함 — `package.json`의 `"license": "MIT"` 필드와 패키지 내 `LICENSE` 파일 존재를 직접 확인했다. |
| `public/favicon.svg` | 이미지(favicon) | 저장소 내 프로젝트 자체 제작 자산 | 김도한(직접 제작 또는 AI/Figma 보조) | 외부 라이선스 해당 없음 | 가능 | 가능 | 불필요 | 2026-07-20 | 확인함 — 사용자가 프로젝트를 위해 직접 제작하거나 AI/Figma 보조로 생성했고, 외부 이미지·템플릿·회사 로고·브랜드 자산을 무단 사용하지 않았다고 확인했다. |
| `public/jobflow-thumb.svg` | 이미지(썸네일) | 저장소 내 프로젝트 자체 제작 자산 | 김도한(직접 제작 또는 AI/Figma 보조) | 외부 라이선스 해당 없음 | 가능 | 가능 | 불필요 | 2026-07-20 | 확인함 — 사용자가 프로젝트를 위해 직접 제작하거나 AI/Figma 보조로 생성했고, 외부 이미지·템플릿·회사 로고·브랜드 자산을 무단 사용하지 않았다고 확인했다. |
| `public/thumbnails/bus-arrival-ui-thumbnail.png` | 이미지(썸네일) | 저장소 내 프로젝트 자체 제작 자산 | 김도한(직접 제작 또는 AI/Figma 보조) | 외부 라이선스 해당 없음 | 가능 | 가능 | 불필요 | 2026-07-20 | 확인함 — 사용자가 프로젝트를 위해 직접 제작하거나 AI/Figma 보조로 생성했고, 외부 이미지·템플릿·회사 로고·브랜드 자산을 무단 사용하지 않았다고 확인했다. |
| `public/thumbnails/community-feedback-hub.svg` | 이미지(썸네일) | 저장소 내 프로젝트 자체 제작 자산 | 김도한(직접 제작 또는 AI/Figma 보조) | 외부 라이선스 해당 없음 | 가능 | 가능 | 불필요 | 2026-07-20 | 확인함 — 사용자가 프로젝트를 위해 직접 제작하거나 AI/Figma 보조로 생성했고, 외부 이미지·템플릿·회사 로고·브랜드 자산을 무단 사용하지 않았다고 확인했다. |
| `public/thumbnails/minisns-worklog.svg` | 이미지(썸네일) | 저장소 내 프로젝트 자체 제작 자산 | 김도한(직접 제작 또는 AI/Figma 보조) | 외부 라이선스 해당 없음 | 가능 | 가능 | 불필요 | 2026-07-20 | 확인함 — 사용자가 프로젝트를 위해 직접 제작하거나 AI/Figma 보조로 생성했고, 외부 이미지·템플릿·회사 로고·브랜드 자산을 무단 사용하지 않았다고 확인했다. |
| `public/thumbnails/ott-service.png` | 이미지(썸네일) | 저장소 내 프로젝트 자체 제작 자산 | 김도한(직접 제작 또는 AI/Figma 보조) | 외부 라이선스 해당 없음 | 가능 | 가능 | 불필요 | 2026-07-20 | 확인함 — 사용자가 프로젝트를 위해 직접 제작하거나 AI/Figma 보조로 생성했고, 외부 이미지·템플릿·회사 로고·브랜드 자산을 무단 사용하지 않았다고 확인했다. |
| SUIT Variable | 폰트 | npm 패키지 `@sun-typeface/suit`(공식 저장소 `github.com/sun-typeface/SUIT`), `node_modules/@sun-typeface/suit/fonts/variable/woff2/SUIT-Variable.{css,woff2}`를 `src/main.jsx`에서 import(런타임 CDN 아님) | SUNN(sun.fo) | SIL Open Font License 1.1 | 가능 | 가능(OFL 조건 준수) | 불필요(OFL은 단순 사용 시 표시를 강제하지 않음. 폰트 파일 재배포 시 OFL 및 저작권 고지 유지 필요) | 2026-07-21 | 확인함 — `node_modules/@sun-typeface/suit/LICENSE`(SIL OFL 1.1 전문)와 `package.json`의 `"license": "OFL-1.1"` 필드를 직접 확인했다. variable WOFF2 1개 파일만 사용하며 다른 weight/포맷 파일은 import하지 않는다. |

## 갱신 규칙
- 새 외부 폰트/이미지/아이콘/영상/mockup/template/코드를 추가할 때는 위
  표에 한 행을 추가하고, 원 배포처 LICENSE를 직접 연 뒤에만 `상태`를
  "확인함"으로 표시한다.
- "무료"라는 블로그·소개 글만 보고 상태를 "확인함"으로 적지 않는다.
- 프로젝트 썸네일/스크린샷/favicon도 사용자 본인이 "직접 만들었다"고
  확인해주거나 원본 제작 근거(디자인 파일, 제작 과정 기록 등)가 있을
  때만 상태를 "확인함"으로 바꾼다. git 커밋 이력만으로는 제작 경위를
  확정하지 않는다.
- 확인하지 못한 채 화면에 이미 쓰인 자산이 있다면 이 표에 `[저작권 확인
  필요]` 또는 `[제작자/권리 확인 필요]`로 남기고, 공개 배포 전 검토
  대상으로 삼는다.
