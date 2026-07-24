import fs from 'fs';
import path from 'path';
import { test, expect, type Page } from '@playwright/test';
import { assertTargetUrl, SCREENSHOT_DIR, DETAILED_RESULTS_FILE, DETAILED_VIEWPORTS } from './detailed-target';
import { scanContrastInPage } from '../scripts/contrast-scan';

// Phase 5A-R: QhdSectionIndex/QhdAmbientSignal 표시 기준이 `theme.js`의
// QHD_DECORATION_MIN_WIDTH(2480)로 바뀌었다. site-audit-kit은 별도 Node
// 패키지라 my-portfolio의 MUI 기반 theme.js를 직접 import할 수 없어(빌드
// 시스템이 다름), 같은 값을 여기서도 상수로 미러링한다 — `theme.js`의
// QHD_DECORATION_MIN_WIDTH를 바꾸면 이 값도 함께 바꿔야 한다.
const QHD_DECORATION_MIN_WIDTH = 2480;

/* Phase 4E: qhdSignalGeometry는 Phase 4D까지 수치만 기록하고 실패로 연결하지
 * 않았다(감사 도구가 "기록만 하고 통과시키는" 신뢰성 문제) — 아래 표는 각
 * variant의 Figma 실측 기준 기대값이고, 실제 assertion은 expect.soft()로
 * 걸어 하나라도 어긋나면 `npm run audit:detailed`가 실패하게 한다.
 * 2560/1920 side-scene(hero-left/about-right/featured-left/selected-right)은
 * width/height 360x620을, contact-left/right는 각 viewport gutter 폭 기준
 * 정사각형을 기대한다. 1440 이하 7개 viewport는 6개 variant 전부 visible:false만
 * 확인한다(그 외 수치는 렌더되지 않아 의미가 없다). */
type QhdExpectation = {
  documentTop?: number;
  sectionRelativeTop?: number;
  left?: number;
  rightGap?: number; // viewport 오른쪽 끝에서 rect.right까지 거리
  width?: number;
  height?: number;
  overlapsContent?: boolean;
};
const QHD_TOLERANCE = 2;
const QHD_SIZE_TOLERANCE = 1;

// Phase 5A-R: 표시 기준이 2480으로 바뀌면서 실제 visible을 기대하는 viewport는
// desktop-2560/desktop-2480 둘뿐이다(그 사이 1707/1920/2048/2133/2304는 전부
// hidden). left/rightGap은 gutter offset 상수(hero/about: 470, featured/selected: 440)를
// `calc((100vw-1440)/2 - offset)`로 그대로 계산한 값이고, contact 폭은
// `calc((100vw-1440)/2)`(560 상한)이다.
const QHD_EXPECTED: Record<string, Record<string, QhdExpectation>> = {
  'desktop-2560': {
    'hero-left': { documentTop: 250, left: 90, width: 360, height: 620 },
    'about-right': { sectionRelativeTop: 260, rightGap: 90, width: 360, height: 620 },
    'featured-left': { sectionRelativeTop: 1278, left: 120, width: 360, height: 620 },
    'selected-right': { sectionRelativeTop: -123, rightGap: 120, width: 360, height: 620 },
    'contact-left': { width: 560, height: 560, overlapsContent: false },
    'contact-right': { width: 560, height: 560, overlapsContent: false },
  },
  'desktop-2480': {
    'hero-left': { documentTop: 250, left: 50, width: 360, height: 620 },
    'about-right': { sectionRelativeTop: 260, rightGap: 50, width: 360, height: 620 },
    'featured-left': { sectionRelativeTop: 1278, left: 80, width: 360, height: 620 },
    'selected-right': { sectionRelativeTop: -123, rightGap: 80, width: 360, height: 620 },
    'contact-left': { width: 520, height: 520, overlapsContent: false },
    'contact-right': { width: 520, height: 520, overlapsContent: false },
  },
};
const QHD_HIDDEN_VIEWPORTS = [
  'desktop-2304', 'desktop-2133', 'desktop-2048', 'desktop-1920', 'desktop-1707',
  'desktop-1440', 'desktop-1366', 'tablet-1024', 'tablet-820', 'mobile-768', 'mobile-430', 'mobile-390',
];
const QHD_VISIBLE_VIEWPORTS = ['desktop-2560', 'desktop-2480'];

/* Phase 4F: QhdSectionIndex(01~04) 4쌍의 section-relative top은 caller가 넘긴
 * 리터럴 px 값이라 뷰포트 폭과 무관하게 항상 같다(가로 위치만 50% 기준 calc라
 * 뷰포트마다 달라진다) — 그래서 desktop-2560/2480 둘 다 같은 기대값을 쓴다.
 * Phase 5A-R: "1920에서 화면 밖으로 나갈 수 있어(침범 허용)"라던 이전 원칙은
 * 폐기했다 — 이제 visible로 판정되는 viewport(2480/2560)에서는 index/label
 * rect가 viewport 안에 완전히 들어와야 하며(아래 본문의 rect.left>=0 /
 * rect.right<=innerWidth 검사), 부분적으로만 잘리는 상태를 PASS로 두지 않는다. */
type QhdIndexExpectation = { sectionRelativeTop: number; labelSectionRelativeTop: number };
const QHD_INDEX_EXPECTED: Record<string, QhdIndexExpectation> = {
  about: { sectionRelativeTop: 220, labelSectionRelativeTop: 380 },
  featured: { sectionRelativeTop: 1619, labelSectionRelativeTop: 1779 },
  selected: { sectionRelativeTop: 117, labelSectionRelativeTop: 277 },
  contact: { sectionRelativeTop: -5, labelSectionRelativeTop: 173 },
};
const QHD_INDEX_VISIBLE_VIEWPORTS = QHD_VISIBLE_VIEWPORTS;

function record(entry: Record<string, unknown>) {
  fs.appendFileSync(DETAILED_RESULTS_FILE, JSON.stringify(entry) + '\n');
}

