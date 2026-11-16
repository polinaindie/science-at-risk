import { chromium } from '/Users/ppetri/CascadeProjects/transfer-app/Science at risk/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const axeSrc = fs.readFileSync('/Users/ppetri/CascadeProjects/transfer-app/Science at risk/node_modules/axe-core/axe.min.js','utf8');
const base='http://localhost:8731/handoff/cabinet/';
const walk=(d,p='')=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name,p+e.name+'/'):e.name.endsWith('.html')?[p+e.name]:[]);
const files=walk('/Users/ppetri/CascadeProjects/transfer-app/Science at risk/public/handoff/cabinet');
const b=await chromium.launch();
let problems=0; const P=(...a)=>{problems++;console.log(...a)};
for (const w of [375,768,1280]) {
  const ctx=await b.newContext({viewport:{width:w,height:900}});
  const page=await ctx.newPage();
  const errs=[]; page.on('console',m=>{if(m.type()==='error')errs.push(m.text())}); page.on('pageerror',e=>errs.push(String(e)));
  for (const f of files) {
    errs.length=0;
    await page.goto(base+f,{waitUntil:'load'});
    const r=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,h1:document.querySelectorAll('h1').length,main:document.querySelectorAll('main').length}));
    if (r.sw>r.cw) P(w,f,'HSCROLL',r.sw,r.cw);
    if (r.h1!==1) P(w,f,'h1 count',r.h1);
    if (!f.startsWith('email') && r.main!==1) P(w,f,'main',r.main);
    const e=errs.filter(x=>!/tokens\.css/.test(x)&&!/404/.test(x)); if(e.length) P(w,f,'console',e);
    if (w===1280||w===375) {
      await page.addScriptTag({content:axeSrc});
      const res=await page.evaluate(()=>axe.run(document,{runOnly:['wcag2a','wcag2aa','wcag21aa','best-practice']}));
      for (const v of res.violations) P(w,f,'AXE',v.id,v.nodes.length,v.nodes[0].target.join(' '),v.nodes[0].failureSummary?.split('\n')[1]);
    }
  }
  await ctx.close();
}
// no-JS
const ctx=await b.newContext({javaScriptEnabled:false}); const page=await ctx.newPage();
for (const f of files){ await page.goto(base+f); const t=await page.evaluate(()=>document.body.innerText.length); const h=await page.locator('h1').first().innerText(); if(t<80||!h) P('nojs',f,t,h); }
// tokens existence
console.log('tokens.css exists:',fs.existsSync('/Users/ppetri/CascadeProjects/transfer-app/Science at risk/public/handoff/tokens.css'));
console.log(files.length,'files, problems:',problems);
await b.close();
