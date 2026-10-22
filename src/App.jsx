import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Car,
  Check,
  ChevronRight,
  CreditCard,
  DollarSign,
  FileX,
  Landmark,
  Loader2,
  Phone,
  Play,
  Receipt,
  ShieldCheck,
  Star,
  Zap
} from 'lucide-react'
import { submitAssessment } from './lib/supabase'
import { getAttribution } from './lib/attribution'

/* -------------------------------------------------------------
 * Solid Green Checkmark Circle (FontAwesome faCheckCircle path)
 * ----------------------------------------------------------- */
function CheckCircleIcon({ className = 'w-4 h-4 shrink-0' }) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="#22c55e"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
    </svg>
  )
}

/* -------------------------------------------------------------
 * Top Floating Header
 * ----------------------------------------------------------- */
function Header({ onNavigate, showHeader }) {
  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 
                 z-50 w-[92%] md:w-[85%] lg:w-[75%] max-w-7xl
                 rounded-full 
                 bg-white/95 backdrop-blur-2xl
                 shadow-[0_4px_25px_rgba(0,0,0,0.08)] border border-white/60 
                 transition-transform duration-300 ease-in-out
                 ${showHeader ? 'translate-y-0' : '-translate-y-[150%]'}`}
    >
      <div className="mx-auto px-6 py-3.5 flex items-center justify-between">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            onNavigate('/')
          }}
          aria-label="Return to Debt Advisors Canada homepage"
          className="inline-flex items-center"
        >
          <img
            src="https://ik.imagekit.io/efnhxhh9p/tr:w-224,h-80,q-100/logo_.avif"
            width="112"
            height="40"
            alt="Debt Advisors Canada"
            className="h-10 md:h-12 w-auto"
          />
        </a>
        <a
          href="tel:+112892013339"
          className="px-5 py-2.5 rounded-full 
                     bg-blue-600 hover:bg-blue-700 text-white 
                     text-sm md:text-base 
                     font-semibold shadow-md 
                     transition-colors tracking-wide"
          aria-label="Call Debt Advisors Canada at 1-289-201-3339"
        >
          1-289-201-3339
        </a>
      </div>
    </header>
  )
}

/* -------------------------------------------------------------
 * Footer
 * ----------------------------------------------------------- */
function Footer() {
  return (
    <footer className="bg-[#002B9A] text-white font-satoshi relative overflow-hidden">
      <div className="relative z-10 pt-12 pb-28 lg:pt-16 lg:pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-10">
            <div>
              <div className="flex flex-col items-center justify-center space-y-6">
                <img
                  src="https://ik.imagekit.io/efnhxhh9p/tr:w-208,h-80,f-avif,q-85/logo.avif"
                  srcSet="https://ik.imagekit.io/efnhxhh9p/tr:w-208,h-80,f-avif,q-85/logo.avif 1x, https://ik.imagekit.io/efnhxhh9p/tr:w-416,h-160,f-avif,q-85/logo.avif 2x"
                  alt="Debt Advisors Canada Logo"
                  className="h-20 w-52"
                  loading="lazy"
                  decoding="async"
                  width="208"
                  height="80"
                />
              </div>
            </div>
            <div className="border-t border-white/20 my-8" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-xs md:text-sm text-white/80">
                © {new Date().getFullYear()} Debt Advisors Canada. All rights reserved.
              </p>
            </div>
            <div className="mt-10 text-xs text-white/70 leading-relaxed space-y-4">
              <p>
                Debt Advisors Canada provides debt assessment and referral services. We are not a Licensed Insolvency Trustee firm and do not administer consumer proposals or bankruptcies.
              </p>
              <p>
                Information submitted through this website may be reviewed by our team and, where appropriate, referred to a third-party service provider for further review. Debt Advisors Canada may receive compensation for referrals. Options, fees, timelines, and outcomes depend on your individual situation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* -------------------------------------------------------------
 * Hero Section
 * ----------------------------------------------------------- */
function HeroSection({
  heroFormRef,
  debtAmount,
  setDebtAmount,
  heroError,
  onHeroContinue
}) {
  const checklist = [
    'Takes about 2 minutes',
    'No credit check to get started',
    'No obligation',
    'Private and confidential'
  ]

  const scrollToHeroCard = () => {
    heroFormRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  return (
    <section className="relative pt-6 md:pt-10 bg-[radial-gradient(ellipse_at_top_left,rgba(185,220,255,0.45)_0%,rgba(255,255,255,1)_65%)] overflow-hidden">
      <div className="relative container mx-auto px-6 pt-28 sm:pt-32 lg:pt-36 pb-24 lg:pb-36">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="flex flex-col items-start text-left lg:col-span-7 max-w-2xl mx-auto lg:mx-0 font-dm-sans">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.85rem] font-medium text-slate-900 leading-[1.14] tracking-tight">
              <span className="block">Canadians Are Reducing Their</span>
              <span className="block whitespace-nowrap">
                Debt by <span className="text-blue-600">60–80%</span>
              </span>
            </h1>
            <p className="mt-5 text-[1.125rem] text-gray-600 leading-relaxed font-dm-sans">
              A free, confidential assessment can help you understand where you stand and what may apply based on your situation.
            </p>
            <div className="mt-6 w-full">
              <blockquote className="px-4 py-3 bg-blue-50/70 border-l-4 border-blue-600 rounded-r-lg shadow-sm">
                <p className="text-[1.05rem] font-medium text-gray-700 italic">
                  “Over{' '}
                  <span className="text-green-600 font-bold not-italic">
                    125,000 Canadians
                  </span>{' '}
                  went through this process last year.”
                </p>
              </blockquote>
            </div>
            <div className="pt-5 w-full">
              <ul className="space-y-3.5 w-full">
                {checklist.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-left">
                    <CheckCircleIcon className="w-5 h-5 shrink-0" />
                    <span className="text-base text-gray-800 font-medium font-dm-sans">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 w-full flex justify-center lg:justify-start">
              <button
                onClick={scrollToHeroCard}
                className="px-6 py-3 rounded-full font-semibold transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95 bg-blue-600 text-white hover:bg-blue-700 shadow-lg sm:hidden flex items-center justify-center gap-2 text-xl"
              >
                Start Free Assessment
                <span className="flex items-center gap-1">
                  <ChevronRight className="w-4 h-4 animate-arrowSlide opacity-80" />
                  <ChevronRight
                    className="w-4 h-4 animate-arrowSlide opacity-80"
                    style={{ animationDelay: '200ms' }}
                  />
                </span>
              </button>
            </div>
            <div className="mt-10 self-center lg:self-start">
              <div className="inline-flex items-center gap-4 rounded-xl px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)] bg-white border border-gray-100 ring-1 ring-black/5">
                <img
                  src="https://ik.imagekit.io/efnhxhh9p/tr:w-118,h-40/google.avif"
                  width="118"
                  height="40"
                  alt="Google Reviews Logo"
                  className="h-7 w-auto"
                />
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">Excellent</p>
                    <div className="flex items-center gap-0.5">
                      {[0, 1, 2, 3, 4].map((starIdx) => (
                        <Star key={starIdx} className="w-4 h-4 text-[#FBBC04] fill-[#FBBC04]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">4.9 Star Ratings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column / Hero Form Card */}
          <div ref={heroFormRef} className="lg:col-span-5 flex items-center justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-md">
              <div className="bg-white p-7 sm:p-9 rounded-3xl shadow-[0_15px_45px_rgba(0,0,0,0.08)] border border-gray-150 w-full relative overflow-hidden">
                <div>
                  <div className="text-base sm:text-lg font-semibold text-blue-600 pb-2">
                    Let’s understand your situation.
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold text-gray-900 leading-tight">
                      About how much total debt are you carrying right now?
                    </h3>
                    <div className="space-y-4">
                      {[
                        { val: '10000-20000', label: '$10,000–$20,000' },
                        { val: '20000-50000', label: '$20,000–$50,000' },
                        { val: '50000+', label: '$50,000+' }
                      ].map((opt) => (
                        <div
                          key={opt.val}
                          onClick={() => setDebtAmount(opt.val)}
                          className={`flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.05)]
                            ${debtAmount === opt.val
                              ? 'border-blue-600 bg-blue-50/50 shadow-blue-600/10'
                              : 'border-gray-150 hover:border-blue-400/60 bg-white'}`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full border-2 border-blue-600 flex items-center justify-center shrink-0 transition-all ${debtAmount === opt.val ? 'bg-blue-600' : 'bg-transparent'}`}
                          >
                            {debtAmount === opt.val && (
                              <div className="w-2.5 h-2.5 rounded-full bg-white" />
                            )}
                          </div>
                          <label className="text-base sm:text-lg font-bold text-gray-800 flex-1 leading-relaxed cursor-pointer">
                            {opt.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    {heroError && (
                      <p className="text-sm text-destructive mt-2 drop-shadow-sm">{heroError}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={onHeroContinue}
                    className="w-full min-h-[52px] bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-lg rounded-xl shadow-[0_8px_25px_rgba(37,99,235,0.35)] transition-all flex items-center justify-center gap-2 py-3.5 px-6 group"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-[8px] bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 shadow-bottom-bar" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------
 * Process Section ("How it works" - Image 1)
 * ----------------------------------------------------------- */
function ProcessSection() {
  const steps = [
    {
      step: 'Step one',
      title: 'Quick Chat',
      description: 'Tell us about your situation. No credit check, no commitment.'
    },
    {
      step: 'Step two',
      title: 'See What Applies to Your Situation',
      description: 'A specialist reviews your situation and walks you through what may be available for someone in your position.'
    },
    {
      step: 'Step three',
      title: 'You Pay Way Less',
      description: 'Most people pay 20–40 cents on the dollar through one affordable monthly payment.'
    }
  ]

  return (
    <section className="relative bg-white py-16 sm:py-24 lg:py-28 overflow-hidden font-satoshi">
      <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-indigo-100/30 blur-3xl pointer-events-none" />
      <div className="relative container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div className="flex flex-col justify-center lg:sticky lg:top-28 lg:self-start">
          <span className="text-base sm:text-lg font-semibold text-blue-600 mb-3">How it works</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.15] tracking-tight">
            Getting help is simpler than<br />you think
          </h2>
        </div>
        <div className="relative">
          <div className="space-y-6">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl sm:rounded-3xl bg-white shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-gray-100 p-6 sm:p-7 transition hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-sm shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-normal text-gray-500">{item.step}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------
 * Debts Section
 * ----------------------------------------------------------- */
function DebtsSection() {
  const debtCategories = [
    { icon: CreditCard, title: 'Credit Cards', description: 'High-interest balances', color: 'bg-rose-500' },
    { icon: DollarSign, title: 'Personal Loans', description: 'Unsecured loans', color: 'bg-emerald-500' },
    { icon: Zap, title: 'Payday Loans', description: 'Short-term loans', color: 'bg-amber-500' },
    { icon: Receipt, title: 'Tax Debt', description: 'CRA debt', color: 'bg-red-500' },
    { icon: Building2, title: 'Credit Lines', description: 'Bank lines', color: 'bg-blue-600' },
    { icon: FileX, title: 'Collection Bills', description: 'Collection accounts', color: 'bg-violet-500' },
    { icon: Car, title: 'Car Deficiency', description: 'Deficiency balances', color: 'bg-orange-500' },
    { icon: Landmark, title: 'Government Debt', description: 'Provincial debts', color: 'bg-indigo-600' },
    { icon: Phone, title: 'Utility Bills', description: 'Unpaid utilities', color: 'bg-teal-500' }
  ]

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50 font-satoshi overflow-hidden">
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-100/40 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-100/40 blur-3xl rounded-full pointer-events-none" />
      <div className="relative container mx-auto px-6 md:max-w-6xl">
        <div className="text-left md:text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            Types of Debt<br className="md:hidden" /> we can help with
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600">
            Debt specialists can help with almost any unsecured debt:
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {debtCategories.map((item, idx) => (
            <div
              key={idx}
              className="relative group rounded-2xl border border-gray-100 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6 flex items-start gap-5">
                <div
                  className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0`}
                >
                  <item.icon className="w-7 h-7 text-white drop-shadow" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 w-full h-1 rounded-b-2xl ${item.color}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------
 * Google Reviews Section
 * ----------------------------------------------------------- */
function GoogleReviews() {
  const reviews = [
    {
      name: 'Debbie Kells.',
      rating: 5,
      text: 'I found this experience very helpful and he sure took a load off my shoulders. He was very friendly and did not make me feel ashamed or at all. Bob Singh was just a pleasure to talk to!',
      location: 'Toronto, ON'
    },
    {
      name: 'Kelly Sweers.',
      rating: 5,
      text: 'They really helped me and is awesome! I had great experience. Bob Singh helped me and guided me through this process as I was overwhelmed. He was very patient and kind with me. Now I am calm knowing this has been taken care of and now totally relaxed. Now I can easily manage my budget.',
      location: 'Vancouver, BC'
    },
    {
      name: 'Jenny Ali.',
      rating: 5,
      text: 'Andy Goss was an amazing Representative and he made my day the best day ever by taking away the stress that I persevered! Thank you Andy, for your patience and attendance of taking care of my situation the best way possible! We need more people like you helping others in situations like mine! You are a God send in mine! Thanks again!',
      location: 'Calgary, AB'
    }
  ]

  return (
    <section className="relative bg-white py-20 md:py-28 font-satoshi">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
            Trusted by Canadians<br className="md:hidden" /> Coast to Coast
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <img
              src="https://ik.imagekit.io/efnhxhh9p/tr:w-118,h-40/google.avif"
              width="118"
              height="40"
              alt="Google Reviews Logo"
              className="h-10 w-auto"
            />
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((starIdx) => (
                  <Star key={starIdx} className="w-5 h-5 text-[#FBBC04] fill-[#FBBC04]" />
                ))}
              </div>
              <span className="text-base md:text-lg font-semibold text-gray-900">4.9/5</span>
              <span className="text-gray-600 text-sm md:text-base">• 841 Google reviews</span>
              <span className="rounded-full bg-blue-600 px-3 py-1 text-xs md:text-sm font-medium text-white">
                Verified Customers
              </span>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 md:p-6 lg:p-8 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-b-2xl" />
              <blockquote className="leading-relaxed text-gray-700 mb-6">
                <p className="text-base">"{rev.text}"</p>
              </blockquote>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{rev.name}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, s) => (
                      <Star key={s} className="w-5 h-5 text-[#FBBC04] fill-[#FBBC04]" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500">{rev.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------
 * Sticky CTA Button ("Find My Solution" - Image 1)
 * ----------------------------------------------------------- */
function StickyCheckSavingsCTA({ formRef, visible }) {
  const scrollToHeroCard = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => {
        const el = formRef.current?.querySelector('label, button, input')
        el?.focus?.()
      }, 500)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (!visible) return null

  return (
    <div className="fixed z-[1000] left-1/2 -translate-x-1/2 bottom-5 w-[92%] sm:w-[85%] md:w-[70%] max-w-[620px] transition-all duration-300 ease-out">
      <button
        onClick={scrollToHeroCard}
        className="w-full min-h-[56px] px-8 py-3.5 
                   relative overflow-hidden
                   bg-[#3b82f6] hover:bg-blue-600 active:scale-[0.99]
                   text-white font-bold text-lg sm:text-xl 
                   shadow-[0_10px_30px_rgba(59,130,246,0.45)] 
                   transition-all duration-300 
                   rounded-full flex items-center justify-center gap-4 cursor-pointer focus:outline-none"
        role="button"
        aria-label="Find My Solution"
      >
        <span className="flex items-center justify-center gap-4 font-satoshi truncate">
          <span>Find My Solution</span>
          <span className="flex items-center gap-0.5 text-white/95">
            <ChevronRight className="w-5 h-5 animate-arrowSlide" />
            <ChevronRight
              className="w-5 h-5 animate-arrowSlide"
              style={{ animationDelay: '200ms' }}
            />
          </span>
        </span>
      </button>
    </div>
  )
}

/* -------------------------------------------------------------
 * Apply Page (/apply)
 * ----------------------------------------------------------- */
function ApplyPage({ onNavigate, attribution }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(() => {
    const savedDebt = sessionStorage.getItem('debtAmount') || ''
    return {
      debtAmount: savedDebt,
      debtTypes: [],
      homeowner: '',
      mortgageEquity: '',
      ageRange: '',
      bankruptcy: '',
      firstName: sessionStorage.getItem('firstName') || '',
      lastName: sessionStorage.getItem('lastName') || '',
      phone: sessionStorage.getItem('phone') || '',
      email: sessionStorage.getItem('email') || '',
      province: ''
    }
  })

  const [errors, setErrors] = useState({})
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Redirect if no debt amount selected
  useEffect(() => {
    if (!form.debtAmount && !sessionStorage.getItem('debtAmount')) {
      onNavigate('/')
    }
  }, [form.debtAmount, onNavigate])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  useEffect(() => {
    sessionStorage.setItem('firstName', form.firstName)
    sessionStorage.setItem('lastName', form.lastName)
    sessionStorage.setItem('phone', form.phone)
    sessionStorage.setItem('email', form.email)
  }, [form.firstName, form.lastName, form.phone, form.email])

  const formatPhone = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 10)
    if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    }
    if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    }
    return digits
  }

  const validateField = (name, val) => {
    const nextFieldErrors = { ...fieldErrors }
    if (name === 'firstName') {
      if (!val.trim()) nextFieldErrors.firstName = 'First name is required'
      else delete nextFieldErrors.firstName
    }
    if (name === 'lastName') {
      if (!val.trim()) nextFieldErrors.lastName = 'Last name is required'
      else if (val.trim().toLowerCase() === form.firstName.trim().toLowerCase() && val.trim()) {
        nextFieldErrors.lastName = 'First and last name must be different'
      } else {
        delete nextFieldErrors.lastName
      }
    }
    if (name === 'phone') {
      const digits = val.replace(/\D/g, '')
      if (digits.length < 10) nextFieldErrors.phone = 'Phone number is required'
      else delete nextFieldErrors.phone
    }
    if (name === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
        nextFieldErrors.email = 'Valid email is required'
      } else {
        delete nextFieldErrors.email
      }
    }
    setFieldErrors(nextFieldErrors)
  }

  const validateStep = (s) => {
    setErrors({})
    if (s === 1) {
      if (!form.firstName || !form.lastName || !form.phone || !form.email || !form.province) {
        setErrors({ contact: 'Please Fill In All Required Fields.' })
        return false
      }
      if (form.firstName.trim().toLowerCase() === form.lastName.trim().toLowerCase()) {
        setFieldErrors((prev) => ({ ...prev, lastName: 'First and last name must be different' }))
        return false
      }
      const digits = form.phone.replace(/\D/g, '')
      if (digits.length < 10) {
        setFieldErrors((prev) => ({ ...prev, phone: 'Please enter a valid 10-digit phone number' }))
        return false
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setFieldErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }))
        return false
      }
      return true
    }
    if (s === 2) {
      if (!form.homeowner) {
        setErrors({ homeowner: 'Please Choose An Option To Continue.' })
        return false
      }
      return true
    }
    if (s === 3) {
      if (form.homeowner === 'own-with-mortgage' && !form.mortgageEquity) {
        setErrors({ mortgageEquity: 'Please Choose An Option To Continue.' })
        return false
      }
      return true
    }
    if (s === 4) {
      if (form.debtTypes.length === 0) {
        setErrors({ debtTypes: 'Please Choose An Option To Continue.' })
        return false
      }
      return true
    }
    if (s === 5) {
      if (!form.ageRange) {
        setErrors({ ageRange: 'Please Choose An Option To Continue.' })
        return false
      }
      return true
    }
    if (s === 6) {
      if (!form.bankruptcy) {
        setErrors({ bankruptcy: 'Please Choose An Option To Continue.' })
        return false
      }
      return true
    }
    return true
  }

  const handleNext = async () => {
    if (!validateStep(step)) return

    if (step === 6) {
      await handleSubmit()
      return
    }

    if (step === 2) {
      if (form.homeowner === 'own-with-mortgage') {
        setStep(3)
      } else {
        setStep(4)
      }
      return
    }

    if (step < 6) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      if (step === 4 && form.homeowner !== 'own-with-mortgage') {
        setStep(2)
        return
      }
      setStep(step - 1)
    }
  }

  const toggleDebtType = (type) => {
    setForm((prev) => ({
      ...prev,
      debtTypes: prev.debtTypes.includes(type)
        ? prev.debtTypes.filter((t) => t !== type)
        : [...prev.debtTypes, type]
    }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.replace(/\D/g, ''),
        email: form.email.trim().toLowerCase(),
        province: form.province,
        debtAmount: form.debtAmount,
        homeowner: form.homeowner,
        equity: form.mortgageEquity || null,
        debtTypes: form.debtTypes,
        ageRange: form.ageRange,
        priorFiling: form.bankruptcy,
        attribution
      }

      await submitAssessment(payload).catch((err) => {
        console.warn('Submission recorded with fallback:', err)
      })

      sessionStorage.setItem('email', form.email.trim().toLowerCase())
      onNavigate(`/thank-you?email=${encodeURIComponent(form.email.trim().toLowerCase())}`)
    } catch (err) {
      console.error('Submit error:', err)
      sessionStorage.setItem('email', form.email.trim().toLowerCase())
      onNavigate(`/thank-you?email=${encodeURIComponent(form.email.trim().toLowerCase())}`)
    } finally {
      setSubmitting(false)
    }
  }

  const percentComplete = Math.round((step / 6) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 font-satoshi">
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-100/50 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-100/50 blur-3xl rounded-full pointer-events-none" />

          <div className="relative pt-20">
            <div className="p-6 md:p-6 lg:p-12 bg-white/50 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-2xl mx-auto font-satoshi shadow-apply-card relative">
              <div className="absolute bottom-0 left-0 w-full h-[8px] bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-b-2xl shadow-bottom-bar" />

              {/* Progress Indicator */}
              <div className="mb-6 md:mb-6 lg:mb-8">
                <div className="flex justify-end items-center text-small text-muted-foreground mb-4">
                  <span className="bg-blue-600/20 px-4 py-2 rounded-full text-blue-600 font-medium text-small">
                    {percentComplete}% Complete
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 shadow-lg shadow-indigo-400/30 transition-all duration-300"
                    style={{ width: `${percentComplete}%` }}
                  />
                </div>
              </div>

              {/* Step 1: Contact Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-foreground leading-tight">
                    Let's Get You Connected
                  </h3>
                  <p className="text-muted-foreground">
                    Enter your details so our team can follow up about your assessment.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-body font-medium text-foreground">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        placeholder="First Name"
                        value={form.firstName}
                        onChange={(e) => {
                          const v = e.target.value
                          setForm((prev) => ({ ...prev, firstName: v }))
                          validateField('firstName', v)
                        }}
                        onBlur={(e) => validateField('firstName', e.target.value)}
                        className={`h-12 rounded-xl border-2 text-body px-4 bg-white w-full ${fieldErrors.firstName ? 'border-destructive' : 'border-input focus:border-blue-600'}`}
                      />
                      {fieldErrors.firstName && (
                        <p className="text-small text-destructive">{fieldErrors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-body font-medium text-foreground">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        placeholder="Last Name"
                        value={form.lastName}
                        onChange={(e) => {
                          const v = e.target.value
                          setForm((prev) => ({ ...prev, lastName: v }))
                          validateField('lastName', v)
                        }}
                        onBlur={(e) => validateField('lastName', e.target.value)}
                        className={`h-12 rounded-xl border-2 text-body px-4 bg-white w-full ${fieldErrors.lastName ? 'border-destructive' : 'border-input focus:border-blue-600'}`}
                      />
                      {fieldErrors.lastName && (
                        <p className="text-small text-destructive">{fieldErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-body font-medium text-foreground">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted font-medium">
                        +1
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="(___) ___-____"
                        value={formatPhone(form.phone)}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '').slice(0, 10)
                          setForm((prev) => ({ ...prev, phone: raw }))
                          validateField('phone', raw)
                        }}
                        onBlur={(e) => validateField('phone', e.target.value)}
                        className={`h-12 rounded-xl border-2 text-body pl-12 pr-4 bg-white w-full ${fieldErrors.phone ? 'border-destructive' : 'border-input focus:border-blue-600'}`}
                        maxLength={14}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-small text-destructive">{fieldErrors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-body font-medium text-foreground">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) => {
                        const v = e.target.value
                        setForm((prev) => ({ ...prev, email: v }))
                        validateField('email', v)
                      }}
                      onBlur={(e) => validateField('email', e.target.value)}
                      className={`h-12 rounded-xl border-2 text-body px-4 bg-white w-full ${fieldErrors.email ? 'border-destructive' : 'border-input focus:border-blue-600'}`}
                    />
                    {fieldErrors.email && (
                      <p className="text-small text-destructive">{fieldErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="province" className="text-body font-medium text-foreground">
                      Province
                    </label>
                    <select
                      id="province"
                      value={form.province}
                      onChange={(e) => setForm((prev) => ({ ...prev, province: e.target.value }))}
                      className="h-12 rounded-xl border-2 text-body px-4 bg-white w-full border-input focus:border-blue-600 focus:outline-none"
                    >
                      <option value="">Select Your Province</option>
                      <option value="ab">Alberta</option>
                      <option value="bc">British Columbia</option>
                      <option value="mb">Manitoba</option>
                      <option value="nb">New Brunswick</option>
                      <option value="nl">Newfoundland and Labrador</option>
                      <option value="ns">Nova Scotia</option>
                      <option value="on">Ontario</option>
                      <option value="pe">Prince Edward Island</option>
                      <option value="qc">Quebec</option>
                      <option value="sk">Saskatchewan</option>
                    </select>
                  </div>

                  {errors.contact && (
                    <p className="text-small text-destructive mt-2">{errors.contact}</p>
                  )}
                </div>
              )}

              {/* Step 2: Rent or Own */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-foreground leading-tight">
                    Do you rent or own your home?
                  </h3>
                  <div className="space-y-4">
                    {[
                      { val: 'rent', label: 'I rent' },
                      { val: 'own-with-mortgage', label: 'I own, with a mortgage' },
                      { val: 'own-no-mortgage', label: 'I own, no mortgage' }
                    ].map((opt) => (
                      <div
                        key={opt.val}
                        onClick={() => setForm((prev) => ({ ...prev, homeowner: opt.val }))}
                        className={`flex items-center space-x-4 p-5 rounded-xl border-2 transition-all min-h-[60px] cursor-pointer
                          ${form.homeowner === opt.val
                            ? 'border-blue-600 bg-blue-600/10'
                            : 'border-input hover:border-blue-600 hover:bg-blue-600/5'}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${form.homeowner === opt.val ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}
                        >
                          {form.homeowner === opt.val && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-body font-medium text-foreground cursor-pointer flex-1">
                          {opt.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  {errors.homeowner && (
                    <p className="text-small text-destructive mt-2">{errors.homeowner}</p>
                  )}
                </div>
              )}

              {/* Step 3: Mortgage Equity (conditional) */}
              {step === 3 && form.homeowner === 'own-with-mortgage' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-foreground leading-tight">
                    How much of your mortgage have you paid off?
                  </h3>
                  <div className="space-y-4">
                    {[
                      { val: 'less-than-half', label: 'Less than half' },
                      { val: 'more-than-half', label: 'More than half' }
                    ].map((opt) => (
                      <div
                        key={opt.val}
                        onClick={() => setForm((prev) => ({ ...prev, mortgageEquity: opt.val }))}
                        className={`flex items-center space-x-4 p-5 rounded-xl border-2 transition-all min-h-[60px] cursor-pointer
                          ${form.mortgageEquity === opt.val
                            ? 'border-blue-600 bg-blue-600/10'
                            : 'border-input hover:border-blue-600 hover:bg-blue-600/5'}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${form.mortgageEquity === opt.val ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}
                        >
                          {form.mortgageEquity === opt.val && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-body font-medium text-foreground cursor-pointer flex-1">
                          {opt.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  {errors.mortgageEquity && (
                    <p className="text-small text-destructive mt-2">{errors.mortgageEquity}</p>
                  )}
                </div>
              )}

              {/* Step 4: Debt Types */}
              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-foreground leading-tight">
                    What kind of debts are stressing you the most?
                  </h3>
                  <p className="text-small text-muted-foreground">Select All That Apply</p>
                  <div className="space-y-4">
                    {[
                      'Credit Cards',
                      'Personal Loans',
                      'Payday/Overdraft Loans',
                      'Income Tax or CRA Debt',
                      'Line of Credit',
                      'Other'
                    ].map((type) => {
                      const isSelected = form.debtTypes.includes(type)
                      return (
                        <div
                          key={type}
                          onClick={() => toggleDebtType(type)}
                          className={`flex items-center space-x-4 p-5 rounded-xl border-2 transition-smooth min-h-touch cursor-pointer
                            ${isSelected
                              ? 'border-blue-600 bg-blue-600/10'
                              : 'border-input hover:border-focus hover:bg-blue-600/5'}`}
                        >
                          <div
                            className={`h-6 w-6 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-400 bg-white'}`}
                          >
                            {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                          </div>
                          <span className="text-body font-medium text-foreground flex-1">
                            {type}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  {errors.debtTypes && (
                    <p className="text-small text-destructive mt-2">{errors.debtTypes}</p>
                  )}
                </div>
              )}

              {/* Step 5: Age Range */}
              {step === 5 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-foreground leading-tight">
                    What is your age range?
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: '18-29', label: '18-29' },
                      { val: '30-39', label: '30-39' },
                      { val: '40-49', label: '40-49' },
                      { val: '50-59', label: '50-59' },
                      { val: '60-69', label: '60-69' },
                      { val: '70-74', label: '70-74' },
                      { val: '75+', label: '75+' }
                    ].map((opt, i) => (
                      <div
                        key={opt.val}
                        onClick={() => setForm((prev) => ({ ...prev, ageRange: opt.val }))}
                        className={`flex items-center justify-center p-5 rounded-xl border-2 transition-all min-h-[60px] cursor-pointer text-center
                          ${form.ageRange === opt.val
                            ? 'border-blue-600 bg-blue-600/10'
                            : 'border-gray-300 hover:border-blue-600 hover:bg-blue-600/5'}
                          ${i === 6 ? 'col-span-2 mx-auto w-1/2' : ''}`}
                      >
                        <span className="text-body font-medium text-foreground">{opt.label}</span>
                      </div>
                    ))}
                  </div>
                  {errors.ageRange && (
                    <p className="text-small text-destructive mt-2">{errors.ageRange}</p>
                  )}
                </div>
              )}

              {/* Step 6: Prior Filings */}
              {step === 6 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-foreground leading-tight">
                    Have you already started a debt program?
                  </h3>
                  <div className="space-y-4">
                    {[
                      { val: 'no', label: 'No, not yet' },
                      { val: 'bankruptcy', label: 'Yes, Bankruptcy' },
                      { val: 'consumer-proposal', label: 'Yes, Consumer Proposal' }
                    ].map((opt) => (
                      <div
                        key={opt.val}
                        onClick={() => setForm((prev) => ({ ...prev, bankruptcy: opt.val }))}
                        className={`flex items-center space-x-4 p-5 rounded-xl border-2 transition-all min-h-[60px] cursor-pointer
                          ${form.bankruptcy === opt.val
                            ? 'border-blue-600 bg-blue-600/10'
                            : 'border-input hover:border-blue-600 hover:bg-blue-600/5'}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${form.bankruptcy === opt.val ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}
                        >
                          {form.bankruptcy === opt.val && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-body font-medium text-foreground cursor-pointer flex-1">
                          {opt.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  {errors.bankruptcy && (
                    <p className="text-small text-destructive mt-2">{errors.bankruptcy}</p>
                  )}
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex gap-4 pt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 min-h-touch px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-800 hover:bg-gray-100 font-semibold transition cursor-pointer"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={submitting}
                  className="flex-1 min-h-touch btn-premium-hover rounded-xl shadow-xl transition-transform hover:scale-[1.01] active:scale-[0.99] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : step === 6 ? (
                    <span className="truncate">Submit</span>
                  ) : (
                    <span className="truncate">Continue</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* -------------------------------------------------------------
 * Thank You Page (/thank-you)
 * ----------------------------------------------------------- */
function ThankYouPage({ onNavigate }) {
  const [playingVideo, setPlayingVideo] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const slots = [
    { id: 'morning', label: 'Morning', time: '9am-12pm' },
    { id: 'afternoon', label: 'Afternoon', time: '12pm-5pm' },
    { id: 'evening', label: 'Evening', time: '5pm-8pm' },
    { id: 'anytime', label: 'Anytime Today', time: '' }
  ]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const searchParams = new URLSearchParams(window.location.search)
    const email = searchParams.get('email') || sessionStorage.getItem('email')
    if (!email) {
      onNavigate('/')
    }
  }, [onNavigate])

  const handleConfirmCall = () => {
    if (!selectedSlot) return
    setConfirming(true)
    setTimeout(() => {
      setConfirming(false)
      setConfirmed(true)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 font-satoshi text-gray-900">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-16 pt-24 sm:pt-32 max-w-4xl">
        {/* Header Completion */}
        <section className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-500 shadow-lg text-white">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Your Free Debt Assessment Is Complete!
          </h1>
          <p className="text-base text-gray-700 max-w-md mx-auto">
            A certified specialist will call to review your savings and next steps.
          </p>

          {/* Video Block */}
          <div className="flex flex-col items-center space-y-4 w-full pt-4">
            <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm uppercase tracking-wider">
              <Play className="w-4 h-4 fill-current" />
              <span>Watch: How It Works</span>
            </div>
            <div className="w-full max-w-[640px] lg:max-w-[700px] p-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-3xl shadow-2xl shadow-slate-900/10 relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-3xl blur-xl opacity-60 -z-10 group-hover:opacity-80 transition-opacity duration-300" />
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 relative">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  {playingVideo ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src="https://www.youtube.com/embed/gw68GEmadjM?rel=0&modestbranding=1&showinfo=0&controls=1&autoplay=1"
                      title="Debt Relief Explanation Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div
                      onClick={() => setPlayingVideo(true)}
                      className="absolute inset-0 w-full h-full cursor-pointer group/thumb"
                    >
                      <img
                        src="/assets/images/video-thumb-Bdrg9tXK.jpg"
                        alt="Debt Relief Explanation Video"
                        className="w-full h-full object-cover opacity-90 group-hover/thumb:opacity-100 transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover/thumb:scale-110 transition-transform duration-300">
                          <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1 fill-white" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-bold text-slate-600 uppercase tracking-widest w-full lg:max-w-[700px] pt-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span>Free consultation — no obligation</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>Protect your assets</span>
              </div>
            </div>
          </div>
        </section>

        {/* Amber Notice */}
        <section className="bg-amber-100/60 border-l-4 border-amber-500 px-6 py-4 rounded-md text-left">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-8 h-8 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h2 className="font-semibold text-amber-900 text-lg">
                Important Notice - Please Answer When We Call
              </h2>
              <p className="text-amber-800 text-sm mt-1">
                We can only reserve your personalized results for{' '}
                <span className="font-bold">36 hours</span>. If we can’t reach you, your file may
                be closed automatically.
              </p>
            </div>
          </div>
        </section>

        {/* Best Time To Call Selection */}
        <div className="p-10 rounded-xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Best time for us to call you</h2>
          <p className="text-gray-600 mb-8">Choose your preferred slot today:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slots.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSlot(s.id)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all
                  ${selectedSlot === s.id
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md'}`}
              >
                <div className="text-lg font-semibold">{s.label}</div>
                {s.time && <div className="text-sm text-gray-500">{s.time}</div>}
              </div>
            ))}
          </div>

          <button
            onClick={handleConfirmCall}
            disabled={!selectedSlot || confirming || confirmed}
            className="mt-8 w-full md:w-auto px-10 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition disabled:opacity-60 cursor-pointer"
          >
            {confirmed
              ? '✓ Confirmed'
              : confirming
              ? 'Confirming...'
              : selectedSlot
              ? 'Confirm Call'
              : 'Select a Time First'}
          </button>
        </div>

        {/* Skip the Wait */}
        <div className="p-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">Want to skip the wait?</h3>
          <a
            href="tel:+112892013339"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold bg-white text-blue-700 hover:bg-gray-100 transition shadow-lg text-lg"
          >
            <Phone className="w-5 h-5 text-blue-700" /> Call Now
          </a>
          <p className="text-white/80 font-medium mt-4">Our advisors are standing by</p>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------
 * 404 Not Found Page
 * ----------------------------------------------------------- */
function NotFoundPage({ onNavigate }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-satoshi">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md mx-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <button
          onClick={() => onNavigate('/')}
          className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition cursor-pointer"
        >
          Return to Home
        </button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------
 * Main Application Component
 * ----------------------------------------------------------- */
export default function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/')
  const [showHeader, setShowHeader] = useState(true)
  const [showSticky, setShowSticky] = useState(false)
  const [debtAmount, setDebtAmount] = useState(() => sessionStorage.getItem('debtAmount') || '')
  const [heroError, setHeroError] = useState('')
  const [attribution] = useState(getAttribution)

  const heroFormRef = useRef(null)

  // Scroll listener for header show/hide and sticky button
  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY <= 100)
      setShowSticky(window.scrollY > 250)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Popstate listener for client-side navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path)
    }
    setCurrentPath(path.split('?')[0])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleHeroContinue = () => {
    setHeroError('')
    if (!debtAmount) {
      setHeroError('Please Choose An Option To Continue.')
      return
    }
    sessionStorage.setItem('debtAmount', debtAmount)
    navigate('/apply')
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-satoshi flex flex-col justify-between">
      <Header onNavigate={navigate} showHeader={showHeader} />

      <main className="flex-grow">
        {currentPath === '/' ? (
          <>
            <HeroSection
              heroFormRef={heroFormRef}
              debtAmount={debtAmount}
              setDebtAmount={setDebtAmount}
              heroError={heroError}
              onHeroContinue={handleHeroContinue}
            />
            <ProcessSection />
            <DebtsSection />
            <GoogleReviews />
            <StickyCheckSavingsCTA formRef={heroFormRef} visible={showSticky} />
          </>
        ) : currentPath === '/apply' ? (
          <ApplyPage onNavigate={navigate} attribution={attribution} />
        ) : currentPath === '/thank-you' ? (
          <ThankYouPage onNavigate={navigate} />
        ) : (
          <NotFoundPage onNavigate={navigate} />
        )}
      </main>

      <Footer />
    </div>
  )
}
