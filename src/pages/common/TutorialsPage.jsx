import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, BookOpen, Clock, ChevronRight, ArrowLeft, Search, GraduationCap } from 'lucide-react';

const tutorials = [
  {
    id: 1,
    title: 'Getting Started with EduStack',
    duration: '12:45',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    description: 'A complete walk-through of the dashboard features for new institute administrators.'
  },
  {
    id: 2,
    title: 'Mastering AI Lesson Planning',
    duration: '18:20',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=800',
    description: 'Learn how to use our AI engine to generate comprehensive lesson plans tailored to your curriculum.'
  },
  {
    id: 3,
    title: 'Advanced Analytics for Teachers',
    duration: '15:10',
    level: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    description: 'Deep dive into student performance metrics and predictive learning outcome reports.'
  },
  {
    id: 4,
    title: 'Setting up Parent Portals',
    duration: '08:30',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?auto=format&fit=crop&q=80&w=800',
    description: 'Enable seamless communication between your institute and parents with simple setup steps.'
  }
];

export default function TutorialsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header Section */}
      <header className="relative py-20 px-8 overflow-hidden rounded-b-[4rem]" style={{ background: '#1E2B6F' }}>
        {/* Animated Background Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400 rounded-full opacity-10 blur-3xl -ml-20 -mb-20"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white/70 hover:text-white mb-10 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap size={40} className="text-orange-500" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  Learning <span className="text-orange-500">Center</span>
                </h1>
              </div>
              <p className="text-xl text-indigo-100/80 leading-relaxed">
                Step-by-step video guides designed to help you get the most out of the EduStack ecosystem.
              </p>
            </div>
            
            {/* Search Box */}
            <div className="w-full md:w-80 group">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Find a tutorial..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/40 focus:outline-none focus:bg-white/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tutorials Grid */}
      <main className="max-w-6xl mx-auto px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: '#1E2B6F' }}>
            <PlayCircle className="text-orange-500" /> Recent Tutorials
          </h2>
          <div className="flex gap-2">
            {['All', 'Beginner', 'Advanced'].map(filter => (
              <button key={filter} className="px-5 py-2 rounded-xl text-sm font-semibold bg-white border border-slate-200 hover:border-orange-200 hover:bg-orange-50 transition-all shadow-sm">
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tutorials.map((tutorial) => (
            <div 
              key={tutorial.id}
              className="group flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative w-full md:w-64 h-48 md:h-full overflow-hidden flex-shrink-0">
                <img 
                  src={tutorial.thumbnail} 
                  alt={tutorial.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300">
                    <PlayCircle className="text-orange-500 w-8 h-8" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
                   {tutorial.duration}
                </div>
              </div>

              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-orange-100 text-orange-600">
                    {tutorial.level}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-orange-600 transition-colors" style={{ color: '#1E2B6F' }}>
                  {tutorial.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {tutorial.description}
                </p>
                <button className="flex items-center gap-1.5 text-sm font-bold group/link" style={{ color: '#1E2B6F' }}>
                   Watch Now <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <section className="mt-24 p-12 rounded-[3.5rem] bg-indigo-900 text-white relative overflow-hidden">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="text-center md:text-left">
               <h3 className="text-3xl font-extrabold mb-2">Can't find a specific guide?</h3>
               <p className="text-indigo-200">Our support team is happy to record a custom Loom for you.</p>
             </div>
             <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-orange-900 border-none">
               Request a Tutorial
             </button>
           </div>
           {/* Decorative SVG behind */}
           <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <BookOpen size={200} />
           </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="footer-bg-clean py-10 text-center">
         <p className="text-slate-400 text-xs font-medium tracking-wide">EDUSTACK LEARNING CENTER — 2026</p>
      </footer>
    </div>
  );
}
