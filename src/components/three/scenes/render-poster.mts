// Run with Node 24+ from the project root to regenerate the transparent
// fallback. Supersampling, interpolated normals and a depth buffer preserve
// the fine laminations at silhouette crossings.
import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'
import { chromium } from 'playwright'
const { spectrumMaterial } = await import(new URL('../shaders/spectrumMaterial.ts', import.meta.url).href) as typeof import('../shaders/spectrumMaterial')
const { surface, normal, railCount, tau } = await import(new URL('./ribbonModel.ts', import.meta.url).href)
const stage=Number(process.argv[2] ?? 0)
const size=1400, out=700
const pixels=new Uint8Array(size*size*4), depth=new Float32Array(size*size).fill(-Infinity)
const scale=size/3.85
const smooth=(a:number,b:number,x:number)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}
function shade(x:number,y:number,z:number, rail:number) {
  const m=Math.hypot(x,y,z); x/=m; y/=m; z/=m
  if(z<0){x=-x;y=-y;z=-z}
  const rx=2*z*x, ry=2*z*y, rz=2*z*z-1
  const sky=smooth(-0.68,1,ry), fres=(1-z)**2
  const strip=1-smooth(.11,.40,Math.abs(rx+.32*ry+.44))
  const top=1-smooth(.12,.42,Math.abs(ry-.78))
  const edge=1-smooth(.015,.085,Math.abs(rx-.79))
  const glint=strip*(.66+.34*smooth(-1,.8,rz))+top*.55+edge*.40
  const l=.105+.43*sky+.89*glint+.18*fres
  const band=smooth(-.74,.68,rx*.78+ry*.57)
  const fringe=smooth(.12,.83,fres)*.68
  const silver=.14+.54*smooth(.30,1.22,glint)
  const accent=1-smooth(.35,1.5,Math.abs(rail-9.5))
  const [low,high,rim]=spectrumMaterial[stage]
  return [.90,.93,1].map((neutral,i)=>{
    const tint=(low[i]*(1-band)+high[i]*band)*(1-fringe)+rim[i]*fringe
    return Math.min(255,255*(l*(tint*(1-silver)+neutral*silver)+accent*.07*tint))
  })
}
function vertex(t:number,a:number,r:number){const p=surface(t,a,r,stage), n=normal(t,a,r,stage);return [(size/2+p[0]*scale),(size/2-p[1]*scale),p[2],...n]}
function triangle(a:number[],b:number[],c:number[],r:number) {
  const dx=b[0]-a[0],dy=b[1]-a[1],ex=c[0]-a[0],ey=c[1]-a[1], det=dx*ey-dy*ex
  if(Math.abs(det)<.00001)return
  for(let y=Math.max(0,Math.floor(Math.min(a[1],b[1],c[1])));y<=Math.min(size-1,Math.ceil(Math.max(a[1],b[1],c[1])));y++)
    for(let x=Math.max(0,Math.floor(Math.min(a[0],b[0],c[0])));x<=Math.min(size-1,Math.ceil(Math.max(a[0],b[0],c[0])));x++){
      const u=((x+.5-a[0])*ey-(y+.5-a[1])*ex)/det,v=(dx*(y+.5-a[1])-dy*(x+.5-a[0]))/det,w=1-u-v
      if(u<0||v<0||w<0)continue
      const z=w*a[2]+u*b[2]+v*c[2],i=y*size+x
      if(z<=depth[i])continue
      depth[i]=z
      const rgb=shade(w*a[3]+u*b[3]+v*c[3],w*a[4]+u*b[4]+v*c[4],w*a[5]+u*b[5]+v*c[5],r)
      pixels.set([...rgb,255],i*4)
    }
}
for(let r=0;r<railCount;r++){
  const rows=Array.from({length:241},(_,i)=>Array.from({length:13},(_,j)=>vertex(i*tau/240,j*tau/12,r)))
  for(let i=0;i<240;i++)for(let j=0;j<12;j++){const a=rows[i][j],b=rows[i+1][j],c=rows[i][j+1],d=rows[i+1][j+1];triangle(a,b,c,r);triangle(c,b,d,r)}
}
const rgba=Buffer.alloc(out*(1+out*4))
for(let y=0;y<out;y++)for(let x=0;x<out;x++){
  const i=y*(out*4+1)+1+x*4, rgb=[0,0,0];let n=0
  for(let v=0;v<2;v++)for(let u=0;u<2;u++){
    const k=((2*y+v)*size+2*x+u)*4
    if(!pixels[k+3])continue
    n++;for(let c=0;c<3;c++)rgb[c]+=pixels[k+c]
  }
  for(let c=0;c<3;c++)rgba[i+c]=n?Math.round(rgb[c]/n):0
  rgba[i+3]=Math.round(n*255/4)
}
function chunk(type:string,data:Buffer){const name=Buffer.from(type);let crc=-1;for(const byte of Buffer.concat([name,data])){crc^=byte;for(let k=0;k<8;k++)crc=crc&1?(crc>>>1)^0xedb88320:crc>>>1}const head=Buffer.alloc(4),tail=Buffer.alloc(4);head.writeUInt32BE(data.length);tail.writeUInt32BE((crc^-1)>>>0);return Buffer.concat([head,name,data,tail])}
const header=Buffer.alloc(13);header.writeUInt32BE(out);header.writeUInt32BE(out,4);header[8]=8;header[9]=6
const png = Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),chunk('IHDR',header),chunk('IDAT',deflateSync(rgba,{level:9})),chunk('IEND',Buffer.alloc(0))])
const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH})
try {
  const page = await browser.newPage()
  const data = await page.evaluate(async src=>{
    const image = new Image()
    image.src=src
    await image.decode()
    const c=document.createElement('canvas')
    c.width=image.width;c.height=image.height
    c.getContext('2d')!.drawImage(image,0,0)
    return c.toDataURL('image/webp', .9).split(',')[1]
  }, 'data:image/png;base64,'+png.toString('base64'))
  writeFileSync('public/assets/sculpture'+(stage ? '-'+stage : '')+'.webp',Buffer.from(data,'base64'))
} finally { await browser.close() }
