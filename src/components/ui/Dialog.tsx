import {useLayoutEffect,useRef,type ReactNode} from 'react';
import gsap from 'gsap';
import {X} from 'lucide-react';
export default function Dialog({children,title,close,kind}:{children:ReactNode,title:string,close:()=>void,kind:string}){
 const ref=useRef<HTMLDialogElement>(null);
 useLayoutEffect(()=>{const el=ref.current!,previous=document.activeElement as HTMLElement;el.showModal();document.documentElement.classList.add('modal-open');document.dispatchEvent(new Event('studio-dialog'));
 const viewport=window.visualViewport;
 const fit=()=>el.style.setProperty('--dialog-height',Math.floor((viewport?.height??innerHeight)*.92)+'px');
 fit();viewport?.addEventListener('resize',fit);
 const ctx=gsap.context(()=>{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){gsap.from(el,{y:24,opacity:0,duration:.35});gsap.from(el.querySelectorAll('.menu-item'),{yPercent:35,opacity:0,stagger:.045,duration:.45})}},el);
 return()=>{viewport?.removeEventListener('resize',fit);ctx.revert();el.close();document.documentElement.classList.remove('modal-open');document.dispatchEvent(new Event('studio-dialog'));previous?.focus({preventScroll:true})}},[]);
 return <dialog ref={ref} className={'dialog '+kind} onCancel={e=>{e.preventDefault();close()}} aria-label={title}><div className="dialog-top"><span className="mono">{title}</span><button className="close-btn" onClick={close} aria-label={'Close '+title}><X/></button></div>{children}</dialog>
}
