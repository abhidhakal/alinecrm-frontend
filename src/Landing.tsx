import { Link } from 'react-router-dom';
import Header from './components/Header';
import GoogleLogo from './assets/brand-logos/workspace-logo.png';
import Gradient from './assets/gradient.png';
import BrevoLogo from './assets/brand-logos/brevo-logo.png';
import MetaLogo from './assets/brand-logos/meta-logo.png';
import TikTokLogo from './assets/brand-logos/tiktok-logo.png';
import XLogo from './assets/brand-logos/x-logo.png';

export default function Landing() {
  return (
    <div className="flex w-full flex-col">
      <div
        className="relative flex min-h-[90vh] w-full flex-col bg-cover bg-center"
        style={{ backgroundImage: `url(${Gradient})` }}
      >
        <Header />

        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <h1 className="max-w-4xl text-5xl font-bold leading-tight text-black md:text-6xl lg:text-[64px] mb-6">
            Aligned Pipelines. Higher Sales. Lower Costs.
          </h1>
          <p className="max-w-2xl text-lg text-gray-800 md:text-xl mb-10">
            AlineCRM helps you streamline your sales process, track leads effortlessly, and optimize costs - all in one platform.
          </p>

          <div className="flex items-center gap-4">
            <Link to="/login" className="rounded-xl bg-[#1A1A1A] px-8 py-3.5 text-base font-medium text-white transition hover:bg-black">
              Get Started
            </Link>
            <button className="flex items-center gap-2 rounded-xl border border-gray-800 bg-transparent px-8 py-3.5 text-base font-medium text-black transition hover:bg-black/5">
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
        <h2 className="mb-16 text-center text-3xl font-bold text-black md:text-4xl">
          Connect the tools <span className="font-normal text-black">that power</span>
          <br />
          <span className="font-bold">your business.</span>
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-12 grayscale opacity-80">
          <img src={GoogleLogo} alt="Google Workspace" className="h-8 md:h-10 object-contain" />
          <img src={BrevoLogo} alt="Brevo" className="h-8 md:h-10 object-contain" />
          <img src={MetaLogo} alt="Meta" className="h-8 md:h-10 object-contain" />
          <img src={TikTokLogo} alt="TikTok" className="h-8 md:h-10 object-contain" />
          <img src={XLogo} alt="X" className="h-6 md:h-8 object-contain" />
        </div>
      </div>
    </div>
  );
}
