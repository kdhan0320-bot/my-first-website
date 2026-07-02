const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 480, height: 900 });

  // 1. 로그인 페이지
  await page.goto("https://kdhan0320-bot.github.io/my-first-website/mini-sns/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "C:/Users/User/Desktop/sns_01_login.png" });

  const loginHtml = await page.content();
  console.log("LOGIN_HAS_MINISNS_TITLE:", loginHtml.includes("Mini SNS"));
  console.log("LOGIN_HAS_GUEST_BTN:", loginHtml.includes("게스트로 둘러보기"));
  console.log("LOGIN_HAS_DEMO_NOTE:", loginHtml.includes("별도 회원가입 없이"));

  // 2. 게스트 버튼 클릭 → 홈
  const guestBtn = page.locator("button", { hasText: "게스트로 둘러보기" }).first();
  await guestBtn.click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "C:/Users/User/Desktop/sns_02_home.png" });

  const homeHtml = await page.content();
  console.log("HOME_HAS_SAMPLE_POST:", homeHtml.includes("포트폴리오 대표 프로젝트"));
  console.log("HOME_HAS_GUEST_BANNER:", homeHtml.includes("게스트 모드"));
  console.log("HOME_HAS_AI_FOOTER:", homeHtml.includes("AI-assisted Social App"));
  console.log("HOME_HAS_PORTFOLIO_LINK:", homeHtml.includes("포트폴리오로 돌아가기"));

  // 3. 모임 탭
  await page.locator('[data-testid="People"], button').filter({ hasText: "" }).nth(1).click().catch(() => {});
  const bottomNav = page.locator('[class*="BottomNavigation"] button, [class*="MuiBottomNavigation"] button');
  const navBtns = await bottomNav.all();
  if (navBtns.length > 1) await navBtns[1].click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "C:/Users/User/Desktop/sns_03_meetup.png" });
  const meetupHtml = await page.content();
  console.log("MEETUP_HAS_PORTFOLIO:", meetupHtml.includes("포트폴리오 피드백 모임"));
  console.log("MEETUP_HAS_FIGMA:", meetupHtml.includes("Figma"));

  // 4. 채팅 탭
  if (navBtns.length > 3) await navBtns[3].click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "C:/Users/User/Desktop/sns_04_chat.png" });
  const chatHtml = await page.content();
  console.log("CHAT_HAS_DEMO_LABEL:", chatHtml.includes("데모 채팅"));
  console.log("CHAT_HAS_DESIGN_ROOM:", chatHtml.includes("포트폴리오 피드백방"));

  // 5. 프로필 탭
  if (navBtns.length > 4) await navBtns[4].click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "C:/Users/User/Desktop/sns_05_profile.png" });
  const profileHtml = await page.content();
  console.log("PROFILE_HAS_GUEST_NAME:", profileHtml.includes("Guest Designer"));
  console.log("PROFILE_HAS_INTERESTS:", profileHtml.includes("UX/UI"));

  // 6. 모바일 확인 (360px)
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("https://kdhan0320-bot.github.io/my-first-website/mini-sns/");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "C:/Users/User/Desktop/sns_06_mobile360.png" });

  await browser.close();
})();
