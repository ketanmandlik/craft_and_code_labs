import {useCallback,useState} from 'react';
import {ArrowUpRight,Menu,MessageCircle,Phone} from 'lucide-react';
import {SmoothScrollProvider,ScrollProgress,reduced} from './components/animations/motion';
import Intro from './components/layout/Intro';
import Brand from './components/layout/Brand';
import Dialog from './components/ui/Dialog';
import ContactOverlay from './components/ui/ContactOverlay';
import Opening from './components/sections/Opening';
import InteractiveServiceList from './components/sections/InteractiveServiceList';
import HorizontalShowcase from './components/sections/HorizontalShowcase';
import Editorial from './components/sections/Editorial';
import {config} from './config/site';
import {whatsappUrl,defaultMessage} from './utils/whatsapp';
const nav=['Home','Services','Solutions','Process','About','Contact'];
function WhatsAppButton({onClick}:{onClick:()=>void}){return <button aria-label="Chat on WhatsApp" className="floating-wa" onClick={onClick}><MessageCircle size={24}/><Phone size={10} className="wa-phone"/></button>}
export default function App(){
 const [intro,setIntro]=useState(()=>{try{return !sessionStorage.getItem('studio-intro')&&!location.hash&&!reduced()}catch{return false}});
 const finish=useCallback(()=>{setIntro(false);try{sessionStorage.setItem('studio-intro','1')}catch{/* Storage is optional. */}},[]);
 const [panel,setPanel]=useState<null|'menu'|'contact'|'unconfigured'>(null);const close=()=>setPanel(null);
 const chat=(message=defaultMessage)=>{const url=whatsappUrl(config.whatsapp,message);if(url)location.assign(url);else setPanel('unconfigured')};
 return <SmoothScrollProvider><a href="#main" className="skip">Skip to content</a><header className="mast"><a className="brand-link" href="#home" aria-label="Craft &amp; Code Labs home"><Brand/></a><nav aria-label="Studio navigation"><button onClick={()=>setPanel('menu')} className="menu-btn"><Menu size={19}/> Menu</button><button onClick={()=>chat()} className="nav-project">Start a project <ArrowUpRight size={15}/></button></nav><ScrollProgress/></header>
 <main id="main" tabIndex={-1}><Opening onChat={()=>chat()} ready={!intro}/><InteractiveServiceList onEnquire={chat}/><HorizontalShowcase onEnquire={chat}/><Editorial onChat={()=>chat()} onContact={()=>setPanel('contact')}/></main>
 <WhatsAppButton onClick={()=>chat()}/>{intro&&<Intro done={finish}/>}
 {panel==='menu'&&<Dialog title="Navigation" close={close} kind="menu-dialog"><nav aria-label="Sections">{nav.map((item,i)=><a className="menu-item" key={item} href={'#'+item.toLowerCase()} onClick={close}><small>0{i+1}</small>{item}<ArrowUpRight/></a>)}</nav><div className="menu-meta">
   <p>Turn Ideas Into Innovation.</p>
   <button className="button solid" onClick={()=>setPanel('contact')}>Tell us your idea <ArrowUpRight size={16}/></button>
   {(config.instagram||config.linkedin)&&<div className="menu-socials">{config.instagram&&<a href={config.instagram}>Instagram</a>}{config.linkedin&&<a href={config.linkedin}>LinkedIn</a>}</div>}
 </div></Dialog>}
 {panel==='contact'&&<ContactOverlay close={close}/>}
 {panel==='unconfigured'&&<Dialog title="WhatsApp enquiries" close={close} kind="notice"><h2>WhatsApp is currently unavailable.</h2><p>{import.meta.env.DEV?'Set VITE_WHATSAPP_NUMBER in .env.local and restart Vite to enable project enquiries.':'Please check back to start your project enquiry.'}</p></Dialog>}</SmoothScrollProvider>
}
