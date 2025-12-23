import { Link } from 'react-router-dom';
import Header from './components/Header';
import GoogleLogo from './assets/brand-logos/workspace-logo.png';
import BrevoLogo from './assets/brand-logos/brevo-logo.png';
import MetaLogo from './assets/brand-logos/meta-logo.png';
import TikTokLogo from './assets/brand-logos/tiktok-logo.png';
import XLogo from './assets/brand-logos/x-logo.png';

export default function Landing() {
  return (
    <div className="flex w-full flex-col">
      <div className="relative flex min-h-[100vh] w-full flex-col hero-gradient">
        <Header />
        {/* Hero Section */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <h1 className="max-w-4xl text-5xl font-bold leading-tight text-black md:text-6xl lg:text-[64px] mb-6">
            Aligned Pipelines. Higher Sales. Lower Costs.
          </h1>
          <p className="max-w-2xl text-lg text-foreground md:text-xl mb-10">
            AlineCRM helps you streamline your sales process, track leads effortlessly, and optimize costs - all in one platform.
          </p>

          <div className="flex items-center gap-4">
            <Link to="/login" className="rounded-xl bg-[#2b2b2b] px-8 py-3.5 text-base font-medium text-white transition hover:bg-black">
              Get Started
            </Link>
            <button className="flex items-center gap-2 rounded-xl border border-[#2b2b2b] bg-transparent px-8 py-3.5 text-base font-medium text-black transition hover:bg-black/5">
              Book a Demo
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Brands Section */}
      <div className="flex w-full flex-col items-center justify-center bg-white pt-24 pb-60 px-4">
        <h2 className="mb-16 text-center text-4xl font-bold text-black md:text-4xl">
          Connect the tools <span className="font-normal text-black">that power</span>
          <br />
          <span className="font-bold">your business.</span>
        </h2>

        <div className="flex flex-wrap items-center justify-center pt-32 gap-16">
          <img src={GoogleLogo} alt="Google Workspace" className="h-8 md:h-8 object-contain" />
          <img src={BrevoLogo} alt="Brevo" className="h-8 md:h-8 object-contain" />
          <img src={MetaLogo} alt="Meta" className="h-14 md:h-14 object-contain" />
          <img src={TikTokLogo} alt="TikTok" className="h-14 md:h-14 object-contain" />
          <img src={XLogo} alt="X" className="h-10 md:h-10 object-contain" />
        </div>
      </div>

      {/* Features Swipeable Section */}
      <div className="flex w-full flex-col items-center bg-[#F9FAFB] py-32 px-4 overflow-hidden">
        <h2 className="mb-20 text-center text-4xl font-bold text-black md:text-4xl">
          <span className="italic">Aline</span> your sales data with business growth
        </h2>

        <div className="flex w-full max-w-7xl overflow-x-auto pb-12 no-scrollbar snap-x snap-mandatory gap-8 px-4">
          {/* Card 1 */}
          <div className="min-w-[320px] md:min-w-[400px] snap-center rounded-[32px] bg-white p-10 shadow-sm border border-gray-100 flex flex-col gap-6 transition-all hover:shadow-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
              <img src="/icons/campaign-icon.svg" alt="Leads" className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-black">Lead Tracking</h3>
            <p className="text-gray-600 leading-relaxed">
              Organize and track your leads from initial contact to closed deal with our intuitive pipeline management system.
            </p>
          </div>

          {/* Card 2 */}
          <div className="min-w-[320px] md:min-w-[400px] snap-center rounded-[32px] bg-white p-10 shadow-sm border border-gray-100 flex flex-col gap-6 transition-all hover:shadow-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
              <img src="/icons/contact-icon.svg" alt="Contacts" className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-black">Contact Management</h3>
            <p className="text-gray-600 leading-relaxed">
              Maintain a detailed database of all your business contacts, including interaction history and key preferences.
            </p>
          </div>

          {/* Card 3 */}
          <div className="min-w-[320px] md:min-w-[400px] snap-center rounded-[32px] bg-white p-10 shadow-sm border border-gray-100 flex flex-col gap-6 transition-all hover:shadow-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
              <img src="/icons/calendar-icon.svg" alt="Tasks" className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-black">Task Scheduling</h3>
            <p className="text-gray-600 leading-relaxed">
              Schedule follow-ups and manage your daily sales tasks efficiently to ensure no opportunity falls through the cracks.
            </p>
          </div>

          {/* Card 4 */}
          <div className="min-w-[320px] md:min-w-[400px] snap-center rounded-[32px] bg-white p-10 shadow-sm border border-gray-100 flex flex-col gap-6 transition-all hover:shadow-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
              <img src="/icons/dashboard.svg" alt="Dashboard" className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-black">Performance Dashboard</h3>
            <p className="text-gray-600 leading-relaxed">
              Visualize your sales growth and pipeline health in real-time with customizable dashboards and detailed analytics.
            </p>
          </div>

          {/* Card 5 */}
          <div className="min-w-[320px] md:min-w-[400px] snap-center rounded-[32px] bg-white p-10 shadow-sm border border-gray-100 flex flex-col gap-6 transition-all hover:shadow-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
              <img src="/icons/notification-icon.svg" alt="Notifications" className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-black">Smart Notifications</h3>
            <p className="text-gray-600 leading-relaxed">
              Stay updated with instant alerts on lead activity, task deadlines, and important team updates across all devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
