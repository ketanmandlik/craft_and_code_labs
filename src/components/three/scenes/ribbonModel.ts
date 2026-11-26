// Laminated continuous loop. Each rail follows a rotating frame around a
// common spine; its rounded cross-section catches a separate strip of light.
export type Vec = [number, number, number]
export const railCount = 44
export const tau = Math.PI * 2
export function surface(t: number, a: number, rail: number, stage = 0): Vec {
  const s = rail / (railCount - 1) * 2 - 1
  if(stage>0){
    const fine=.17*Math.cos(a), stack=.66*s+.0149*Math.sin(a), tr=t+.48*s
    let x=0,y=0,z=0,c=1,h=0
    if(stage===2){
      const r=(Math.abs(Math.cos(t))**6 + Math.abs(Math.sin(t))**6)**(-1/6)
      const u=Math.cos(t)*(r+fine), v=Math.sin(t)*(r+fine)*.64, tilt=.58*s+.24
      x=u*Math.cos(tilt)-v*Math.sin(tilt);y=u*Math.sin(tilt)+v*Math.cos(tilt);z=stack*1.65
      c=.72;h=.694
    } else if(stage===1){
      x=Math.cos(tr)*(1.18+fine); y=Math.sin(tr)*(.92+fine); z=stack+.44*Math.sin(2*tr)
      c=.866; h=.5
    } else {
      x=(1+fine)*Math.cos(tr); y=(1+fine)*Math.sin(tr); z=stack+.7*Math.sin(3*tr+.65*s)
      c=.89;h=.456
    }
    return [x,c*y-h*z,h*y+c*z]
  }
  const twist = 1.5 * t + 0.65 + 0.28 * Math.sin(2 * t + 0.15)
  const face = 0.68 * s + 0.0149 * Math.cos(a)
  const edge = (0.12 + 0.018 * Math.cos(s * Math.PI)) * Math.sin(a)
  const radius = 1.01 + face * Math.cos(twist) - edge * Math.sin(twist)
  const x = Math.cos(t) * radius
  const y = Math.sin(t) * radius * 1.10
  const z = face * Math.sin(twist) + edge * Math.cos(twist) + 0.42 * Math.sin(2 * t - 0.3)
  // Incline the spine towards the camera and rotate the projected silhouette.
  const py = y * 0.84 - z * 0.542
  return [x * 0.877 - py * 0.48, x * 0.48 + py * 0.877, y * 0.542 + z * 0.84]
}
export function normal(t: number, a: number, rail: number, stage = 0): Vec {
  const p = surface(t,a,rail,stage), q = surface(t + 0.0002,a,rail,stage), r = surface(t,a + 0.0002,rail,stage)
  const x=q[0]-p[0], y=q[1]-p[1], z=q[2]-p[2]
  const u=r[0]-p[0], v=r[1]-p[1], w=r[2]-p[2]
  const nx=y*w-z*v, ny=z*u-x*w, nz=x*v-y*u
  const length=Math.hypot(nx,ny,nz)
  return [nx/length,ny/length,nz/length]
}
