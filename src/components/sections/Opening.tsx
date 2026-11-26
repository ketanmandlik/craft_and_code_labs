import {useRef,useState} from 'react';
import {ArrowDown,ArrowUpRight} from 'lucide-react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {AnimatedHeading,MagneticButton} from '../animations/motion';
import SceneCanvas from '../three/SceneCanvas';
const states=['Idea','Craft','Code','Innovation'];
export default function Opening({onChat,ready}:{onChat:()=>void,ready:boolean}){
 const root=useRef<HTMLDivElement>(null),[stage,setStage]=useState(0);
 useGSAP(()=>{if(!ready||matchMedia('(prefers-reduced-motion: reduce)').matches)return;gsap.from('.hero h1 .text-mask>span',{yPercent:35,duration:.72,stagger:.085,ease:'power4.out'});},{scope:root,dependencies:[ready],revertOnUpdate:true});
 useGSAP(()=>{const mm=gsap.matchMedia();mm.add('(min-width: 960px) and (pointer:fine) and (prefers-reduced-motion:no-preference)',()=>{
 const tl=gsap.timeline({scrollTrigger:{trigger:'.manifesto',start:()=>'top '+(document.querySelector('.mast')?.clientHeight ?? 80)+'px',end:'+=45%',pin:true,scrub:true,invalidateOnRefresh:true}});
 const styles=getComputedStyle(root.current!.querySelector('.manifesto')!);
 const token=(name:string)=>styles.getPropertyValue(name).trim();
 tl.fromTo('.manifesto h2 > *:not(br)', {color:token('--muted-dark')}, {
   color:(index:number)=>token(['--blue-light','--accent-light','--orange-light'][index]), stagger:.23
 }).fromTo('.manifesto h2 em', {color:token('--muted-dark')}, {color:token('--pink-light')}, .4).to('.manifesto',{backgroundColor:token('--elevated')},0);
 });return()=>mm.revert()},{scope:root});
 return <div ref={root} className="opening"><div className="scene-rail" aria-hidden="true"><div className="scene-stage"><div className="art-slot"><SceneCanvas onStageChange={setStage}/></div></div></div>
 <section className="hero" id="home"><div className="hero-grid" aria-hidden="true"/><div className="hero-inner">
 <div className="hero-copy"><p className="eyebrow"><i/> Independent digital technology studio</p><AnimatedHeading/><p className="hero-tagline">Turn Ideas Into Innovation.</p><p className="hero-desc">We build exceptional websites, mobile applications, AI-powered solutions and scalable software that turn ambitious ideas into real business impact.</p>
 <div className="hero-actions"><MagneticButton className="button solid" onClick={onChat}>Start a project <ArrowUpRight size={17}/></MagneticButton><a className="button quiet" href="#manifesto">Explore our world <ArrowDown size={15}/></a></div></div>
 <div className="plate-caption" aria-hidden="true"><span className="crosshair">+</span> FIG. 01 <em>/</em> PROCEDURAL FORM</div></div>
 <div className="hero-footer"><a href="#manifesto" className="scroll-cue"><span>↓</span> Scroll to explore</a><div className="state-switch" aria-label="Sculpture state">{states.map((s,i)=><button key={s} aria-pressed={stage===i} onClick={()=>{setStage(i);window.dispatchEvent(new CustomEvent('sculpture-state',{detail:i}))}}><b/> {s}</button>)}</div><span className="fig-num">FIG. 01 — 04</span></div>
 </section><section className="manifesto" id="manifesto"><p className="eyebrow"><i/> 02 / Studio manifesto</p><h2><strong>GOOD IDEAS</strong><br/><strong>DESERVE</strong><br/><span><em>GREAT</em> ENGINEERING.</span></h2><p>We bring creativity and technology together to build meaningful digital experiences. From the first idea to the final product, every detail is crafted with purpose.</p></section></div>
}
