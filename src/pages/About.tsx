import Header from '../components/Header';
import Footer from '../components/Footer';
import { Users, Globe, Clock, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="flex w-full flex-col min-h-screen bg-white font-sans selection:bg-[#0B3954]/10">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-50 border-b border-slate-100">
        <div className="container-width mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 animate-fade-in-up">
              We're building the <span className="text-[#0B3954]">future</span> of sales operations.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed animate-fade-in-up delay-100">
              AlineCRM was born out of a simple realization: CRMs should help you sell, not get in your way. We're a team of passionate individuals dedicated to creating the most intuitive and powerful sales platform.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="container-width mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: "Offices Worldwide", value: "4", icon: <Globe className="w-6 h-6 text-blue-600" /> },
              { label: "Full-time colleagues", value: "120+", icon: <Users className="w-6 h-6 text-indigo-600" /> },
              { label: "Hours per week", value: "40", icon: <Clock className="w-6 h-6 text-emerald-600" /> },
              { label: "Commitment to privacy", value: "100%", icon: <Heart className="w-6 h-6 text-pink-600" /> },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-4 p-8 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                  {stat.icon}
                </div>
                <div>
                  <dd className="text-4xl font-bold tracking-tight text-slate-900 mb-1">{stat.value}</dd>
                  <dt className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</dt>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-slate-50">
        <div className="container-width mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
                Our mission is to empower growth-minded teams.
              </h2>
              <div className="space-y-6 text-lg text-slate-600">
                <p>
                  We believe that technology should be an enabler, not a hurdle. Legacy systems are often bloated, slow, and confusing. AlineCRM is the antidote—designed with clarity and performance at its core.
                </p>
                <p>
                  Whether you're a startup of 5 or an enterprise of 500, our tools are built to scale with you, providing the insights and automation you need to close more deals and build lasting relationships.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071823991-b5ae7264040e?auto=format&fit=crop&q=80&w=2070"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-[#0B3954] rounded-full flex items-center justify-center p-8 text-white text-center font-bold text-lg leading-tight shadow-xl">
                Est. 2024 Kathmandu
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
