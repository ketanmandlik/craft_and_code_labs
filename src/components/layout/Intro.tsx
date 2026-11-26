import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import Brand from './Brand';
export default function Intro({done}:{done:()=>void}){
 const ref=useRef<HTMLDivElement>(null);useGSAP(()=>{gsap.timeline({onComplete:done}).from('.intro-rule',{scaleX:0,duration:.24}).from('.intro-brand',{y:16,opacity:0,duration:.35}).from('.intro-tag',{opacity:0,duration:.24}).to(ref.current,{clipPath:'inset(0 0 100% 0)',duration:.56,ease:'power3.inOut'});const key=(e:KeyboardEvent)=>{if(e.key==='Escape')done()};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},{scope:ref});
 return <div ref={ref} className="intro"><div className="intro-rule"/><div className="intro-brand"><Brand/></div><p className="intro-tag">Turn Ideas Into Innovation.</p><button onClick={done}>Skip intro ↗</button></div>
}
