import {useRef,useState} from 'react'
import {ArrowLeft, ArrowRight, ArrowUpRight} from 'lucide-react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {useGSAP} from '@gsap/react'
import {concepts, services} from '../../data/services'
import ProductStudy from '../ui/ProductStudy'
import type {EnquiryProps} from './InteractiveServiceList'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function HorizontalShowcase({onEnquire}: EnquiryProps) {
  const ref=useRef<HTMLElement>(null)
  const viewport=useRef<HTMLDivElement>(null)
  const track=useRef<HTMLDivElement>(null)
  const [active,setActive]=useState(0)
  const activeRef=useRef(0)
  const trigger=useRef<ScrollTrigger | null>(null)
  function updateActive(offset:number) {
    const panels=Array.from(track.current?.children??[]) as HTMLElement[]
    const distance=(panel:HTMLElement)=>Math.abs(Math.min(panel.offsetLeft,track.current!.scrollWidth-viewport.current!.clientWidth)-offset)
    const index=panels.reduce((closest,panel,i)=>distance(panel)<distance(panels[closest])?i:closest,0)
    if(index!==activeRef.current){activeRef.current=index;setActive(index)}
  }

  useGSAP(()=>{
    const media=gsap.matchMedia()
    media.add('(min-width: 1000px) and (min-height: 660px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)',()=>{
      const view=viewport.current!, strip=track.current!
      const distance=()=>strip.scrollWidth-view.clientWidth
      const tween=gsap.to(strip,{x:()=>-distance(),ease:'none',scrollTrigger:{trigger:ref.current,pin:true,start:()=> 'top '+(document.querySelector('.mast')?.clientHeight??80)+'px',end:()=>'+='+distance()*.8,scrub:0.38,invalidateOnRefresh:true,onUpdate:self=>updateActive(self.progress*distance())}})
      trigger.current=tween.scrollTrigger!
      view.classList.add('ex-pinned')
      return ()=>{trigger.current=null;view.classList.remove('ex-pinned')}
    })
    return ()=>media.revert()
  },{scope:ref})
  function go(index:number) {
    const panel=track.current?.children[index] as HTMLElement|undefined
    const view=viewport.current
    if(!panel||!view)return
    const pinned=trigger.current
    if(pinned){view.scrollLeft=0;window.scrollTo(0,pinned.start+(pinned.end-pinned.start)*Math.min(panel.offsetLeft/(track.current!.scrollWidth-view.clientWidth),1))}
    else view.scrollTo({left:panel.offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})
  }
  function move(delta:number) {
    go(Math.max(0,Math.min(concepts.length-1,activeRef.current+delta)))
  }
  return <section id="solutions" ref={ref} className="ex-solutions" aria-labelledby="solution-title">
    <div className="ex-solution-head"><div><div className="ex-kicker"><span/> Concept demonstrations</div><h2 id="solution-title" className="ex-title">IDEAS. ENGINEERED.</h2></div><div className="ex-stepper"><span className="ex-counter" aria-label={`Concept ${active+1} of ${concepts.length}`}>0{active+1} / 0{concepts.length}</span><button aria-label="Previous solution" aria-disabled={active===0} onClick={()=>{if(active>0)move(-1)}}><ArrowLeft/></button><button aria-label="Next solution" aria-disabled={active===concepts.length-1} onClick={()=>{if(active<concepts.length-1)move(1)}}><ArrowRight/></button></div></div>
    <div className="ex-viewport" ref={viewport} onScroll={event=>{if(!trigger.current)updateActive(event.currentTarget.scrollLeft)}} role="region" aria-label="Product concepts"><div className="ex-track" ref={track}>{concepts.map((item,i)=><article key={item.name} className="ex-concept" data-active={active===i} onPointerMove={event=>{if(event.pointerType==='mouse'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const box=event.currentTarget.getBoundingClientRect();event.currentTarget.style.setProperty('--tilt',((event.clientX-box.left)/box.width*4-2)+'deg')}}} onPointerLeave={event=>event.currentTarget.style.removeProperty('--tilt')}>
      <ProductStudy index={item.service}/><div className="ex-concept-copy"><small>0{i+1} / 04　 ·　 {services[item.service].medium}</small><h3>{item.name}</h3><p>{item.objective}</p><button onFocus={()=>{if(trigger.current)go(i)}} onClick={()=>onEnquire(`Hi Craft and Code Labs! I'd like to explore a project similar to your ${item.name} concept demonstration.`)}>Explore solution <ArrowUpRight size={16}/></button></div>
    </article>)}</div></div>
  </section>
}
