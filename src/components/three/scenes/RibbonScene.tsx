import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei/core/OrthographicCamera'
import { useEffect, useRef } from 'react'
import type { MutableRefObject } from 'react'
import type { Group, ShaderMaterial } from 'three'
import { gsap } from 'gsap'
import ParticleMorph from './ParticleMorph'

type Controls = { stage: number; x: number; y: number; visible: boolean }
type Props = { controls: MutableRefObject<Controls>; onReady: () => void; onLoss: () => void }
function Assembly({controls,onReady,onLoss}:Props) {
  const {advance,size,gl} = useThree()
  const group = useRef<Group>(null), material = useRef<ShaderMaterial>(null)
  const frameClock = useRef(0)
  useEffect(()=>{
    const node=gl.domElement
    const lost=(event:Event)=>{event.preventDefault();onLoss()}
    node.addEventListener('webglcontextlost',lost)
    let last=0,first=true
    function tick(time:number){
      if(document.hidden || !controls.current.visible || time-last<1/30) return
      frameClock.current+=Math.min(.05,time-last)
      last=time
      advance(frameClock.current*1000)
      if(first){first=false;onReady()}
    }
    gsap.ticker.add(tick)
    return ()=>{gsap.ticker.remove(tick);node.removeEventListener('webglcontextlost',lost)}
  },[advance,gl,controls,onLoss,onReady])
  useFrame(()=>{
    if(!group.current || !material.current)return
    const {x,y,stage}=controls.current, time=frameClock.current
    const scale=Math.min(size.width,size.height)/3.85
    group.current.scale.setScalar(scale)
    group.current.rotation.y+=(.05*Math.sin(.24*time)+x*.13+stage*.06-group.current.rotation.y)*.12
    group.current.rotation.x+=(y*.08+.035*Math.sin(.17*time)-group.current.rotation.x)*.12
    material.current.uniforms.stage.value+=(stage-material.current.uniforms.stage.value)*.1
  })
  return <>
    <OrthographicCamera makeDefault near={0.1} far={12000} position={[0,0,6000]} />
    <group ref={group}><ParticleMorph materialRef={material}/></group>
  </>
}
export default function RibbonScene(props:Props){
  return <Canvas orthographic frameloop="never" dpr={[1,1.5]} gl={{alpha:true,antialias:true,powerPreference:'low-power'}} resize={{debounce:80}}>
    <Assembly {...props}/>
  </Canvas>
}
