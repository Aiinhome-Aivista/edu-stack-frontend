import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Check, ArrowLeft, Star, ShieldCheck, ChevronDown, Zap, Globe, MessageCircle } from 'lucide-react';

export default function PricingPage() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    { 
      title: 'Starter', 
      monthlyPrice: '$49', 
      annualPrice: '$39',
      desc: 'Perfect for small tutorial centers.', 
      features: ['Up to 50 Students', 'Core LMS', 'Manual Grading', 'Email Support', 'Basic Analytics'] 
    },
    { 
      title: 'Professional', 
      monthlyPrice: '$199', 
      annualPrice: '$159',
      desc: 'Ideal for growing K-12 schools.', 
      popular: true, 
      features: ['Unlimited Students', 'AI-Grading engine', 'Parent Mobile App', 'Premium Analytics', 'Priority 24/7 Support', 'Custom Branding'] 
    },
    { 
      title: 'Enterprise', 
      monthlyPrice: 'Custom', 
      annualPrice: 'Custom',
      desc: 'Full-suite for large universities.', 
      features: ['Campus-wide ERP', 'White-label Mobile Apps', 'Dedicated API Access', 'SLA Guarantee', 'Dedicated Success Manager', 'On-site Training'] 
    }
  ];

  const comparison = [
    { feature: 'Students', starter: '50', pro: 'Unlimited', enterprise: 'Unlimited' },
    { feature: 'AI Grading', starter: '❌', pro: '✅', enterprise: '✅' },
    { feature: 'Mobile App', starter: 'Web only', pro: 'Included', enterprise: 'White-label' },
    { feature: 'Support', starter: 'Email', pro: 'Priority', enterprise: 'Dedicated' },
    { feature: 'API Access', starter: '❌', pro: '❌', enterprise: 'Full' },
  ];

  const faqs = [
    { q: 'Can I change plans later?', a: 'Yes, you can upgrade or downgrade your plan at any time from your administration dashboard.' },
    { q: 'Is there a free trial?', a: 'We offer a 14-day full-feature trial for the Professional plan to help you evaluate the platform.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, UPI (for India), and international wire transfers for Enterprise clients.' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Premium Header */}
      <header 
        className="relative py-28 px-8 text-center text-white rounded-b-[4rem] md:rounded-b-[6rem] overflow-hidden"
        style={{ background: '#1E2B6F' }}
      >
         {/* Consistent Decorative Overlays */}
         <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-50 pointer-events-none" />
         <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
         
         <div className="max-w-4xl mx-auto relative z-10">
           <button 
             onClick={() => navigate(-1)}
             className="inline-flex items-center text-white/40 hover:text-white mb-10 transition-colors group px-4 py-2 rounded-full border border-white/10 hover:bg-white/5"
           >
             <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
           </button>
           
           <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
              Pricing built for <br />
              <span className="text-orange-500">Every Scale.</span>
           </h1>
           <p className="text-xl text-indigo-100/60 font-medium max-w-2xl mx-auto mb-12">
              Simple, transparent pricing. Save 20% when you choose annual billing.
           </p>

           {/* Toggle */}
           <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-bold ${!isAnnual ? 'text-white' : 'text-white/40'}`}>Monthly</span>
              <button 
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-16 h-8 bg-white/10 rounded-full relative p-1 transition-colors hover:bg-white/20"
              >
                 <div className={`w-6 h-6 bg-orange-500 rounded-full transition-transform duration-300 ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`} />
              </button>
              <div className="flex items-center gap-2">
                 <span className={`text-sm font-bold ${isAnnual ? 'text-white' : 'text-white/40'}`}>Annual</span>
                 <span className="bg-orange-500/20 text-orange-400 text-[10px] font-black px-2 py-0.5 rounded-md border border-orange-500/30">SAVE 20%</span>
              </div>
           </div>
         </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-24">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
           {plans.map((p, i) => (
             <div key={i} className={`relative p-10 rounded-[3.5rem] border flex flex-col transition-all duration-500 hover:-translate-y-2 ${p.popular ? 'bg-white border-orange-500 shadow-[0_30px_60px_-15px_rgba(240,90,40,0.15)] scale-105 z-10' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`}>
                {p.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-lg shadow-orange-200">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#1E2B6F' }}>{p.title}</h3>
                <p className="text-sm text-slate-400 mb-8 font-medium">{p.desc}</p>
                <div className="mb-10 flex items-baseline gap-1">
                   <span className="text-6xl font-black" style={{ color: '#1E2B6F' }}>
                      {isAnnual ? p.annualPrice : p.monthlyPrice}
                   </span>
                   {p.monthlyPrice !== 'Custom' && <span className="text-slate-400 font-bold text-lg">/mo</span>}
                </div>
                <ul className="space-y-5 mb-12 flex-1">
                   {p.features.map((f, fi) => (
                     <li key={fi} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                        <Check size={18} className="text-orange-500" strokeWidth={3} /> {f}
                     </li>
                   ))}
                </ul>
                <button className={`w-full py-5 rounded-[2rem] font-black transition-all shadow-lg ${p.popular ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-indigo-950 text-white hover:bg-slate-800'}`}>
                   Get Started
                </button>
             </div>
           ))}
        </div>

        {/* Detailed Comparison */}
        <div className="mb-40">
           <h2 className="text-3xl font-black text-center mb-16" style={{ color: '#1E2B6F' }}>Compare Features</h2>
           <div className="overflow-hidden rounded-[3rem] border border-slate-100 bg-slate-50 shadow-sm">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-white border-b border-slate-100">
                       <th className="p-8 font-black uppercase tracking-widest text-xs text-slate-400">Features</th>
                       <th className="p-8 font-black text-indigo-900">Starter</th>
                       <th className="p-8 font-black text-orange-600">Professional</th>
                       <th className="p-8 font-black text-indigo-900">Enterprise</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {comparison.map((row, i) => (
                       <tr key={i} className="hover:bg-white transition-colors">
                          <td className="p-8 font-bold text-slate-600">{row.feature}</td>
                          <td className="p-8 font-semibold text-slate-500">{row.starter}</td>
                          <td className="p-8 font-semibold text-slate-900">{row.pro}</td>
                          <td className="p-8 font-semibold text-slate-500">{row.enterprise}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
           <div>
              <h2 className="text-4xl font-black mb-6" style={{ color: '#1E2B6F' }}>Common <br />Questions.</h2>
              <p className="text-slate-500 text-lg leading-relaxed max-w-sm">Everything you need to know about our billing and subscription process.</p>
              <div className="mt-12 flex flex-col gap-6">
                 <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="p-3 bg-white rounded-xl shadow-sm"><Zap className="text-orange-500" /></div>
                    <div>
                       <p className="font-bold" style={{ color: '#1E2B6F' }}>Quick Setup</p>
                       <p className="text-xs text-slate-400 font-bold">Accounts active in 24 hours</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="p-3 bg-white rounded-xl shadow-sm"><ShieldCheck className="text-emerald-500" /></div>
                    <div>
                       <p className="font-bold" style={{ color: '#1E2B6F' }}>Secure Billing</p>
                       <p className="text-xs text-slate-400 font-bold">PCI-DSS Compliant payments</p>
                    </div>
                 </div>
              </div>
           </div>
           <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="group p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:border-orange-200 transition-all">
                   <h3 className="font-bold text-lg mb-3 flex items-center justify-between" style={{ color: '#1E2B6F' }}>
                      {faq.q}
                      < ChevronDown className="text-slate-300 group-hover:text-orange-500 transition-colors" />
                   </h3>
                   <p className="text-slate-500 leading-relaxed text-sm font-medium">{faq.a}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Bottom CTA */}
        <div 
          className="mt-40 rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden"
          style={{ background: '#1E2B6F' }}
        >
           {/* Consistent Decorative Overlays */}
           <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-50 pointer-events-none" />
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
           <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to transform?</h2>
              <p className="text-indigo-200 text-xl max-w-2xl mx-auto mb-12">Join over 500+ institutes already using EduStack to empower their students.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <button onClick={() => navigate('/login')} className="px-12 py-5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl shadow-xl transition-all">
                    Start Your Free Trial
                 </button>
                 <button className="px-12 py-5 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl transition-all backdrop-blur-md border border-white/10">
                    Schedule a Demo
                 </button>
              </div>
           </div>
           <Globe size={400} className="absolute -left-20 -bottom-20 opacity-5 text-white pointer-events-none" />
           <MessageCircle size={200} className="absolute -top-20 -right-20 opacity-5 text-white pointer-events-none" />
        </div>
      </main>

      <footer className="py-20 border-t border-slate-100 text-center">
         <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen size={20} className="text-orange-500" />
            <span className="font-black text-xl">
               <span style={{ color: '#1E2B6F' }}>Edu</span>
               <span style={{ color: '#F05A28' }}>Stack</span>
            </span>
         </div>
         <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">Scalable Education — 2026</p>
      </footer>
    </div>
  );
}
