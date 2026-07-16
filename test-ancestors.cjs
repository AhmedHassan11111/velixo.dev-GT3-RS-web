const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  // Check ALL ancestors of hero text for visibility issues
  const ancestorCheck = await page.evaluate(() => {
    const h1 = document.querySelector('#hero-text h1');
    if (!h1) return 'no h1';
    
    let el = h1;
    const ancestors = [];
    while (el && el !== document.body) {
      const style = getComputedStyle(el);
      ancestors.push({
        tag: el.tagName,
        id: el.id,
        className: el.className?.substring(0, 50),
        opacity: style.opacity,
        visibility: style.visibility,
        display: style.display,
        position: style.position,
        zIndex: style.zIndex,
        bg: style.backgroundColor,
      });
      el = el.parentElement;
    }
    return ancestors;
  });
  
  console.log('Ancestor chain:', JSON.stringify(ancestorCheck, null, 2));
  
  // Check if body/html have any hidden styles
  const rootCheck = await page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    
    const htmlStyle = getComputedStyle(html);
    const bodyStyle = getComputedStyle(body);
    const rootStyle = root ? getComputedStyle(root) : null;
    
    return {
      html: {
        bg: htmlStyle.backgroundColor,
        visibility: htmlStyle.visibility,
        opacity: htmlStyle.opacity,
      },
      body: {
        bg: bodyStyle.backgroundColor,
        visibility: bodyStyle.visibility,
        opacity: bodyStyle.opacity,
        display: bodyStyle.display,
      },
      root: rootStyle ? {
        bg: rootStyle.backgroundColor,
        visibility: rootStyle.visibility,
        opacity: rootStyle.opacity,
        display: rootStyle.display,
      } : null,
    };
  });
  
  console.log('Root elements:', JSON.stringify(rootCheck, null, 2));
  
  await browser.close();
})();
