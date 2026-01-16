import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 h-[70px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/aline-logo.svg" alt="AlineCRM" className="w-8 h-8 object-contain rounded-full" />
          <span className="text-gray-900 font-bold text-xl tracking-tight">
            AlineCRM
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="text-sm font-medium text-gray-600 hover:text-blue-900 transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden md:block text-sm font-semibold text-gray-600 hover:text-blue-900 transition-colors">
            Log in
          </Link>
          <Link to="/demo" className="bg-black hover:bg-[#082a3f] text-white px-5 py-2.5 rounded-md text-sm font-medium transition-all shadow-sm">
            Book a Demo
          </Link>
        </div>
      </div>
    </header>
  );
}
