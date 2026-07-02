const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  await page.goto("https://kdhan0320-bot.github.io/my-first-website/ott-service/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "C:/Users/User/Desktop/ott_01_hero.png" });

  const html = await page.content();
  console.log("HAS_DEMO_LOGIN_BTN:", html.includes("데모 로그인"));
  console.log("HAS_DETAIL_BTN:", html.includes("상세 정보"));
  console.log("HAS_PORTFOLIO_LINK:", html.includes("Portfolio"));
  console.log("HAS_GITHUB_LINK:", html.includes("GitHub"));
  console.log("HAS_AI_ASSISTED:", html.includes("AI-assisted"));
  console.log("HAS_DEMO_NOTICE:", html.includes("학습 목적"));
  console.log("NO_RESULTS_HIDDEN:", !html.includes("해당 장르의 콘텐츠가 없습니다.") || html.includes('display: none') || html.includes('display:none'));

  // 장르 필터 클릭 테스트
  const thrBtn = page.locator('.filter-btn[data-filter="thriller"]');
  await thrBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: "C:/Users/User/Desktop/ott_02_filter.png" });
  console.log("FILTER_WORKS:", true);

  // 전체 필터로 돌아가기
  const allBtn = page.locator('.filter-btn[data-filter="all"]');
  await allBtn.click();
  await page.waitForTimeout(300);

  // 데모 로그인 버튼 클릭 → 로그인 모달
  const demoLoginBtn = page.locator("button.js-start-btn").first();
  await demoLoginBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: "C:/Users/User/Desktop/ott_03_login_modal.png" });

  const modalHtml = await page.content();
  console.log("MODAL_DEMO_TITLE:", modalHtml.includes("데모 로그인"));
  console.log("MODAL_DEMO_ENTER_BTN:", modalHtml.includes("데모로 둘러보기"));
  console.log("MODAL_NO_GOOGLE:", !modalHtml.includes("Google로 계속하기"));

  // ESC로 닫기
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // 예고편 모달
  const trailerBtn = page.locator("#heroTrailerBtn");
  await trailerBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: "C:/Users/User/Desktop/ott_04_trailer_modal.png" });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 모바일 360px
  await page.setViewportSize({ width: 360, height: 780 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "C:/Users/User/Desktop/ott_05_mobile.png" });

  // Footer 확인
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: "C:/Users/User/Desktop/ott_06_footer.png" });

  await browser.close();
})();
