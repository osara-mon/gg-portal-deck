const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DECK = 'file://' + path.resolve('/Volumes/ORICO/ClaudeCode/ゴールデンゲート/口コミサイト/deliverables/background-deck/index.html');
const OUT = '/Volumes/ORICO/ClaudeCode/ゴールデンゲート/口コミサイト/deliverables/.webpublish/shots';
const ids = process.argv.slice(2).map(Number);
(async () => {
  const fs = require('fs'); fs.mkdirSync(OUT, { recursive: true });
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 810, deviceScaleFactor: 1 });
  await p.goto(DECK, { waitUntil: 'networkidle0' });
  await p.evaluate(async () => { if (document.fonts) await document.fonts.ready; });
  for (const id of ids) {
    await p.evaluate((id) => {
      const slides = document.querySelectorAll('.slide');
      slides.forEach(s => s.classList.remove('is-active'));
      [...slides].find(x => Number(x.getAttribute('data-i')) === id).classList.add('is-active');
    }, id);
    await new Promise(r=>setTimeout(r,200));
    await p.screenshot({ path: `${OUT}/slide-${id}.png` });
    console.log('shot', id);
  }
  await b.close();
})();
