import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';

for(const width of [1440,768,390]){
  test.describe('Services at '+width,()=>{
    test.use({viewport:{width,height:900},hasTouch:width===390,reducedMotion:width===390?'reduce':'no-preference'});

    test('deep link, repeated switching and preview stacking',async({page,browserName})=>{
      const errors:string[]=[];
      page.on('pageerror',error=>errors.push(error.message));
      await page.goto('/#services');
      const section=page.locator('#services');
      const header=page.locator('.mast');
      const checkAnchor=async()=>{
        await expect.poll(async()=>{
          const [top,bottom]=await Promise.all([
            section.evaluate(el=>el.getBoundingClientRect().top),
            header.evaluate(el=>el.getBoundingClientRect().bottom),
          ]);
          return Math.round(top-bottom);
        }).toBeGreaterThanOrEqual(0);
        await expect(section.locator('.ex-kicker')).toBeInViewport();
        await expect(section.locator('h2')).toBeInViewport();
      };
      await checkAnchor();
      const rows=section.locator('.ex-row-trigger');
      const preview=(i:number)=>section.locator(width===390?`#capability-${i} .ex-mobile-study .ex-study`:'.ex-service-figure .ex-study');
      if([1440,390].includes(width)){
        await mkdir('reports/services-fix',{recursive:true});
        await preview(0).screenshot({path:`reports/services-fix/after-${browserName}-${width}.png`,animations:'disabled'});
      }

      for(const i of [1,2,3,4,5,0,5,4,3,2,1,0]){
        if(width===390) await rows.nth(i).tap();
        else await rows.nth(i).focus();
        await expect(preview(i)).toHaveClass(new RegExp('ex-study-'+i+'\\b'));
        await expect(preview(i).locator('.ex-study-plane > :first-child')).toBeVisible();
      }

      const web=preview(0);
      expect(await web.evaluate(el=>{
        const plane=el.querySelector('.ex-study-plane')!;
        const foreground=plane.querySelector('.ex-web')!;
        return ['::before','::after'].every(layer=>Number(getComputedStyle(foreground).zIndex)>Number(getComputedStyle(plane,layer).zIndex));
      })).toBe(true);

      const start=await page.evaluate(()=>window.scrollY);
      await page.evaluate(()=>window.scrollBy(0,600));
      await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBeGreaterThan(start+300);
      await page.evaluate(y=>window.scrollTo(0,y),start);
      await expect.poll(()=>page.evaluate(y=>Math.abs(window.scrollY-y),start)).toBeLessThan(4);
      await expect(web).toBeVisible();
      await page.getByRole('button',{name:'Menu',exact:true}).click();
      await page.getByRole('link',{name:'02 Services'}).click();
      await checkAnchor();
      expect(errors).toEqual([]);
    });
  });
}
