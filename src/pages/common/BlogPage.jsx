import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Clock, User, ArrowRight, ArrowLeft } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'The Future of AI in Modern Classrooms',
    excerpt: 'Discover how artificial intelligence is transforming the way teachers plan lessons and students engage with complex concepts.',
    author: 'Dr. Sarah Chen',
    date: 'March 15, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
    category: 'Innovation'
  },
  {
    id: 2,
    title: '5 Strategies for Better Parent-Teacher Collaboration',
    excerpt: 'Effective communication is the cornerstone of student success. Learn how to bridge the gap using modern digital tools.',
    author: 'James Wilson',
    date: 'March 10, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
    category: 'Community'
  },
  {
    id: 3,
    title: 'Personalized Learning: Moving Beyond One-Size-Fits-All',
    excerpt: 'Why tailored educational paths lead to 40% higher engagement rates in secondary education environments.',
    author: 'Elena Rodriguez',
    date: 'March 05, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800',
    category: 'Pedagogy'
  }
];

export default function BlogPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header / Hero */}
      <header className="relative py-24 px-8 overflow-hidden" style={{ background: '#1E2B6F' }}>
        {/* Decorative elements to match PublicHomePage style */}
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-20 pointer-events-none">
          <svg viewBox="0 0 400 400" className="w-full h-full">
             <path d="M400 0 Q300 100 350 200 Q250 150 200 300" fill="none" stroke="#F05A28" strokeWidth="20" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white/80 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          
          <div className="flex items-center gap-3 mb-6">
            <BookOpen size={32} className="text-orange-500" />
            <span className="text-3xl font-extrabold text-white">
              EduStack <span style={{ color: '#F05A28' }}>Insights</span>
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Our Stories & <br /><span className="text-orange-500">Perspectives</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl">
            Explore the latest trends in educational technology, pedagogical research, and success stories from our global community.
          </p>
        </div>
      </header>

      {/* Blog Feed */}
      <main className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <article 
              key={post.id} 
              className="group flex flex-col bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider" style={{ color: '#1E2B6F' }}>
                  {post.category}
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-slate-400 text-xs mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {post.readTime}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-4 group-hover:text-orange-600 transition-colors leading-snug" style={{ color: '#1E2B6F' }}>
                  {post.title}
                </h2>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <User size={16} className="text-slate-500" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{post.author}</span>
                  </div>
                  <button className="text-orange-600 hover:text-orange-700 font-bold text-sm flex items-center gap-1 group/btn">
                    Read More <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Section */}
        <section className="mt-24 bg-slate-50 rounded-[3rem] p-12 md:p-20 text-center border border-slate-100">
           <h3 className="text-3xl font-extrabold mb-4" style={{ color: '#1E2B6F' }}>Join our newsletter</h3>
           <p className="text-slate-500 max-w-lg mx-auto mb-10 text-lg">
             Get the latest articles and case studies delivered directly to your inbox every two weeks.
           </p>
           <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
             <input 
               type="email" 
               placeholder="Enter your email" 
               className="flex-1 px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
             />
             <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-orange-200">
               Subscribe
             </button>
           </form>
        </section>
      </main>

      {/* Reuse the footer from main page logically */}
      <footer className="px-8 py-12 border-t" style={{ borderColor: '#E8EAF6' }}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen size={20} className="text-orange-500" />
            <span className="font-extrabold text-lg">
              <span style={{ color: '#1E2B6F' }}>Edu</span>
              <span style={{ color: '#F05A28' }}>Stack</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs">©2026 VedaYukti. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
