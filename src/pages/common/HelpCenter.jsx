import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Mail, MessageCircle, Phone, ArrowLeft, Book, ShieldAlert, Zap } from 'lucide-react';

const faqs = [
  {
    category: 'Getting Started',
    icon: <Zap className="w-5 h-5 text-yellow-500" />,
    questions: [
      { q: 'How do I log into my dashboard?', a: 'Simply head over to the login page and enter the credentials provided by your institute administrator.' },
      { q: 'Can I change my role?', a: 'No, roles are strictly assigned by the superadmin. If you believe there is an error, please contact support.' }
    ]
  },
  {
    category: 'Assessments & Tests',
    icon: <Book className="w-5 h-5 text-blue-500" />,
    questions: [
      { q: 'How do I take an assessment?', a: 'Navigate to your Student Dashboard, click on "Assessments", and select the test that is currently marked as "Active".' },
      { q: 'What happens if I get disconnected during a test?', a: 'Your progress is automatically saved every few seconds. Once you reconnect, you can resume exactly where you left off.' }
    ]
  },
  {
    category: 'Security & Privacy',
    icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
    questions: [
      { q: 'Is my data secure?', a: 'Yes. We use industry-standard encryption for all data transmissions, and roles are strictly compartmentalized.' }
    ]
  }
];

export default function HelpCenter() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-800 font-sans selection:bg-indigo-200">
      
      {/* Header Section */}
      <div className="relative overflow-hidden bg-indigo-900 px-6 py-20 text-center text-white shadow-2xl rounded-b-[3rem] sm:rounded-b-[5rem]">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse transition-all duration-1000"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse transition-all duration-1000 delay-500"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <button 
            onClick={() => navigate(-1)}
            className="absolute -top-10 sm:left-0 left-4 text-white hover:text-indigo-200 flex items-center transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-md">
            How can we help you?
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mb-10">
            Search our knowledge base or browse categories below to find exactly what you need.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="block w-full pl-12 pr-4 py-4 md:py-5 border-none rounded-2xl bg-white/95 text-slate-900 placeholder-slate-400 shadow-xl focus:ring-4 focus:ring-indigo-300 focus:outline-none text-lg transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-10">
          {faqs.map((section, sIdx) => (
            <div key={sIdx} className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{animationDelay: `${sIdx * 150}ms`}}>
              <div className="flex items-center mb-6">
                <div className="p-3 bg-white rounded-xl shadow-sm mr-4 border border-slate-100">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold border-b-2 border-transparent hover:border-indigo-100 transition-colors inline-block">{section.category}</h2>
              </div>
              
              <div className="space-y-4">
                {section.questions.map((faq, qIdx) => {
                  const globalIdx = `${sIdx}-${qIdx}`;
                  const isOpen = openFaq === globalIdx;
                  
                  // Simple client-side search filter
                  if (searchQuery && !faq.q.toLowerCase().includes(searchQuery.toLowerCase()) && !faq.a.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return null;
                  }

                  return (
                    <div 
                      key={qIdx} 
                      className={`group border rounded-2xl overflow-hidden transition-all duration-300 \${isOpen ? 'bg-white shadow-lg border-indigo-100 ring-1 ring-indigo-50' : 'bg-white/60 hover:bg-white border-slate-200 hover:border-indigo-100 hover:shadow-md'}`}
                    >
                      <button
                        onClick={() => toggleFaq(globalIdx)}
                        className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                      >
                        <span className={`font-semibold text-lg \${isOpen ? 'text-indigo-700' : 'text-slate-700'}`}>
                          {faq.q}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-indigo-400 transition-transform duration-300 \${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <div 
                        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out \${isOpen ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <p className="text-slate-600 leading-relaxed pt-2 border-t border-slate-50">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100/50 border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-xl font-bold mb-2">Still need help?</h3>
            <p className="text-slate-500 mb-8">Our support team is always ready to assist you.</p>
            
            <div className="space-y-4">
              <a href="mailto:support@edustack.com" className="flex items-center p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors group">
                <Mail className="w-6 h-6 mr-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                <div className="font-semibold">Email Us</div>
              </a>
              <a href="#" className="flex items-center p-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors group">
                <MessageCircle className="w-6 h-6 mr-4 text-purple-500 group-hover:scale-110 transition-transform" />
                <div className="font-semibold">Live Chat</div>
              </a>
              <a href="tel:+1234567890" className="flex items-center p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors group">
                <Phone className="w-6 h-6 mr-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                <div className="font-semibold">Call Us</div>
              </a>
            </div>
          </div>
          
          <div className="bg-indigo-900 text-indigo-50 p-8 rounded-3xl shadow-lg relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-all duration-700">
               <Book className="w-32 h-32" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2 relative z-10">Read the Docs</h3>
             <p className="text-indigo-200 text-sm mb-6 relative z-10">Check out our detailed documentation for a comprehensive guide on all features.</p>
             <button className="bg-white/20 hover:bg-white text-white hover:text-indigo-900 font-semibold py-2 px-6 rounded-xl relative z-10 transition-colors w-full">
               Go to Docs
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
