const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DECK = 'file://' + path.resolve('/Volumes/ORICO/ClaudeCode/ゴールデンゲート/口コミサイト/deliverables/background-deck/index.html');
const target = Number(process.argv[2] || 30);
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 810 });
  await p.goto(DECK, { waitUntil: 'networkidle0' });
  await p.evaluate(async () => { if (document.fonts) await document.fonts.ready; });
  const r = await p.evaluate((target) => {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(s => s.classList.remove('is-active'));
    const s = [...slides].find(x => Number(x.getAttribute('data-i')) === target);
    s.classList.add('is-active');
    const pad = s.querySelector('.pad');
    const pr = pad.getBoundingClientRect();
    // direct children of pad and grid columns
    const lines = [];
    function rec(el, depth) {
      [...el.children].forEach(c => {
        const rb = c.getBoundingClientRect();
        lines.push(`${'  '.repeat(depth)}${c.tagName.toLowerCase()}.${(c.className||'').toString().split(' ')[0]} h=${Math.round(rb.height)} bottom=${Math.round(rb.bottom-pr.top)}`);
        if (depth < 2 && c.children.length) rec(c, depth+1);
      });
    }
    rec(pad, 0);
    return { padH: pad.clientHeight, lines };
  }, target);
  console.log('padH', r.padH);
  console.log(r.lines.join('\n'));
  await b.close();
})();
