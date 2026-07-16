const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-gpu']
  });
  
  // Capture issue 1: before React mounts
  const page1 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page1.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page1.waitForTimeout(100);
  await page1.screenshot({ path: 'issue1-initial-load.png', fullPage: false });
  console.log('Issue 1 screenshot saved: initial load before React mounts');
  
  // Capture issue 2: after loading screen dismisses, before any scroll
  await page1.waitForTimeout(2000);
  const loadingScreen = await page1.$('.fixed.inset-0.z-\\[100\\]');
  console.log('Loading screen present after 2s:', !!loadingScreen);
  
  await page1.screenshot({ path: 'issue2-after-loading.png', fullPage: false });
  console.log('Issue 2 screenshot saved: after loading screen should dismiss');
  
  // Check hero visibility before scroll
  const heroVisible = await page1.$eval('#hero-sticky', el => {
    const style = getComputedStyle(el);
    return {
      opacity: style.opacity,
      visibility: style.visibility,
      bg: style.backgroundColor,
    };
  });
  console.log('Hero state before scroll:', heroVisible);
  
  // Capture issue 3: scroll to see hero image
  await page1.evaluate(() => window.scrollBy(0, 50));
  await page1.waitForTimeout(500);
  await page1.screenshot({ path: 'issue3-after-scroll.png', fullPage: false });
  console.log('Issue 3 screenshot saved: after small scroll');
  
  // Check for overlays
  const overlayInfo = await page1.evaluate(() => {
    const overlays = document.querySelectorAll('[id*="overlay"], [class*="overlay"]');
    return Array.from(overlays).map(el => ({
      id: el.id,
      className: el.className,
      opacity: getComputedStyle(el).opacity,
      bg: getComputedStyle(el).backgroundColor,
      zIndex: getComputedStyle(el).zIndex,
    }));
  });
  console.log('Overlay elements:', JSON.stringify(overlayInfo, null, 2));
  
  await browser.close();
})();
