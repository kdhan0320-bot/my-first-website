/* 대비(WCAG) 스캔 로직 — tests/detailed-audit.spec.ts의 "다크 배경 텍스트 대비 확인" 스텝과
 * scripts/check-contrast.js(수동 크롭 검증용)가 같은 판정 로직(색 대비 계산)을 각자
 * 복붙해서 갖고 있던 것을 이 파일 하나로 합쳤다. page.evaluate()에 함수 참조 그대로
 * 넘겨 브라우저 컨텍스트에서 실행하므로, 이 함수는 외부 클로저를 참조하지 않는
 * 순수 함수여야 한다(인자로만 옵션을 받는다).
 *
 * @param {{ selectors: string, leafOnly?: boolean, maxElements?: number }} options
 *   - selectors: 검사할 엘리먼트 셀렉터(예: 'h1, h2, h3, p, button, a')
 *   - leafOnly: true면 자식 엘리먼트가 없는 leaf 노드만 검사(텍스트가 실제로 그
 *     엘리먼트 자신의 색으로 렌더링되는 경우만 보고 싶을 때 사용, check-contrast.js가 씀)
 *   - maxElements: 검사할 최대 엘리먼트 수(큰 페이지에서 과도한 계산 방지, detailed-audit가 씀)
 * @returns {{ totalScanned: number, low: Array<object> }}
 *   - totalScanned: 실제로 색상 판정까지 시도한 엘리먼트 수(대비 통과/실패 무관)
 *   - low: 기준 대비(24px 이상 3:1, 미만 4.5:1)에 못 미치는 항목 목록
 */
function scanContrastInPage(options) {
  const { selectors, leafOnly = false, maxElements } = options;

  function parseColor(str) {
    const m = str.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
    return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
  }
  function luminance(c) {
    const [r, g, b] = [c.r, c.g, c.b].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function bgColor(el) {
    let node = el;
    while (node) {
      const c = parseColor(getComputedStyle(node).backgroundColor);
      if (c && c.a > 0) return c;
      node = node.parentElement;
    }
    return { r: 255, g: 255, b: 255 };
  }

  let candidates = Array.from(document.querySelectorAll(selectors)).filter(
    (el) => (el.textContent || '').trim().length > 1
  );
  if (leafOnly) candidates = candidates.filter((el) => el.children.length === 0);
  if (maxElements) candidates = candidates.slice(0, maxElements);

  const low = [];
  let idx = 0;
  let totalScanned = 0;
  for (const el of candidates) {
    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none') continue;
    const fg = parseColor(style.color);
    if (!fg) continue;
    totalScanned++;
    const bg = bgColor(el);
    const l1 = luminance(fg) + 0.05;
    const l2 = luminance(bg) + 0.05;
    const ratio = l1 > l2 ? l1 / l2 : l2 / l1;
    const fontSize = parseFloat(style.fontSize);
    const threshold = fontSize >= 24 ? 3 : 4.5;
    const rect = el.getBoundingClientRect();
    if (ratio < threshold && rect.width > 0 && rect.height > 0) {
      low.push({
        idx: idx++,
        text: (el.textContent || '').trim().slice(0, 60),
        tag: el.tagName,
        ratio: Math.round(ratio * 100) / 100,
        threshold,
        fontSize,
        fgColor: style.color,
        bgColorDetected: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
        rect: {
          x: Math.round(rect.x),
          y: Math.round(rect.y) + window.scrollY,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
      });
    }
  }
  return { totalScanned, low };
}

module.exports = { scanContrastInPage };
