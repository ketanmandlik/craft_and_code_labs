import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch();
await mkdir('reports/walkthrough',{recursive:true});
const ctx=await browser.newContext({viewport:{width:1280,height:800},recordVideo:{dir:'reports/walkthrough',size:{width:960,height:600}}});
const p=await ctx.newPage();await p.goto('http://127.0.0.1:5173');await p.waitForTimeout(2100);
await p.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>{const start=performance.now(),height=document.documentElement.scrollHeight-innerHeight;function frame(now){const t=Math.min(1,(now-start)/23000);window.scrollTo(0,t*height);if(t<1)requestAnimationFrame(frame);else resolve()}requestAnimationFrame(frame)})});await p.waitForTimeout(500);await ctx.close();await browser.close()
