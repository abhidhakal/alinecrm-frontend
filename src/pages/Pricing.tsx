import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCurrency } from '../context/CurrencyContext';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const tiers = [
  {
    name: 'Starter',
    id: 'tier-starter',
    priceMonthly: 15,
    description: 'The essentials for small teams and solo entrepreneurs.',
    features: ['5 users included', 'Up to 1,000 subscribers', 'Basic pipeline tracking', 'Email support', 'Real-time dashboard'],
    featured: false,
    cta: 'Get Started'
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    priceMonthly: 49,
    description: 'Advanced tools for rapidly growing sales teams.',
    features: ['25 users included', 'Up to 10,000 subscribers', 'Advanced analytics', 'Marketing automations', 'Priority email support', 'Template builder access'],
    featured: true,
    cta: 'Start Free Trial'
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    priceMonthly: 99,
    description: 'Dedicated infrastructure for your expanding enterprise.',
    features: ['Unlimited users', 'Unlimited subscribers', 'Custom reporting', 'SSO & Advanced security', 'Dedicated account manager', '24/7 Phone & Email support'],
    featured: false,
    cta: 'Contact Sales'
  },
];

export default function Pricing() {
  const { formatCurrency } = useCurrency();

  return (
    <div className="flex w-full flex-col min-h-screen bg-white font-sans selection:bg-[#0B3954]/10">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-50 border-b border-slate-100">
        <div className="container-width mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 animate-fade-in-up">
              Simple, <span className="text-[#0B3954]">transparent</span> pricing.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed animate-fade-in-up delay-100">
              Choose the plan that fits your current scale. No hidden fees, no complex contracts. Start growing with AlineCRM today.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-24 bg-white relative">
        <div className="container-width mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-300 ${tier.featured
                    ? 'bg-[#0B3954] text-white shadow-2xl scale-105 z-10'
                    : 'bg-white border border-slate-200 text-slate-900 hover:border-slate-300 shadow-sm'
                  }`}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-[#0B3954] border-[#0B3954] border text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${tier.featured ? 'text-white' : 'text-slate-900'}`}>{tier.name}</h3>
                  <p className={`text-sm leading-relaxed ${tier.featured ? 'text-slate-300' : 'text-slate-500'}`}>{tier.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-bold tracking-tight ${tier.featured ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(tier.priceMonthly)}</span>
                    <span className={`text-sm font-semibold ${tier.featured ? 'text-slate-400' : 'text-slate-500'}`}>/month</span>
                  </div>
                </div>

                <Link
                  to="/login"
                  className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold transition-all mb-10 ${tier.featured
                      ? 'bg-white text-[#0B3954] hover:bg-slate-50'
                      : 'bg-[#0B3954] text-white hover:bg-slate-800'
                    }`}
                >
                  {tier.cta} <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="space-y-4">
                  <p className={`text-sm font-bold uppercase tracking-wider ${tier.featured ? 'text-slate-300' : 'text-slate-400'}`}>What's included</p>
                  <ul className="space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-sm items-start">
                        <Check className={`w-5 h-5 shrink-0 ${tier.featured ? 'text-white' : 'text-[#0B3954]'}`} />
                        <span className={tier.featured ? 'text-slate-200' : 'text-slate-600'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section (Simple) */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container-width mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {[
              { q: "Can I change plans anytime?", a: "Yes, you can upgrade or downgrade your plan at any time from your billing dashboard." },
              { q: "Do you offer a free trial?", a: "Every professional plan comes with a 14-day free trial. No credit card required to start." },
              { q: "What happens after my trial ends?", a: "You can choose to subscribe to any of our plans or your account will be limited until you provide billing information." },
            ].map((faq, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-3 text-lg">{faq.q}</h4>
                <p className="text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
