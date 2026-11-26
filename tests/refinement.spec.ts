import { test, expect } from '@playwright/test';

test('mobile entry contrast during and after reveal, and unobscured anchor navigation', async ({page})=>{
  await page.setViewportSize({width:360,height:740});
  await page.goto('/');
  await page.getByRole('button',{name:/skip intro/i}).click();
  for(const selector of ['.hero h1 .text-mask:nth-child(1)','.hero h1 .text-mask:nth-child(2)','.mast .brand','.menu-btn','.nav-project','.hero .quiet']){
    await expect(page.locator(selector)).toHaveCSS('color','rgb(245, 245, 250)');
  }
  await page.getByRole('button',{name:'Menu',exact:true}).click();
  await expect(page.getByRole('dialog')).toContainText('Turn Ideas Into Innovation.');
  await page.getByRole('link',{name:'02 Services'}).click();
  await expect(page).toHaveURL(/#services$/);
  await expect.poll(()=>page.locator('#services').evaluate(el=>Math.round(el.getBoundingClientRect().top))).toBeGreaterThanOrEqual(63);
  await expect(page.locator('#service-title')).toBeInViewport();
});

test('WebGL failure preserves poster and sculpture selection',async ({page})=>{
  await page.addInitScript(()=>{
    const getContext=HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype,'getContext',{value:function(this:HTMLCanvasElement,type:string,...args:unknown[]){
      if(type.startsWith('webgl'))return null;
      return Reflect.apply(getContext,this,[type,...args]);
    }});
  });
  const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await page.getByRole('button',{name:/skip intro/i}).click();
  await page.getByRole('button',{name:'Innovation',exact:true}).click();
  await expect(page.locator('[data-scene=poster] img')).toHaveAttribute('src','/assets/sculpture-3.webp');
  await expect.poll(()=>page.locator('[data-scene=poster] img').evaluate((image:HTMLImageElement)=>image.naturalWidth)).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});
