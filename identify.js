const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DECK = 'file://' + path.resolve('/Volumes/ORICO/ClaudeCode/ゴールデンゲート/口コミサイト/deliverables/background-deck/index.html');
const ids = process.argv.slice(2).map(Number);
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 810 });
  await p.goto(DECK, { waitUntil: 'networkidle0' });
  const out = await p.evaluate((ids) => {
    return [...document.querySelectorAll('.slide')].map(s => {
      const di = Number(s.getAttribute('data-i'));
      const cls = s.className;
      const h = s.querySelector('.title, h1, h2, h3');
      const kick = s.querySelector('.kick');
      return { di, cls, kick: kick ? kick.textContent.trim().slice(0,40) : '', title: h ? h.textContent.trim().slice(0,60) : '' };
    }).filter(r => ids.length === 0 || ids.includes(r.di));
  }, ids);
  out.forEach(r => console.log(`#${r.di} [${r.cls}] ${r.kick} | ${r.title}`));
  await b.close();
})();
