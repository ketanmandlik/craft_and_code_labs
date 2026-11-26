import { test, expect, type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const output = 'reports/screenshots'
async function openExhibits(page: Page) {
  await mkdir(output, {recursive:true})
  await page.goto('/')
  const skip=page.getByRole('button',{name:/skip intro/i})
  if(await skip.isVisible())await skip.click()
  await expect(page.locator('.ex-service-list')).toBeAttached()
  await page.evaluate(()=>document.fonts.ready)
}

test('all six service studies respond to focus and expose contextual enquiries', async ({page})=>{
  await page.setViewportSize({width:1440,height:960})
  await openExhibits(page)
  const rows=page.locator('.ex-row-trigger')
  await expect(rows).toHaveCount(6)
  await page.locator('.ex-service-layout').scrollIntoViewIfNeeded()
  for(let index=0;index<6;index++){
    const row=rows.nth(index)
    await row.focus()
    await expect(page.locator(`.ex-service-figure .ex-study-${index}`)).toBeVisible()
    if(await row.getAttribute('aria-expanded')!=='true')await page.keyboard.press('Enter')
    const detail=page.locator(`#capability-${index}`)
    await expect(detail.getByRole('button',{name:'Enquire about this service'})).toBeVisible()
    await page.waitForTimeout(900)
    await page.locator('.ex-service-layout').screenshot({path:`${output}/service-0${index+1}.png`})
  }
})

test('desktop solution rail follows vertical scroll and its controls', async ({page})=>{
  await page.setViewportSize({width:1440,height:960})
  await page.emulateMedia({reducedMotion:'no-preference'})
  await openExhibits(page)
  const section=page.locator('#solutions')
  const track=section.locator('.ex-track')
  await expect(section.locator('.ex-viewport')).toHaveClass(/ex-pinned/)
  await section.scrollIntoViewIfNeeded()
  await section.getByRole('button',{name:'Next solution'}).click()
  await expect.poll(()=>track.evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m41)).toBeLessThan(-500)
  await page.waitForTimeout(650)
  await section.screenshot({path:`${output}/product-showcase.png`})
  const x=await track.evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m41)
  await page.evaluate(()=>window.scrollBy(0,500))
  await expect.poll(()=>track.evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m41)).toBeLessThan(x-300)
})

test('touch service controls and native concept rail work with reduced motion',async({browser,baseURL})=>{
  const page=await browser.newPage({baseURL,viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'})
  try{
    await openExhibits(page)
    await page.locator('.ex-row-trigger').nth(4).tap()
    await expect(page.locator('#capability-4 .ex-mobile-study')).toBeVisible()
    const rail=page.locator('.ex-viewport')
    await expect(rail).not.toHaveClass(/ex-pinned/)
    await rail.scrollIntoViewIfNeeded()
    await rail.evaluate(el=>el.scrollLeft=el.scrollWidth)
    await expect.poll(()=>rail.evaluate(el=>el.scrollLeft)).toBeGreaterThan(700)
    await expect(page.locator('.ex-concept').last().getByRole('button')).toBeInViewport({ratio:.5})
  }finally{await page.close()}
})
