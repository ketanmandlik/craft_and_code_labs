import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
await mkdir('reports/references',{recursive:true});
const browser=await chromium.launch();
await Promise.all(['https://www.breydaqs.com/en','https://layrmedia.com'].map(async url=>{const page=await browser.newPage();try{await page.goto(url,{timeout:15000,waitUntil:'domcontentloaded'});await page.screenshot({path:'reports/references/'+new URL(url).hostname+'.png',timeout:5000});console.log(url,await page.title())}catch(e){console.log(url,e.message)}await page.close()}));await browser.close()
