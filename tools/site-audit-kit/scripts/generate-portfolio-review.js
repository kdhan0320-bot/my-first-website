// projects/my-portfolio 검사용 정적 리뷰 페이지를 생성하는 스크립트.
// 결과물은 저장소에 커밋되는 my-portfolio가 아니라, tools/site-audit-kit/audit-output/
// portfolio-review/ 아래(이 폴더의 .gitignore audit-output/ 규칙으로 Git 추적 제외)에
// 만든다. tools/site-audit-kit에 이미 설치된 @playwright/test(Chromium)를 재사용하며,
// my-portfolio에는 Playwright를 별도로 설치하지 않는다.
//
// 실행: npm run review:build (tools/site-audit-kit 위치에서)
//
// 순서:
// 1. git status 확인
// 2. Playwright/Chromium 실행 가능 여부 확인
// 3. 기존 review 결과물 중 허용된 생성 파일만 정리
// 4. projects/my-portfolio npm run build (캡처용, 1회만 실행)
// 5. 로컬 Vite Preview 서버 시작
// 6. 서버 응답 대기
// 7. 메인 포트폴리오 데스크톱·모바일 캡처
// 8. 대표 프로젝트 캡처
// 9. audit-output/portfolio-review/index.html 생성
// 10. review 페이지를 로컬 HTTP로 열어 PDF 생성
// 11. review 결과물 검증
// 12. Preview/임시 서버 종료 (성공·실패와 관계없이 항상 종료, try/finally)
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn, execSync } = require('child_process');
const { pathToFileURL } = require('url');
const { chromium } = require('@playwright/test');

const SITE_AUDIT_DIR = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SITE_AUDIT_DIR, '..', '..');
const PORTFOLIO_DIR = path.join(REPO_ROOT, 'projects', 'my-portfolio');
const REVIEW_DIR = path.join(SITE_AUDIT_DIR, 'audit-output', 'portfolio-review');
const ASSETS_DIR = path.join(REVIEW_DIR, 'assets');

// vite.config.js의 base 값과 반드시 일치해야 함 (이번 작업에서 base는 변경하지 않음)
const PREVIEW_BASE_PATH = '/dohan-portfolio/my-portfolio/';
const PREVIEW_PORT = 4321;
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}${PREVIEW_BASE_PATH}`;
const STATIC_SERVER_PORT = 4322;

const KNOWN_FILES = [
  path.join(REVIEW_DIR, 'index.html'),
  path.join(REVIEW_DIR, 'portfolio-review.pdf'),
  path.join(ASSETS_DIR, 'home-desktop.png'),
  path.join(ASSETS_DIR, 'home-mobile.png'),
  path.join(ASSETS_DIR, 'jobflow.png'),
  path.join(ASSETS_DIR, 'feedback-hub.png'),
  path.join(ASSETS_DIR, 'bus-arrival-app.png'),
];

function log(step, msg) {
  console.log(`[${step}] ${msg}`);
}

function run(cmd, args, opts) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} 종료 코드 ${code}`))));
    child.on('error', reject);
  });
}

function spawnPreviewServer() {
  const child = spawn(
    'npm',
    ['run', 'preview', '--', '--port', String(PREVIEW_PORT), '--strictPort'],
    { cwd: PORTFOLIO_DIR, shell: true, stdio: ['ignore', 'pipe', 'pipe'] }
  );
  let output = '';
  child.stdout.on('data', (d) => { output += d.toString(); });
  child.stderr.on('data', (d) => { output += d.toString(); });
  return { child, getOutput: () => output };
}

function killTree(pid) {
  if (!pid) return;
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore' });
    } else {
      process.kill(-pid, 'SIGKILL');
    }
  } catch (e) {
    // 이미 종료된 프로세스 등은 무시
  }
}

