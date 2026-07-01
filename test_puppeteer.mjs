import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[Browser Console] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log(`[Browser PageError]:`, err.message);
  });
  
  page.on('requestfailed', request => {
    console.log(`[Browser RequestFailed]: ${request.url()} - ${request.failure()?.errorText}`);
  });

  try {
    await page.goto('http://localhost:3001/workspace/demo', { waitUntil: 'networkidle0', timeout: 10000 });
  } catch (e) {
    console.log('Failed to load workspace directly. Trying index...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
  }
  
  // Try to find the chat input
  try {
    await page.waitForSelector('#chat-textarea', { timeout: 5000 });
    await page.type('#chat-textarea', 'hi');
    await page.keyboard.press('Enter');
    
    // Wait for a few seconds to let the error happen
    await new Promise(r => setTimeout(r, 4000));
  } catch (e) {
    console.log('Could not interact with chat:', e.message);
  }

  await browser.close();
})();
