import {test,expect} from '@playwright/test';
import {whatsappUrl,defaultMessage} from '../src/utils/whatsapp';
import {mkdirSync} from 'node:fs';
const dir='reports/screenshots/';
mkdirSync(dir,{recursive:true});
test('WhatsApp validates international format and preserves encoded project content',()=>{expect(whatsappUrl('')).toBeNull();expect(whatsappUrl('+1-202-555-0100')).toBeNull();const url=new URL(whatsappUrl('12025550100','AI & design\n₹?')!);expect(url.host).toBe('wa.me');expect(url.searchParams.get('text')).toBe('AI & design\n₹?');expect(whatsappUrl('12025550100')).toContain(encodeURIComponent(defaultMessage))});
test('initial entry, state controls, sections and navigation',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/',{waitUntil:'domcontentloaded'});await page.locator('.intro').waitFor();await page.screenshot({path:dir+'intro.png',timeout:10000});await page.keyboard.press('Escape');await expect(page.locator('.intro')).toHaveCount(0);await page.waitForTimeout(1900);await page.screenshot({path:dir+'hero-desktop.png'});await page.getByRole('button',{name:'Craft',exact:true}).click();await expect(page.getByRole('button',{name:'Craft',exact:true})).toHaveAttribute('aria-pressed','true');await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('link',{name:'05 About'}).click();await expect(page).toHaveURL(/#about$/);await expect(page.locator('dialog')).toHaveCount(0);
 await page.getByRole('button',{name:'Menu',exact:true}).click();
 await page.getByRole('link',{name:'01 Home'}).click();
 await expect(page.getByRole('link',{name:'Explore our world'})).toBeInViewport();
 await page.getByRole('link',{name:'Explore our world'}).click();
 await expect(page.locator('.manifesto h2')).toBeInViewport();
 await page.screenshot({path:dir+'manifesto.png'});
 for(const id of ['process','contact']){
   await page.getByRole('button',{name:'Menu',exact:true}).click();
   await page.getByRole('link',{name:new RegExp(id,'i')}).click();
   await expect.poll(()=>page.locator('#'+id).evaluate(el=>el.getBoundingClientRect().top)).toBeLessThan(110);
   await expect(page.locator('#'+id+' h2')).toBeInViewport();
   await page.screenshot({path:dir+id+'.png'});
 }
 expect(errors).toEqual([]);
});
test('mobile keyboard, enquiry validation and missing configuration',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250);await page.screenshot({path:dir+'hero-mobile.png'});const menu=page.getByRole('button',{name:'Menu',exact:true});await menu.focus();await page.keyboard.press('Enter');await page.screenshot({path:dir+'menu-mobile.png'});await page.keyboard.press('Escape');await expect(menu).toBeFocused();await page.goto('/#contact');await page.getByRole('button',{name:/tell us your idea/i}).click();await page.screenshot({path:dir+'enquiry-mobile.png'});await page.getByRole('button',{name:'Send enquiry'}).click();await expect(page.getByLabel('Full name')).toBeFocused();await page.getByLabel('Full name').fill('Studio Tester');await page.getByLabel('Required service').selectOption('Web Experiences');await page.getByLabel('Project description').fill('Design a booking interface');await page.getByRole('button',{name:'Send enquiry'}).click();await expect(page.getByRole('alert')).toContainText('VITE_WHATSAPP_NUMBER');await page.keyboard.press('Escape');await page.getByRole('button',{name:'Chat on WhatsApp',exact:true}).last().click();await expect(page.getByRole('dialog')).toContainText('VITE_WHATSAPP_NUMBER')
});
for(const width of [360,390,430,768,1024,1440,1920])test('layout fits '+width,async({page})=>{await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);await expect(page.locator('h1')).toBeVisible()});
