export default function Header() {
  return (
    <header className="w-full h-[70px] flex items-center justify-between px-10 sticky top-0 z-50 bg-transparent">
      
      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-3">
        <img 
          src="/aline-logo.svg" 
          alt="AlineCRM Logo"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="text-white text-xl font-semibold">
          AlineCRM
        </span>
      </div>

      {/* Center: Nav Links */}
      <nav className="flex gap-10 text-white text-base font-normal">
        <a href="#product" className="hover:opacity-80">Product</a>
        <a href="#features" className="hover:opacity-80">Features</a>
        <a href="#pricing" className="hover:opacity-80">Pricing</a>
        <a href="#about" className="hover:opacity-80">About Us</a>
      </nav>

      {/* Right: CTA */}
      <button className="bg-[#0e0e0e] text-white px-7 py-2.5 rounded-xl text-[15px] font-medium hover:opacity-90">
        Book a Call
      </button>
    </header>
  );
}
