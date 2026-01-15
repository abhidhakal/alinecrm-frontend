import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { BarChart3, CheckCircle2, LayoutDashboard, LayoutTemplate, Brain, Mail, Zap, Shield, Smartphone } from 'lucide-react';

const featureList = [
  {
    name: 'Pipeline Management',
    description: 'Visualize your sales process with customizable boards. Drag and drop deals to move them forward.',
    icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
  },
  {
    name: 'Template Builder',
    description: 'Create reusable email templates with a drag-and-drop editor to speed up your outreach.',
    icon: <LayoutTemplate className="w-6 h-6 text-pink-600" />,
  },
  {
    name: 'Zen Mode',
    description: 'Focus on what matters. Built-in mindfulness tools to keep your team balanced and productive.',
    icon: <Brain className="w-6 h-6 text-yellow-600" />,
  },
  {
    name: 'Smart Automation',
    description: 'Trigger emails, tasks, and notifications automatically based on deal stage changes.',
    icon: <Zap className="w-6 h-6 text-orange-600" />,
  },
  {
    name: 'Unified Communications',
    description: 'Sync your email and calendar to keep all customer interactions in one place.',
    icon: <Mail className="w-6 h-6 text-purple-600" />,
  },
  {
    name: 'Deep Analytics',
    description: 'Gain insights into team performance and revenue forecasts with real-time reports.',
    icon: <LayoutDashboard className="w-6 h-6 text-emerald-600" />,
  },
  {
    name: 'Data Privacy & Security',
    description: 'Enterprise-grade security to keep your sensitive customer data safe and compliant.',
    icon: <Shield className="w-6 h-6 text-red-600" />,
  },
  {
    name: 'Mobile Access',
    description: 'Stay connected on the go with our fully responsive web platform designed for any device.',
    icon: <Smartphone className="w-6 h-6 text-indigo-600" />,
  },
];

export default function Features() {
  return (
    <div className="flex w-full flex-col min-h-screen bg-white font-sans selection:bg-[#0B3954]/10">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-white overflow-hidden">
        <div className="container-width">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 animate-fade-in-up">
              Features built for the <span className="text-[#0B3954]">modern</span> sales team.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed animate-fade-in-up delay-100">
              Stop fighting your CRM and start closing more deals. AlineCRM provides the essential tools to manage your pipeline, automate outreach, and analyze your growth.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container-width">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureList.map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-white group-hover:scale-110 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive Section */}
      <section className="py-24 bg-white">
        <div className="container-width">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="/images/dashboard-ss.png"
                alt="AlineCRM Dashboard"
                className="rounded-2xl border border-slate-200 shadow-2xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
                Powerful analytics to drive your decisions.
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Real-time Revenue Tracking</h4>
                    <p className="text-slate-500">Know exactly where your money is at any given moment with interactive charts.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Team Performance Insights</h4>
                    <p className="text-slate-500">Identify top performers and areas for improvement with detailed activity logs.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Custom Reporting</h4>
                    <p className="text-slate-500">Build the reports you actually need, not just the ones legacy CRMs give you.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