async function waitForHttpReady(url, { timeoutMs = 30000, intervalMs = 500 } = {}) {
  const start = Date.now();
  let lastErr;
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`서버 준비 대기 시간 초과: ${url} (${lastErr})`);
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function readPngSize(filePath) {
  const buf = fs.readFileSync(filePath);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

function formatKst(date) {
  return `${new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(date)} KST`;
}

function renderProjectSection(p, index) {
  const techLine = p.tech_stack && p.tech_stack.length ? p.tech_stack.join(', ') : '기재된 기술 스택 없음';
  const goal = p.goal || p.overview || '기재된 목적 설명 없음';
  const role = p.role || '기재된 역할 없음';
  const scope = p.cardScope || p.result || '기재된 구현 범위 없음';
  const limitation = p.limitation || '기재된 한계 설명 없음';
  // dataUsage는 projectsFallbackData.js의 대표 프로젝트 전용 필드(단일 출처) -
  // limitation과 내용이 겹치지 않도록 별도로 관리된다. 없으면(비대표 프로젝트 등)
  // limitation으로 폴백하지 않고 명시적으로 "없음"을 표시해 중복 문장을 만들지 않는다.
  const dataUsage = p.dataUsage || '기재된 API/데이터 사용 방식 설명 없음';
  const aiUsage = p.is_ai_project ? (p.aiContribution || '기재된 AI 활용 설명 없음') : 'AI 도구를 활용하지 않은 프로젝트입니다.';
  const imageFile = `assets/${p.id}.png`;

  const liveLink = p.liveUrl
    ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank" rel="noopener noreferrer">라이브 사이트 보기 →</a>`
    : p.figmaPrototypeUrl
      ? `<a href="${escapeHtml(p.figmaPrototypeUrl)}" target="_blank" rel="noopener noreferrer">Figma 프로토타입 보기 →</a> <span class="note">(실제 배포된 라이브 사이트 없음)</span>`
      : '<span class="note">라이브 사이트 없음</span>';
  const githubLink = p.github_url
    ? `<a href="${escapeHtml(p.github_url)}" target="_blank" rel="noopener noreferrer">GitHub 보기 →</a>`
    : '<span class="note">공개 GitHub 링크 없음</span>';

  return `
  <section class="project" aria-labelledby="project-${index}-title">
    <h3 id="project-${index}-title">${escapeHtml(p.title)}</h3>
    <img class="project-shot" src="${imageFile}" alt="${escapeHtml(p.title)} 실제 화면 스크린샷" loading="lazy" />
    <dl>
      <dt>목적</dt><dd>${escapeHtml(goal)}</dd>
      <dt>담당 역할</dt><dd>${escapeHtml(role)}</dd>
      <dt>사용 기술</dt><dd>${escapeHtml(techLine)}</dd>
      <dt>실제 구현 범위</dt><dd>${escapeHtml(scope)}</dd>
      <dt>구현하지 않은 기능 / 한계</dt><dd>${escapeHtml(limitation)}</dd>
      <dt>API와 데이터 사용 방식</dt><dd>${escapeHtml(dataUsage)}</dd>
      <dt>AI 활용 범위</dt><dd>${escapeHtml(aiUsage)}</dd>
      <dt>링크</dt><dd>${liveLink} &nbsp;·&nbsp; ${githubLink}</dd>
    </dl>
  </section>`;
}

function buildReviewHtml({ meta, featuredProjects, generatedAt }) {
  const name = meta.NAME;
  const positioning = meta.POSITIONING_LINE;
  const applicationFocus = meta.APPLICATION_FOCUS.join(' · ');
  const aiUsageGlobal = meta.SUB_DESCRIPTION;
  const liveSiteUrl = meta.LIVE_SITE_URL;
  const githubUrl = meta.PROJECT_GITHUB_URL;
  const generatedAtIso = generatedAt.toISOString();
  const generatedAtKst = formatKst(generatedAt);
  const projectsHtml = featuredProjects.map((p, i) => renderProjectSection(p, i + 1)).join('\n');

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>${escapeHtml(name)} 포트폴리오 검사용 요약</title>
<meta name="description" content="${escapeHtml(positioning)}" />
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 0 1.25rem 3rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', sans-serif;
    color: #16202e; background: #ffffff; line-height: 1.6;
  }
  main { max-width: 860px; margin: 0 auto; }
  header.page-header { padding: 2rem 0 1.25rem; border-bottom: 2px solid #16202e; margin-bottom: 1.5rem; }
  h1 { font-size: 1.6rem; margin: 0 0 0.35rem; }
  .badge-line { font-size: 0.95rem; color: #475569; margin: 0 0 0.75rem; }
  .positioning { font-size: 1.05rem; font-weight: 600; margin: 0; }
  .meta-links { margin-top: 1rem; font-size: 0.9rem; }
  .meta-links a { margin-right: 1rem; }
  section.intro dl, .project dl { display: grid; grid-template-columns: 9rem 1fr; gap: 0.4rem 1rem; margin: 0.75rem 0 0; }
  section.intro dt, .project dt { font-weight: 700; color: #334155; }
  section.intro dd, .project dd { margin: 0; }
  .project { border-top: 1px solid #cbd5e1; padding: 1.5rem 0; page-break-inside: avoid; break-inside: avoid; }
  .project h3 { font-size: 1.15rem; margin: 0 0 0.75rem; }
  .project-shot { display: block; max-width: 100%; height: auto; border: 1px solid #cbd5e1; border-radius: 4px; margin-bottom: 0.75rem; }
  .home-shots { display: flex; gap: 1rem; flex-wrap: wrap; margin: 1rem 0; }
  .home-shots figure { margin: 0; flex: 1 1 260px; }
  .home-shots img { display: block; max-width: 100%; height: auto; border: 1px solid #cbd5e1; border-radius: 4px; }
  .home-shots figcaption { font-size: 0.85rem; color: #64748b; margin-top: 0.35rem; }
  .note { color: #64748b; font-size: 0.85rem; }
  footer.page-footer { margin-top: 2.5rem; padding-top: 1rem; border-top: 1px solid #cbd5e1; font-size: 0.8rem; color: #64748b; }
  a { color: #1d4ed8; }
  [style*="position: sticky"], [style*="position:sticky"], .sticky { position: static !important; }
  @media print {
    body { padding: 0; }
    .project {
      page-break-inside: avoid; break-inside: avoid;
      padding: 0.9rem 0;
    }
    .project dl { break-inside: avoid; gap: 0.25rem 1rem; margin: 0.5rem 0 0; }
    .project-shot { max-height: 230px; margin-bottom: 0.5rem; }
    .home-shots { margin: 0.5rem 0; }
    .home-shots img { max-height: 210px; }
    /* 마지막 프로젝트 다음, footer 앞에서 억지로 페이지가 넘어가지 않도록
       "링크" 줄 + footer가 앞 내용과 붙어 있게 유도한다(강제는 아님 - 정말 공간이
       없으면 그래도 넘어감). */
    .project:last-of-type { break-after: avoid; }
    footer.page-footer {
      margin-top: 1rem; padding-top: 0.5rem;
      font-size: 0.7rem;
      break-inside: avoid; break-before: avoid;
    }
    [style*="position: sticky"], [style*="position:sticky"], .sticky { position: static !important; }
  }
</style>
</head>
<body>
<main>
  <header class="page-header">
    <h1>${escapeHtml(name)}</h1>
    <p class="badge-line">지원 분야: ${escapeHtml(applicationFocus)}</p>
    <p class="positioning">${escapeHtml(positioning)}</p>
    <p class="meta-links">
      <a href="${escapeHtml(liveSiteUrl)}" target="_blank" rel="noopener noreferrer">라이브 사이트 보기 →</a>
      <a href="${escapeHtml(githubUrl)}" target="_blank" rel="noopener noreferrer">GitHub 저장소 보기 →</a>
      <a href="../">메인 포트폴리오로 돌아가기 →</a>
    </p>
  </header>

  <section class="intro" aria-labelledby="intro-title">
    <h2 id="intro-title">개요</h2>
    <dl>
      <dt>AI 활용 범위</dt><dd>${escapeHtml(aiUsageGlobal)}</dd>
      <dt>API/데이터 사용 방식</dt><dd>홈 화면의 대표 프로젝트 카드는 기본적으로 정적 fallback 데이터(projectsFallbackData.js)를 사용하며, Supabase 연결이 가능한 경우에만 이를 대체합니다. 프로젝트별 API·데이터 연동 범위는 아래 각 프로젝트 항목에 따로 표시했습니다.</dd>
    </dl>
  </section>

  <section class="home-preview" aria-labelledby="home-preview-title">
    <h2 id="home-preview-title">메인 화면</h2>
    <div class="home-shots">
      <figure>
        <img src="assets/home-desktop.png" alt="${escapeHtml(name)} 포트폴리오 홈 화면 데스크톱(1440x900) 스크린샷" />
        <figcaption>데스크톱 (1440×900)</figcaption>
      </figure>
      <figure>
        <img src="assets/home-mobile.png" alt="${escapeHtml(name)} 포트폴리오 홈 화면 모바일(390x844) 스크린샷" />
        <figcaption>모바일 (390×844)</figcaption>
      </figure>
    </div>
  </section>

  <section class="projects" aria-labelledby="projects-title">
    <h2 id="projects-title">대표 프로젝트</h2>
    ${projectsHtml}
  </section>

  <footer class="page-footer">
    <p>생성 시각: ${escapeHtml(generatedAtIso)} (${escapeHtml(generatedAtKst)})</p>
    <p>이 페이지는 tools/site-audit-kit의 스크립트로 자동 생성된 정적 검사용 페이지이며, JavaScript 실행 없이 본문 내용을 확인할 수 있습니다.</p>
  </footer>
</main>
</body>
</html>`;
}

function createStaticServer(rootDir) {
  const mime = { '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.pdf': 'application/pdf', '.svg': 'image/svg+xml' };
  return http.createServer((req, res) => {
    try {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      const filePath = path.join(rootDir, urlPath === '/' ? 'index.html' : urlPath);
      if (!filePath.startsWith(rootDir) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404); res.end('Not found'); return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } catch (e) {
      res.writeHead(500); res.end(String(e));
    }
  });
}

async function captureHome(browser, url) {
  const targets = [
    { name: 'home-desktop.png', viewport: { width: 1440, height: 900 } },
    { name: 'home-mobile.png', viewport: { width: 390, height: 844 } },
  ];
  for (const t of targets) {
    const context = await browser.newContext({ viewport: t.viewport, reducedMotion: 'reduce' });
    // React 마운트보다 먼저 실행되어 HeroSection이 fadeIn 진입 애니메이션을 건너뛰고
    // 즉시 최종(opacity:1) 상태로 렌더링하게 하는 표시. HomePage의 data-review-ready
    // 신호도 이 표시를 보고 "실제로 보이는지"를 확인한 뒤에만 true가 된다.
    //
    // window.__PORTFOLIO_REVIEW_MODE__를 먼저 설정한다 - 이 Chromium 환경에서는
    // addInitScript 실행 시점에 document.documentElement가 아직 생성되지 않은 경우가
    // 있어(재현 확인됨) document.documentElement.setAttribute 호출이 조용히 아무 효과도
    // 내지 못하는 문제가 있었다. window 객체는 항상 존재하므로 window 플래그를 우선
    // 신호로 쓰고, documentElement가 생기면(즉시 또는 DOMContentLoaded 시점에) 기존
    // data-review-mode 속성도 함께 세워 두 경로 모두를 만족시킨다.
    await context.addInitScript(() => {
      window.__PORTFOLIO_REVIEW_MODE__ = true;

      const markDocument = () => {
        if (document.documentElement) {
          document.documentElement.setAttribute('data-review-mode', 'true');
        }
      };

      markDocument();
      document.addEventListener('DOMContentLoaded', markDocument, { once: true });
    });
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      // data-review-ready(성공) 또는 data-review-error(HomePage가 제한 시간 안에
      // Hero 텍스트 가시 상태를 확인하지 못함)를 함께 기다린다. 여기서 절대
      // "타임아웃이니 그냥 캡처 진행"으로 넘어가지 않는다 - 오류 신호가 오면 즉시
      // throw해서 review:build 전체를 실패시킨다.
      await page.waitForFunction(
        () =>
          document.documentElement.getAttribute('data-review-ready') === 'true' ||
          document.documentElement.hasAttribute('data-review-error'),
        null, { timeout: 20000 }
      );
      const reviewError = await page.evaluate(() => document.documentElement.getAttribute('data-review-error'));
      if (reviewError) {
        throw new Error(`${t.name}: Hero 텍스트 준비 실패 - ${reviewError}`);
      }
      await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));
      await page.waitForFunction(() => {
        const imgs = Array.from(document.images).filter((img) => {
          const r = img.getBoundingClientRect();
          return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
        });
        return imgs.every((img) => img.complete && img.naturalWidth > 0);
      }, null, { timeout: 20000 });
      await page.waitForSelector('#projects', { state: 'attached', timeout: 20000 });
      // 주의: 여기서 animation:none을 강제로 주입하지 않는다. Hero 텍스트/버튼은
      // opacity:0 + `animation: ... both`로 진입하는 구조라, animation을 통째로
      // 없애면 fill-mode의 최종 상태(opacity:1)도 함께 사라져 텍스트가 영구히
      // 안 보이게 된다(실제로 이 버그가 발생했었음). 대신 context의
      // reducedMotion:'reduce'(HeroSection 자체의 prefers-reduced-motion 처리로
      // 애니메이션을 0.01ms로 단축)와 screenshot의 animations:'disabled'
      // (진행 중인 애니메이션을 최종 상태로 fast-forward)만으로 안정화한다.
      const bodyText = await page.evaluate(() => document.body.innerText.trim());
      if (bodyText.length < 100) {
        throw new Error(`본문 텍스트가 비정상적으로 짧습니다(로딩 상태 의심): "${bodyText.slice(0, 80)}"`);
      }
      await page.screenshot({ path: path.join(ASSETS_DIR, t.name), animations: 'disabled', caret: 'hide' });
      log('capture', `${t.name} 저장 완료`);
    } finally {
      await context.close();
    }
  }
}

async function captureExternal(browser, url, fileName) {
  if (!url) throw new Error(`${fileName} 캡처용 라이브 URL이 없습니다.`);
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));
    // captureHome과 동일한 이유로 animation:none을 강제 주입하지 않는다.
    const bodyText = await page.evaluate(() => document.body.innerText.trim());
    if (bodyText.length < 50) {
      throw new Error(`${fileName}: 본문 텍스트가 비정상적으로 짧습니다(로딩 상태 의심): "${bodyText.slice(0, 80)}"`);
    }
    await page.screenshot({ path: path.join(ASSETS_DIR, fileName), animations: 'disabled', caret: 'hide' });
    log('capture', `${fileName} 저장 완료 (${url})`);
  } finally {
    await context.close();
  }
}

// JobFlow 전용 캡처. 기본 진입 화면이 로그인 화면이라 captureExternal을 그대로 쓰면
// 대시보드가 아니라 로그인 폼이 캡처된다. jobflow-dashboard 소스
// (src/pages/LoginPage.jsx, src/context/AuthContext.jsx)를 직접 확인해
// "데모로 둘러보기" 버튼이 계정/비밀번호/토큰 없이 로컬 상태(enterGuestMode →
// setIsGuest(true))만 바꾸고 Supabase 호출이 전혀 없음을 검증했다.
// 정확한 aria-label로만 버튼을 찾고(첫 번째 버튼 클릭 금지), 클릭 후에는 로딩
// 상태와 무관하게 항상 렌더되는 대시보드 제목으로 진입을 확인한다.
async function captureJobflow(browser, url, fileName) {
  if (!url) throw new Error(`${fileName} 캡처용 라이브 URL이 없습니다.`);
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });

    // 1) 정확한 데모 버튼만 클릭 - src/pages/LoginPage.jsx의 aria-label과 정확히 일치.
    const demoButton = page.getByRole('button', { name: '로그인 없이 데모 대시보드 체험하기' });
    const demoButtonCount = await demoButton.count();
    if (demoButtonCount !== 1) {
      throw new Error(
        `${fileName}: 데모 버튼("로그인 없이 데모 대시보드 체험하기")을 정확히 1개 찾지 못했습니다(찾은 개수: ${demoButtonCount}). ` +
        '로그인 화면을 대신 저장하지 않고 실패 처리합니다.'
      );
    }
    await demoButton.click();

    // 2) 대시보드 고유 요소 대기 - src/pages/DashboardPage.jsx의 고정 제목(로딩 상태와 무관하게 항상 렌더됨).
    const dashboardHeading = page.getByText('취업 준비 현황과 할 일을 한눈에 관리하는 대시보드', { exact: true });
    await dashboardHeading.waitFor({ state: 'visible', timeout: 15000 });

    // 3) 폰트 로딩 대기
    await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));

    // 4) 주요(뷰포트 내) 이미지 로딩 확인
    await page.waitForFunction(() => {
      const imgs = Array.from(document.images).filter((img) => {
        const r = img.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
      });
      return imgs.every((img) => img.complete && img.naturalWidth > 0);
    }, null, { timeout: 15000 });

    // 로그인 화면 문구가 여전히 남아있으면(전환 실패) 성공으로 저장하지 않는다.
    const bodyText = await page.evaluate(() => document.body.innerText.trim());
    if (bodyText.length < 50) {
      throw new Error(`${fileName}: 본문 텍스트가 비정상적으로 짧습니다(로딩 상태 의심): "${bodyText.slice(0, 80)}"`);
    }
    if (bodyText.includes('데모로 둘러보기')) {
      throw new Error(`${fileName}: 데모 버튼 클릭 후에도 로그인 화면 문구가 남아 있습니다 - 대시보드 진입 실패로 판단합니다.`);
    }

    // 5) 대시보드 화면 캡처
    await page.screenshot({ path: path.join(ASSETS_DIR, fileName), animations: 'disabled', caret: 'hide' });
    log('capture', `${fileName} 저장 완료 (게스트 데모 대시보드, ${url})`);
  } finally {
    await context.close();
  }
}

async function generatePdf(browser) {
  const server = createStaticServer(REVIEW_DIR);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(STATIC_SERVER_PORT, '127.0.0.1', resolve);
  });
  try {
    await waitForHttpReady(`http://127.0.0.1:${STATIC_SERVER_PORT}/`);
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(`http://127.0.0.1:${STATIC_SERVER_PORT}/`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.pdf({
        path: path.join(REVIEW_DIR, 'portfolio-review.pdf'),
        format: 'A4',
        printBackground: true,
        margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' },
      });
    } finally {
      await context.close();
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

function validate({ featuredProjects, htmlText }) {
  const errors = [];
  if (featuredProjects.length === 0) errors.push('대표 프로젝트가 0개입니다.');

  const indexPath = path.join(REVIEW_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    errors.push('index.html이 없습니다.');
  } else {
    for (const p of featuredProjects) {
      if (!htmlText.includes(escapeHtml(p.title))) errors.push(`프로젝트 제목 누락: ${p.title}`);
      if (!p.role || !htmlText.includes(escapeHtml(p.role))) errors.push(`역할 문구 누락: ${p.title}`);
    }
  }

  for (const f of ['home-desktop.png', 'home-mobile.png', 'jobflow.png', 'feedback-hub.png', 'bus-arrival-app.png']) {
    const fp = path.join(ASSETS_DIR, f);
    if (!fs.existsSync(fp)) { errors.push(`이미지 없음: ${f}`); continue; }
    const size = fs.statSync(fp).size;
    if (size === 0) { errors.push(`이미지 0바이트: ${f}`); continue; }
    const { width, height } = readPngSize(fp);
    if (width < 200 || height < 200) errors.push(`이미지 크기가 지나치게 작음(빈 화면 의심): ${f} (${width}x${height})`);
  }

  const pdfPath = path.join(REVIEW_DIR, 'portfolio-review.pdf');
  if (!fs.existsSync(pdfPath) || fs.statSync(pdfPath).size === 0) errors.push('PDF가 없거나 0바이트입니다.');

  const localPathPattern = /[a-zA-Z]:\\|\/Users\/|\/home\/[a-zA-Z]|AppData|file:\/\//;
  if (localPathPattern.test(htmlText)) errors.push('절대 로컬 경로로 의심되는 문자열이 HTML에 포함되어 있습니다.');

  const secretPattern = /SUPABASE|VITE_[A-Z_]+|sk-[a-zA-Z0-9]{10,}|eyJ[a-zA-Z0-9_-]{10,}/;
  if (secretPattern.test(htmlText)) errors.push('환경변수/비밀키로 의심되는 문자열이 HTML에 포함되어 있습니다.');

  return errors;
}

async function main() {
  // 1. git status 확인
  let gitStatusOutput;
  try {
    gitStatusOutput = execSync('git status --porcelain', { cwd: REPO_ROOT }).toString();
  } catch (e) {
    gitStatusOutput = `확인 실패: ${e.message}`;
  }
  log('1/12', 'git status 확인');
  console.log(gitStatusOutput.trim() ? gitStatusOutput : '(clean)');

  // 2. Playwright/Chromium 실행 가능 여부 확인
  log('2/12', 'Playwright/Chromium 실행 가능 여부 확인');
  const browser = await chromium.launch();
  log('2/12', `Chromium 실행 확인됨: ${await browser.version()}`);

  let previewProc;
  try {
    try {
      // 3. 기존 review 결과물 중 허용된 생성 파일만 정리
      log('3/12', '기존 review 결과물 중 허용된 생성 파일만 정리');
      for (const f of KNOWN_FILES) {
        if (fs.existsSync(f)) {
          fs.rmSync(f);
          log('3/12', `삭제: ${path.relative(REPO_ROOT, f)}`);
        }
      }
      fs.mkdirSync(ASSETS_DIR, { recursive: true });

      // 4. projects/my-portfolio npm run build (캡처용, 1회만 실행)
      log('4/12', 'projects/my-portfolio npm run build 시작');
      await run('npm', ['run', 'build'], { cwd: PORTFOLIO_DIR });
      log('4/12', 'npm run build 완료');

      // 5. 로컬 Vite Preview 서버 시작
      log('5/12', `로컬 Vite Preview 서버 시작 (포트 ${PREVIEW_PORT})`);
      previewProc = spawnPreviewServer();

      // 6. 서버 응답 대기
      log('6/12', `서버 응답 대기: ${PREVIEW_URL}`);
      await waitForHttpReady(PREVIEW_URL);
      log('6/12', '서버 응답 확인됨');

      // 7. 메인 포트폴리오 데스크톱·모바일 캡처
      log('7/12', '메인 포트폴리오 데스크톱·모바일 캡처');
      await captureHome(browser, PREVIEW_URL);

      // 8. 대표 프로젝트 캡처
      log('8/12', '대표 프로젝트 데이터 로드 (projectsFallbackData.js, portfolioMeta.js)');
      const dataModule = await import(pathToFileURL(path.join(PORTFOLIO_DIR, 'src', 'data', 'projectsFallbackData.js')).href);
      const meta = await import(pathToFileURL(path.join(PORTFOLIO_DIR, 'src', 'data', 'portfolioMeta.js')).href);
      const { fallbackProjects } = dataModule;

      const jobflow = fallbackProjects.find((p) => p.id === 'jobflow');
      const feedbackHub = fallbackProjects.find((p) => p.id === 'feedback-hub');
      const busArrival = fallbackProjects.find((p) => p.id === 'bus-arrival-app');
      const featuredProjects = [jobflow, busArrival, feedbackHub].filter(Boolean);

      log('8/12', '대표 프로젝트 캡처: jobflow, feedback-hub (라이브), bus-arrival-app (기존 썸네일)');
      await captureJobflow(browser, jobflow && jobflow.liveUrl, 'jobflow.png');
      await captureExternal(browser, feedbackHub && feedbackHub.liveUrl, 'feedback-hub.png');

      const busThumbSrc = path.join(PORTFOLIO_DIR, 'public', 'thumbnails', 'bus-arrival-ui-thumbnail.png');
      if (!fs.existsSync(busThumbSrc)) throw new Error('bus-arrival-ui-thumbnail.png 원본을 찾을 수 없습니다.');
      fs.copyFileSync(busThumbSrc, path.join(ASSETS_DIR, 'bus-arrival-app.png'));
      log('8/12', 'bus-arrival-app.png (기존 썸네일 복사, 원본 유지) 저장 완료');

      // 9. audit-output/portfolio-review/index.html 생성
      // 주의: Git commit hash는 표시하지 않는다. review 산출물 자체가 Git 추적 대상이
      // 아니라서 HEAD 해시를 넣으면 "이 커밋에 현재 PDF 결과물이 포함되어 있다"고
      // 오해할 수 있기 때문이다(생성 시각만 표시).
      log('9/12', 'audit-output/portfolio-review/index.html 생성');
      const generatedAt = new Date();
      const html = buildReviewHtml({ meta, featuredProjects, generatedAt });
      fs.writeFileSync(path.join(REVIEW_DIR, 'index.html'), html, 'utf-8');
      log('9/12', 'index.html 저장 완료');

      // 10. review 페이지를 로컬 HTTP로 열어 PDF 생성
      log('10/12', `review 페이지를 로컬 HTTP(포트 ${STATIC_SERVER_PORT})로 열어 PDF 생성`);
      await generatePdf(browser);
      log('10/12', 'portfolio-review.pdf 저장 완료');

      // 11. review 결과물 검증
      log('11/12', 'review 결과물 검증');
      const errors = validate({ featuredProjects, htmlText: html });
      if (errors.length) throw new Error(`검증 실패:\n- ${errors.join('\n- ')}`);
      log('11/12', '검증 통과');
    } finally {
      // 12. Preview 서버 종료 (성공·실패와 관계없이 항상 실행)
      if (previewProc && previewProc.child && previewProc.child.pid) {
        killTree(previewProc.child.pid);
        log('12/12', 'Preview 서버 종료 완료');
      } else {
        log('12/12', 'Preview 서버가 시작되지 않아 종료할 대상 없음');
      }
    }

    console.log('\n=== review:build 성공 ===');
    console.log(`결과물 위치: ${path.relative(REPO_ROOT, REVIEW_DIR)}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('\n=== review:build 실패 ===');
  console.error(err);
  process.exit(1);
});
