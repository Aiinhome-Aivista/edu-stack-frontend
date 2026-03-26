import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ShieldCheck, Lock, ShieldAlert, Cpu, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function SecurityPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <header className="relative py-24 px-8 bg-indigo-950 text-white rounded-b-[4rem] overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white/50 hover:text-white mb-10 transition-colors group mx-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 px-4 py-1.5 rounded-full border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8">
             <ShieldCheck size={14} /> Enterprise Grade Security
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
             Trusted by <br /><span className="text-orange-500 text-shadow-glow">Institutes.</span>
          </h1>
          <p className="text-xl text-indigo-100/60 leading-relaxed max-w-2xl mx-auto">
             Security isn't a feature; it's the foundation of EduStack. We protect student privacy and institutional data with multi-layered defense.
          </p>
        </div>
        <Lock size={300} className="absolute -left-20 -bottom-20 opacity-[0.03] text-white pointer-events-none" />
      </header>

      <main className="max-w-6xl mx-auto px-8 py-24">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
            {[
               { icon: <ShieldAlert className="text-orange-500" />, title: 'Proactive Monitoring', desc: 'Real-time threat detection and anomaly scanning ensure your environment is safe 24/7.' },
               { icon: <Cpu className="text-blue-500" />, title: 'End-to-End Encryption', desc: 'All data, whether at rest or in transit, is encrypted using AES-256 and TLS 1.3 standards.' },
               { icon: <ShieldCheck className="text-emerald-500" />, title: 'Regular Audits', desc: 'We conduct bi-annual third-party security audits and penetration testing to keep our defenses sharp.' },
               { icon: <Lock className="text-purple-500" />, title: 'Granular RBAC', desc: 'Role-based access controls ensure that your data is only visible to the users who strictly need it.' }
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-6">
                 <div className="p-4 bg-slate-50 rounded-2xl flex-shrink-0">{s.icon}</div>
                 <div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: '#1E2B6F' }}>{s.title}</h3>
                    <p className="text-slate-500 leading-relaxed font-medium">{s.desc}</p>
                 </div>
              </div>
            ))}
         </div>

         <section className="bg-slate-50 p-12 md:p-20 rounded-[4rem] border border-slate-100">
            <h2 className="text-3xl font-extrabold text-center mb-16" style={{ color: '#1E2B6F' }}>Compliance & Standards</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center font-bold">
               {['GDPR Compliant', 'HIPAA (PE) Standards', 'ISO 27001 Prepared', 'Cloud-Native Security', 'OAuth 2.0 / SAML', 'Multi-Factor Auth'].map(item => (
                 <div key={item} className="p-6 bg-white rounded-3xl border border-slate-100 flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                    <CheckCircle2 className="text-orange-500" size={20} /> <span style={{ color: '#1E2B6F' }}>{item}</span>
                 </div>
               ))}
            </div>
         </section>

         <div className="mt-24 text-center">
            <h4 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-6">Security Bulletin</h4>
            <p className="text-slate-500 max-w-lg mx-auto italic font-serif text-lg leading-relaxed">
               "Our mission is to ensure that every student's learning profile is treated as a high-security asset, giving parents and teachers total peace of mind."
            </p>
         </div>
      </main>

      <footer className="py-12 border-t border-slate-100 text-center">
         <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen size={20} className="text-orange-500" />
            <span className="font-extrabold text-lg">
               <span style={{ color: '#1E2B6F' }}>Edu</span>
               <span style={{ color: '#F05A28' }}>Stack</span>
            </span>
         </div>
         <p className="text-slate-400 text-[10px] uppercase font-extrabold tracking-tighter">Defense-in-Depth — 2026</p>
      </footer>
    </div>
  );
}
