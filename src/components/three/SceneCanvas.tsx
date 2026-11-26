import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
const RibbonScene = lazy(()=>import('./scenes/RibbonScene'))

class RenderBoundary extends Component<{children:ReactNode; onFailure:()=>void},{failed:boolean}> {
  state = {failed:false}
  static getDerivedStateFromError(){return {failed:true}}
  componentDidCatch(){this.props.onFailure()}
  render(){return this.state.failed?null:this.props.children}
}

export default function SceneCanvas({onStageChange}:{onStageChange:(stage:number)=>void}) {
  const frame=useRef<HTMLDivElement>(null)
  const controls=useRef({stage:0,x:0,y:0,visible:true})
  const [enabled,setEnabled]=useState(false), [ready,setReady]=useState(false)
  const [posterStage,setPosterStage]=useState(0)
  const showCanvas=useCallback(()=>setReady(true),[])
  const restorePoster=useCallback(()=>{setEnabled(false);setReady(false)},[])
  useEffect(()=>{
    const element=frame.current
    if(!element)return
    const media=window.matchMedia('(min-width: 700px) and (prefers-reduced-motion: no-preference)')
    let timer=0
    const setup=()=>{
      clearTimeout(timer)
      restorePoster()
      if(!media.matches)return
      timer=window.setTimeout(()=>{
        // Probe a minimal context before mounting the heavyweight renderer.
        try{
          const probe=document.createElement('canvas').getContext('webgl2',{failIfMajorPerformanceCaveat:true})
          if(probe){probe.getExtension('WEBGL_lose_context')?.loseContext();setEnabled(true)}
        }catch{restorePoster()}
      },900)
    }
    setup()
    const pointer=(e:PointerEvent)=>{
      if(e.pointerType!=='mouse'||!media.matches||!controls.current.visible)return
      controls.current.x=e.clientX/innerWidth*2-1
      controls.current.y=e.clientY/innerHeight*2-1
    }
    const setStage=(stage:number)=>{
      const step=Math.round(stage)
      if(Math.round(controls.current.stage)!==step){setPosterStage(step);onStageChange(step)}
      controls.current.stage=stage
    }
    let lastScroll=-10
    const scroll=()=>{
      if(!controls.current.visible || Math.abs(lastScroll-scrollY)<3)return
      lastScroll=scrollY
      const opening=element.closest('.opening') as HTMLElement|null
      const travel=opening?Math.max(innerHeight,opening.offsetHeight-innerHeight):innerHeight
      setStage(Math.min(3,Math.max(0,scrollY/travel*3)))
    }
    const select=(event:Event)=>{const n=(event as CustomEvent<number>).detail;if(Number.isFinite(n))setStage(Math.min(3,Math.max(0,n)))}
    const observer=new IntersectionObserver(([entry])=>{controls.current.visible=entry.isIntersecting;if(entry.isIntersecting)scroll()})
    observer.observe(element)
    window.addEventListener('sculpture-state',select)
    window.addEventListener('pointermove',pointer,{passive:true})
    window.addEventListener('scroll',scroll,{passive:true})
    media.addEventListener('change',setup)
    return ()=>{clearTimeout(timer);observer.disconnect();media.removeEventListener('change',setup);window.removeEventListener('pointermove',pointer);window.removeEventListener('scroll',scroll);window.removeEventListener('sculpture-state',select)}
  },[restorePoster,onStageChange])
  return <div ref={frame} aria-hidden="true" data-scene={ready?'webgl':'poster'} style={{position:'absolute',inset:0,pointerEvents:'none'}}>
    <img fetchPriority="high" alt="" src={posterStage===0?'/assets/sculpture.webp':`/assets/sculpture-${posterStage}.webp`} width="700" height="700" style={{position:'absolute',width:'100%',height:'100%',objectFit:'contain',opacity:ready?0:1,transition:'opacity .35s ease'}}/>
    {enabled && <RenderBoundary onFailure={restorePoster}><Suspense fallback={null}><RibbonScene controls={controls} onReady={showCanvas} onLoss={restorePoster}/></Suspense></RenderBoundary>}
  </div>
}