async function gotoHome(page: Page) {
  const response = await page.goto(assertTargetUrl(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  return response;
}

// 이 사이트는 스크롤 진입 시 섹션이 페이드인되는 scroll-reveal 애니메이션을 사용한다.
// fullPage 스크린샷은 실제 스크롤 이벤트 없이 뷰포트만 늘려서 캡처하므로,
// 미리 끝까지 스크롤해 애니메이션을 모두 트리거해두지 않으면 섹션이 빈 화면으로 캡처된다.
async function scrollThroughPage(page: Page) {
  await page.evaluate(async () => {
    const step = 400;
    const height = document.body.scrollHeight;
    for (let y = 0; y < height; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

test.describe('Detailed Design Audit', () => {
  test('뷰포트별 상세 점검', async ({ page }, testInfo) => {
    const viewportKey = testInfo.project.name;
    const vp = DETAILED_VIEWPORTS[viewportKey];

    const consoleIssues: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') consoleIssues.push(`[${msg.type()}] ${msg.text()}`);
    });
    page.on('pageerror', (err) => consoleIssues.push(`[pageerror] ${String(err)}`));

    // 삭제된 파일로 인한 404/asset 로딩 실패 확인
    const failedRequests: { url: string; status?: number; reason?: string }[] = [];
    page.on('response', (res) => {
      if (res.status() >= 400) failedRequests.push({ url: res.url(), status: res.status() });
    });
    page.on('requestfailed', (req) => {
      failedRequests.push({ url: req.url(), reason: req.failure()?.errorText });
    });

    const response = await gotoHome(page);
    record({ kind: 'connectivity', viewport: viewportKey, ok: !!response && response.ok(), status: response?.status() ?? null });

    // 1. 전체 페이지 스크린샷
    await test.step('전체 페이지 스크린샷', async () => {
      try {
        const filePath = path.join(SCREENSHOT_DIR, vp.file);
        await scrollThroughPage(page);
        await page.screenshot({ path: filePath, fullPage: true });
        const exists = fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
        record({ kind: 'screenshot', viewport: viewportKey, file: vp.file, ok: exists });
      } catch (e) {
        record({ kind: 'screenshot', viewport: viewportKey, file: vp.file, ok: false, remark: String(e).slice(0, 200) });
      }
    });

    // 2. 가로 스크롤(레이아웃 깨짐) 발생 여부
    await test.step('가로 스크롤 발생 여부 확인', async () => {
      try {
        const overflow = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        }));
        const hasOverflow = overflow.scrollWidth > overflow.innerWidth + 1;
        record({ kind: 'horizontalOverflow', viewport: viewportKey, hasOverflow, ...overflow });
      } catch (e) {
        record({ kind: 'horizontalOverflow', viewport: viewportKey, ok: undefined, remark: String(e).slice(0, 200) });
      }
    });

    // 2-1. content shell 좌우 중앙 정렬 확인 — Batch G 13-4: 픽셀 완전 동일이
    // 아니라 구조적 중앙 정렬(좌우 여백 차이 2px 이내)만 본다. Header Container가
    // Home/Projects/Detail/404 전 route에서 같은 폭 공식(HOME_WIDE_MAX_WIDTH)을
    // 쓰므로 이 하나로 shell 정렬의 대표값을 잰다.
    await test.step('content shell 좌우 여백 대칭 확인', async () => {
      try {
        const margins = await page.evaluate(() => {
          const shell = document.querySelector('header .MuiContainer-root');
          if (!shell) return null;
          const r = shell.getBoundingClientRect();
          return { left: Math.round(r.left), right: Math.round(window.innerWidth - r.right) };
        });
        if (margins) {
          const diff = Math.abs(margins.left - margins.right);
          record({ kind: 'shellAlignment', viewport: viewportKey, ...margins, diff });
          expect.soft(diff, `${viewportKey}: content shell 좌우 여백 차이 ${diff}px (left=${margins.left}, right=${margins.right})`).toBeLessThanOrEqual(2);
        } else {
          record({ kind: 'shellAlignment', viewport: viewportKey, ok: undefined, remark: 'header Container를 찾지 못함' });
        }
      } catch (e) {
        record({ kind: 'shellAlignment', viewport: viewportKey, ok: undefined, remark: String(e).slice(0, 200) });
      }
    });

    // 3. 버튼/링크 터치 영역 44px 이상 확인
    await test.step('버튼/링크 터치 영역 44px 확인', async () => {
      try {
        const results = await page.evaluate(() => {
          const els = Array.from(document.querySelectorAll('button, a[href], [role="button"]'));
          return els
            .filter((el) => {
              const style = getComputedStyle(el);
              const rect = el.getBoundingClientRect();
              return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
            })
            .map((el) => {
              const rect = el.getBoundingClientRect();
              return {
                text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
              };
            });
        });
        const small = results.filter((r) => r.width < 44 || r.height < 44);
        record({ kind: 'touchTarget', viewport: viewportKey, total: results.length, smallCount: small.length, small: small.slice(0, 20) });
      } catch (e) {
        record({ kind: 'touchTarget', viewport: viewportKey, ok: undefined, remark: String(e).slice(0, 200) });
      }
    });

    // 3-1. 버튼/링크 겹침 여부 확인 (조상-자손 관계는 제외, 겹치는 영역이 작은 요소 면적의 30% 이상일 때만 기록)
    await test.step('버튼/링크 겹침 여부 확인', async () => {
      try {
        const overlaps = await page.evaluate(() => {
          const els = Array.from(document.querySelectorAll('button, a[href], [role="button"]')).filter((el) => {
            const style = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden' && r.width > 0 && r.height > 0;
          });
          const rects = els.map((el) => ({ el, r: el.getBoundingClientRect() }));
          const out: { a: string; b: string }[] = [];
          for (let i = 0; i < rects.length; i++) {
            for (let j = i + 1; j < rects.length; j++) {
              const A = rects[i];
              const B = rects[j];
              if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
              const ix = Math.max(0, Math.min(A.r.right, B.r.right) - Math.max(A.r.left, B.r.left));
              const iy = Math.max(0, Math.min(A.r.bottom, B.r.bottom) - Math.max(A.r.top, B.r.top));
              const interArea = ix * iy;
              if (interArea === 0) continue;
              const smallerArea = Math.min(A.r.width * A.r.height, B.r.width * B.r.height);
              if (smallerArea > 0 && interArea / smallerArea > 0.3) {
                out.push({
                  a: (A.el.textContent || A.el.getAttribute('aria-label') || '').trim().slice(0, 30),
                  b: (B.el.textContent || B.el.getAttribute('aria-label') || '').trim().slice(0, 30),
                });
              }
            }
          }
          return out;
        });
        record({ kind: 'buttonOverlap', viewport: viewportKey, count: overlaps.length, items: overlaps.slice(0, 10) });
      } catch (e) {
        record({ kind: 'buttonOverlap', viewport: viewportKey, ok: undefined, remark: String(e).slice(0, 200) });
      }
    });

    // 4. 텍스트 잘림(clipping) 확인 — Phase 5A-R: ellipsis/line-clamp가 있는
    // 요소만 검사하던 이전 로직은 "ellipsis 없이 overflow-hidden 부모에 잘리는
    // 일반 텍스트"를 전부 놓쳤다(사용자가 실제 2560/1024에서 발견한 마감 문제의
    // 일부) — 실제 텍스트가 있는 요소 전부를 대상으로 확장했다.
    //
    // 처음 구현은 `scrollHeight > clientHeight`만으로 판정했는데, Hero H1처럼
    // 타이트한 line-height(1.12)에 한글 폰트를 쓰면 glyph 자체의 ascent/descent가
    // CSS line-height 계산값보다 미세하게 커서 scrollHeight가 clientHeight를
    // 몇 px 넘는 게 정상이다(브라우저는 line-height로 glyph를 클리핑하지 않는다).
    // 이 상태를 실제로 캡처해 확인한 결과 화면에는 아무것도 잘려 보이지 않았다
    // (element.screenshot()으로 전체 glyph가 그대로 렌더됨) — 진짜 위험 신호는
    // "부모가 실제로 overflow:hidden/clip으로 이 요소를 자르는가"이므로, 가장
    // 가까운 클리핑 조상을 찾아 그 경계를 실제로 넘는지까지 확인한다.
    await test.step('텍스트 잘림 확인', async () => {
      try {
        const clipped = await page.evaluate(() => {
          const candidates = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, a, button, li, span'));
          const vw = window.innerWidth;
          const out: { text: string; tag: string; reason: string }[] = [];
          for (const el of candidates) {
            const text = (el.textContent || '').trim();
            if (!text) continue;
            if (el.closest('[aria-hidden="true"]')) continue; // 장식/보조 텍스트는 별도 geometry 검사 대상
            const style = getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') continue;
            const rect = el.getBoundingClientRect();
            if (rect.width <= 1 && rect.height <= 1) continue; // visually-hidden 패턴

            const reasons: string[] = [];
            if (rect.left < -1) reasons.push('rect.left<0');
            if (rect.right > vw + 1) reasons.push('rect.right>viewport');

            // 가장 가까운 실제 클리핑 조상(overflow hidden/clip, html 제외)을 찾아
            // 이 요소의 rect가 그 조상의 경계를 실제로 넘는지 확인한다.
            let ancestor = el.parentElement;
            let depth = 0;
            while (ancestor && ancestor !== document.body && depth < 10) {
              const aStyle = getComputedStyle(ancestor);
              const clipsX = aStyle.overflowX === 'hidden' || aStyle.overflowX === 'clip';
              const clipsY = aStyle.overflowY === 'hidden' || aStyle.overflowY === 'clip';
              if (clipsX || clipsY) {
                const aRect = ancestor.getBoundingClientRect();
                if (clipsY && (rect.top < aRect.top - 1 || rect.bottom > aRect.bottom + 1)) reasons.push('부모 overflow-y:hidden 경계 초과');
                if (clipsX && (rect.left < aRect.left - 1 || rect.right > aRect.right + 1)) reasons.push('부모 overflow-x:hidden 경계 초과');
                break; // 가장 가까운 클리핑 조상 하나만 확인(그 위 조상은 이미 이 조상 안에 있음)
              }
              ancestor = ancestor.parentElement;
              depth++;
            }

            if (reasons.length === 0) continue;
            out.push({ text: text.slice(0, 60), tag: el.tagName, reason: reasons.join(',') });
          }
          return out;
        });
        record({ kind: 'textClipped', viewport: viewportKey, count: clipped.length, items: clipped.slice(0, 30) });
        expect.soft(clipped.length, `${viewportKey}: 텍스트 잘림 0이어야 함 (${clipped.slice(0, 5).map((c) => `${c.tag}:"${c.text}"(${c.reason})`).join(' / ')})`).toBe(0);
      } catch (e) {
        record({ kind: 'textClipped', viewport: viewportKey, ok: undefined, remark: String(e).slice(0, 200) });
      }
    });

    // 5. (모바일) 본문 글씨 크기 확인 — Phase 4B: 숫자만 세면 원인 판단이 어려워
    // 후보별 상세(text/tag/font-size/line-height/selector/aria-hidden/role/rect/
    // 장식 후보 여부)를 함께 기록한다. leaf 텍스트 노드(자식 element가 없는
    // p/span/heading)만 후보로 삼아, 자식을 포함한 컨테이너의 상속 폰트 크기를
    // 중복 집계하지 않는다.
    if (viewportKey.startsWith('mobile')) {
      await test.step('모바일 본문 글씨 크기 확인(상세)', async () => {
        try {
          const detail = await page.evaluate(() => {
            const buildSelector = (el: Element) => {
              const parts: string[] = [];
              let node: Element | null = el;
              for (let i = 0; i < 4 && node && node !== document.body; i++) {
                const parent = node.parentElement;
                const idx = parent ? Array.from(parent.children).indexOf(node) + 1 : 1;
                parts.unshift(`${node.tagName.toLowerCase()}:nth-child(${idx})`);
                node = parent;
              }
              return parts.join(' > ');
            };
            const candidates = Array.from(document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6'))
              .filter((el) => el.children.length === 0 && (el.textContent || '').trim().length > 0)
              // display:none 등으로 실제 렌더링되지 않는 요소(예: md+ 전용 데스크톱 메뉴가
              // 모바일 폭에서 display:none인 경우)는 rect가 0x0이 되어 오탐을 만든다 —
              // 실제로 화면에 보이는 요소만 후보로 삼는다.
              .filter((el) => {
                const r = el.getBoundingClientRect();
                return r.width > 0 && r.height > 0;
              });
            const rows = candidates.map((el) => {
              const style = getComputedStyle(el);
              const fontSize = parseFloat(style.fontSize);
              const lineHeightRaw = style.lineHeight;
              const lineHeightPx = lineHeightRaw.endsWith('px') ? parseFloat(lineHeightRaw) : fontSize * (parseFloat(lineHeightRaw) || 1);
              const rect = el.getBoundingClientRect();
              const ariaHidden = el.closest('[aria-hidden="true"]') !== null;
              const role = el.getAttribute('role') || el.closest('[role]')?.getAttribute('role') || null;
              const fontFamily = style.fontFamily || '';
              const isMono = /mono/i.test(fontFamily);
              const text = (el.textContent || '').trim();
              // 장식 후보 추정: aria-hidden 이거나, 순수 2~3자리 숫자/기호(인덱스·번호 라벨류)
              const decorativeCandidate = ariaHidden || /^[0-9./·\-]{1,4}$/.test(text);
              // 짧은 라벨/태그 추정: 문장부호로 끝나지 않고 " · " 구분자로 이어지는 도구명
              // 나열, 메타 라벨류 — mono가 아니어도 body 문장과 같은 14px 기준을 적용하지
              // 않는다(예: "Figma · Photoshop · Illustrator"). 40자 이하 + 문장 종결 어미
              // 없음을 함께 본다.
              const looksLikeSentence = /[.!?]$|다\.$|요\.$|니다\.$/.test(text);
              const isShortLabel = !looksLikeSentence && (text.length <= 24 || / · /.test(text));
              return {
                text: text.slice(0, 40),
                tag: el.tagName.toLowerCase(),
                fontSize: Math.round(fontSize * 100) / 100,
                lineHeightPx: Math.round(lineHeightPx * 100) / 100,
                selector: buildSelector(el),
                ariaHidden,
                role,
                rect: { w: Math.round(rect.width), h: Math.round(rect.height), x: Math.round(rect.x), y: Math.round(rect.y) },
                decorativeCandidate,
                isMono,
                isShortLabel,
              };
            });
            return rows;
          });
          // 분류 기준(사용자 지시): 본문(문장) 텍스트·버튼은 14px, mono metadata나 짧은
          // 라벨/태그(도구명 나열 등)는 12px, 순수 장식 번호·위치 표식(aria-hidden 등)은
          // 11px까지 허용 가능 — 무조건 18개 전부를 "실패"로 몰지 않는다.
          const tooSmall = detail.filter((r) => {
            if (r.decorativeCandidate) return r.fontSize < 11;
            if (r.isMono || r.isShortLabel) return r.fontSize < 12;
            return r.fontSize < 14;
          });
          record({
            kind: 'mobileFontSize',
            viewport: viewportKey,
            count: detail.length,
            minSize: detail.length ? Math.min(...detail.map((r) => r.fontSize)) : null,
            tooSmallCount: tooSmall.length,
            tooSmall: tooSmall.slice(0, 30),
          });
        } catch (e) {
          record({ kind: 'mobileFontSize', viewport: viewportKey, ok: undefined, remark: String(e).slice(0, 200) });
        }
      });
    }

    // 이하 항목은 뷰포트에 좌우되지 않는 상호작용/스타일 점검이므로 대표 뷰포트(desktop-1440)에서만 1회 수행한다.
    if (viewportKey === 'desktop-1440') {
      // Phase 5A-R Batch G 13-5: 폰트가 fallback으로 렌더되면 줄바꿈/자간이
      // 마감되지 않아 보인다는 사용자 피드백과 직결된다 — 실제 로드 여부를
      // document.fonts로 확인하고, fallback이면 FAIL(기록만 하고 넘어가지 않는다).
      // `document.fonts.check()`는 weight 인자를 안 주면 기본값 400(normal)만
      // 본다 — 이 사이트는 FONT_MONO 라벨류를 전부 500/600 weight로만 쓰고 평범한
      // 400은 실제로 렌더에 쓰이지 않아(직접 확인: allFonts 목록에 400은 전부
      // status 'unloaded', 500/600만 'loaded'), 400 기준 체크는 항상 거짓을
      // 반환하는 검사 버그였다 — 실제 쓰이는 weight(500)로 확인한다.
      await test.step('웹폰트 실제 로드 확인', async () => {
        try {
          await gotoHome(page);
          const fonts = await page.evaluate(async () => {
            await document.fonts.ready;
            return {
              status: document.fonts.status,
              suitLoaded: document.fonts.check('16px "SUIT Variable"'),
              plexMonoLoaded: document.fonts.check('500 16px "IBM Plex Mono"'),
            };
          });
          record({ kind: 'fontLoad', ...fonts });
          expect.soft(fonts.status, 'document.fonts.status는 loaded여야 함').toBe('loaded');
          expect.soft(fonts.suitLoaded, 'SUIT Variable이 실제로 로드돼야 함(fallback 금지)').toBe(true);
          expect.soft(fonts.plexMonoLoaded, 'IBM Plex Mono(500)가 실제로 로드돼야 함(fallback 금지)').toBe(true);
        } catch (e) {
          record({ kind: 'fontLoad', ok: undefined, remark: String(e).slice(0, 200) });
        }
      });

      await test.step('다크 배경 텍스트 대비(WCAG) 확인', async () => {
        try {
          // 대비 계산 로직은 scripts/contrast-scan.js(check-contrast.js와 공용)로 옮겼다 -
          // 같은 판정 로직을 두 곳에서 복붙해 유지하지 않기 위함. 이 스텝은 기존과 동일하게
          // 최대 200개 요소만 훑고, low만 20개까지 기록한다.
          //
          // h1/h2/h3/p/button/a 자신만 검사하면, Hero h1처럼 자식 span별로 다른 색을 쓰는
          // 혼합 색상 요소에서 부모의 상속 color(실제로 화면에 렌더링되지 않는 색)를 잘못
          // 측정해 오탐이 발생했다(h1 ratio 1.03 false positive로 재현 확인). 선택자를 각
          // leaf(하위 `*`)까지 넓히고 leafOnly로 걸러서, 텍스트가 실제로 그 색으로
          // 렌더링되는 리프 노드만 대비 판정 대상으로 삼는다. contrast-scan.js의 leafOnly
          // 계약(자식 element가 없는 노드만 후보) 자체는 바꾸지 않는다.
          const { totalScanned, low } = await page.evaluate(scanContrastInPage, {
            selectors: 'h1, h1 *, h2, h2 *, h3, h3 *, p, p *, button, button *, a, a *',
            leafOnly: true,
            maxElements: 200,
          });
          record({ kind: 'contrast', total: totalScanned, lowCount: low.length, low: low.slice(0, 20) });
        } catch (e) {
          record({ kind: 'contrast', ok: undefined, remark: String(e).slice(0, 200) });
        }
      });

      await test.step('hover/focus 상태 확인', async () => {
        try {
          const cta = page.getByRole('button', { name: /프로젝트 (보기|섹션으로 이동)/ }).first();
          const found = (await cta.count()) > 0;
          let hoverChanged = false;
          let focusChanged = false;
          let hoverBase: Record<string, string> | null = null;
          let hoverAfter: Record<string, string> | null = null;
          let focusBase: Record<string, string> | null = null;
          let focusAfter: Record<string, string> | null = null;
          if (found) {
            // getComputedStyle(el).cssText는 computed style에서 스펙상 항상 빈 문자열을
            // 반환하므로(computed style의 cssText는 inline style에서만 채워짐) hover 전후
            // 비교가 항상 "변화 없음"으로 잘못 판정되던 버그가 있었다(재현 확인됨). 실제로
            // hover에서 바뀌는 개별 속성을 직접 스냅샷 비교한다.
            const snapshotHover = (el: Element) => {
              const s = getComputedStyle(el);
              return {
                transform: s.transform,
                boxShadow: s.boxShadow,
                color: s.color,
                backgroundColor: s.backgroundColor,
                borderColor: s.borderColor,
                opacity: s.opacity,
              };
            };
            const snapshotFocus = (el: Element) => {
              const s = getComputedStyle(el);
              return {
                outlineStyle: s.outlineStyle,
                outlineColor: s.outlineColor,
                outlineWidth: s.outlineWidth,
                boxShadow: s.boxShadow,
              };
            };

            // hover 전 포인터를 대상 밖으로 이동해 base 상태가 실제 non-hover임을 보장
            await page.mouse.move(0, 0);
            await page.waitForTimeout(50);
            hoverBase = await cta.evaluate(snapshotHover);
            await cta.hover();
            await page.waitForTimeout(250); // hover transition(180ms) 완료 대기
            hoverAfter = await cta.evaluate(snapshotHover);
            hoverChanged = JSON.stringify(hoverBase) !== JSON.stringify(hoverAfter);

            await cta.evaluate((el) => (el as HTMLElement).blur());
            await page.waitForTimeout(50);
            focusBase = await cta.evaluate(snapshotFocus);
            await cta.focus();
            await page.waitForTimeout(150);
            focusAfter = await cta.evaluate(snapshotFocus);
            focusChanged = JSON.stringify(focusBase) !== JSON.stringify(focusAfter);
          }
          // report에서 원인 확인이 가능하도록 base/after 핵심 값도 함께 기록한다.
          record({ kind: 'hoverFocus', ctaFound: found, hoverChanged, focusChanged, hoverBase, hoverAfter, focusBase, focusAfter });
        } catch (e) {
          record({ kind: 'hoverFocus', ok: undefined, remark: String(e).slice(0, 200) });
        }
      });

      await test.step('키보드 탐색(Tab) 가능 여부 확인', async () => {
        try {
          await gotoHome(page);
          const focusedSeq: string[] = [];
          for (let i = 0; i < 15; i++) {
            await page.keyboard.press('Tab');
            const info = await page.evaluate(() => {
              const el = document.activeElement as HTMLElement | null;
              if (!el || el === document.body) return null;
              // 실제 accessible-name 계산 순서(aria-label > aria-labelledby > textContent)를
              // 따른다 — textContent를 먼저 읽으면 aria-label로 이미 고친 이름이 있어도
              // 화면에 보이는 원문 텍스트가 뭉쳐서/중복으로 나온다(Phase 4C에서 발견).
              const ariaLabel = el.getAttribute('aria-label');
              const labelledbyId = el.getAttribute('aria-labelledby');
              const labelledbyText = labelledbyId
                ? labelledbyId.split(/\s+/).map((id) => document.getElementById(id)?.textContent || '').join(' ').trim()
                : '';
              const name = ariaLabel || labelledbyText || (el.textContent || '').trim();
              return `${el.tagName}:${name.trim().slice(0, 20)}`;
            });
            if (info) focusedSeq.push(info);
          }
          record({ kind: 'keyboardNav', reachedCount: focusedSeq.length, sequence: focusedSeq });
        } catch (e) {
          record({ kind: 'keyboardNav', ok: undefined, remark: String(e).slice(0, 200) });
        }
      });

      await test.step('prefers-reduced-motion 반응 확인', async () => {
        try {
          await page.emulateMedia({ reducedMotion: 'no-preference' });
          await gotoHome(page);
          const scan = () =>
            page.evaluate(() => {
              const els = Array.from(document.querySelectorAll('*')).slice(0, 800);
              const withDuration = els
                .map((el) => ({ animationName: getComputedStyle(el).animationName, duration: parseFloat(getComputedStyle(el).animationDuration) || 0 }))
                .filter((e) => e.duration > 0);
              // animationName이 'none'인 요소는 실제 애니메이션이 없는데도 전역 reduced-motion 규칙(*{animation-duration:...!important})의
              // 영향을 받아 duration>0으로 잡히는 "가짜 카운트"이므로 분리해서 센다 (15회차에 원인 규명, tests/detailed-audit.spec.ts 참고).
              const real = withDuration.filter((e) => e.animationName !== 'none');
              const phantom = withDuration.filter((e) => e.animationName === 'none');
              return { rawCount: withDuration.length, realAnimatedCount: real.length, phantomCount: phantom.length };
            });
          const normal = await scan();
          await page.emulateMedia({ reducedMotion: 'reduce' });
          await gotoHome(page);
          const reduced = await scan();
          // 전역 reduced-motion 규칙 원문 확보 (증빙용)
          const reducedMotionCssRuleText = await page.evaluate(() => {
            const rules: string[] = [];
            for (const sheet of Array.from(document.styleSheets)) {
              try {
                for (const rule of Array.from((sheet as CSSStyleSheet).cssRules || [])) {
                  const mediaRule = rule as CSSMediaRule;
                  if (mediaRule.media && /prefers-reduced-motion/.test(mediaRule.conditionText || mediaRule.media.mediaText || '')) {
                    rules.push(mediaRule.cssText.slice(0, 300));
                  }
                }
              } catch {
                /* cross-origin stylesheet, skip */
              }
            }
            return rules;
          });
          record({
            kind: 'reducedMotion',
            normalAnimatedCount: normal.rawCount,
            reducedAnimatedCount: reduced.rawCount,
            normalRealAnimatedCount: normal.realAnimatedCount,
            reducedRealAnimatedCount: reduced.realAnimatedCount,
            reducedPhantomCount: reduced.phantomCount,
            reducedMotionCssRuleText,
            rootCauseVerdict: '검사 로직 문제 (사이트 결함 아님)',
            rootCauseExplanation:
              'normalAnimatedCount/reducedAnimatedCount는 animationName이 none인 요소도 함께 세고 있었다. 사이트는 `*, ::before, ::after { animation-duration: 0.01ms !important }` 형태의 전역 reduced-motion 접근성 규칙을 갖고 있어, 애니메이션이 실제로 없는 요소(html/head/meta/script 등 포함)도 reduced 모드에서 animationDuration이 0이 아닌 값(0.01ms)으로 잡힌다. animationName!==none으로 필터링한 realAnimatedCount는 normal/reduced 양쪽에서 값이 일치하며, 이는 실제 named 애니메이션(현재 디자인 시스템 기준 heroLineIn/heroFadeIn/heroRowIn/heroLineScaleIn/heroCtaIn/signalDotIn/signalLineIn 등, 디자인이 바뀌면 이름도 바뀔 수 있음)이 reduced 모드에서 duration/delay만 0으로 줄어들 뿐 존재 자체는 유지된다는 뜻이다. 이 설명은 검사 로직의 일반 원리를 기록한 것으로, 특정 라운드의 애니메이션 이름은 바뀔 수 있으니 실제 코드 기준으로 다시 확인한다.',
          });
          await page.emulateMedia({ reducedMotion: 'no-preference' });
        } catch (e) {
          record({ kind: 'reducedMotion', ok: undefined, remark: String(e).slice(0, 200) });
        }
      });

      await test.step('prefers-reduced-motion CSS 미디어쿼리 존재 여부 확인', async () => {
        try {
          const hasMediaQuery = await page.evaluate(() => {
            try {
              for (const sheet of Array.from(document.styleSheets)) {
                try {
                  for (const rule of Array.from((sheet as CSSStyleSheet).cssRules || [])) {
                    if (rule instanceof CSSMediaRule && /prefers-reduced-motion/i.test(rule.conditionText || rule.media.mediaText)) {
                      return true;
                    }
                  }
                } catch {
                  // cross-origin stylesheet, 접근 불가 - 건너뜀
                }
              }
            } catch {
              return null;
            }
            return false;
          });
          record({ kind: 'reducedMotionCssRule', found: hasMediaQuery });
        } catch (e) {
          record({ kind: 'reducedMotionCssRule', ok: undefined, remark: String(e).slice(0, 200) });
        }
      });

      await test.step('장식 요소 aria-hidden 처리 확인', async () => {
        try {
          const decorative = await page.evaluate(() => {
            const els = Array.from(document.querySelectorAll('img, svg'));
            return els
              .filter((el) => {
                const alt = el.getAttribute('alt');
                const ariaHidden = el.getAttribute('aria-hidden');
                const role = el.getAttribute('role');
                const isFocusable = el.hasAttribute('tabindex');
                return (alt === '' || alt === null) && ariaHidden !== 'true' && role !== 'img' && !isFocusable;
              })
              .map((el) => ({ tag: el.tagName, class: (el.getAttribute('class') || '').slice(0, 60) }));
          });
          record({ kind: 'ariaHiddenCheck', count: decorative.length, items: decorative.slice(0, 20) });
        } catch (e) {
          record({ kind: 'ariaHiddenCheck', ok: undefined, remark: String(e).slice(0, 200) });
        }
      });

      await test.step('heading 구조 확인', async () => {
        try {
          const headings = await page.evaluate(() =>
            Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((el) => ({
              level: parseInt(el.tagName.slice(1), 10),
              text: (el.textContent || '').trim().slice(0, 50),
            }))
          );
          const h1Count = headings.filter((h) => h.level === 1).length;
          const skips: string[] = [];
          let prevLevel = 0;
          for (const h of headings) {
            if (prevLevel > 0 && h.level > prevLevel + 1) {
              skips.push(`h${prevLevel} 다음에 h${h.level} ("${h.text}")`);
            }
            prevLevel = h.level;
          }
          record({ kind: 'headingStructure', h1Count, sequence: headings.map((h) => `h${h.level}:${h.text}`), skips });
        } catch (e) {
          record({ kind: 'headingStructure', ok: undefined, remark: String(e).slice(0, 200) });
        }
      });

      await test.step('이미지 alt 텍스트 확인', async () => {
        try {
          const images = await page.evaluate(() =>
            Array.from(document.querySelectorAll('img')).map((el) => ({
              src: (el.getAttribute('src') || '').slice(-60),
              alt: el.getAttribute('alt'),
            }))
          );
          const missingAlt = images.filter((i) => i.alt === null || i.alt === undefined);
          record({ kind: 'imageAlt', total: images.length, missingAltCount: missingAlt.length, images });
        } catch (e) {
          record({ kind: 'imageAlt', ok: undefined, remark: String(e).slice(0, 200) });
        }
      });

      await test.step('버튼/링크 accessible name 확인', async () => {
        try {
          const noName = await page.evaluate(() => {
            const els = Array.from(document.querySelectorAll('button, a[href]'));
            return els
              .filter((el) => {
                const style = getComputedStyle(el);
                return style.display !== 'none' && style.visibility !== 'hidden';
              })
              .filter((el) => {
                const text = (el.textContent || '').trim();
                const ariaLabel = el.getAttribute('aria-label');
                const ariaLabelledby = el.getAttribute('aria-labelledby');
                const title = el.getAttribute('title');
                return !text && !ariaLabel && !ariaLabelledby && !title;
              })
              .map((el) => ({ tag: el.tagName, class: (el.getAttribute('class') || '').slice(0, 60) }));
          });
          record({ kind: 'accessibleName', missingCount: noName.length, items: noName.slice(0, 10) });
        } catch (e) {
          record({ kind: 'accessibleName', ok: undefined, remark: String(e).slice(0, 200) });
        }
      });

      // Phase 4C: Logo/PROJECTS nav/프로젝트 상세 CTA 3개의 accessible name·role·href를
      // 직접 기록한다. aria-label이 textContent보다 우선한다는 실제 accessible-name
      // 계산 순서로 이름을 구한다(위 키보드 탐색 단계와 동일한 우선순위).
      await test.step('로고·PROJECTS nav·프로젝트 상세 CTA semantics 확인', async () => {
        try {
          await gotoHome(page);
          const data = await page.evaluate(() => {
            const nameOf = (el: Element) => {
              const ariaLabel = el.getAttribute('aria-label');
              const labelledbyId = el.getAttribute('aria-labelledby');
              const labelledbyText = labelledbyId
                ? labelledbyId.split(/\s+/).map((id) => document.getElementById(id)?.textContent || '').join(' ').trim()
                : '';
              return (ariaLabel || labelledbyText || (el.textContent || '').trim()).trim();
            };

            const logo = document.querySelector('a[aria-label$="홈으로 이동"]');
            const logoInfo = logo
              ? { tag: logo.tagName, role: logo.getAttribute('role'), name: nameOf(logo), href: logo.getAttribute('href') }
              : null;

            const navScope = document.querySelector('nav[aria-label="주요 메뉴"]');
            const navProjects = navScope
              ? Array.from(navScope.querySelectorAll('a, button')).find((el) => nameOf(el) === 'PROJECTS')
              : undefined;
            const navProjectsInfo = navProjects
              ? { tag: navProjects.tagName, name: nameOf(navProjects), href: navProjects.getAttribute('href') }
              : null;

            const detailCtas = Array.from(document.querySelectorAll('a, button')).filter((el) => nameOf(el).includes('상세'));
            const detailCtaInfo = detailCtas.map((el) => ({ tag: el.tagName, name: nameOf(el), href: el.getAttribute('href') }));

            const interactive = Array.from(document.querySelectorAll('a[href], button')).filter((el) => {
              const style = getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden';
            });
            // Phase 4D: 같은 이름을 가진 요소가 실제로는 desktop header nav + Contact
            // footer CTA처럼 "같은 목적지로 가는 서로 다른 두 진입점"인 경우가 있다(직접
            // 코드 확인 — 닫힌 mobile Drawer는 unmount되어 여기 안 잡힌다). 이건 접근성
            // 결함이 아니라 흔한 패턴이므로, 이름이 같아도 href가 전부 같으면 오탐으로
            // 보고 세지 않는다. 이름은 같은데 href가 서로 다른 경우만 진짜 라벨링 오류로
            // 카운트한다.
            const byName = new Map<string, { href: string | null }[]>();
            interactive.forEach((el) => {
              const n = nameOf(el);
              if (!n) return;
              const href = el.getAttribute('href');
              if (!byName.has(n)) byName.set(n, []);
              byName.get(n)!.push({ href });
            });
            const duplicates: { name: string; count: number; hrefs: (string | null)[] }[] = [];
            const sameDestination: { name: string; count: number; href: string | null }[] = [];
            byName.forEach((entries, name) => {
              if (entries.length <= 1) return;
              const uniqueHrefs = Array.from(new Set(entries.map((e) => e.href)));
              if (uniqueHrefs.length === 1) {
                sameDestination.push({ name, count: entries.length, href: uniqueHrefs[0] });
              } else {
                duplicates.push({ name, count: entries.length, hrefs: uniqueHrefs });
              }
            });

            return { logoInfo, navProjectsInfo, detailCtaInfo, duplicates, sameDestination };
          });

          record({ kind: 'logoHomeAccessibleName', ...data.logoInfo });
          record({ kind: 'navigationSemantics', target: 'PROJECTS', ...data.navProjectsInfo });
          record({
            kind: 'projectDetailAccessibleNames',
            items: data.detailCtaInfo,
            allDistinct: new Set(data.detailCtaInfo.map((c) => c.name)).size === data.detailCtaInfo.length,
          });
          record({
            kind: 'duplicateInteractiveNames',
            duplicateCount: data.duplicates.length,
            duplicates: data.duplicates.slice(0, 20),
            sameDestinationCount: data.sameDestination.length,
            sameDestination: data.sameDestination.slice(0, 20),
          });
        } catch (e) {
          record({ kind: 'logoHomeAccessibleName', ok: undefined, remark: String(e).slice(0, 200) });
          record({ kind: 'navigationSemantics', ok: undefined, remark: String(e).slice(0, 200) });
          record({ kind: 'projectDetailAccessibleNames', ok: undefined, remark: String(e).slice(0, 200) });
          record({ kind: 'duplicateInteractiveNames', ok: undefined, remark: String(e).slice(0, 200) });
        }
      });

      await test.step('line-height 확인(상세)', async () => {
        try {
          const rows = await page.evaluate(() => {
            const buildSelector = (el: Element) => {
              const parts: string[] = [];
              let node: Element | null = el;
              for (let i = 0; i < 4 && node && node !== document.body; i++) {
                const parent = node.parentElement;
                const idx = parent ? Array.from(parent.children).indexOf(node) + 1 : 1;
                parts.unshift(`${node.tagName.toLowerCase()}:nth-child(${idx})`);
                node = parent;
              }
              return parts.join(' > ');
            };
            const paras = Array.from(document.querySelectorAll('p, span, li')).filter(
              (p) => p.children.length === 0 && (p.textContent || '').trim().length > 15,
            );
            return paras.map((p) => {
              const style = getComputedStyle(p);
              const fontSize = parseFloat(style.fontSize);
              const lineHeightRaw = style.lineHeight;
              const lh = lineHeightRaw.endsWith('px') ? parseFloat(lineHeightRaw) : parseFloat(lineHeightRaw) * fontSize;
              const ratio = Math.round((lh / fontSize) * 100) / 100;
              const closestHeading = p.closest('h1, h2, h3, h4, h5, h6');
              // heading/body/label 추정: heading 조상이 있으면 heading, mono 폰트면 label,
              // 그 외는 body로 본다.
              const fontFamily = style.fontFamily || '';
              const kindGuess = closestHeading ? 'heading' : /mono/i.test(fontFamily) ? 'label' : 'body';
              return {
                text: (p.textContent || '').trim().slice(0, 40),
                tag: p.tagName.toLowerCase(),
                fontSize: Math.round(fontSize * 100) / 100,
                lineHeightPx: Math.round(lh * 100) / 100,
                ratio,
                selector: buildSelector(p),
                kindGuess,
              };
            });
          });
          const low = rows.filter((r) => r.ratio < 1.6);
          record({
            kind: 'lineHeight',
            total: rows.length,
            belowRecommendedCount: low.length,
            minRatio: rows.length ? Math.min(...rows.map((r) => r.ratio)) : null,
            low: low.slice(0, 30),
          });
        } catch (e) {
          record({ kind: 'lineHeight', ok: undefined, remark: String(e).slice(0, 200) });
        }
      });

      // ORDERED SIGNAL 리디자인 이후 상세 버튼 라벨이 "작업 과정 보기"에서 Figma 원문
      // "상세보기"로 바뀌었다(42:118 Detail_CTA 등). 두 라벨을 함께 찾아 과거/현재 어느
      // 쪽이든 실제 버튼을 찾도록 한다.
      // Home Featured 3개와 /projects 페이지의 FEATURED 카드는 모두 /projects/:slug로
      // 이동하는 route 버튼이고, /projects 페이지의 ARCHIVE 항목만 모달을 연다. 이전
      // 로직은 이 둘을 구분하지 않고 순서대로 클릭했다 - route 버튼을 클릭해 페이지가
      // 이동한 뒤에는 원래 버튼 목록의 nth(i)가 더 이상 존재하지 않아 다음 클릭이
      // actionability timeout(재현 확인됨)으로 이어졌다. route 이동 검사와 modal 검사를
      // 완전히 분리된 흐름으로 처리하고, report kind도 의미별로 나눈다
      // (projectCardText / projectDetailRoute / projectModalText).
      await test.step('Home Featured 카드 텍스트 추출', async () => {
        try {
          await gotoHome(page);
          await scrollThroughPage(page);
          const cards = await page.evaluate(() => {
            const detailButtons = Array.from(document.querySelectorAll('button')).filter((b) =>
              /상세\s*보기/.test(b.getAttribute('aria-label') || '')
            );
            return detailButtons.map((btn) => {
              let card: Element | null = btn;
              for (let i = 0; i < 6 && card; i++) {
                card = card.parentElement;
                if (card && card.querySelector('h3, h4')) break;
              }
              return (card?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 400);
            });
          });
          record({ kind: 'projectCardText', cards });
        } catch (e) {
          record({ kind: 'projectCardText', ok: undefined, remark: String(e).slice(0, 200) });
        }
      });

      await test.step('Home Featured route 이동 검사 (3개 개별)', async () => {
        try {
          await gotoHome(page);
          await scrollThroughPage(page);
          const labels = await page.evaluate(() =>
            Array.from(document.querySelectorAll('button'))
              .map((b) => b.getAttribute('aria-label') || '')
              .filter((label) => /상세\s*보기/.test(label))
          );
          for (const label of labels) {
            // 매 반복 홈으로 새로 이동해 그 시점의 실제 버튼을 다시 query한다 - 상세
            // route에 들어간 상태에서 다음 버튼을 nth(i)로 찾지 않는다.
            await gotoHome(page);
            await scrollThroughPage(page);
            const btn = page.getByRole('button', { name: label, exact: true }).first();
            if ((await btn.count()) === 0) {
              record({ kind: 'projectDetailRoute', label, navigated: false, remark: '버튼을 다시 찾지 못함' });
              continue;
            }
            await btn.click();
            await page.waitForTimeout(500);
            const navigated = /\/projects\/[^/?#]+/.test(page.url());
            const heading = navigated
              ? ((await page.locator('h1').first().textContent().catch(() => null)) ?? '').trim() || null
              : null;
            record({ kind: 'projectDetailRoute', label, navigated, url: page.url(), heading });
          }
        } catch (e) {
          record({ kind: 'projectDetailRoute', ok: undefined, remark: String(e).slice(0, 200) });
        }
      });

      await test.step('/projects Archive 모달 검사', async () => {
        try {
          await page.goto(`${assertTargetUrl()}#/projects`, { waitUntil: 'networkidle' });
          await page.waitForTimeout(500);
          const labels = await page.evaluate(() =>
            Array.from(document.querySelectorAll('button'))
              .map((b) => b.getAttribute('aria-label') || '')
              .filter((label) => /상세\s*보기/.test(label))
          );
          if (labels.length === 0) {
            record({ kind: 'projectModalText', modals: [], detailButtonCandidateCount: 0, remark: '확인 불가/대상 없음 - Archive 버튼을 찾지 못함' });
          } else {
            const modalTexts: string[] = [];
            // FEATURED 카드(route 이동)도 같은 라벨 패턴을 쓸 수 있으므로, 라벨 문구
            // 차이에 의존하지 않고 클릭 후 실제로 [role="dialog"]가 열리는지로 Archive
            // 버튼인지 판별한다 - 열리지 않고 URL만 바뀌면 route 버튼이었던 것으로 보고
            // 되돌아간 뒤 다음 라벨로 넘어간다(성공으로 잘못 기록하지 않음).
            for (const label of labels) {
              const btn = page.getByRole('button', { name: label, exact: true }).first();
              if ((await btn.count()) === 0) continue;
              const urlBefore = page.url();
              await btn.click();
              const dialog = page.locator('[role="dialog"]');
              const opened = await dialog.first().waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false);
              if (opened) {
                const text = await dialog.first().evaluate((el) => (el.textContent || '').replace(/\s+/g, ' ').trim());
                modalTexts.push(text.slice(0, 1500));
                const closeBtn = dialog.getByRole('button', { name: /닫기/ }).first();
                if ((await closeBtn.count()) > 0) await closeBtn.click();
                else await page.keyboard.press('Escape');
                await page.waitForTimeout(300);
              } else if (page.url() !== urlBefore) {
                await page.goBack();
                await page.waitForTimeout(300);
              }
            }
            // labels.length는 "실제 Archive 버튼 수"가 아니라 "/projects에서 상세 보기류
            // aria-label 패턴에 매칭된 후보 수"(Featured route 버튼 포함)다. 필드 이름이
            // 실제 의미와 달랐던 문제(재현 확인)를 이름만 고쳐서 바로잡는다 - route/modal
            // 판별 동작 자체는 바꾸지 않는다. 실제 Archive modal 수는 modalOpenedCount다.
            record({ kind: 'projectModalText', modals: modalTexts, detailButtonCandidateCount: labels.length, modalOpenedCount: modalTexts.length });
          }
        } catch (e) {
          record({ kind: 'projectModalText', ok: undefined, remark: String(e).slice(0, 200) });
        }
      });
    }

    // Phase 4D: QhdAmbientSignal(hero-left/about-right/featured-left/selected-right/
    // contact-left/contact-right) 6개 scene의 실제 렌더 기하를 9개 viewport 전부에서
    // 잰다(desktop-1440 전용 블록 밖에 둬서 1440/390의 "안 보임"과 1920/2560의 "보임"을
    // 같은 회차에서 함께 확인한다). 원이 타원으로 늘어나는 버그(circle의 width/height
    // 렌더 차이)가 재발하지 않는지, 1440 content shell과 안 겹치는지를 직접 측정한다 —
    // 자동 통과만으로 완료 처리하지 않기 위한 수치 근거.
    await test.step('QHD signal 기하 확인', async () => {
      try {
        await gotoHome(page);
        const geometry = await page.evaluate(() => {
          const scenes = Array.from(document.querySelectorAll('[data-qhd-signal]'));
          const contentLeft = (window.innerWidth - 1440) / 2;
          const contentRight = window.innerWidth - contentLeft;
          return scenes.map((el) => {
            const style = getComputedStyle(el);
            const visible = style.display !== 'none';
            const rect = (el as HTMLElement).getBoundingClientRect();
            const sectionEl = el.closest('section');
            const sectionRect = sectionEl ? sectionEl.getBoundingClientRect() : null;
            const circles = Array.from(el.querySelectorAll('[data-qhd-shape="circle"]')).map((c) => {
              const r = (c as HTMLElement).getBoundingClientRect();
              return { width: Math.round(r.width * 100) / 100, height: Math.round(r.height * 100) / 100, diff: Math.round(Math.abs(r.width - r.height) * 100) / 100 };
            });
            const overlapsContent = visible && rect.width > 0 && rect.left < contentRight && rect.right > contentLeft;
            return {
              variant: el.getAttribute('data-qhd-signal'),
              visible,
              pointerEvents: style.pointerEvents,
              ariaHidden: el.getAttribute('aria-hidden'),
              rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width), height: Math.round(rect.height) },
              documentTop: Math.round(rect.top + window.scrollY),
              sectionRelativeTop: sectionRect ? Math.round(rect.top - sectionRect.top) : null,
              viewportWidth: window.innerWidth,
              circles,
              allCirclesRound: circles.every((c) => c.diff <= 1),
              overlapsContent,
            };
          });
        });
        record({ kind: 'qhdSignalGeometry', viewport: viewportKey, scenes: geometry });

        // Phase 4E: 기록만 하고 끝내지 않는다 — 필수 조건은 expect.soft()로 실패를
        // 남긴다(하나가 실패해도 나머지 검사는 계속 진행). 예외를 삼켜 "확인 불가"로만
        // 남기지 않고, 측정 자체가 위 try에서 실패하면 이 test.step은 그대로 throw된다.
        const hiddenExpected = QHD_HIDDEN_VIEWPORTS.includes(viewportKey);
        for (const scene of geometry) {
          const label = `${viewportKey}/${scene.variant}`;
          if (hiddenExpected) {
            expect.soft(scene.visible, `${label}: 1440 이하에서 visible이면 안 됨`).toBe(false);
            continue;
          }
          const expected = QHD_EXPECTED[viewportKey]?.[scene.variant as string];
          if (!expected) continue; // 이 viewport는 위 표에 없음(1440 이하 외 다른 뷰포트는 자유 렌더 허용)

          expect.soft(scene.visible, `${label}: visible이어야 함`).toBe(true);
          expect.soft(scene.allCirclesRound, `${label}: 원이 타원으로 늘어나면 안 됨`).toBe(true);
          expect.soft(scene.ariaHidden, `${label}: aria-hidden="true"`).toBe('true');
          expect.soft(scene.pointerEvents, `${label}: pointer-events:none`).toBe('none');

          // Phase 5A-R: "부분 clip 허용" 폐기 — visible로 판정된 장식은 viewport
          // 안에 완전히 들어와야 한다(한 픽셀이라도 밖으로 나가면 FAIL).
          expect.soft(scene.rect.left, `${label}: rect.left가 0 미만(왼쪽으로 잘림)`).toBeGreaterThanOrEqual(0);
          expect.soft(scene.rect.right, `${label}: rect.right가 viewport(${scene.viewportWidth}) 초과(오른쪽으로 잘림)`).toBeLessThanOrEqual(scene.viewportWidth);

          if (expected.width != null) {
            expect.soft(Math.abs(scene.rect.width - expected.width), `${label}: width ${scene.rect.width} vs 기대 ${expected.width}`).toBeLessThanOrEqual(QHD_SIZE_TOLERANCE);
          }
          if (expected.height != null) {
            expect.soft(Math.abs(scene.rect.height - expected.height), `${label}: height ${scene.rect.height} vs 기대 ${expected.height}`).toBeLessThanOrEqual(QHD_SIZE_TOLERANCE);
          }
          if (expected.left != null) {
            expect.soft(Math.abs(scene.rect.left - expected.left), `${label}: left ${scene.rect.left} vs 기대 ${expected.left}`).toBeLessThanOrEqual(QHD_TOLERANCE);
          }
          if (expected.rightGap != null) {
            const actualGap = scene.viewportWidth - scene.rect.right;
            expect.soft(Math.abs(actualGap - expected.rightGap), `${label}: rightGap ${actualGap} vs 기대 ${expected.rightGap}`).toBeLessThanOrEqual(QHD_TOLERANCE);
          }
          if (expected.documentTop != null) {
            expect.soft(Math.abs(scene.documentTop - expected.documentTop), `${label}: documentTop ${scene.documentTop} vs 기대 ${expected.documentTop}`).toBeLessThanOrEqual(QHD_TOLERANCE);
          }
          if (expected.sectionRelativeTop != null) {
            expect.soft(scene.sectionRelativeTop, `${label}: section을 찾지 못함`).not.toBeNull();
            if (scene.sectionRelativeTop != null) {
              expect.soft(Math.abs(scene.sectionRelativeTop - expected.sectionRelativeTop), `${label}: sectionRelativeTop ${scene.sectionRelativeTop} vs 기대 ${expected.sectionRelativeTop}`).toBeLessThanOrEqual(QHD_TOLERANCE);
            }
          }
          if (expected.overlapsContent != null) {
            expect.soft(scene.overlapsContent, `${label}: overlapsContent ${scene.overlapsContent} vs 기대 ${expected.overlapsContent}`).toBe(expected.overlapsContent);
          }
        }
      } catch (e) {
        record({ kind: 'qhdSignalGeometry', viewport: viewportKey, ok: undefined, remark: String(e).slice(0, 200) });
        throw e; // 측정 자체 실패는 "확인 불가"로 조용히 넘기지 않고 test를 FAIL시킨다.
      }
    });

    // Phase 4F: QhdSectionIndex(01~04, Figma "Wide Index/Wide Label" 396:199~206)
    // 기하를 QhdAmbientSignal과 같은 방식으로 실측·검증한다. Featured/Contact는
    // project band·2-pane split 같은 opaque full-bleed 배경이 DOM에서 이 컴포넌트보다
    // 앞에 있으면 완전히 가려지는 실제 버그가 있었다(elementFromPoint로 재현, 구현 중
    // 발견해 DOM 순서를 뒤로 옮겨 수정) — 이 검사는 그 회귀를 막기 위해 visible뿐
    // 아니라 좌표까지 확인한다.
    await test.step('QHD section index 기하 확인', async () => {
      try {
        await gotoHome(page);
        const indexGeometry = await page.evaluate(() => {
          const contentLeft = (window.innerWidth - 1440) / 2;
          const contentRight = window.innerWidth - contentLeft;
          const indexEls = Array.from(document.querySelectorAll('[data-qhd-index]'));
          return indexEls.map((el) => {
            const wrapper = el.parentElement as HTMLElement;
            const style = getComputedStyle(wrapper);
            const visible = style.display !== 'none';
            const rect = (el as HTMLElement).getBoundingClientRect();
            const labelEl = wrapper.querySelector('[data-qhd-index-label]') as HTMLElement | null;
            const labelRect = labelEl ? labelEl.getBoundingClientRect() : null;
            const section = el.closest('section');
            const sectionRect = section ? section.getBoundingClientRect() : null;
            const overlapsContent = visible && (
              (rect.width > 0 && rect.left < contentRight && rect.right > contentLeft) ||
              (!!labelRect && labelRect.width > 0 && labelRect.left < contentRight && labelRect.right > contentLeft)
            );
            return {
              index: el.getAttribute('data-qhd-index'),
              labelId: labelEl ? labelEl.getAttribute('data-qhd-index-label') : null,
              visible,
              pointerEvents: style.pointerEvents,
              ariaHidden: wrapper.getAttribute('aria-hidden'),
              rect: { left: Math.round(rect.left), right: Math.round(rect.right), top: Math.round(rect.top), width: Math.round(rect.width), height: Math.round(rect.height) },
              labelRect: labelRect ? { left: Math.round(labelRect.left), right: Math.round(labelRect.right), width: Math.round(labelRect.width) } : null,
              viewportWidth: window.innerWidth,
              sectionRelativeTop: sectionRect ? Math.round(rect.top - sectionRect.top) : null,
              labelSectionRelativeTop: (labelRect && sectionRect) ? Math.round(labelRect.top - sectionRect.top) : null,
              overlapsContent,
            };
          });
        });
        record({ kind: 'qhdIndexGeometry', viewport: viewportKey, indices: indexGeometry });

        const hiddenExpected = QHD_HIDDEN_VIEWPORTS.includes(viewportKey);
        const visibleExpected = QHD_INDEX_VISIBLE_VIEWPORTS.includes(viewportKey);
        for (const item of indexGeometry) {
          const label = `${viewportKey}/index-${item.labelId}`;
          if (hiddenExpected) {
            expect.soft(item.visible, `${label}: 1440 이하에서 visible이면 안 됨`).toBe(false);
            continue;
          }
          if (!visibleExpected) continue; // 표 밖 viewport는 자유 렌더 허용(현재는 hidden/visible 둘로 전부 분류됨)

          expect.soft(item.visible, `${label}: visible이어야 함`).toBe(true);
          expect.soft(item.ariaHidden, `${label}: aria-hidden="true"`).toBe('true');
          expect.soft(item.pointerEvents, `${label}: pointer-events:none`).toBe('none');
          expect.soft(item.overlapsContent, `${label}: overlapsContent는 false여야 함(중앙 1440 shell 침범 금지)`).toBe(false);

          // Phase 5A-R: index 숫자와 label 전체가 viewport 안에 완전히 들어와야 한다
          // ("숫자는 보이는데 label이 잘리는 상태" 금지 — 사용자가 실제 2560에서 발견).
          expect.soft(item.rect.left, `${label}: index rect.left가 0 미만`).toBeGreaterThanOrEqual(0);
          expect.soft(item.rect.right, `${label}: index rect.right가 viewport(${item.viewportWidth}) 초과`).toBeLessThanOrEqual(item.viewportWidth);
          if (item.labelRect) {
            expect.soft(item.labelRect.left, `${label}: label rect.left가 0 미만`).toBeGreaterThanOrEqual(0);
            expect.soft(item.labelRect.right, `${label}: label rect.right가 viewport(${item.viewportWidth}) 초과`).toBeLessThanOrEqual(item.viewportWidth);
          }

          const expected = item.labelId ? QHD_INDEX_EXPECTED[item.labelId] : undefined;
          if (expected) {
            expect.soft(item.sectionRelativeTop, `${label}: section을 찾지 못함`).not.toBeNull();
            if (item.sectionRelativeTop != null) {
              expect.soft(
                Math.abs(item.sectionRelativeTop - expected.sectionRelativeTop),
                `${label}: sectionRelativeTop ${item.sectionRelativeTop} vs 기대 ${expected.sectionRelativeTop}`,
              ).toBeLessThanOrEqual(QHD_TOLERANCE);
            }
            expect.soft(item.labelSectionRelativeTop, `${label}: label section을 찾지 못함`).not.toBeNull();
            if (item.labelSectionRelativeTop != null) {
              expect.soft(
                Math.abs(item.labelSectionRelativeTop - expected.labelSectionRelativeTop),
                `${label}: labelSectionRelativeTop ${item.labelSectionRelativeTop} vs 기대 ${expected.labelSectionRelativeTop}`,
              ).toBeLessThanOrEqual(QHD_TOLERANCE);
            }
          }
        }
      } catch (e) {
        record({ kind: 'qhdIndexGeometry', viewport: viewportKey, ok: undefined, remark: String(e).slice(0, 200) });
        throw e;
      }
    });

    // Phase 4F 9-3: viewport 밖으로 나간 element를 진단 기록한다. 이 저장소에서
    // 의도적으로 화면 밖에 걸쳐 렌더되는 요소는 QhdAmbientSignal/QhdSectionIndex뿐이라
    // (다른 콘텐츠는 그런 패턴을 쓰지 않는다) 이 두 selector만 스캔해도 "의도된 장식 vs
    // 콘텐츠 overflow"를 구분하는 실질적 목적을 満족한다 — 진짜 콘텐츠가 실수로 화면
    // 밖으로 나가면 이미 위의 'horizontalOverflow' 스텝(scrollWidth 비교)이 잡는다.
    await test.step('overflow source diagnostics', async () => {
      try {
        const diag = await page.evaluate(() => {
          const vw = window.innerWidth;
          const items: Record<string, unknown>[] = [];
          document.querySelectorAll('[data-qhd-signal], [data-qhd-index], [data-qhd-index-label]').forEach((el) => {
            const r = (el as HTMLElement).getBoundingClientRect();
            if (r.width === 0 && r.height === 0) return; // display:none 등으로 렌더 안 됨
            const exceeds = r.left < 0 || r.right > vw;
            if (!exceeds) return;
            const sig = el.getAttribute('data-qhd-signal');
            const idx = el.getAttribute('data-qhd-index');
            const idxLabel = el.getAttribute('data-qhd-index-label');
            items.push({
              selector: sig ? `[data-qhd-signal="${sig}"]` : idx ? `[data-qhd-index="${idx}"]` : `[data-qhd-index-label="${idxLabel}"]`,
              rect: { left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), width: Math.round(r.width) },
              computedOverflow: getComputedStyle(el).overflow,
              intendedDecoration: true,
              isContent: false,
            });
          });
          return {
            items,
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: vw,
            scrollWidthAffected: document.documentElement.scrollWidth > vw + 1,
          };
        });
        record({ kind: 'overflowDiagnostics', viewport: viewportKey, ...diag });
        expect.soft(
          diag.scrollWidthAffected,
          `${viewportKey}: QHD 장식이 화면 밖으로 나가도 document.documentElement.scrollWidth는 늘어나면 안 됨(scrollWidth ${diag.scrollWidth} vs innerWidth ${diag.innerWidth})`,
        ).toBe(false);
      } catch (e) {
        record({ kind: 'overflowDiagnostics', viewport: viewportKey, ok: undefined, remark: String(e).slice(0, 200) });
        throw e;
      }
    });

    record({ kind: 'consoleIssues', viewport: viewportKey, count: consoleIssues.length, items: consoleIssues.slice(0, 20) });
    record({ kind: 'failedRequests', viewport: viewportKey, count: failedRequests.length, items: failedRequests.slice(0, 20) });
  });
});
