import { useEffect, useState } from 'react'
import {  ArrowDown, ArrowLeft, ArrowRight, Check, CheckCircle2, Building2, Car, ChevronDown, Clock3, CreditCard, DollarSign, FileX2, HeartHandshake, Landmark, LockKeyhole, Menu, ShieldCheck, Sparkles, Phone, Receipt, X, Zap  } from 'lucide-react'
import { submitAssessment } from './lib/supabase'
import { getAttribution } from './lib/attribution'

const provinces = ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador','Nova Scotia','Ontario','Prince Edward Island','Quebec','Saskatchewan']
const debtKinds = ['Credit cards','Personal loans','Payday loans','CRA / tax debt','Lines of credit','Government debt','Other unsecured debt']
const initial = { debtAmount:'', firstName:'', lastName:'', email:'', phone:'', province:'', homeowner:'', equity:'', debtTypes:[], ageRange:'', priorFiling:'' }

function App() {
  const [page, setPage] = useState(window.location.pathname === '/assessment' ? 'assessment' : 'home')
  const [form, setForm] = useState(initial)
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [complete, setComplete] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [attribution] = useState(getAttribution)
  const update = (key, value) => setForm(current => ({ ...current, [key]: value }))
  const navigate = target => {
    const path = target === 'assessment' ? '/assessment' : '/'
    if (window.location.pathname !== path) window.history.pushState({}, '', path)
    setPage(target)
    setMobileMenu(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  useEffect(() => {
    const onPopState = () => setPage(window.location.pathname === '/assessment' ? 'assessment' : 'home')
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])
  useEffect(() => {
    if (page !== 'home') return
    const revealSections = [...document.querySelectorAll('.debt-types-section, .process')]
    if (!revealSections.length || !('IntersectionObserver' in window)) return
    revealSections.forEach(section => section.classList.add('reveal-enabled'))
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14 })
    revealSections.forEach(section => {
      section.querySelectorAll('.debt-types-heading, .debt-type-card, .section-intro, .step-card').forEach(element => revealObserver.observe(element))
    })
    return () => {
      revealObserver.disconnect()
      revealSections.forEach(section => section.classList.remove('reveal-enabled'))
    }
  }, [page])
  const scrollToForm = () => navigate('assessment')
  const next = () => {
    setError('')
    const checks = [() => form.debtAmount, () => form.firstName && form.lastName && form.email && form.phone && form.province, () => form.homeowner && (!['Yes','Not sure'].includes(form.homeowner) || form.equity), () => form.debtTypes.length && form.ageRange && form.priorFiling]
    if (!checks[step]()) { setError('Please complete each field to continue.'); return }
    if (step < 3) setStep(step + 1)
  }
  const send = async () => {
    setError('')
    if (!form.debtTypes.length || !form.ageRange || !form.priorFiling) { setError('Please complete each field to continue.'); return }
    setSending(true)
    try { await submitAssessment({ ...form, attribution }); setComplete(true) }
    catch (e) { setError(e.message || 'Something went wrong. Please try again.') }
    finally { setSending(false) }
  }
  const choose = (key, value) => <button type="button" onClick={() => update(key, value)} className={`choice ${form[key] === value ? 'selected' : ''}`}><span>{value}</span><span className="choice-mark">{form[key] === value && <Check size={15}/>}</span></button>
  const input = (label, key, type='text', placeholder='') => <label className="field"><span>{label}</span><input type={type} placeholder={placeholder} value={form[key]} onChange={e => update(key,e.target.value)} /></label>
  const formCard = <div className="form-card" id="assessment">
    {complete ? <div className="success"><span className="success-icon"><CheckCircle2 size={30}/></span><span className="eyebrow">ASSESSMENT RECEIVED</span><h3>You’ve taken a thoughtful first step.</h3><p>A member of our team will review your information and reach out soon to talk through what may be available.</p><button className="button button-light" onClick={() => {setComplete(false);setStep(0);setForm(initial)}}>Start a new assessment <ArrowRight size={17}/></button></div> : <>
      <div className="form-top"><div><span className="eyebrow">YOUR FREE ASSESSMENT</span><h3>{['Let’s start with the big picture.','How can we reach you?','A little more about your situation.','You’re nearly there.'][step]}</h3></div><span className="step-count">0{step+1}<i> / 04</i></span></div>
      <div className="progress"><span style={{width:`${(step+1)*25}%`}}/></div>
      <div className="form-body">
      {step===0 && <><p className="question">About how much unsecured debt are you carrying?</p><p className="helper">An estimate is all we need to get started.</p><div className="options">{['$10,000 – $20,000','$20,000 – $50,000','$50,000+'].map((v,i)=>choose('debtAmount',['10000-20000','20000-50000','50000+'][i]))}</div></>}
      {step===1 && <><p className="question">Your details, kept confidential.</p><p className="helper">We’ll use these details to follow up about your assessment.</p><div className="field-grid">{input('First name','firstName','text','First name')}{input('Last name','lastName','text','Last name')}{input('Email address','email','email','you@example.com')}{input('Phone number','phone','tel','(555) 555-5555')}<label className="field full"><span>Province or territory</span><select value={form.province} onChange={e=>update('province',e.target.value)}><option value="">Select your province</option>{provinces.map(x=><option key={x}>{x}</option>)}</select></label></div><label className="consent"><input type="checkbox" defaultChecked/><span>I agree to be contacted about my assessment. Your information is handled with care.</span></label></>}
      {step===2 && <><p className="question">Do you own a home?</p><p className="helper">This helps us understand which options may fit your situation.</p><div className="options options-row">{['Yes','No','Not sure'].map(v=>choose('homeowner',v))}</div>{['Yes','Not sure'].includes(form.homeowner) && <div className="subquestion"><p className="question">About how much equity do you have?</p><div className="options options-row">{['Under $50,000','$50,000 or more','Not sure'].map(v=>choose('equity',v))}</div></div>}</>}
      {step===3 && <><p className="question">What kinds of debt are you dealing with?</p><p className="helper">Select all that apply.</p><div className="debt-options">{debtKinds.map(v=><button className={`debt-chip ${form.debtTypes.includes(v)?'selected':''}`} onClick={()=>update('debtTypes',form.debtTypes.includes(v)?form.debtTypes.filter(x=>x!==v):[...form.debtTypes,v])} key={v}><span className="choice-mark">{form.debtTypes.includes(v)&&<Check size={14}/>}</span>{v}</button>)}</div><div className="field-grid compact"><label className="field"><span>Your age range</span><select value={form.ageRange} onChange={e=>update('ageRange',e.target.value)}><option value="">Select age range</option>{['18–29','30–39','40–49','50–59','60+'].map(x=><option key={x}>{x}</option>)}</select></label><label className="field"><span>Have you filed before?</span><select value={form.priorFiling} onChange={e=>update('priorFiling',e.target.value)}><option value="">Select an option</option>{['No','Yes, consumer proposal','Yes, bankruptcy','Not sure'].map(x=><option key={x}>{x}</option>)}</select></label></div><p className="privacy-note"><LockKeyhole size={14}/> Your information stays private and secure.</p></>}
      {error && <p className="error" role="alert">{error}</p>}
      </div>
      <div className="form-actions">{step>0&&<button className="back-button" onClick={()=>{setError('');setStep(step-1)}}><ArrowLeft size={16}/> Back</button>}<button className="button button-primary" onClick={step===3?send:next} disabled={sending}>{sending?'Sending…':step===3?'Get my free assessment':'Continue'}{!sending&&<ArrowRight size={17}/>}</button></div>
      <div className="form-foot"><LockKeyhole size={14}/> Private & confidential <span/> No obligation</div>
    </>}
  </div>

  return <div className={`site-shell ${page === 'home' ? 'with-sticky-solution' : ''}`}>
    <div className="announcement"><span className="live-dot"/> A clearer path forward starts with a conversation <span className="announcement-right">Free, confidential assessment <ArrowRight size={13}/></span></div>
    <header className="header"><a className="brand" href="/" onClick={e=>{e.preventDefault();navigate('home')}}><span className="brand-mark"><HeartHandshake size={22}/></span><span>debt<span className="brand-light">advisors</span><small>CANADA</small></span></a><nav className={mobileMenu?'nav open':'nav'}><a href="/" onClick={e=>{e.preventDefault();navigate('home')}}>Home</a><a href="/#how-it-works" onClick={e=>{e.preventDefault();navigate('home');setTimeout(()=>document.getElementById('how-it-works')?.scrollIntoView({behavior:'smooth'}),80)}}>How it works</a><a href="/#options" onClick={e=>{e.preventDefault();navigate('home');setTimeout(()=>document.getElementById('options')?.scrollIntoView({behavior:'smooth'}),80)}}>Debt options</a><a href="/#faq" onClick={e=>{e.preventDefault();navigate('home');setTimeout(()=>document.getElementById('faq')?.scrollIntoView({behavior:'smooth'}),80)}}>FAQs</a><a href="/assessment" onClick={e=>{e.preventDefault();navigate('assessment')}}>Assessment</a></nav><div className="header-right"><a className="phone-link" href="tel:+12892013339">1 (289) 201-3339</a></div><button className="menu-button" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu?<X/>:<Menu/>}</button></header>
    <main id="top">
      {page === 'assessment' ? <section className="assessment-page"><div className="assessment-intro"><span className="eyebrow">A PRIVATE, NO OBLIGATION FIRST STEP</span><h1>Let's understand your options.</h1><p>Answer a few questions about your situation. It takes about two minutes, and your information stays confidential.</p><div className="assessment-benefits"><span><ShieldCheck size={17}/> No credit check</span><span><LockKeyhole size={17}/> Private and confidential</span><span><Clock3 size={17}/> About two minutes</span></div></div><div className="assessment-form-wrap">{formCard}</div></section> : <>
      <section className="hero"><div className="hero-glow"/><div className="hero-inner"><div className="hero-copy"><div className="eyebrow hero-eyebrow"><span className="eyebrow-line"/> DEBT HELP, MADE HUMAN</div><h1>Make space for<br/>a <em>fresh start.</em></h1><p className="hero-desc">Debt can feel like a lot to carry alone. Let’s look at your situation together and find a way forward that feels right for you.</p><div className="hero-ctas"><button className="button button-primary" onClick={scrollToForm}>Explore my options <ArrowRight size={17}/></button><a className="text-link" href="#how-it-works"><span className="play">↓</span> See how it works</a></div><div className="trust-row"><span className="trust-item"><ShieldCheck size={17}/> No credit check</span><i/><span className="trust-item"><Clock3 size={17}/> Takes 2 minutes</span><i/><span className="trust-item"><LockKeyhole size={16}/> 100% confidential</span></div></div>
        <div className="home-summary"><span className="summary-label">A SIMPLE PLACE TO BEGIN</span><h2>Clear guidance, at your pace.</h2><p>Start with a free assessment. A member of our team will review your situation and help you understand what may be available.</p><div className="summary-rule"/><div className="summary-points"><span><b>01</b> Tell us what's going on</span><span><b>02</b> Get a clearer picture</span><span><b>03</b> Choose your next step</span></div></div>
      </div><div className="hero-bottom"><span>HERE WHEN YOU’RE READY</span><a href="#how-it-works">Scroll to learn more <ArrowDown size={14}/></a><span className="hero-bottom-right">SERVING CANADIANS NATIONWIDE</span></div></section>
      <section className="proof-strip"><div className="proof-label">A LITTLE REASSURANCE</div><div><b>Private by design</b><span>Your story stays yours.</span></div><div><b>People-first guidance</b><span>Real conversations, no pressure.</span></div><div><b>Options that fit you</b><span>Because no two situations are alike.</span></div><div className="proof-sign"><span>Start with a conversation</span><small>Understand your options at your pace</small></div></section>
      <section className="section process" id="how-it-works"><div className="section-intro"><span className="eyebrow">A SIMPLE PLACE TO BEGIN</span><h2>One step at a time.<br/><em>At your pace.</em></h2><p>You don’t need to have it all figured out. We’ll help you understand what comes next, without judgment or pressure.</p><button className="button button-dark" onClick={scrollToForm}>Start with a conversation <ArrowRight size={16}/></button></div><div className="steps"><article className="step-card"><div className="step-top"><span>01</span><span className="step-icon"><HeartHandshake size={20}/></span></div><h3>Tell us what’s going on</h3><p>A few simple questions help us understand the full picture. It takes about two minutes.</p><span className="step-tag">NO CREDIT CHECK · NO OBLIGATION</span></article><article className="step-card step-highlight"><div className="step-top"><span>02</span><span className="step-icon"><Sparkles size={20}/></span></div><h3>Get a clearer picture</h3><p>A real person reviews your situation and explains the options that may be available to you.</p><span className="step-tag">CLEAR ANSWERS, AT YOUR PACE</span></article><article className="step-card"><div className="step-top"><span>03</span><span className="step-icon"><ArrowRight size={20}/></span></div><h3>Choose your next step</h3><p>If you decide to move forward, we’ll help connect you with the right support for your needs.</p><span className="step-tag">YOU’RE ALWAYS IN CONTROL</span></article></div></section>
      <section className="debt-types-section" id="options"><div className="debt-types-heading"><h2>Types of Debt we can help with</h2><p>Debt specialists can help with almost any unsecured debt:</p></div><div className="debt-types-grid">{[
        ['Credit Cards','High-interest balances',CreditCard,'rose'],['Personal Loans','Unsecured loans',DollarSign,'emerald'],['Payday Loans','Short-term loans',Zap,'amber'],['Tax Debt','CRA debt',Receipt,'red'],['Credit Lines','Bank lines',Building2,'blue'],['Collection Bills','Collection accounts',FileX2,'violet'],['Car Deficiency','Deficiency balances',Car,'orange'],['Government Debt','Provincial debts',Landmark,'indigo'],['Utility Bills','Unpaid utilities',Phone,'teal']
      ].map(([title,description,Icon,tone])=><article className={`debt-type-card ${tone}`} key={title}><span className={`debt-type-icon ${tone}`}><Icon size={27}/></span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>
      <section className="quote-section" id="about"><div className="quote-mark">“</div><div><span className="eyebrow">A HUMAN APPROACH TO DEBT</span><h2>You deserve to understand your options <em>without feeling judged.</em></h2><p>Debt Advisors Canada helps Canadians make sense of their debt situation and explore what may be available. Every conversation starts with listening.</p></div><div className="quote-side"><span className="quote-seal"><HeartHandshake size={27}/></span><b>Here to help.<br/>Here to listen.</b><span>CANADIAN DEBT SUPPORT</span></div></section>
      <section className="faq-section" id="faq"><div className="faq-heading"><span className="eyebrow">GOOD QUESTIONS</span><h2>Before we talk.</h2><p>A few things you might be wondering.</p><button className="text-link" onClick={scrollToForm}>Still have questions? Talk to us <ArrowRight size={15}/></button></div><div className="faqs">{[['Does completing an assessment affect my credit score?','No. Starting an assessment does not require a credit check and does not affect your credit score.'],['Is there any cost or obligation?','No. Your assessment is free, confidential, and there is no obligation to move forward.'],['What happens after I submit my information?','A member of our team reviews what you shared and may contact you to discuss possible next steps. You decide what feels right.'],['Will I qualify for a debt solution?','Every situation is different. An assessment can help identify options that may be available, but eligibility depends on your individual circumstances.'],['Are you a Licensed Insolvency Trustee?','Debt Advisors Canada provides debt assessment and referral services. We are not a Licensed Insolvency Trustee firm and do not administer consumer proposals or bankruptcies.']].map(([q,a])=><details className="faq" key={q}><summary>{q}<ChevronDown size={18}/></summary><p>{a}</p></details>)}</div></section>
      <section className="last-cta"><div><span className="eyebrow">WHEN YOU’RE READY</span><h2>A little clarity can<br/><em>change a lot.</em></h2></div><div><p>Start with a few questions. We’ll take it from there, together.</p><button className="button button-light" onClick={scrollToForm}>Get my free assessment <ArrowRight size={17}/></button></div><span className="cta-decoration">D</span></section>
      </>}
    </main>
    {page === 'home' && <div className="sticky-solution-wrap"><button className="sticky-solution" onClick={scrollToForm}><span>Find My Solution</span> <ArrowRight size={22}/></button></div>}
    <footer className="footer"><div className="footer-main"><a className="brand footer-brand" href="#top"><span className="brand-mark"><HeartHandshake size={22}/></span><span>debt<span className="brand-light">advisors</span><small>CANADA</small></span></a><p>Helping Canadians understand their debt options, one conversation at a time.</p><div className="footer-links"><a href="#how-it-works">How it works</a><a href="#options">Debt options</a><a href="#faq">FAQs</a><a href="tel:+12892013339">Contact</a></div><a className="footer-phone" href="tel:+12892013339">1 (289) 201-3339 <ArrowRight size={15}/></a></div><div className="footer-disclosure">Debt Advisors Canada provides debt assessment and referral services. We are not a Licensed Insolvency Trustee firm and do not administer consumer proposals or bankruptcies. Information submitted may be reviewed by our team and, where appropriate, referred to a third-party service provider. Debt Advisors Canada may receive compensation for referrals. Options, fees, timelines, and outcomes depend on your individual situation.</div><div className="footer-bottom"><span>© {new Date().getFullYear()} Debt Advisors Canada. All rights reserved.</span><span>Made with care in Canada <span className="canada-dot">●</span></span><div><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div></div></footer>
  </div>
}

export default App
