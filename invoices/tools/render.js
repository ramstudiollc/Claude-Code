// Render an invoice HTML page to an A4 PDF and a PNG preview.
//   NODE_PATH=$(npm root -g) node render.js <invoice.html> <out.pdf> [preview.png]
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const [html, pdf, png] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });

  // Use locally installed brand fonts rather than waiting on the web font CDN.
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());

  await page.goto("file://" + path.resolve(html), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: "print" });

  await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
  if (png) {
    await page.setViewportSize({ width: 794, height: 1123 });
    await page.locator(".sheet").screenshot({ path: png });
  }
  await browser.close();
})();
