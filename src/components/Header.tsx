import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="w-full h-[70px] flex items-center justify-between px-10 sticky top-0 z-50">

      {/* Left: Logo + Brand */}
      <Link to="/" className="flex items-center gap-3">
        <img
          src="/aline-logo.svg"
          alt="AlineCRM Logo"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="text-foreground text-xl font-semibold">
          AlineCRM
        </span>
      </Link>

      {/* Center: Nav Links */}
      <nav className="flex gap-10 text-foreground text-base font-normal">
        <Link to="/product" className="hover:opacity-80">Product</Link>
        <Link to="/features" className="hover:opacity-80">Features</Link>
        <Link to="/pricing" className="hover:opacity-80">Pricing</Link>
        <Link to="/about" className="hover:opacity-80">About Us</Link>
      </nav>

      {/* Right: CTA */}
      <button className="bg-[#121212] text-white px-7 py-2.5 rounded-xl text-[15px] font-medium hover:opacity-90">
        Book a Call
      </button>
    </header>
  );
}
