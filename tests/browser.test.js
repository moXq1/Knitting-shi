import { test } from "@playwright/test";
import { webkit, devices } from "@playwright/test";

test("test browser", async ({ page }) => {
  const browser = await webkit.launch();

  const iPad = {
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A5341f Safari/604.1",
    viewport: {
      width: 810,
      height: 1080,
    },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    defaultBrowserType: "webkit",
  };
  const context = await browser.newContext({
    ...iPad,
  });
  // point this to wherever you want

  const ppage = await context.newPage();

  // Navigate to the desired webpage

  await ppage.goto("http://localhost:5173/");

  // keep browser open
  await ppage.pause();
});
