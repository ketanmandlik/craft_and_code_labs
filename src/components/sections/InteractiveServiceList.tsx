import { useState, useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Minus, Plus } from 'lucide-react'
import { services } from '../../data/services'
import ProductStudy from '../ui/ProductStudy'

export type EnquiryProps = { onEnquire: (message: string) => void }

export default function InteractiveServiceList({onEnquire}: EnquiryProps) {
  const [active, setActive] = useState(0)
  const [expanded, setExpanded] = useState<number | null>(0)
  useEffect(() => { ScrollTrigger.refresh() }, [expanded])
  const section = useRef<HTMLElement>(null)
  useEffect(() => {
    if (location.hash !== '#services') return
    // The fragment can resolve before React mounts the section and its preceding pin.
    const frame = requestAnimationFrame(() => {
      if (location.hash === '#services' && window.scrollY === 0) {
        ScrollTrigger.refresh()
        section.current?.scrollIntoView({block:'start', behavior:'instant'})
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [])
  const service = services[active]
  return <section ref={section} className="ex-services" id="services" aria-labelledby="service-title">
    <div className="ex-kicker"><span/> Studio capabilities</div>
    <h2 id="service-title" className="ex-title">WHAT WE<br/>MAKE POSSIBLE.</h2>
    <div className="ex-service-layout">
      <div className="ex-service-list">{services.map((item, i) => <div key={item.name} className={'ex-service-row'+(i===active?' is-active':'')}>
        <h3><button className="ex-row-trigger" onPointerEnter={event=>{if(event.pointerType==='mouse')setActive(i)}} onFocus={()=>setActive(i)} onClick={()=>{setActive(i);setExpanded(expanded===i?null:i)}} aria-expanded={expanded===i} aria-controls={`capability-${i}`}><small>0{i+1}</small><span>{item.name}</span>{expanded===i?<Minus/>:<Plus/>}</button></h3>
        <div id={`capability-${i}`} className="ex-row-detail" hidden={expanded!==i}><p>{item.description}</p>{expanded===i&&<div className="ex-mobile-study"><ProductStudy index={i}/></div>}<button onClick={()=>onEnquire(`Hi Craft and Code Labs! I'd like to discuss a project involving ${item.name}.`)}>Enquire about this service <ArrowUpRight size={15}/></button></div>
      </div>)}</div>
      <figure className="ex-service-figure"><ProductStudy key={active} index={active}/><figcaption><span>0{active+1} / 06</span><span>{service.study} · Interface study</span></figcaption></figure>
    </div>
  </section>
}
