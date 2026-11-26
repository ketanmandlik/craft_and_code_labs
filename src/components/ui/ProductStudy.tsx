import { ArrowUpRight, AudioLines, Bot, Check, CircuitBoard, Command, CornerDownRight, Layers2, ListFilter, Send, SlidersHorizontal, Workflow } from 'lucide-react'
import '../../styles/exhibits.css'

const range = (count: number) => Array.from({ length: count }, (_, i) => i)

function Pavilion() {
  return <svg viewBox="0 0 280 180" preserveAspectRatio="xMidYMid slice" className="ex-pavilion" aria-hidden="true">
    <rect width="280" height="180" fill="#a9b7a5" />
    <circle cx="204" cy="42" r="21" fill="#ece8ce"/>
    {range(25).map(i => <path key={i} d={`M0 ${116 + i*2} Q65 ${67+i*2} 135 ${118+i*2} T290 ${100+i*2}`} fill="none" stroke="#7b9384" strokeWidth=".7"/>)}
    <path d="M0 169 171 116 280 155 280 180H0" fill="#636d58"/>
    <path d="M43 132V101l98-35 83 25v41l-97 31z" fill="#283e37"/>
    <path d="m43 101 98-35v42l-98 33z" fill="#c1c3af"/>
    {range(47).map(i => <path key={i} d={`M${46+i*2} ${102-i*.72}v36`} stroke="#69776c" strokeWidth=".9"/>)}
    <path d="m32 100 102-43 105 27-108 45z" fill="#eee6c9"/>
    <path d="m32 100 99 29v5l-99-30zm99 29 108-45v6l-108 44z" fill="#58665a"/>
    {range(27).map(i => <path key={i} d={`M${39+i*3.75} ${99-i*1.54} l94 25`} stroke="#aea98e" strokeWidth=".65"/>)}
  </svg>
}

function MapArt() {
  return <svg className="ex-map" viewBox="0 0 180 105" aria-hidden="true"><rect width="180" height="105" fill="#cfd9cb"/>
    {range(28).map(i => <path key={i} d={`M${-40+i*5} -8 Q ${50+i*3} 34 ${22+i*3} 58 T ${70+i*3} 115`} fill="none" stroke={i%4===0?'#6e8c78':'#a7bba8'} strokeWidth="1.2"/>)}
    <path d="m13 81 32-21 26 6 36-32 48-10" fill="none" stroke="#f3f3dc" strokeWidth="5"/><circle cx="106" cy="34" r="7" fill="#183f37" stroke="#fff" strokeWidth="2"/>
  </svg>
}

function BrowserBar({title}:{title:string}) {
  return <div className="ex-chrome"><span>● ● ●</span><span>{title}</span><Command size={10}/></div>
}

