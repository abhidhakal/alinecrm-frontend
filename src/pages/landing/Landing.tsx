import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GoogleLogo from '../../assets/brand-logos/workspace-logo.png';
import BrevoLogo from '../../assets/brand-logos/brevo-logo.png';
import MetaLogo from '../../assets/brand-logos/meta-logo.png';
import TikTokLogo from '../../assets/brand-logos/tiktok-logo.png';
import XLogo from '../../assets/brand-logos/x-logo.png';


export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-background selection:bg-accent/20">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
        <div className="container-width mx-auto px-6 relative z-10 flex flex-col items-center text-center">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New v2.0 is now live
          </div>

          <h1 className="max-w-5xl text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 text-balance animate-fade-in-up delay-100">
            Aligned Pipelines. <br className="hidden md:block" />
            <span className="text-slate-900">
              Higher Sales. Lower Costs.
            </span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-slate-500 mb-10 leading-relaxed animate-fade-in-up delay-200 mx-auto">
            AlineCRM helps you streamline your sales process, track leads effortlessly, and optimize costs — all in one premium platform designed for growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 bg-[#0B3954] text-white text-base font-semibold rounded-lg shadow-lg shadow-blue-900/10 hover:shadow-xl hover:bg-[#082a3f] transition-all duration-300 flex items-center justify-center gap-2">
              Get Started <img src="/icons/arrow-right.svg" className="w-4 h-4 invert" alt="" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 group">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-3 h-3 fill-slate-700" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </span>
              Watch Demo
            </button>
          </div>

          <div className="relative mx-auto max-w-6xl w-full mt-16 animate-fade-in-up delay-300">
            <img
              src="/images/Dashboard.png"
              alt="AlineCRM Dashboard"
              className="w-full h-auto rounded-xl border border-slate-200 shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-12 border-y border-slate-100 bg-surface/50">
        <div className="container-width mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-slate-500 mb-8 uppercase tracking-widest">
            Powerful integrations, all in one place
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {[GoogleLogo, BrevoLogo, MetaLogo, TikTokLogo, XLogo].map((logo, index) => (
              <img key={index} src={logo} alt="Integration Partner" className="h-8 md:h-10 object-contain hover:scale-110 transition-transform duration-300" />
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid (Bento Style) */}
      <section className="py-32 bg-white relative">
        <div className="container-width mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6 tracking-tight text-slate-900">
              Everything you need to <span className="text-[#0B3954] underline decoration-4 decoration-[#0B3954]/20 underline-offset-4">scale</span>
            </h2>
            <p className="text-lg text-slate-500">AlineCRM replaces your messy spreadsheet with a powerful, joyous sales engine.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "/icons/analytics-icon.svg",
                title: "Pipeline Management",
                desc: "Visualize your entire sales funnel. Drag-and-drop deals and never let a lead go cold again.",
                cols: "md:col-span-2"
              },
              {
                icon: "/icons/contact-icon.svg",
                title: "Contact Hub",
                desc: "Your entire network in one searchable, organized database with rich history."
              },
              {
                icon: "/icons/check-icon-large.svg",
                title: "Smart Tasks",
                desc: "Automated follow-ups and daily tasks so your team knows exactly what to do."
              },
              {
                icon: "/icons/dashboard.svg",
                title: "Analytics Dashboard",
                desc: "Real-time insights into revenue, conversion rates, and team performance.",
                cols: "md:col-span-2"
              },
              {
                icon: "/icons/column-view-icon.svg",
                title: "Template Builder",
                desc: "Create reusable email templates to speed up your outreach campaigns."
              },
              {
                icon: "/icons/mindfulness-icon.svg",
                title: "Zen Mode",
                desc: "Built-in mindfulness games and ambient sounds to keep your sales team focused."
              },
              {
                icon: "/icons/mail-icon.svg",
                title: "Email Campaigns",
                desc: "Built-in email marketing automation. Create, schedule, and track campaigns directly from your dashboard."
              }
            ].map((feature, i) => (
              <div key={i} className={`group relative p-8 rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${feature.cols || ''}`}>
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <img src={feature.icon} className="w-8 h-8" alt="" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-white group-hover:scale-110 transition-all shadow-sm">
                  <img src={feature.icon} className="w-8 h-8" alt="" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-balance">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="container-width mx-auto px-6">
          <div className="relative rounded-[2.5rem] bg-[#0F172A] overflow-hidden px-6 py-20 text-center sm:px-16 md:px-24 lg:py-24 border border-slate-800 shadow-2xl">
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl mb-6 text-balance">
                Ready to align your success?
              </h2>
              <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of high-growth teams using AlineCRM to streamline operations and close more deals.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-900 rounded-md font-bold text-base hover:bg-slate-50 transition-colors shadow-sm hover:shadow-md duration-200"
                >
                  Start Free Trial
                </Link>
                <button
                  className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-slate-600 text-white rounded-md font-semibold text-base hover:bg-white/5 hover:border-slate-500 transition-all"
                >
                  Contact Sales
                </button>
              </div>

              <p className="mt-8 text-sm text-slate-400 font-medium opacity-80">
                No credit card required · 14-day free trial · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
