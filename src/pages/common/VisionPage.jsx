import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Target, Sparkles, Heart, Globe, ArrowLeft, Lightbulb } from 'lucide-react';

export default function VisionPage() {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Target className="w-8 h-8 text-orange-500" />,
      title: "Precision Learning",
      description: "We aim to eliminate the guesswork in education by providing data-driven insights that help every student reach their full potential."
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-500" />,
      title: "Global Accessibility",
      description: "Our vision is to bridge the educational gap, making high-quality learning tools accessible to institutes and students around the world."
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Holistic Development",
      description: "We don't just focus on grades. We care about the overall growth, emotional well-being, and skill-building of every learner."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
      title: "Future Innovation",
      description: "By integrating AI and modern research, we stay ahead of the curve to prepare the next generation for a dynamic future."
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Hero Section */}
      <header className="relative py-32 px-8 overflow-hidden bg-indigo-950 text-white rounded-b-[5rem]">
         <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg viewBox="0 0 1000 1000" className="w-full h-full">
               <circle cx="500" cy="500" r="400" fill="none" stroke="#F05A28" strokeWidth="2" strokeDasharray="10 20" />
               <circle cx="500" cy="500" r="300" fill="none" stroke="#6B5ECD" strokeWidth="1" />
            </svg>
         </div>

         <div className="max-w-6xl mx-auto relative z-10 text-center">
           <button 
             onClick={() => navigate(-1)}
             className="absolute -top-16 left-0 flex items-center text-white/60 hover:text-white transition-colors group"
           >
             <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
           </button>

           <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full mb-8 border border-white/20">
              <Lightbulb size={20} className="text-yellow-400" />
              <span className="text-sm font-bold tracking-widest uppercase">The Future of Education</span>
           </div>
           
           <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
             Empowering Minds, <br />
             <span className="text-orange-500 italic">One Node at a Time.</span>
           </h1>
           <p className="text-xl md:text-2xl text-indigo-100/70 max-w-3xl mx-auto leading-relaxed">
             Our vision is to build a collaborative, data-driven ecosystem where every learner is understood, every teacher is empowered, and every institute thrives.
           </p>
         </div>
      </header>

      {/* Philosophy Section */}
      <main className="max-w-6xl mx-auto px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
           <div>
             <h2 className="text-4xl font-extrabold mb-6 leading-tight" style={{ color: '#1E2B6F' }}>
               A New Paradigm in Collaborative Learning
             </h2>
             <p className="text-lg text-slate-600 mb-8 leading-relaxed">
               At EduStack, we believe that education isn't just about the transfer of information; it's about the connection between people. We are rebuilding the educational framework into a modern "Ecosystem" where data flows seamlessly between students, parents, teachers, and administrators.
             </p>
             <div className="space-y-4">
               {["Data-Driven Insights", "Unified Communication", "Scalable Infrastructure"].map(item => (
                 <div key={item} className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                     <div className="w-2 h-2 rounded-full bg-orange-500" />
                   </div>
                   <span className="font-bold text-slate-700">{item}</span>
                 </div>
               ))}
             </div>
           </div>
           <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-100 shadow-inner relative overflow-hidden group">
              <div className="relative z-10">
                <blockquote className="text-2xl font-serif italic text-slate-400 mb-8 leading-relaxed">
                  "Education is the most powerful weapon which you can use to change the world. We are simply building the high-tech platform to deliver it."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-900" />
                  <div>
                    <p className="font-bold text-indigo-900">VedaYukti Core Team</p>
                    <p className="text-xs text-slate-500">Founding Visionaries</p>
                  </div>
                </div>
              </div>
              <BookOpen className="absolute -bottom-10 -right-10 w-64 h-64 text-indigo-100 group-hover:rotate-12 transition-transform duration-700" />
           </div>
        </div>

        {/* Values Grid */}
        <div className="text-center mb-16">
           <h3 className="text-3xl font-extrabold mb-4" style={{ color: '#1E2B6F' }}>Our Core Pillars</h3>
           <p className="text-slate-500">The values that drive every line of code we write.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {values.map((v, i) => (
             <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100 transition-all duration-300 group">
                <div className="mb-6 p-4 bg-slate-50 w-fit rounded-2xl group-hover:scale-110 transition-transform">
                   {v.icon}
                </div>
                <h4 className="text-xl font-bold mb-4" style={{ color: '#1E2B6F' }}>{v.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                   {v.description}
                </p>
             </div>
           ))}
        </div>
      </main>

      {/* Action Footer */}
      <section className="bg-slate-50 py-24 px-8 text-center rounded-t-[5rem]">
        <h3 className="text-3xl font-extrabold mb-6" style={{ color: '#1E2B6F' }}>Be part of our Journey</h3>
        <p className="text-slate-500 max-w-lg mx-auto mb-10">
           Ready to transform your institute with our visionary platform? Let's build the future together.
        </p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg hover:shadow-orange-200"
        >
          Get Started Today
        </button>
      </section>

      {/* Simple Clean Footer */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
           <BookOpen size={20} className="text-orange-500" />
           <span className="font-extrabold text-lg">
             <span style={{ color: '#1E2B6F' }}>Edu</span>
             <span style={{ color: '#F05A28' }}>Stack</span>
           </span>
        </div>
        <p className="text-slate-400 text-[10px] tracking-widest font-bold uppercase underline decoration-orange-500 underline-offset-4">EST. 2026</p>
      </footer>
    </div>
  );
}
