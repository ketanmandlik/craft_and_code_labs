import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ArrowUp, Braces, Database, Layers, Workflow } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { config } from '../../config/site'
import '../../styles/editorial.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const stages = [
  ['Discover', 'Understand the business, audience and project objectives.'],
  ['Craft', 'Design intuitive, premium digital experiences.'],
  ['Engineer', 'Develop reliable, secure and scalable technology.'],
  ['Launch', 'Deliver, optimize and support the product.'],
]

const layers = [
  { title: 'Interfaces', icon: Layers, tools: ['React', 'React Native', 'Next.js', 'TypeScript'] },
  { title: 'Architecture', icon: Braces, tools: ['Node.js', 'NestJS', 'Docker'] },
  { title: 'Data systems', icon: Database, tools: ['PostgreSQL', 'MongoDB'] },
  { title: 'Intelligence', icon: Workflow, tools: ['Google Gemini', 'OpenAI'] },
]

const values = ['Thoughtful design', 'Reliable engineering', 'Transparent collaboration', 'Business-focused solutions']

function sectionNumber(index: number) {
  return String(index + 1).padStart(2, '0')
}

function Study({ phase, edition = false }: { phase: number; edition?: boolean }) {
  return <img key={phase} className="ed-study ed-model" width="400" height="350"
    src={`/assets/studies/contour-${phase}.svg`} loading="lazy"
    alt={edition ? 'A twisted column of engraved contours' : stages[phase][0] + ' construction study'}/>
}

const marks: Record<string, string> = {
  'React': 'react', 'React Native': 'react', 'Next.js': 'nextdotjs', 'TypeScript': 'typescript',
  'Node.js': 'nodedotjs', 'NestJS': 'nestjs', 'Docker': 'docker', 'PostgreSQL': 'postgresql',
  'MongoDB': 'mongodb', 'Google Gemini': 'googlegemini',
}

function KineticTransition() {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const track = root.current!.firstElementChild
      gsap.fromTo(track, { xPercent: -13 }, { xPercent: -30, ease: 'none', scrollTrigger: {
        trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.6,
        onUpdate: self => gsap.to(track, { skewX: gsap.utils.clamp(-3, 3, self.getVelocity() / -1200), duration: 0.3, overwrite: 'auto' }),
      } })
    })
    return () => media.revert()
  }, { scope: root })
  return <div className="ed-kinetic" role="img" aria-label="Design × Technology × Innovation" ref={root}>
    <div aria-hidden="true">{[0,1].map(n => <span key={n}>DESIGN <b>×</b> <i>TECHNOLOGY</i> <b>×</b> INNOVATION <b>×</b> </span>)}</div>
  </div>
}

function Process() {
  const root = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState(0)
  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      root.current!.querySelectorAll('.ed-step').forEach(step => {
        gsap.from(step.querySelectorAll('h3,p'), {
          y: 12, clipPath: 'inset(0 0 85% 0)', duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: step, start: 'top 91%', once: true },
        })
      })
    })
    return () => media.revert()
  }, { scope: root })
  useEffect(() => {
    const nodes = Array.from(root.current!.querySelectorAll<HTMLElement>('.ed-step'))
    const observer = new IntersectionObserver(entries => {
      const inRange = entries.filter(entry => entry.isIntersecting)
      if (inRange.length) setPhase(nodes.indexOf(inRange[0].target as HTMLElement))
    }, { rootMargin: '-25% 0px -49% 0px' })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])
  return <section id="process" data-phase={phase} className="ed-process ed-section" ref={root}>
    <div className="ed-kicker"><span>07 / PROCESS</span><span>METHOD OF WORK</span></div>
    <h2 className="ed-title">FROM WHAT IF<br/>TO WHAT'S NEXT.</h2>
    <div className="ed-process-layout">
      <figure className="ed-plate">
        <figcaption><span>CONSTRUCTION STUDY</span><span>{sectionNumber(phase)} / 04</span></figcaption>
        <Study phase={phase}/>
        <div className="ed-plate-footer"><span>{stages[phase][0]}</span><i style={{transform: `scaleX(${(phase+1)/4})`}}/></div>
      </figure>
      <ol className="ed-steps">
        {stages.map(([name, copy], index) => <li data-phase={index} className={'ed-step' + (phase === index ? ' is-current' : '')} key={name}>
          <span className="ed-index">{sectionNumber(index)}</span><div><h3>{name}</h3><p>{copy}</p></div>
        </li>)}
      </ol>
    </div>
  </section>
}

