import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, ArrowRight, ArrowLeft, BarChart3, TrendingUp } from 'lucide-react';

const cases = [
  {
    institute: 'Global International High',
    result: '40% Growth in Student Engagement',
    desc: 'How switching to EduStack’s AI planning tool allowed teachers to focus on student intervention.',
    image: 'https://images.unsplash.com/photo-152305035309e-ad148c020b73?auto=format&fit=crop&q=80&w=800'
  },
  {
    institute: 'St. Marks Science Academy',
    result: '92% Reduction in Admin Overhead',
    desc: 'Standardizing financial workflows and student records across 4 campuses using our cloud ERP.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800'
  }
];

export default function CaseStudiesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <header className="relative py-24 px-8 bg-indigo-950 text-white rounded-b-[5rem] overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white/40 hover:text-white mb-10 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            Impact in <span className="text-orange-500 text-shadow-glow">Numbers.</span>
          </h1>
          <p className="text-xl text-indigo-100/60 max-w-2xl leading-relaxed">
            Real success stories from educational institutes that have transformed their operations and outcomes with EduStack.
          </p>
        </div>
        <TrendingUp size={400} className="absolute -right-20 -bottom-20 opacity-[0.03] text-white pointer-events-none" />
      </header>

      <main className="max-w-6xl mx-auto px-8 py-24">
        <div className="space-y-20">
           {cases.map((cs, i) => (
             <div key={i} className={`flex flex-col lg:items-center gap-12 \${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                <div className="flex-1">
                   <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-slate-50 group">
                      <img src={cs.image} alt={cs.institute} className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-10 left-10 text-white">
                         <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-orange-400 mb-2">
                            <Trophy size={16} /> Featured Success Story
                         </h4>
                         <p className="text-2xl font-bold">{cs.institute}</p>
                      </div>
                   </div>
                </div>
                <div className="flex-1 space-y-8">
                   <div className="inline-flex items-center gap-3 bg-orange-100 px-6 py-2 rounded-full border border-orange-200">
                      <BarChart3 size={18} className="text-orange-600" />
                      <span className="text-orange-950 font-extrabold tracking-tight italic">{cs.result}</span>
                   </div>
                   <h2 className="text-4xl font-extrabold leading-tight text-indigo-950">{cs.desc}</h2>
                   <p className="text-slate-500 text-lg leading-relaxed">
                      Beyond just a software change, this was a cultural shift. The institute saw a massive reduction in paperwork, allowing teachers to spend 15% more time per week on direct student engagement.
                   </p>
                   <button className="text-orange-600 font-bold text-lg flex items-center gap-2 group underline decoration-2 underline-offset-8 decoration-orange-300 hover:decoration-orange-600 transition-all">
                      Read Full Case Study <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </main>

      <footer className="py-20 bg-slate-50 text-center rounded-t-[5rem]">
         <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen size={24} className="text-orange-500" />
            <span className="font-extrabold text-2xl">
               <span style={{ color: '#1E2B6F' }}>Edu</span>
               <span style={{ color: '#F05A28' }}>Stack</span>
            </span>
         </div>
         <p className="text-slate-400 text-sm font-bold tracking-widest">REAL IMPACT • 2026</p>
      </footer>
    </div>
  );
}
