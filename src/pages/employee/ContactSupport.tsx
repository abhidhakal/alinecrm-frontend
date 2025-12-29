import { useState } from 'react';
import Sidebar from "../../components/Sidebar";
import { useSidebar } from "../../context/SidebarContext";


type Tab = 'support' | 'feedback' | 'business';
export default function ContactSupport() {
  const { isExpanded } = useSidebar();
  const [activeTab, setActiveTab] = useState<Tab>('support');
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('sent'), 1500);
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-gray-900 mt-4">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>

        <header className="flex h-16 items-center border-b border-gray-100 bg-white px-8">
          <h1 className="text-xl font-bold">Help & Support</h1>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100 overflow-hidden">
          {/* Navigation */}
          <aside className="w-full lg:w-64 bg-white p-4">
            <nav className="flex flex-row lg:flex-col gap-1">
              {[
                { id: 'support', label: 'Contact Support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
                { id: 'feedback', label: 'Give Feedback', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
                { id: 'business', label: 'Business Inquiries', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === tab.id
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-8 lg:p-12">
            <div className="max-w-2xl mx-auto">

              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-2xl font-bold">
                    {activeTab === 'support' && 'Get in touch with Support'}
                    {activeTab === 'feedback' && 'Help us improve AlineCRM'}
                    {activeTab === 'business' && 'Partnership & Business'}
                  </h2>
                  <p className="text-gray-500 mt-1">
                    {activeTab === 'support' && 'Tell us what problem you are facing and we will get back to you shortly.'}
                    {activeTab === 'feedback' && 'Your ideas and observations help us make the tool better for everyone.'}
                    {activeTab === 'business' && 'Looking for custom solutions or enterprise plans? Drop us a line.'}
                  </p>
                </div>

                {formStatus === 'sent' ? (
                  <div className="rounded-2xl bg-gray-50 p-12 text-center border border-gray-100">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-black text-white mb-4">
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Message Sent!</h3>
                    <p className="text-gray-500 mt-2">Our team has received your inquiry and will respond within 24 hours.</p>
                    <button
                      onClick={() => setFormStatus('idle')}
                      className="mt-6 text-sm font-bold border-b border-black pb-0.5"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Topic</label>
                        <select className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-black transition-all bg-gray-50/50">
                          <option>General Support</option>
                          <option>Billing Issues</option>
                          <option>Technical Bug</option>
                          <option>Feature Request</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Urgency</label>
                        <select className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-black transition-all bg-gray-50/50">
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High (Urgent)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Subject</label>
                      <input
                        type="text"
                        required
                        placeholder="Briefly describe your inquiry"
                        className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-black transition-all bg-gray-50/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Message</label>
                      <textarea
                        required
                        rows={6}
                        placeholder="How can we help you today?"
                        className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-black transition-all bg-gray-50/50 resize-none"
                      ></textarea>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={formStatus === 'sending'}
                        className="rounded-xl bg-black px-10 py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50 flex items-center gap-2"
                      >
                        {formStatus === 'sending' ? (
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : null}
                        {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-gray-100">
                  <div>
                    <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest">Office Location</h4>
                    <p className="mt-4 text-sm font-bold text-gray-900 leading-relaxed">
                      Aline Technology Pvt. Ltd.<br />
                      Kathmandu, Nepal<br />
                      Bagmati Province, 44600
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest">Quick Contact</h4>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-bold text-gray-900">support@alinecrm.io</p>
                      <p className="text-sm font-bold text-gray-900">+977 (01) 456-7890</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

