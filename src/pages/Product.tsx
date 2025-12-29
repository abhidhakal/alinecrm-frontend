import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowRight, Zap, Shield, Sparkles, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Product() {
  return (
    <div className="flex w-full flex-col min-h-screen bg-white font-sans selection:bg-[#0B3954]/10">
      <Header />

      {/* Hero section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-white overflow-hidden">
        <div className="container-width mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-slate-900 mb-8 animate-fade-in-up">
              One platform. <br /><span className="text-[#0B3954]">Infinite</span> possibilities.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-10 animate-fade-in-up delay-100 max-w-2xl mx-auto">
              AlineCRM combines customer data, pipeline tracking, and marketing automation into a single, high-performance workspace.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
              <Link
                to="/login"
                className="w-full sm:w-auto px-10 py-4 bg-[#0B3954] text-white text-lg font-bold rounded-2xl shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="w-full sm:w-auto px-10 py-4 bg-white text-slate-900 border border-slate-200 text-lg font-bold rounded-2xl hover:bg-slate-50 transition-all">
                View Live Demo
              </button>
            </div>
          </div>

          <div className="mt-20 relative animate-fade-in-up delay-300">
            <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full transform -translate-y-1/2"></div>
            <img
              src="/images/Dashboard.png"
              alt="AlineCRM Product Interface"
              className="relative z-10 w-full max-w-6xl mx-auto rounded-[2rem] border border-slate-200 shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Core Philosophies */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container-width mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: "Lightning Fast", desc: "Built with modern architecture for sub-second page loads.", icon: <Zap className="w-6 h-6 text-yellow-500" /> },
              { title: "Secure by Design", desc: "Your data is encrypted at rest and in transit.", icon: <Shield className="w-6 h-6 text-blue-500" /> },
              { title: "Pure UI", desc: "No clutter. Just high-density information you actually need.", icon: <Layout className="w-6 h-6 text-purple-500" /> },
              { title: "AI Enhanced", desc: "Leverage smart insights to predict your best next move.", icon: <Sparkles className="w-6 h-6 text-pink-500" /> },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive 1 */}
      <section className="py-24 bg-white">
        <div className="container-width mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
                The only dashboard you'll ever need.
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                AlineCRM's dashboard provides a bird's-eye view of your entire business. Track revenue, monitor lead health, and identify bottlenecks before they happen.
              </p>
              <ul className="space-y-4">
                {[
                  "Visual Sales Funnel",
                  "Activity Heatmaps",
                  "Revenue Velocity Maps",
                  "Custom KPI Tracking"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-900 font-semibold">
                    <div className="w-2 h-2 rounded-full bg-[#0B3954]"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-100 rounded-[3rem] p-8">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <img src="https://images.unsplash.com/photo-1551288049-bbdac8a28a1e?auto=format&fit=crop&q=80&w=2070" alt="Analytics View" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
