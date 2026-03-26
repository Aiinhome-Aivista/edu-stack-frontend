import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Briefcase, MapPin, Clock, ArrowRight, ArrowLeft, Users, Zap } from 'lucide-react';

const jobs = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote / Hyderabad',
    type: 'Full-time',
    description: 'Lead the development of our React-based educational dashboards and collaborative tools.'
  },
  {
    id: 2,
    title: 'Product Designer (UX/UI)',
    department: 'Design',
    location: 'Remote / Bangalore',
    type: 'Full-time',
    description: 'Create intuitive, premium experiences for students, teachers, and administrators.'
  },
  {
    id: 3,
    title: 'AI Curriculum Specialist',
    department: 'Education',
    location: 'Remote',
    type: 'Contract',
    description: 'Help fine-tune our AI models for pedagogical accuracy and classroom alignment.'
  }
];

export default function CareersPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Hero Section */}
      <header className="relative py-24 px-8 overflow-hidden bg-indigo-950 text-white rounded-b-[4rem]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white/60 hover:text-white mb-10 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Build the Future of <br />
            <span className="text-orange-500">Education.</span>
          </h1>
          <p className="text-xl text-indigo-100/70 max-w-2xl leading-relaxed">
            We're looking for passionate individuals to help us redefine the educational ecosystem through technology and data-driven insights.
          </p>
        </div>
      </header>

      {/* Why Join Us */}
      <main className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
           {[
             { icon: <Users className="text-orange-500" />, title: 'Collaborative Culture', desc: 'Work with a diverse team of engineers, educators, and designers.' },
             { icon: <Zap className="text-yellow-500" />, title: 'High Impact', desc: 'Your work directly influences the learning journey of thousands of students.' },
             { icon: <Briefcase className="text-blue-500" />, title: 'Growth & Benefits', desc: 'Competitive salaries, remote options, and continuous learning support.' }
           ].map((item, i) => (
             <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
               <div className="mb-4">{item.icon}</div>
               <h3 className="text-xl font-bold mb-3" style={{ color: '#1E2B6F' }}>{item.item}</h3>
               <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>

        {/* Job Listings */}
        <div className="mb-12">
           <h2 className="text-3xl font-extrabold mb-8" style={{ color: '#1E2B6F' }}>Open Positions</h2>
           <div className="space-y-6">
             {jobs.map((job) => (
               <div key={job.id} className="group p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:border-orange-200 hover:shadow-xl hover:shadow-orange-50 transition-all duration-300">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div>
                     <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-orange-100 text-orange-600">
                          {job.department}
                        </span>
                        <span className="text-xs text-slate-400">• {job.type}</span>
                     </div>
                     <h3 className="text-2xl font-bold group-hover:text-orange-600 transition-colors" style={{ color: '#1E2B6F' }}>{job.title}</h3>
                     <div className="flex items-center gap-4 mt-3 text-slate-500 text-sm">
                       <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
                       <span className="flex items-center gap-1.5"><Clock size={14} /> Posted 2d ago</span>
                     </div>
                     <p className="text-slate-500 text-sm mt-4 max-w-xl">
                       {job.description}
                     </p>
                   </div>
                   <button className="bg-indigo-900 text-white font-bold px-8 py-4 rounded-2xl hover:bg-indigo-800 transition-all shadow-lg group-hover:scale-105">
                     Apply Now
                   </button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
           <BookOpen size={20} className="text-orange-500" />
           <span className="font-extrabold text-lg">
             <span style={{ color: '#1E2B6F' }}>Edu</span>
             <span style={{ color: '#F05A28' }}>Stack</span>
           </span>
        </div>
        <p className="text-slate-400 text-xs">JOIN THE REVOLUTION • 2026</p>
      </footer>
    </div>
  );
}
