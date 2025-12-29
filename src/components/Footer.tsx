import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ChevronUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white pt-20 pb-10 border-t border-slate-100">
      <div className="container-width mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand & Newsletter */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src="/aline-logo.svg" alt="AlineCRM" className="w-8 h-8" />
              <span className="text-xl font-bold text-slate-900">AlineCRM</span>
            </Link>
            <p className="text-slate-500 leading-relaxed mb-4">
              The all-in-one CRM platform designed to help you sell smarter, faster, and more efficiently. Built for modern teams.
            </p>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subscribe to our newsletter</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0B3954]/10 transition-all"
                />
                <button className="bg-[#0B3954] text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-slate-800 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="font-bold text-slate-900 mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/features" className="hover:text-slate-900 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/integrations" className="hover:text-primary transition-colors">Integrations</Link></li>
              <li><Link to="/changelog" className="hover:text-primary transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-slate-900 mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#0B3954] shrink-0" />
                <span>Anamnagar, Kathmandu,<br />Nepal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#0B3954] shrink-0" />
                <a href="tel:+9779865206747" className="hover:text-slate-900 transition-colors">+977 9865206747</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#0B3954] shrink-0" />
                <a href="mailto:hi.alinecrm@gmail.com" className="hover:text-slate-900 transition-colors">hi.alinecrm@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} AlineCRM Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <div className="flex gap-6 text-sm text-slate-400">
              <Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            </div>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-[#0B3954] hover:text-white hover:border-[#0B3954] transition-all shadow-sm"
              aria-label="Back to top"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
