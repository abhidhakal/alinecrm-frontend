import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Calendar, Users, Building2, Send } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function Demo() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    teamSize: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://formspree.io/f/xkorzzqz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          _subject: `Demo Request from ${formData.name} at ${formData.company}`
        })
      });

      if (response.ok) {
        showToast("Thank you! We'll be in touch soon to schedule your demo.", "success");
        setFormData({ name: '', email: '', company: '', teamSize: '', message: '' });
      } else {
        showToast("Failed to submit request. Please try again.", "error");
      }
    } catch (error) {
      showToast("An error occurred. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="flex w-full flex-col min-h-screen bg-white font-sans selection:bg-[#0B3954]/10">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-50 border-b border-slate-100">
        <div className="container-width">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 animate-fade-in-up">
              See AlineCRM in <span className="text-[#0B3954]">action</span>.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed animate-fade-in-up delay-100">
              Get a personalized walkthrough of how AlineCRM can help your team close more deals and build lasting customer relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="container-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Benefits */}
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">What you'll get</h2>
                <div className="space-y-6">
                  {[
                    { icon: <Calendar className="w-5 h-5 text-[#0B3954]" />, title: "30-minute personalized demo", desc: "Tailored to your specific business needs and use cases." },
                    { icon: <Users className="w-5 h-5 text-[#0B3954]" />, title: "Q&A with our experts", desc: "Get answers to all your questions from our product team." },
                    { icon: <Building2 className="w-5 h-5 text-[#0B3954]" />, title: "Custom implementation plan", desc: "Learn how to get your team up and running quickly." },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 mb-1">{item.title}</p>
                        <p className="text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-[#0B3954] text-white overflow-hidden relative group">
                <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/5 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700"></div>
                <h3 className="text-xl font-bold mb-4 relative z-10">Trusted by 500+ teams</h3>
                <p className="text-slate-300 mb-6 relative z-10">Join companies who have transformed their sales operations with AlineCRM.</p>
                <div className="flex items-center gap-1 relative z-10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-white font-bold">4.9/5</span>
                </div>
              </div>
            </div>

            {/* Demo Form */}
            <div className="bg-slate-50/50 border border-slate-100 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Request your demo</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#0B3954]/5 focus:border-[#0B3954] transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#0B3954]/5 focus:border-[#0B3954] transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Company Name</label>
                    <input
                      required
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Acme Inc."
                      className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#0B3954]/5 focus:border-[#0B3954] transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Team Size</label>
                    <select
                      required
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#0B3954]/5 focus:border-[#0B3954] transition-all font-medium appearance-none"
                    >
                      <option value="">Select team size</option>
                      <option value="1-5">1-5 people</option>
                      <option value="6-20">6-20 people</option>
                      <option value="21-50">21-50 people</option>
                      <option value="51-100">51-100 people</option>
                      <option value="100+">100+ people</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Anything specific you'd like to see?</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your current challenges or what features interest you most..."
                    className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#0B3954]/5 focus:border-[#0B3954] transition-all font-medium resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-8 bg-[#0B3954] text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-[#082a3f] hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
                >
                  {loading ? 'Submitting...' : 'Request Demo'}
                  {!loading && <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
