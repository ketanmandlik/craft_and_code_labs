import {useEffect,useRef,type ReactNode,type ButtonHTMLAttributes} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger,useGSAP);
export const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
export function SmoothScrollProvider({children}:{children:ReactNode}){
 useEffect(()=>{const media=gsap.matchMedia();media.add('(min-width: 960px) and (pointer:fine) and (prefers-reduced-motion:no-preference)',()=>{
 const lenis=new Lenis({autoRaf:false,anchors:true,lerp:.115,prevent:node=>!!node.closest('dialog')});
 const tick=(t:number)=>lenis.raf(t*1000);lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(tick);
 const lock=()=>document.querySelector('dialog[open]')?lenis.stop():lenis.start();
 document.addEventListener('studio-dialog',lock);
 return()=>{document.removeEventListener('studio-dialog',lock);gsap.ticker.remove(tick);lenis.destroy()};});return()=>media.revert()},[]);
 return <>{children}</>
}
export function MaskedReveal({children}:{children:ReactNode}){return <span className="text-mask"><span>{children}</span></span>}
export function AnimatedHeading(){return <h1 aria-label="We craft. We code. We innovate.">{['WE CRAFT.','WE CODE.','WE INNOVATE.'].map(line=><MaskedReveal key={line}>{line}</MaskedReveal>)}</h1>}
export function MagneticButton({children,...props}:ButtonHTMLAttributes<HTMLButtonElement>){return <button {...props} onPointerMove={e=>{if(e.pointerType!=='mouse'||reduced())return;const r=e.currentTarget.getBoundingClientRect();gsap.to(e.currentTarget,{x:(e.clientX-r.left-r.width/2)*.07,y:(e.clientY-r.top-r.height/2)*.1,duration:.2,overwrite:true})}} onPointerLeave={e=>{if(!reduced())gsap.to(e.currentTarget,{x:0,y:0,duration:.3,overwrite:true})}}>{children}</button>}
export function ScrollProgress(){const ref=useRef<HTMLDivElement>(null);useGSAP(()=>{gsap.to(ref.current,{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:true}})},[]);return <div ref={ref} className="scroll-progress"/>}
