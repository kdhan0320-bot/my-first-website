const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  // 게스트 모드 진입용 helper
  const enterGuest = async (page) => {
    await page.goto("https://kdhan0320-bot.github.io/my-first-website/mini-sns/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1200);
    const btn = page.locator("button", { hasText: "게스트로 둘러보기" }).first();
    await btn.click();
    await page.waitForTimeout(1500);
  };

  // ── 1. 로그인 ──
  const p1 = await context.newPage();
  await p1.setViewportSize({ width: 480, height: 900 });
  await p1.goto("https://kdhan0320-bot.github.io/my-first-website/mini-sns/");
  await p1.waitForLoadState("networkidle");
  await p1.waitForTimeout(1000);
  await p1.screenshot({ path: "C:/Users/User/Desktop/sns_01_login.png" });
  console.log("LOGIN_GUEST_BTN:", await p1.locator("button", { hasText: "게스트로 둘러보기" }).count() > 0);
  await p1.close();

  // ── 2. 홈 ──
  const p2 = await context.newPage();
  await p2.setViewportSize({ width: 480, height: 900 });
  await enterGuest(p2);
  await p2.screenshot({ path: "C:/Users/User/Desktop/sns_02_home.png" });
  const h2 = await p2.content();
  console.log("HOME_SAMPLE_POST:", h2.includes("포트폴리오 대표 프로젝트"));
  console.log("HOME_AI_FOOTER:", h2.includes("AI-assisted Social App"));
  console.log("HOME_PORTFOLIO_LINK:", h2.includes("포트폴리오로 돌아가기"));
  await p2.close();

  // ── 3. 모임 ──
  const p3 = await context.newPage();
  await p3.setViewportSize({ width: 480, height: 900 });
  await enterGuest(p3);
  await p3.goto("https://kdhan0320-bot.github.io/my-first-website/mini-sns/#/meetup");
  await p3.waitForTimeout(1500);
  await p3.screenshot({ path: "C:/Users/User/Desktop/sns_03_meetup.png" });
  const h3 = await p3.content();
  console.log("MEETUP_PORTFOLIO:", h3.includes("포트폴리오 피드백 모임"));
  console.log("MEETUP_FIGMA:", h3.includes("Figma 모바일 UI 스터디"));
  console.log("MEETUP_AI_CODING:", h3.includes("AI-assisted Coding"));
  await p3.close();

  // ── 4. 채팅 ──
  const p4 = await context.newPage();
  await p4.setViewportSize({ width: 480, height: 900 });
  await enterGuest(p4);
  await p4.goto("https://kdhan0320-bot.github.io/my-first-website/mini-sns/#/chat");
  await p4.waitForTimeout(1500);
  await p4.screenshot({ path: "C:/Users/User/Desktop/sns_04_chat.png" });
  const h4 = await p4.content();
  console.log("CHAT_DEMO_LABEL:", h4.includes("데모 채팅"));
  console.log("CHAT_DESIGN_ROOM:", h4.includes("포트폴리오 피드백방"));
  await p4.close();

  // ── 5. 알림 ──
  const p5 = await context.newPage();
  await p5.setViewportSize({ width: 480, height: 900 });
  await enterGuest(p5);
  await p5.goto("https://kdhan0320-bot.github.io/my-first-website/mini-sns/#/notifications");
  await p5.waitForTimeout(1500);
  await p5.screenshot({ path: "C:/Users/User/Desktop/sns_05_notifications.png" });
  const h5 = await p5.content();
  console.log("NOTIF_UX_CONTENT:", h5.includes("대시보드 UI 구조가 정말 깔끔해요"));
  console.log("NOTIF_MEETUP:", h5.includes("모임이 시작되었습니다"));
  await p5.close();

  // ── 6. 프로필 ──
  const p6 = await context.newPage();
  await p6.setViewportSize({ width: 480, height: 900 });
  await enterGuest(p6);
  await p6.goto("https://kdhan0320-bot.github.io/my-first-website/mini-sns/#/profile");
  await p6.waitForTimeout(1500);
  await p6.screenshot({ path: "C:/Users/User/Desktop/sns_06_profile.png" });
  const h6 = await p6.content();
  console.log("PROFILE_GUEST_NAME:", h6.includes("Guest Designer"));
  console.log("PROFILE_INTEREST:", h6.includes("UX/UI"));
  await p6.close();

  // ── 7. 모바일 360px ──
  const p7 = await context.newPage();
  await p7.setViewportSize({ width: 360, height: 780 });
  await p7.goto("https://kdhan0320-bot.github.io/my-first-website/mini-sns/");
  await p7.waitForLoadState("networkidle");
  await p7.waitForTimeout(1000);
  await p7.screenshot({ path: "C:/Users/User/Desktop/sns_07_mobile360.png" });
  await p7.close();

  await browser.close();
})();
