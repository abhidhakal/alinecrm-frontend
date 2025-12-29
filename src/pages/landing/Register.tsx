import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Mascot from '../assets/aline-mascot.png';
import Logo from '../assets/aline-logo.svg';
import { useToast } from '../../context/ToastContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password || !companyName) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:3000/auth/register', {
        name,
        email,
        password,
        companyName,
        role: 'user'
      });

      showToast('Registration successful! Please login.', 'success');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      showToast(Array.isArray(message) ? message[0] : message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative flex w-full max-w-[1100px] flex-col md:flex-row items-stretch rounded-[3rem] bg-white shadow-premium border border-slate-100 overflow-hidden animate-fade-in-up">

        {/* Left Side - Visuals */}
        <div className="flex w-full md:w-1/2 items-center justify-center bg-[#f8fafc] p-12 border-r border-slate-100">
          <div className="relative w-full max-w-[400px]">
            <img
              src={Mascot}
              alt="Aline Mascot"
              className="w-full relative z-10 drop-shadow-2xl"
            />
            <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-3xl transform scale-125"></div>

            {/* Benefits Overlay (Subtle) */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[300px] space-y-3 z-20">
              {[
                "Fast Pipeline Setup",
                "Unlimited Leads Tracking"
              ].map((item, i) => (
                <div key={i} className="bg-white/90 backdrop-blur-sm border border-slate-100 p-3 rounded-2xl shadow-lg flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${(i + 4) * 100}ms` }}>
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <img src="/icons/check-icon-small.svg" className="h-4 w-4" alt="" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex w-full md:w-1/2 flex-col justify-center p-12 lg:p-16">
          <div className="flex flex-col gap-8">
            {/* Brand Section */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm">
                <img src={Logo} alt="AlineCRM" className="h-8 w-8 rounded-full" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-primary">AlineCRM</span>
            </div>

            {/* Title Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-900 leading-tight">Create workspace</h1>
              <p className="text-slate-500 font-medium">Join over 1,000+ teams selling smarter.</p>
            </div>

            {/* Form Section */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Full name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <img src="/icons/account-icon.svg" className="h-5 w-5 opacity-40 group-focus-within:opacity-100 transition-opacity" alt="" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Company Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <img src="/icons/building-icon.svg" className="h-5 w-5 opacity-40 group-focus-within:opacity-100 transition-opacity" alt="" />
                  </div>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Inc."
                    className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <img src="/icons/mail-icon.svg" className="h-5 w-5 opacity-40 group-focus-within:opacity-100 transition-opacity" alt="" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Set password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <img src="/icons/settings-icon.svg" className="h-5 w-5 opacity-40 group-focus-within:opacity-100 transition-opacity" alt="" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="block w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center group/btn"
                  >
                    <img
                      src={showPassword ? "/icons/visibility-off.svg" : "/icons/visibility-on.svg"}
                      className="h-5 w-5 opacity-40 group-hover/btn:opacity-90 transition-opacity"
                      alt=""
                    />
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-500 leading-relaxed px-1">
                By joining, you agree to our <button className="text-primary font-bold hover:underline">Terms</button> and <button className="text-primary font-bold hover:underline">Privacy Policy</button>.
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 group bg-primary text-white py-4 px-6 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 mt-2"
              >
                {loading ? 'Creating account...' : 'Get Started'}
                <img src="/icons/arrow-right.svg" className="h-5 w-5 invert transition-transform group-hover:translate-x-1" alt="" />
              </button>
            </div>

            {/* Footer Section */}
            <div className="pt-2 text-center">
              <p className="text-sm font-medium text-slate-500">
                Already using Aline? <Link to="/login" className="text-primary font-bold hover:underline ml-1">Log in here</Link>
              </p>

              <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors mt-8">
                <img src="/icons/chevron-left.svg" className="h-3 w-3 opacity-40" alt="" /> Back to website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
