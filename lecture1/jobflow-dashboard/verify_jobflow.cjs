const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  // 1. 로그인 페이지 확인
  await page.goto("https://kdhan0320-bot.github.io/my-first-website/jobflow-dashboard/");
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: "C:/Users/User/Desktop/verify_01_login.png", fullPage: false });
  const loginHtml = await page.content();
  console.log("LOGIN_PAGE_LOADED:", true);
  console.log("DEMO_BUTTON_EXISTS:", loginHtml.includes("데모로 둘러보기"));

  // 데모 버튼 클릭
  const demoBtn = page.locator("button").filter({ hasText: "데모로 둘러보기" }).first();
  await demoBtn.click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "C:/Users/User/Desktop/verify_02_dashboard.png", fullPage: true });

  // 2. 대시보드 텍스트 확인
  const dashHtml = await page.content();
  console.log("HAS_BLUEFINLAB:", dashHtml.includes("블루핀랩"));
  console.log("HAS_LIGHTWAVE:", dashHtml.includes("라이트웨이브"));
  console.log("HAS_TOTAL_CARD:", dashHtml.includes("총 지원"));
  console.log("HAS_ACTIVE_CARD:", dashHtml.includes("진행 중"));
  console.log("HAS_INTERVIEW_CARD:", dashHtml.includes("면접 예정"));
  console.log("HAS_CLOSED_CARD:", dashHtml.includes("완료 / 보류"));
  console.log("HAS_AI_ASSISTED:", dashHtml.includes("AI-assisted"));
  console.log("HAS_GITHUB_LINK:", dashHtml.includes("github.com"));
  console.log("HAS_PORTFOLIO_LINK:", dashHtml.includes("my-portfolio"));
  console.log("HAS_WEEKLY_TASKS:", dashHtml.includes("이번 주 할 일"));

  // 3. 지원 현황 페이지 확인
  await page.locator("text=지원 현황").first().click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "C:/Users/User/Desktop/verify_03_applications.png", fullPage: true });
  const appHtml = await page.content();
  console.log("APPLICATIONS_HAS_MOTIONBRIDGE:", appHtml.includes("모션브릿지"));

  await browser.close();
})();
