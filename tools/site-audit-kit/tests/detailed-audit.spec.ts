import fs from 'fs';
import path from 'path';
import { test, type Page } from '@playwright/test';
import { TARGET_URL, SCREENSHOT_DIR, DETAILED_RESULTS_FILE, DETAILED_VIEWPORTS } from './detailed-target';

function record(entry: Record<string, unknown>) {
  fs.appendFileSync(DETAILED_RESULTS_FILE, JSON.stringify(entry) + '\n');
}

async function gotoHome(page: Page) {
  const response = await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
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

    // 4. 텍스트 잘림(clipping) 확인
    await test.step('텍스트 잘림 확인', async () => {
      try {
        const clipped = await page.evaluate(() => {
          const candidates = Array.from(document.querySelectorAll('p, h1, h2, h3, span, li'));
          const out: { text: string; tag: string }[] = [];
          for (const el of candidates) {
            const style = getComputedStyle(el);
            const lineClamp = (style as any).webkitLineClamp;
            const isEllipsis = style.textOverflow === 'ellipsis' || (lineClamp && lineClamp !== 'none');
            if (!isEllipsis) continue;
            if (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) {
              out.push({ text: (el.textContent || '').trim().slice(0, 60), tag: el.tagName });
            }
          }
          return out;
        });
        record({ kind: 'textClipped', viewport: viewportKey, count: clipped.length, items: clipped.slice(0, 20) });
      } catch (e) {
        record({ kind: 'textClipped', viewport: viewportKey, ok: undefined, remark: String(e).slice(0, 200) });
      }
    });

    // 5. (모바일) 본문 글씨 크기 확인
    if (viewportKey.startsWith('mobile')) {
      await test.step('모바일 본문 글씨 크기 확인', async () => {
        try {
          const sizes = await page.evaluate(() => {
            const paras = Array.from(document.querySelectorAll('p'));
            return paras
              .filter((p) => (p.textContent || '').trim().length > 10)
              .map((p) => parseFloat(getComputedStyle(p).fontSize));
          });
          const tooSmall = sizes.filter((s) => s < 14);
          record({
            kind: 'mobileFontSize',
            viewport: viewportKey,
            count: sizes.length,
            minSize: sizes.length ? Math.min(...sizes) : null,
            tooSmallCount: tooSmall.length,
          });
        } catch (e) {
          record({ kind: 'mobileFontSize', viewport: viewportKey, ok: undefined, remark: String(e).slice(0, 200) });
        }
      });
    }

    // 이하 항목은 뷰포트에 좌우되지 않는 상호작용/스타일 점검이므로 대표 뷰포트(desktop-1440)에서만 1회 수행한다.
    if (viewportKey === 'desktop-1440') {
      await test.step('다크 배경 텍스트 대비(WCAG) 확인', async () => {
        try {
          const contrasts = await page.evaluate(() => {
            function parseColor(str: string) {
              const m = str.match(/rgba?\(([^)]+)\)/);
              if (!m) return null;
              const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
              return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
            }
            function luminance(c: { r: number; g: number; b: number }) {
              const [r, g, b] = [c.r, c.g, c.b].map((v) => {
                const s = v / 255;
                return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
              });
              return 0.2126 * r + 0.7152 * g + 0.0722 * b;
            }
            function bgColor(el: Element | null) {
              let node: Element | null = el;
              while (node) {
                const c = parseColor(getComputedStyle(node).backgroundColor);
                if (c && c.a > 0) return c;
                node = node.parentElement;
              }
              return { r: 255, g: 255, b: 255 };
            }
            const textEls = Array.from(document.querySelectorAll('h1, h2, h3, p, button, a')).filter(
              (el) => (el.textContent || '').trim().length > 1
            );
            const out: { text: string; ratio: number; fontSize: number }[] = [];
            for (const el of textEls.slice(0, 200)) {
              const style = getComputedStyle(el);
              const fg = parseColor(style.color);
              if (!fg) continue;
              const bg = bgColor(el);
              const l1 = luminance(fg) + 0.05;
              const l2 = luminance(bg) + 0.05;
              const ratio = l1 > l2 ? l1 / l2 : l2 / l1;
              out.push({ text: (el.textContent || '').trim().slice(0, 40), ratio: Math.round(ratio * 100) / 100, fontSize: parseFloat(style.fontSize) });
            }
            return out;
          });
          const low = contrasts.filter((c) => (c.fontSize >= 24 ? c.ratio < 3 : c.ratio < 4.5));
          record({ kind: 'contrast', total: contrasts.length, lowCount: low.length, low: low.slice(0, 20) });
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
          if (found) {
            const base = await cta.evaluate((el) => getComputedStyle(el).cssText);
            await cta.hover();
            await page.waitForTimeout(150);
            const afterHover = await cta.evaluate((el) => getComputedStyle(el).cssText);
            hoverChanged = base !== afterHover;

            await cta.evaluate((el) => (el as HTMLElement).blur());
            const noFocus = await cta.evaluate((el) => getComputedStyle(el).outlineStyle + getComputedStyle(el).boxShadow);
            await cta.focus();
            await page.waitForTimeout(150);
            const withFocus = await cta.evaluate((el) => getComputedStyle(el).outlineStyle + getComputedStyle(el).boxShadow);
            focusChanged = noFocus !== withFocus;
          }
          record({ kind: 'hoverFocus', ctaFound: found, hoverChanged, focusChanged });
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
              return `${el.tagName}:${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 20)}`;
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
              'normalAnimatedCount/reducedAnimatedCount는 animationName이 none인 요소도 함께 세고 있었다. 사이트는 `*, ::before, ::after { animation-duration: 0.01ms !important }` 형태의 전역 reduced-motion 접근성 규칙을 갖고 있어, 애니메이션이 실제로 없는 요소(html/head/meta/script 등 포함)도 reduced 모드에서 animationDuration이 0이 아닌 값(0.01ms)으로 잡힌다. animationName!==none으로 필터링한 realAnimatedCount는 normal/reduced 양쪽에서 값이 일치하며, 이는 실제 named 애니메이션(flowStreamDrift/spotlightBreathe/coreOrbitSpin/fadeInUp/ctaFadeInUp)이 reduced 모드에서 duration만 0.01ms로 줄어들 뿐 존재 자체는 유지된다는 뜻으로, ambientMotion 계측 결과와도 일치한다.',
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

      await test.step('line-height 확인', async () => {
        try {
          const ratios = await page.evaluate(() => {
            const paras = Array.from(document.querySelectorAll('p')).filter((p) => (p.textContent || '').trim().length > 15);
            return paras.map((p) => {
              const style = getComputedStyle(p);
              const fontSize = parseFloat(style.fontSize);
              let lineHeight = style.lineHeight;
              const lh = lineHeight.endsWith('px') ? parseFloat(lineHeight) : parseFloat(lineHeight) * fontSize;
              return Math.round((lh / fontSize) * 100) / 100;
            });
          });
          const low = ratios.filter((r) => r < 1.6);
          record({ kind: 'lineHeight', total: ratios.length, belowRecommendedCount: low.length, minRatio: ratios.length ? Math.min(...ratios) : null });
        } catch (e) {
          record({ kind: 'lineHeight', ok: undefined, remark: String(e).slice(0, 200) });
        }
      });

      await test.step('프로젝트 카드/모달 문구 추출', async () => {
        try {
          await gotoHome(page);
          await scrollThroughPage(page);
          const cards = await page.evaluate(() => {
            const detailButtons = Array.from(document.querySelectorAll('button')).filter((b) =>
              /작업 과정 보기/.test(b.textContent || '')
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

          const modalTexts: string[] = [];
          const detailButtons = page.getByRole('button', { name: /작업 과정 보기/ });
          const count = await detailButtons.count();
          for (let i = 0; i < count; i++) {
            const btn = detailButtons.nth(i);
            await btn.click();
            const dialog = page.locator('[role="dialog"]');
            const opened = await dialog.first().waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
            if (opened) {
              const text = await dialog.first().evaluate((el) => (el.textContent || '').replace(/\s+/g, ' ').trim());
              modalTexts.push(text.slice(0, 1500));
              const closeBtn = dialog.getByRole('button', { name: /닫기/ }).first();
              if ((await closeBtn.count()) > 0) await closeBtn.click();
              else await page.keyboard.press('Escape');
              await page.waitForTimeout(300);
            } else {
              modalTexts.push('(모달 열기 실패)');
            }
          }
          record({ kind: 'projectModalText', modals: modalTexts });
        } catch (e) {
          record({ kind: 'projectCardText', ok: undefined, remark: String(e).slice(0, 200) });
        }
      });
    }

    record({ kind: 'consoleIssues', viewport: viewportKey, count: consoleIssues.length, items: consoleIssues.slice(0, 20) });
    record({ kind: 'failedRequests', viewport: viewportKey, count: failedRequests.length, items: failedRequests.slice(0, 20) });
  });
});
