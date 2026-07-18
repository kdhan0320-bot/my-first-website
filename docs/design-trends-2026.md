# 2026 웹 디자인 & 포트폴리오 트렌드 참고

## 문서 정보

- **작성일**: 2026-07-18
- **근거**: 실시간 웹 검색 기반 (하단 출처 목록 참고, 추측 아님)
- **지식 한계**: 학습 데이터는 2026년 1월까지이며, 이 문서는 2026년 7월 검색으로
  보완했습니다. 트렌드는 빠르게 바뀌므로 **6개월~1년 주기로 재검증**을 권장합니다.
  이 문서를 근거로 실제 채용 공고나 최신 사례를 다시 확인하는 걸 추천합니다.
- **적용 범위**: `projects/`, `works/` 전반의 참고 자료입니다. 프로젝트별 구체적인
  hex 값·px·모션 수치는 여기 두지 않고 각 프로젝트의 `docs/` 문서에 따로 기록합니다.

---

## 1. 비주얼 트렌드 (참고용)

- **컬러**: 무채색/미니멀 일변도에서 벗어나 채도 높은 컬러(Y2K·"도파민 디자인")가
  라이프스타일·뷰티·영 타겟 브랜드 쪽에서 다시 부상. 다만 미니멀리즘 자체는 여전히
  업종을 안 타는 안전한 선택으로 남아 있음 — 타겟에 따라 취사선택할 문제입니다.
- **타이포그래피**: 가독성 위주에서 벗어나 대형 헤드라인·커스텀 폰트·움직이는
  텍스트로 "스토리텔링"을 강조하는 흐름.
- **3D·인터랙션**: WebGL 기반 3D 요소, 스크롤 트리거 애니메이션, AR 프리뷰 등
  정적 이미지를 넘어선 몰입형 경험이 늘어남.
- **레이아웃**: 엄격한 그리드 대신 유기적 형태·부드러운 그라디언트·비대칭
  레이아웃이 확산 중.

## 2. 포트폴리오 사이트 자체 트렌드

- 비대칭 레이아웃 + 스크롤/호버 인터랙션 — 반응하는 타이포가 "살아있다"는
  인상을 준다는 관찰이 반복적으로 나옴 (정적 텍스트는 "예스럽다"는 평).
- **케이스 스터디 구성**: 과정(process)부터 보여주기보다, **문제→결과를 먼저
  제시하고 그다음 과정을 풀어내는 순서**가 더 설득력 있다는 게 최근 자료들의
  공통 관찰입니다.
- 개인 사이트 + GitHub/블로그 등 외부 링크를 엮은 하이브리드 포트폴리오도
  흔해지는 추세.
- 미니멀리즘, 3D/촉각적 레이아웃, AI 빌더 활용 등 다양한 접근이 공존 —
  "이게 정답"이라기보다 업종·타겟에 맞춰 고르는 스펙트럼으로 보는 게 정확합니다.

## 3. 접근성·성능 기준선 (트렌드가 아니라 확인된 표준)

- 2026년 기준 실무 표준은 여전히 **WCAG 2.2 (AA 등급)**입니다. WCAG 3.0은 아직
  Working Draft 단계로 정식 확정은 2029년 전후로 예상되어, 지금 맞출 표준은
  2.2입니다.
- EU에서 판매되는 디지털 제품은 European Accessibility Act가 WCAG 2.2 AA를
  법적으로 요구합니다 — 해외 대상 포트폴리오/프리랜스를 고려한다면 참고할
  기준입니다.
- `tools/site-audit-kit`이 이미 대비(contrast), alt 텍스트, heading 구조,
  키보드 탐색, `prefers-reduced-motion` 대응 등을 점검하고 있는데, 이 항목들이
  실제로 WCAG 2.2 AA와 상당 부분 겹칩니다. 즉 새 도구 없이 지금 있는 점검
  도구로 기준선의 많은 부분을 이미 커버하고 있습니다.
- "지속가능성"(이미지 최적화, 가벼운 코드)도 2026년 트렌드 논의에서 반복
  언급되지만, 내용상 Core Web Vitals·성능 최적화와 같은 이야기라 완전히 새로운
  기준은 아닙니다.

