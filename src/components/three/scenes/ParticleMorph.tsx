import { useEffect, useMemo } from 'react'
import { BufferAttribute, BufferGeometry, Float32BufferAttribute, InstancedBufferAttribute, DoubleSide, InstancedBufferGeometry } from 'three'
import type { ShaderMaterial } from 'three'
import type { RefObject } from 'react'
import { vertexShader, fragmentShader } from '../shaders/laminate'
import { railCount, tau, surface } from './ribbonModel'

export default function ParticleMorph({materialRef}: {materialRef: RefObject<ShaderMaterial | null>}) {
  const geometry = useMemo(() => {
    const geometry = new InstancedBufferGeometry()
    const positions: number[] = [], indices: number[] = []
    const steps = 180, sides = 12
    for (let i = 0; i <= steps; i++) {
      for (let j = 0; j <= sides; j++) {
        const k = i * (sides + 1) + j
        positions.push(i * tau / steps, j * tau / sides, 0)
        if (i < steps && j < sides) indices.push(k, k + sides + 1, k + 1, k + 1, k + sides + 1, k + sides + 2)
      }
    }
    geometry.setIndex(indices)
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
    geometry.setAttribute('rail', new InstancedBufferAttribute(Float32Array.from({length:railCount}, (_,i)=>i), 1))
    geometry.instanceCount = railCount
    return geometry
  }, [])
  const uniforms = useMemo(() => ({stage:{value:0}}), [])
  // A narrow field of aligned offcuts feeds into the top arc as it is crafted.
  const offcuts = useMemo(() => {
    const vertices: number[] = []
    for(let i=0;i<40;i++){
      const phase=i*2.39996
      const t=1.27+.85*Math.sin(phase)
      const [x,y,z]=surface(t,0,railCount-1)
      const drift=.08+.31*(.5+.5*Math.cos(i*1.32))
      const length=.008+.018*(.5+.5*Math.sin(i*2.63))
      vertices.push(x*(1+drift),y+drift,z, x*(1+drift)+length,y+drift-length*.45,z, x*(1+drift)+length*.30,y+drift+.005,z)
    }
    const result=new BufferGeometry()
    result.setAttribute('position',new Float32BufferAttribute(vertices,3))
    return result
  },[])
  useEffect(()=>()=>{geometry.dispose();offcuts.dispose()},[geometry,offcuts])
  return <group><mesh frustumCulled={false}>
    <primitive object={geometry} attach="geometry" />
    <shaderMaterial ref={materialRef} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} side={DoubleSide} />
  </mesh>
    <mesh frustumCulled={false}>
      <primitive object={offcuts} attach="geometry"/>
      <shaderMaterial transparent depthWrite={false} side={DoubleSide} uniforms={uniforms}
        vertexShader={`uniform float stage; void main(){ vec3 p=position; p.xy*=1.-.22*smoothstep(0.,1.,stage); gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.); }`}
        fragmentShader={`uniform float stage; void main(){gl_FragColor=vec4(.58,.65,1.,.63*(1.-smoothstep(0.,.94,stage)));}`}/>
    </mesh>
  </group>
}