function WebStudy() {
  return <div className="ex-browser ex-web"><BrowserBar title="Forma / Editions"/><div className="ex-webheader"><b>forma.</b><span>JOURNAL　 INDEX</span></div><div className="ex-webbody"><small>SPATIAL JOURNAL　/　01</small><strong>Living<br/>in form.</strong><Pavilion/></div><div className="ex-webfoot">FIELD NOTES　—　ARCHITECTURE <ArrowUpRight size={12}/></div></div>
}
function MobileStudy() {
  return <div className="ex-phone"><div className="ex-notch"/><small className="ex-phonetime">9:41</small><span className="ex-phonebrand">PASSAGE　↗</span><strong>Find a<br/>quiet space.</strong><MapArt/><small>AVAILABLE SESSIONS</small><b>Garden studio</b><div className="ex-times"><span>09:00</span><span>11:30</span><span>14:00</span></div><div className="ex-reserve">Reserve session　↗</div></div>
}
function AIStudy() {
  return <div className="ex-browser ex-chat"><BrowserBar title="Relay / Workspace"/><div className="ex-chatheader"><AudioLines size={25}/><strong>Relay</strong><span>ASSISTANT</span></div><svg viewBox="0 0 270 30" preserveAspectRatio="none" className="ex-voiceprint" aria-hidden="true">{range(70).map(i=>{
    const height=1+22*Math.abs(Math.sin(i*1.7)*Math.cos(i*.38))*Math.sin(i/69*Math.PI)**2
    return <path key={i} d={`M${i*3.88} ${15-height/2}v${height}`} stroke="currentColor" strokeWidth="2"/>
  })}</svg><div className="ex-conversation"><p>Which enquiries need a reply?</p><div><Bot size={17}/><p>Two requests are ready for review. I’ve grouped them by priority.</p></div><small><Check size={12}/> Enquiry summary prepared</small></div><div className="ex-input">Ask a follow-up… <Send size={12}/></div></div>
}
function SaaSStudy() {
  return <div className="ex-browser ex-dashboard"><BrowserBar title="Index / Operations"/><div className="ex-dashheader"><b>◧ Index</b><span>WORKSPACE</span></div><div className="ex-dashbody"><small>MONTHLY OVERVIEW</small><strong>Operations</strong><div className="ex-plot" aria-hidden="true">{[29,44,38,56,49,68,60,72,68,90,77,94].map((v,i)=><i key={i} style={{height:v+'%',animationDelay:i*30+'ms'}}/>)}</div><div className="ex-dashrow">Project pipeline <b>Active</b></div><div className="ex-dashrow">Team capacity <b>Balanced</b></div></div></div>
}
function SystemStudy() {
  return <div className="ex-schematic"><div><CircuitBoard/><b>Signal router</b></div><svg viewBox="0 0 300 145" role="presentation">
    {range(5).map(i=><g key={i}><circle cx="24" cy={15+i*28} r="4"/><path d={`M30 ${15+i*28} H65 L105 72 H145 M156 72 H185 L225 ${15+i*28} H271`}/><rect x="272" y={12+i*28} width="7" height="7"/></g>)}<rect x="123" y="51" width="44" height="44" rx="4"/><text x="145" y="77" textAnchor="middle">API</text>
  </svg><small>INPUT STREAM　 /　 EVENT BUS　 /　 OUTPUT</small></div>
}
function AutomationStudy() {
  return <div className="ex-workflow"><div className="ex-chatheader"><Workflow/><strong>Flow</strong></div>{['Capture enquiry','Qualify request','Route to team'].map((v,i)=><div className="ex-worknode" key={v}>{i===0?<Layers2/>:i===1?<ListFilter/>:<CornerDownRight/>}<span>{v}</span><Check/></div>)}</div>
}

function StudyBackdrop({index}:{index:number}) {
  if(index===2) return <svg className="ex-neural" viewBox="0 0 420 260" preserveAspectRatio="xMidYMid slice">
    {range(6).map(i=><g key={i}><path d={`M0 ${18+i*43} Q90 ${35+i*35} 210 130 T420 ${238-i*42}`}/><circle cx={i%2?22:396} cy={19+i*43} r={3}/></g>)}
  </svg>
  if(index===1) return <div className="ex-booking-ticket"><MapArt/><b>Garden studio</b><small>Session held · 11:30</small></div>
  if(index===3) return <div className="ex-metric"><small>CAPACITY</small><b>Balanced</b><i/><i/><i/></div>
  return null
}

const renderers=[WebStudy, MobileStudy, AIStudy, SaaSStudy, SystemStudy, AutomationStudy]
export default function ProductStudy({index}:{index:number}) {
  const Visual=renderers[index]
  return <div className={`ex-study ex-study-${index}`} aria-hidden="true"><span className="ex-corner ex-corner-t"/><span className="ex-corner ex-corner-b"/><StudyBackdrop index={index}/><div className="ex-study-plane"><Visual/></div><SlidersHorizontal className="ex-register" size={13}/></div>
}
