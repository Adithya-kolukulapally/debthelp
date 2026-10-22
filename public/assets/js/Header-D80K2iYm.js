import{j as e,r as a}from"./vendor-BFl2_GZP.js";import{L as l}from"./vendor-router-Bcikc7cA.js";const o=()=>{const[t,s]=a.useState(!0);return a.useEffect(()=>{const r=()=>{window.scrollY>100?s(!1):s(!0)};return window.addEventListener("scroll",r,{passive:!0}),()=>window.removeEventListener("scroll",r)},[]),t},c=()=>{const t=o();return e.jsx("header",{className:`fixed top-4 left-1/2 -translate-x-1/2 
                 z-50 w-[92%] md:w-[85%] lg:w-[75%] 
                 rounded-full 
                 bg-white/5 backdrop-blur-3xl
                 shadow-lg border border-white/30 
                 transition-transform duration-300 ease-in-out
                 ${t?"translate-y-0":"-translate-y-[150%]"}`,children:e.jsxs("div",{className:"max-w-7xl mx-auto px-6 py-4 flex items-center justify-between",children:[e.jsx(l,{to:"/","aria-label":"Return to Debt Advisors Canada homepage",children:e.jsx("img",{src:"https://ik.imagekit.io/efnhxhh9p/tr:w-224,h-80,q-100/logo_.avif",width:"112",height:"40",alt:"Debt Advisors Canada",className:"h-10 md:h-12"})}),e.jsx("a",{href:"tel:+112892013339",className:`px-4 py-2 rounded-full 
                      bg-blue-600 text-white 
                      text-sm md:text-base lg:text-lg 
                      font-semibold shadow-md 
                      hover:bg-blue-700 transition-colors`,"aria-label":"Call Debt Advisors Canada at 1-289-201-3339",children:"1-289-201-3339"})]})})};export{c as default};
