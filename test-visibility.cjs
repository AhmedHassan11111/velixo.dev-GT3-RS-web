const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Wait for loading screen to dismiss
  await page.waitForTimeout(2000);
  
  // Check hero elements BEFORE scroll
  const heroSticky = await page.$('#hero-sticky');
  const heroText = await page.$('h1');
  const heroCanvas = await page.$('#hero-canvas');
  const heroOverlay = await page.$('#hero-overlay');
  
  console.log('=== BEFORE SCROLL ===');
  console.log('Hero sticky visible:', await heroSticky?.isVisible());
  console.log('Hero h1 visible:', await heroText?.isVisible());
  console.log('Hero canvas visible:', await heroCanvas?.isVisible());
  
  if (heroSticky) {
    const bg = await heroSticky.evaluate(el => getComputedStyle(el).backgroundColor);
    const opacity = await heroSticky.evaluate(el => getComputedStyle(el).opacity);
    const visibility = await heroSticky.evaluate(el => getComputedStyle(el).visibility);
    const display = await heroSticky.evaluate(el => getComputedStyle(el).display);
    console.log('Hero sticky bg:', bg);
    console.log('Hero sticky opacity:', opacity);
    console.log('Hero sticky visibility:', visibility);
    console.log('Hero sticky display:', display);
  }
  
  if (heroText) {
    const opacity = await heroText.evaluate(el => getComputedStyle(el).opacity);
    const visibility = await heroText.evaluate(el => getComputedStyle(el).visibility);
    const display = await heroText.evaluate(el => getComputedStyle(el).display);
    const color = await heroText.evaluate(el => getComputedStyle(el).color);
    console.log('Hero text opacity:', opacity);
    console.log('Hero text visibility:', visibility);
    console.log('Hero text display:', display);
    console.log('Hero text color:', color);
  }
  
  if (heroOverlay) {
    const opacity = await heroOverlay.evaluate(el => getComputedStyle(el).opacity);
    const bg = await heroOverlay.evaluate(el => getComputedStyle(el).backgroundColor);
    console.log('Hero overlay opacity:', opacity);
    console.log('Hero overlay bg:', bg);
  }
  
  // Take screenshot before scroll
  await page.screenshot({ path: 'screenshot-before-scroll.png', fullPage: false });
  
  // Scroll a tiny bit
  await page.evaluate(() => window.scrollBy(0, 10));
  await page.waitForTimeout(500);
  
  console.log('=== AFTER TINY SCROLL ===');
  console.log('Hero sticky visible:', await heroSticky?.isVisible());
  console.log('Hero h1 visible:', await heroText?.isVisible());
  
  if (heroText) {
    const opacity = await heroText.evaluate(el => getComputedStyle(el).opacity);
    console.log('Hero text opacity after scroll:', opacity);
  }
  
  await page.screenshot({ path: 'screenshot-after-scroll.png', fullPage: false });
  
  // Check body and overview
  const body = await page.$('body');
  const overview = await page.$('#overview');
  
  if (body) {
    const bg = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    console.log('Body bg:', bg);
  }
  
  if (overview) {
    const bg = await overview.evaluate(el => getComputedStyle(el).backgroundColor);
    const height = await overview.evaluate(el => getComputedStyle(el).height);
    console.log('Overview bg:', bg);
    console.log('Overview height:', height);
  }
  
  await browser.close();
})();
