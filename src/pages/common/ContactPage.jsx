import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, ArrowLeft, MessageSquare, Globe, Send } from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header Section */}
      <header className="relative py-24 px-8 overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl text-center md:text-left">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-400 hover:text-indigo-900 mb-8 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
            </button>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6" style={{ color: '#1E2B6F' }}>
              Let's Start a <br /><span className="text-orange-500">Conversation.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              Have questions about EduStack? We're here to help you transform your educational institute.
            </p>
          </div>
          <div className="w-full max-w-md bg-white p-8 rounded-[3rem] shadow-2xl shadow-indigo-100 border border-slate-100">
             <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                   <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Full Name</label>
                   <input type="text" placeholder="Your name" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium" />
                </div>
                <div>
                   <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Email Address</label>
                   <input type="email" placeholder="example@email.com" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium" />
                </div>
                <div>
                   <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Message</label>
                   <textarea rows="4" placeholder="How can we help?" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium resize-none"></textarea>
                </div>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group">
                   Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
             </form>
          </div>
        </div>
      </header>

      {/* Simple Contact Grid */}
      <main className="max-w-6xl mx-auto px-8 py-20">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
               { icon: <Mail className="text-orange-500" />, title: 'Email Us', desc: 'support@edustack.com', action: 'mailto:support@edustack.com' },
               { icon: <Phone className="text-blue-500" />, title: 'Call Us', desc: '+91 800-EDUSTACK', action: 'tel:+9180033878225' },
               { icon: <MessageSquare className="text-purple-500" />, title: 'Live Chat', desc: 'Available 24/7', action: '#' },
               { icon: <MapPin className="text-emerald-500" />, title: 'HQ Office', desc: 'Hyderabad, India', action: '#' }
            ].map((contact, i) => (
               <a 
                 key={i} 
                 href={contact.action}
                 className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center group"
               >
                  <div className="p-4 bg-slate-50 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                     {contact.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1E2B6F' }}>{contact.title}</h3>
                  <p className="text-sm text-slate-500 font-medium">{contact.desc}</p>
               </a>
            ))}
         </div>
      </main>

      <footer className="py-12 border-t border-slate-200 text-center">
         <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen size={20} className="text-orange-500" />
            <span className="font-extrabold text-lg">
               <span style={{ color: '#1E2B6F' }}>Edu</span>
               <span style={{ color: '#F05A28' }}>Stack</span>
            </span>
         </div>
         <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Connecting the Nodes — 2026</p>
      </footer>
    </div>
  );
}
