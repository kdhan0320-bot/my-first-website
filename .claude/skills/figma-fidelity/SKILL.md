---
name: figma-fidelity
description: Figma 디자인을 코드로 구현할 때 node 잠금, 실제 asset 배치, deviation 기록 절차를 따르게 한다. Figma 기준 화면을 구현·수정할 때 사용한다.
---

# Figma → Code 충실도 규칙

`C:\work\my_ai_web\CLAUDE.md`의 Source of Truth·안전 규칙 중 "디자인 구현 =
승인된 Figma node·version" 항목을 실행하는 절차입니다.

## 절차

1. 구현 전 최종 node ID와 screenshot을 잠급니다. 이후 근거로 삼습니다.
2. 구현 회차 중에는 Figma 디자인을 수정하지 않습니다. Figma를 바꿔야 할
   사실성 문제를 발견하면 별도의 디자인 수정 회차로 분리합니다.
3. Figma frame의 geometry·타입·색·간격을 우선 기준으로 구현합니다.
4. 실제 프로젝트 이미지는 Figma media frame 안에 삽입합니다.
   - 실제 화면을 edge-to-edge로 넣어 전체 구도를 바꾸지 않습니다.
   - `object-fit: contain` 또는 승인된 crop 규칙을 사용합니다.
   - 실제 화면을 가짜 placeholder UI로 대체하지 않습니다.
5. Figma와 다른 구현은 DEVIATION 표로 남깁니다.

   | 차이 | 이유 | 사용자 영향 | 승인 여부 |
   |---|---|---|---|

6. 특정 폭 기준의 디자인은 그 폭의 CSS viewport 기준으로 판단합니다.
   물리 모니터 해상도와 OS 배율(Windows scaling)을 혼동하지 않습니다.
7. 디자인에 없는 중간 폭(예: 태블릿 폭)은 별도 적응 규칙을 적용하되,
   최종 Figma의 시각 언어를 유지합니다.

## 검증

- Figma와 browser native-size 스크린샷을 비교합니다.
- 주요 요소 bounding box를 비교합니다.
- 실제 폰트가 로드된 상태로 확인합니다.
- 텍스트·버튼·카드 clip이 0인지 확인합니다.
- 구현한 에이전트가 스스로 완료 판정을 내리지 않고, 독립 검토자(다른
  세션·사용자)가 차이를 판정합니다.