## 4. AI 활용 케이스 스터디 작성법

`CLAUDE.md`의 "취업용 포트폴리오 표현 기준"(AI 활용을 숨기지 않고 구체적으로
드러낸다)을 실제 문구로 옮길 때 아래 항목을 채워 넣는 걸 권장합니다. 전부 채울
필요는 없고, 프로젝트 성격에 맞게 고르면 됩니다.

- 어떤 AI 도구/모델을 썼는지 (예: Claude Code, Figma AI 등)
- 무엇을 시켰고, 무엇을 직접 검증·수정·반려했는지 — **구체적 사례 1개 이상**
  (예: "AI가 제안한 A 방식을 실제로 써보니 B 문제가 있어서 C로 바꿨다")
- 왜 이 아키텍처/기술을 골랐는지, 고르지 않은 대안과 그 이유
- 측정 가능한 결과 (응답 속도, 접근성 점수, 완료까지 걸린 시간 등 — **실제로
  측정한 것만**, 지어내지 않음)
- 구성 순서는 "문제 → 접근 → 결정 → 결과"(Problem-Solution-Result)가 범용적으로
  잘 통한다는 게 여러 자료의 공통된 조언입니다.

## 5. my_ai_web에 적용할 때 체크리스트

- [ ] 새 작업은 트렌드를 그대로 베끼지 않고, 목적(취업용 `projects/` vs 실험작
      `works/`)에 맞게 취사선택합니다.
- [ ] `projects/` 배포 전에는 `tools/site-audit-kit` 점검을 최소 1회 통과합니다
      (접근성·반응형 확인).
- [ ] 케이스 스터디에는 위 4번 구조로 AI 활용 과정을 최소 1개 이상 구체적으로
      기록합니다.
- [ ] 이 문서는 6개월~1년 주기로 재검증합니다 — 특히 색상·레이아웃 같은 유행성
      항목은 빨리 낡을 수 있고, 3번(WCAG 등 표준)은 상대적으로 안정적입니다.

---

## 출처

- [Top Web Design Trends for 2026 | Figma](https://www.figma.com/resource-library/web-design-trends/)
- [The 11 Biggest Web Design Trends of 2026 | Wix](https://www.wix.com/blog/web-design-trends)
- [Portfolio design trends for 2026: From AI builds to gamified portfolios | Envato](https://elements.envato.com/learn/portfolio-trends)
- [19 Best Portfolio Design Trends (In 2026) | Colorlib](https://colorlib.com/wp/portfolio-design-trends/)
- [All About Process: Dissecting Case Study Portfolios | Toptal](https://www.toptal.com/designers/ui/case-study-portfolio)
- [UX Case Study Structure: How To Follow UX Recruiters' Logic | uxfol.io](https://blog.uxfol.io/ux-case-study-structure/)
- [AI Ready Developer Portfolio: How to Build Yours for 2026](https://blog.newtum.com/ai-ready-developer-portfolio-2026/)
- [The New Way to Showcase Software Skills | DEV Community](https://dev.to/nicanor_korir/the-new-way-to-showcase-software-skills-in7)
- [AI 시대, 합격하는 디자이너의 조건과 포트폴리오 전략 | OPENPATH](https://blog.openpath.kr/2026-portfolio)
- [2025년 개발자 채용 트렌드와 2026년 전망 | 코드트리](https://www.codetree.ai/blog/2025%EB%85%84-%EA%B0%9C%EB%B0%9C%EC%9E%90-%EC%B1%84%EC%9A%A9-%ED%8A%B8%EB%A0%8C%EB%93%9C%EC%99%80-2026%EB%85%84-%EC%A0%84%EB%A7%9D-ai-%EC%8B%9C%EB%8C%80-%EC%B7%A8%EC%97%85-%EC%A4%80%EB%B9%84/)
- [A Detailed Guide to WCAG Compliance in 2026 | accessibilitychecker.org](https://www.accessibilitychecker.org/guides/wcag/)
- [WCAG 2 Overview | W3C WAI](https://www.w3.org/WAI/standards-guidelines/wcag/)
