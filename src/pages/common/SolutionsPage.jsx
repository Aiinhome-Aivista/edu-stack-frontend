import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Laptop, Users, GraduationCap, BarChart, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function SolutionsPage() {
  const navigate = useNavigate();

  const solutions = [
    {
      title: 'For K-12 Schools',
      icon: <GraduationCap size={40} className="text-orange-500" />,
      features: ['Automated Attendance', 'Smart Gradebooks', 'Parent-Teacher Portals', 'Curriculum Management']
    },
    {
      title: 'For Higher Education',
      icon: <Laptop size={40} className="text-blue-500" />,
      features: ['LMS Integration', 'Research Analytics', 'Campus Management', 'Student Placement Tracking']
    },
    {
      title: 'For Training Centers',
      icon: <Users size={40} className="text-purple-500" />,
      features: ['Skill Benchmarking', 'Certification Workflows', 'Course Scheduling', 'Revenue Dashboards']
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <header className="py-24 px-8 bg-indigo-950 text-white rounded-b-[4rem]">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white/50 hover:text-white mb-10 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            Tailored <span className="text-orange-500 text-shadow-glow">Solutions</span> <br />
            for Every Institute.
          </h1>
          <p className="text-xl text-indigo-100/60 max-w-2xl leading-relaxed">
            From small learning centers to large multi-campus universities, EduStack scales to meet your administrative and educational needs.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {solutions.map((s, i) => (
            <div key={i} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:border-orange-200 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-50 group">
              <div className="mb-8 p-6 bg-white w-fit rounded-3xl shadow-sm group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#1E2B6F' }}>{s.title}</h3>
              <ul className="space-y-4">
                {s.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-3 text-slate-600 font-medium">
                    <CheckCircle2 size={18} className="text-orange-500" /> {f}
                  </li>
                ))}
              </ul>
              <button className="mt-10 w-full py-4 rounded-2xl bg-white border border-slate-200 font-bold text-sm hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all">
                 Learn More
              </button>
            </div>
          ))}
        </div>

        <div className="mt-32 p-16 bg-orange-500 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
           <div className="z-10">
              <h2 className="text-4xl font-extrabold mb-4">Need a custom feature?</h2>
              <p className="text-orange-100 text-lg max-w-md">Our engineering team specializes in building bespoke modules for unique institutional workflows.</p>
           </div>
           <button className="z-10 px-10 py-5 bg-indigo-950 text-white font-bold rounded-2xl hover:bg-indigo-900 transition-all shadow-xl">
              Talk to an Expert
           </button>
           <BarChart size={300} className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none" />
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
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Built for Excellence — 2026</p>
      </footer>
    </div>
  );
}
