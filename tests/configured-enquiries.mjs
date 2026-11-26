// Reserved fictional North American number for this isolated, intercepted integration test.
import {createServer} from 'vite';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
process.env.VITE_WHATSAPP_NUMBER='12025550100';
const server=await createServer({server:{host:'127.0.0.1',port:5198,strictPort:true},logLevel:'error'});
await server.listen();
const browser=await chromium.launch();
try{
 const page=await browser.newPage({reducedMotion:'reduce'});const seen=[];
 await page.route('https://wa.me/**',async route=>{seen.push(new URL(route.request().url()));await route.fulfill({contentType:'text/plain',body:'Test destination intercepted'})});
 for(const [hash,selector] of [['home','.hero-actions button'],['home','.nav-project'],['home','.floating-wa'],['services','.ex-row-detail button'],['solutions','.ex-concept-copy button'],['contact','.ed-secondary']]){
 await page.goto('http://127.0.0.1:5198/#'+hash);await page.locator(selector).first().click();await page.waitForURL('https://wa.me/**');assert.equal(seen.at(-1).pathname,'/12025550100');assert.ok(seen.at(-1).searchParams.get('text').length>30)}
 await page.goto('http://127.0.0.1:5198/#contact');await page.locator('.ed-primary').click();await page.getByLabel('Full name').fill('Example QA');await page.getByLabel('Required service').selectOption('SaaS Products');await page.getByLabel('Project description').fill('Design & build a booking app.');await page.getByRole('button',{name:'Send enquiry'}).click();await page.waitForURL('https://wa.me/**');assert.match(seen.at(-1).searchParams.get('text'),/Design & build a booking app\./);assert.equal(seen.length,7);console.log('PASS: all seven entry paths routed to an intercepted address, including encoded form fields.')
}finally{await browser.close();await server.close()}
