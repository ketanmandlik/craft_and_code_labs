import {chromium} from 'playwright';
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1200,height:630},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:'+(process.env.PLAYWRIGHT_PORT||5173)+'/');
 await page.addStyleTag({content:'.mast{position:absolute;background:transparent;border:0}.mast nav,.hero-actions,.hero-footer,.floating-wa,.scroll-progress,.plate-caption{display:none}.hero,.scene-stage{min-height:630px;height:630px}.hero-copy h1{font-size:99px}.art-slot{height:89%;top:8%;right:0}.hero-inner{padding:28px 0}.hero-desc{max-width:440px}.manifesto{display:none}'});
 await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'public/assets/social.png'});
}finally{await browser.close()}