function Technology() {
  return <section className="ed-tech ed-section" aria-labelledby="ed-tech-title">
    <div className="ed-kicker"><span>08 / TECHNOLOGY</span><span>ENGINEERING STACK</span></div>
    <h2 className="ed-title" id="ed-tech-title">POWERED BY<br/>MODERN ENGINEERING.</h2>
    <div className="ed-stack">{layers.map(({title, icon: Icon, tools}) => <div className="ed-layer" key={title}>
      <h3><Icon aria-hidden="true" size={17}/>{title}</h3>
      <ul>{tools.map(tool => <li key={tool}>{marks[tool] && <svg aria-hidden="true" data-mark={marks[tool]}><use href={`/assets/studies/technology.svg#${marks[tool]}`}/></svg>}{tool}</li>)}</ul>
    </div>)}</div>
  </section>
}

function About() {
  return <section id="about" className="ed-about ed-section">
    <div className="ed-kicker"><span>09 / ABOUT THE STUDIO</span><span>CRAFT AND CODE LABS</span></div>
    <div className="ed-about-layout">
      <div><h2 className="ed-title">CREATIVE<br/>BY NATURE.<br/><em>TECHNICAL<br/>BY DESIGN.</em></h2>
      <p>Craft and Code Labs brings design and engineering together to build digital solutions that make a difference. We believe technology should simplify complexity, empower businesses and create meaningful experiences.</p><p>We build the interfaces people use and the systems behind them, from mobile apps and SaaS platforms to APIs, integrations and AI-assisted workflows.</p></div>
      <div className="ed-about-aside"><Study phase={4} edition/><ul>{values.map(value => <li key={value}><span aria-hidden="true">+</span>{value}</li>)}</ul></div>
    </div>
  </section>
}

type EditorialProps = { onContact: () => void; onChat: () => void }

export default function Editorial({ onContact, onChat }: EditorialProps) {
  const contact = useRef<HTMLElement>(null)
  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.ed-contact-mark', { yPercent: 18, rotation: -7, ease: 'none', scrollTrigger: {
        trigger: contact.current, start: 'top bottom', end: 'center center', scrub: 0.7,
      } })
    })
    return () => media.revert()
  }, { scope: contact })
  const instagram = config.instagram
  const linkedin = config.linkedin
  return <div className="ed-content"><KineticTransition/><Process/><Technology/><About/>
    <section ref={contact} id="contact" className="ed-contact ed-section" onPointerMove={event => {
      if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const bounds = event.currentTarget.getBoundingClientRect()
      event.currentTarget.style.setProperty('--light-x', (event.clientX - bounds.left) + 'px')
      event.currentTarget.style.setProperty('--light-y', (event.clientY - bounds.top) + 'px')
    }}>
      <div className="ed-kicker"><span>10 / CONTACT</span><span>START A CONVERSATION</span></div>
      <div className="ed-contact-body">
        <img className="ed-contact-mark" src="/assets/monogram.svg" alt="" loading="lazy" width="420" height="420"/>
        <h2>LET'S MAKE<br/>SOMETHING<br/><em>EXTRAORDINARY.</em></h2>
        <div className="ed-actions"><button className="ed-primary" onClick={onContact}>TELL US YOUR IDEA <ArrowUpRight size={17}/></button><button className="ed-secondary" onClick={onChat}>CHAT ON WHATSAPP <ArrowUpRight size={15}/></button></div>
      </div>
      <footer className="ed-footer"><span>© {new Date().getFullYear()} Craft and Code Labs</span><div>{instagram && <a href={instagram}>Instagram</a>}{linkedin && <a href={linkedin}>LinkedIn</a>}<a href="#home">BACK TO TOP <ArrowUp size={14}/></a></div></footer>
    </section>
  </div>
}
