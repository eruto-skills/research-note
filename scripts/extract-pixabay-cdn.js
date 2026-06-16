#!/usr/bin/env node
/**
 * Pixabay音楽ページから cdn.pixabay.com のmp3直リンを抽出する。
 *
 * Usage: node scripts/extract-pixabay-cdn.js <url1> <url2> ...
 *
 * Pixabayは動的にaudio要素にsrcをセットするので、Puppeteerで
 * networkidle後にページ全体のHTMLとパフォーマンスエントリを舐めて
 * cdn.pixabay.com/audio/.../*.mp3 を抽出する。
 */
const puppeteer = require("puppeteer-core");
const fs = require("fs");

function findChrome() {
  const candidates = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  ];
  for (const p of candidates) if (fs.existsSync(p)) return p;
  return null;
}

const URL_RE = /https:\/\/cdn\.pixabay\.com\/(?:audio|download\/audio)\/[^"'\s)]+?\.mp3(?:\?[^"'\s)]*)?/gi;

async function extract(page, url) {
  // Capture network responses for mp3 files
  const captured = new Set();
  page.on("response", (res) => {
    const u = res.url();
    if (/cdn\.pixabay\.com.*\.mp3/i.test(u)) captured.add(u);
  });
  page.on("request", (req) => {
    const u = req.url();
    if (/cdn\.pixabay\.com.*\.mp3/i.test(u)) captured.add(u);
  });

  await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });

  // Try to click the play button to force audio load
  try {
    await page.evaluate(() => {
      const btn = document.querySelector(
        'button[aria-label*="Play" i], button[aria-label*="play" i], button.play, [data-testid*="play" i]'
      );
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));
  } catch {}

  // Scan all audio src attributes
  const fromDom = await page.evaluate(() => {
    const urls = new Set();
    document.querySelectorAll("audio, source").forEach((el) => {
      if (el.src) urls.add(el.src);
      if (el.currentSrc) urls.add(el.currentSrc);
    });
    return Array.from(urls);
  });
  for (const u of fromDom) if (/cdn\.pixabay\.com/i.test(u)) captured.add(u);

  // Scan whole HTML for any embedded URLs
  const html = await page.content();
  let m;
  while ((m = URL_RE.exec(html)) !== null) captured.add(m[0]);

  // Extract title
  const title = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return h1 ? h1.textContent.trim() : document.title;
  });

  return { url, title, mp3s: Array.from(captured) };
}

(async () => {
  const urls = process.argv.slice(2);
  if (!urls.length) {
    console.error("Usage: node extract-pixabay-cdn.js <url> [<url> ...]");
    process.exit(1);
  }
  const chrome = findChrome();
  if (!chrome) {
    console.error("Chrome not found");
    process.exit(2);
  }

  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const results = [];
  try {
    for (const u of urls) {
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
      );
      try {
        const r = await extract(page, u);
        results.push(r);
        console.error(`[ok] ${u} -> ${r.mp3s.length} mp3 url(s)`);
      } catch (err) {
        console.error(`[err] ${u}: ${err.message}`);
        results.push({ url: u, error: err.message, mp3s: [] });
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify(results, null, 2));
})();
