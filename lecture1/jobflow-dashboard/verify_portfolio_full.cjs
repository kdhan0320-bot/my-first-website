const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // ── 1. 홈 Hero ──
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-portfolio/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "C:/Users/User/Desktop/full_01_hero.png" });

  const heroHtml = await page.content();
  console.log("=== HERO ===");
  console.log("타이틀 Dohan Kim:", heroHtml.includes("Dohan Kim") || heroHtml.includes("김도한"));
  console.log("Web Designer 표시:", heroHtml.includes("Designer") || heroHtml.includes("디자이너"));

  // ── 2. About 섹션 ──
  await page.evaluate(() => document.getElementById("about")?.scrollIntoView({ behavior:"instant" }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: "C:/Users/User/Desktop/full_02_about.png" });

  // ── 3. Projects 섹션 (홈 featured 4개) ──
  await page.evaluate(() => document.getElementById("projects")?.scrollIntoView({ behavior:"instant" }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "C:/Users/User/Desktop/full_03_projects.png" });
  const projHtml = await page.content();
  console.log("\n=== 홈 PROJECTS ===");
  console.log("Clinic(Figma):", projHtml.includes("Clinic Reservation"));
  console.log("JobFlow:", projHtml.includes("JobFlow Dashboard"));
  console.log("Community Redesign:", projHtml.includes("Community Redesign"));
  console.log("Mini SNS:", projHtml.includes("Mini SNS"));
  console.log("AI-assisted 배지:", projHtml.includes("AI-assisted"));

  // ── 4. Skills 섹션 ──
  await page.evaluate(() => document.getElementById("skills")?.scrollIntoView({ behavior:"instant" }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: "C:/Users/User/Desktop/full_04_skills.png" });

  // ── 5. Contact 섹션 ──
  await page.evaluate(() => document.getElementById("contact")?.scrollIntoView({ behavior:"instant" }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: "C:/Users/User/Desktop/full_05_contact.png" });

  // ── 6. 전체 프로젝트 페이지 ──
  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-portfolio/#/projects");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "C:/Users/User/Desktop/full_06_projects_all.png", fullPage: true });

  const allHtml = await page.content();
  console.log("\n=== 전체 프로젝트 (ALL) ===");
  // 카테고리 배지 확인
  console.log("AI-assisted Dashboard:", allHtml.includes("AI-ASSISTED DASHBOARD") || allHtml.includes("AI-assisted Dashboard"));
  console.log("AI-assisted Social App:", allHtml.includes("AI-ASSISTED SOCIAL APP") || allHtml.includes("AI-assisted Social App"));
  console.log("AI-assisted Community Board:", allHtml.includes("AI-ASSISTED COMMUNITY BOARD") || allHtml.includes("Community Board"));
  console.log("AI-assisted Visual Web UI:", allHtml.includes("AI-ASSISTED VISUAL WEB UI") || allHtml.includes("Visual Web UI"));

  // ── 7. AI Vibe Coding 필터 ──
  const aiTab = page.locator("button", { hasText: "AI Vibe Coding" });
  await aiTab.first().click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: "C:/Users/User/Desktop/full_07_ai_filter.png", fullPage: true });

  const aiHtml = await page.content();
  const order = [
    ["JobFlow", aiHtml.indexOf("JobFlow Dashboard")],
    ["Mini SNS", aiHtml.indexOf("Mini SNS")],
    ["my-community", aiHtml.indexOf("my-community")],
    ["OTT Service", aiHtml.indexOf("OTT Service")],
  ].sort((a,b)=>a[1]-b[1]).map(x=>x[0]);
  console.log("\n=== AI 필터 순서 ===");
  console.log(order.join(" → "));

  // ── 8. Figma UX/UI 필터 ──
  const figmaTab = page.locator("button", { hasText: "Figma UX/UI" });
  await figmaTab.first().click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: "C:/Users/User/Desktop/full_08_figma_filter.png" });

  // ── 9. JobFlow 모달 ──
  await aiTab.first().click();
  await page.waitForTimeout(600);
  const jobflowCard = page.locator('[aria-label="JobFlow Dashboard 프로젝트"]');
  await jobflowCard.locator("button", { hasText: "View Detail" }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: "C:/Users/User/Desktop/full_09_jobflow_modal.png" });
  const jfHtml = await page.content();
  console.log("\n=== JobFlow 모달 ===");
  console.log("AI Contribution:", jfHtml.includes("AI Contribution"));
  console.log("Limitation:", jfHtml.includes("Limitation"));
  console.log("Live Demo btn:", jfHtml.includes("Live Demo"));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // ── 10. 모바일 375px ──
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-portfolio/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "C:/Users/User/Desktop/full_10_mobile_hero.png" });

  await page.evaluate(() => document.getElementById("projects")?.scrollIntoView({ behavior:"instant" }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: "C:/Users/User/Desktop/full_11_mobile_projects.png" });

  // ── 11. 다크모드 확인 ──
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-portfolio/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);
  // 다크모드 토글 버튼 클릭
  const darkToggle = page.locator('[aria-label*="다크"], [aria-label*="모드"], button').filter({ hasText: "" }).first();
  const toggleBtn = page.locator('button[aria-label*="dark"], button[aria-label*="Dark"], button[aria-label*="다크"]');
  if (await toggleBtn.count() > 0) {
    await toggleBtn.first().click();
    await page.waitForTimeout(500);
  }
  await page.evaluate(() => document.getElementById("projects")?.scrollIntoView({ behavior:"instant" }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: "C:/Users/User/Desktop/full_12_darkmode.png" });

  console.log("\n=== 검증 완료 ===");
  await browser.close();
})();
