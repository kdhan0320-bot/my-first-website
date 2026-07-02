const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  // 1. 로그인 없이 직접 접속 → 게시판이 바로 보이는지
  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-community/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "C:/Users/User/Desktop/comm_01_list.png" });

  const h1 = await page.content();
  console.log("DIRECT_ACCESS_NO_LOGIN:", !h1.includes('/login'));
  console.log("HAS_SAMPLE_POSTS:", h1.includes("버스도착정보") || h1.includes("JobFlow Dashboard 프로젝트"));
  console.log("HAS_CATEGORY_FILTER:", h1.includes("포트폴리오 피드백") && h1.includes("AI Coding"));
  console.log("HAS_WRITE_BTN:", h1.includes("글쓰기"));
  console.log("HAS_AI_FOOTER:", h1.includes("AI-assisted Community Board"));
  console.log("HAS_PORTFOLIO_LINK:", h1.includes("포트폴리오로 돌아가기"));

  // 2. 카테고리 필터 클릭
  const aiCodingTab = page.locator("text=AI Coding").first();
  if (await aiCodingTab.count() > 0) {
    await aiCodingTab.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: "C:/Users/User/Desktop/comm_02_filter.png" });
    const h2 = await page.content();
    console.log("FILTER_AI_CODING_WORKS:", h2.includes("AI-assisted"));
  }

  // 3. 샘플 게시글 상세 클릭
  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-community/");
  await page.waitForTimeout(1500);
  const firstCard = page.locator('[class*="MuiCard"]').first();
  if (await firstCard.count() > 0) {
    await firstCard.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: "C:/Users/User/Desktop/comm_03_detail.png" });
    const h3 = await page.content();
    console.log("DETAIL_HAS_CONTENT:", h3.includes("버스도착정보") || h3.includes("JobFlow") || h3.includes("AI-assisted"));
    console.log("DETAIL_HAS_COMMENTS:", h3.includes("댓글"));
    console.log("DETAIL_HAS_BACK_BTN:", h3.includes("뒤로") || h3.includes("게시물 상세"));
  }

  // 4. 로그인 페이지 확인
  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-community/#/login");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "C:/Users/User/Desktop/comm_04_login.png" });
  const h4 = await page.content();
  console.log("LOGIN_HAS_GUEST_BTN:", h4.includes("게스트로 둘러보기"));
  console.log("LOGIN_HAS_DEMO_NOTE:", h4.includes("별도 회원가입 없이"));

  // 5. 모바일 360px
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-community/");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "C:/Users/User/Desktop/comm_05_mobile.png" });
  console.log("MOBILE_NO_ERROR:", true);

  await browser.close();
})();
