import Dialog from './Dialog';
import {useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {config} from '../../config/site';
import {whatsappUrl} from '../../utils/whatsapp';
import {services} from '../../data/services';
export default function ContactOverlay({close}:{close:()=>void}){
 const [error,setError]=useState('');
 return <Dialog title="Project enquiry" kind="enquiry" close={close}><h2>Tell us your idea<span>.</span></h2><form onSubmit={e=>{e.preventDefault();const values=new FormData(e.currentTarget);const msg='Hi Craft and Code Labs!\n'+Array.from(values).filter(([,v])=>String(v).trim()).map(([k,v])=>k+': '+String(v).trim()).join('\n');const url=whatsappUrl(config.whatsapp,msg);if(url)location.assign(url);else setError(import.meta.env.DEV?'Set VITE_WHATSAPP_NUMBER to enable enquiries.':'WhatsApp enquiries are temporarily unavailable.')}}>
 <label>Full name<input name="Full name" autoComplete="name" required pattern=".*\S.*"/></label><label>Business name <small>(optional)</small><input name="Business name" autoComplete="organization"/></label>
 <label>Required service<select name="Service" required defaultValue=""><option value="" disabled>Select a service</option>{services.map(({name})=><option key={name}>{name}</option>)}</select></label>
 <label>Estimated budget <small>(optional)</small><input name="Estimated budget" placeholder="Amount and currency"/></label><label>Project description<textarea name="Project description" required rows={3} onChange={e=>e.target.setCustomValidity(e.target.value.trim()?'':'Describe your project.')}/></label>
 <p>You’ll review and send your message in WhatsApp.</p><button className="button solid">Send enquiry <ArrowUpRight size={17}/></button>{error&&<p role="alert">{error}</p>}</form></Dialog>
}
