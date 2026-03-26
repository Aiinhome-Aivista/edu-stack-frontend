import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  const navigate = useNavigate();

  const sections = [
    { icon: <ShieldCheck size={24} className="text-orange-500" />, title: 'Data Protection', text: 'We use industry-standard encryption protocols (SSL/TLS) to protect all data transmitted between your device and our servers.' },
    { icon: <Lock size={24} className="text-blue-500" />, title: 'Strict Access Control', text: 'Our role-based access control (RBAC) ensures that only authorized users can access sensitive information within an institute.' },
    { icon: <Eye size={24} className="text-purple-500" />, title: 'No Third-Party Selling', text: 'We never sell, rent, or trade your personal or educational data with third parties for marketing purposes.' },
    { icon: <FileText size={24} className="text-emerald-500" />, title: 'Transparency', text: 'We are committed to clear and simple explanations of how your data is used to improve the educational experience.' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header */}
      <header className="py-20 px-8 bg-indigo-950 text-white rounded-b-[4rem]">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white/60 hover:text-white mb-10 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Privacy Policy</h1>
          <p className="text-lg text-indigo-100/60 font-medium">Last Updated: March 20, 2026</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-8 py-20">
         <div className="prose prose-slate lg:prose-lg max-w-none">
            <h2 className="text-3xl font-extrabold" style={{ color: '#1E2B6F' }}>Introduction</h2>
            <p className="text-slate-600 leading-relaxed">
               EduStack is built with a "Privacy First" mindset. We understand the sensitivity surrounding student data and educational records. This policy outlines our commitment to safeguarding your information.
            </p>

            <div className="my-16 grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
               {sections.map((s, i) => (
                  <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-4">
                     <div className="p-3 bg-white w-fit rounded-xl shadow-sm">{s.icon}</div>
                     <h3 className="font-bold text-xl" style={{ color: '#1E2B6F' }}>{s.title}</h3>
                     <p className="text-sm text-slate-500 leading-relaxed">{s.text}</p>
                  </div>
               ))}
            </div>

            <h2 className="text-3xl font-extrabold mt-16" style={{ color: '#1E2B6F' }}>Information Collection</h2>
            <p className="text-slate-600 leading-relaxed">
               We collect information provided directly by users (name, email, institutional role) and information automatically generated during platform use (performance metrics, attendance, assessment results) to facilitate the educational process.
            </p>

            <h2 className="text-3xl font-extrabold mt-12" style={{ color: '#1E2B6F' }}>Your Rights</h2>
            <ul className="list-disc pl-6 space-y-4 text-slate-600 font-medium">
               <li>Right to access your personal data.</li>
               <li>Right to correct any inaccuracies.</li>
               <li>Right to data portability for institutional administrators.</li>
               <li>Right to request deletion (subject to institutional requirements).</li>
            </ul>
         </div>

         <div className="mt-20 p-12 bg-indigo-50 rounded-[3rem] border border-indigo-100 flex flex-col items-center text-center">
            <ShieldCheck size={48} className="text-indigo-600 mb-6" />
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E2B6F' }}>Have Privacy Questions?</h3>
            <p className="text-slate-500 mb-8 max-w-md">Our dedicated Data Protection Officer is available to discuss our security protocols in detail.</p>
            <button 
              onClick={() => navigate('/contact')}
              className="bg-indigo-900 text-white font-bold px-10 py-4 rounded-2xl hover:bg-indigo-800 transition-all shadow-lg"
            >
              Contact DPO
            </button>
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
         <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Privacy Secured — 2026</p>
      </footer>
    </div>
  );
}
