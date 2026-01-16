import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../assets/aline-logo.svg';
import { useToast } from '../../context/ToastContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const { showToast } = useToast();
  const { availableCurrencies } = useCurrency();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user: authUser } = useAuth();

  useEffect(() => {
    if (isAuthenticated && authUser) {
      const userRole = authUser.role;
      if (userRole === 'admin' || userRole === 'superadmin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, authUser, navigate]);

  useEffect(() => {
    const token = searchParams.get('token');
    const userDataStr = searchParams.get('user');

    if (token && userDataStr) {
      try {
        const user = JSON.parse(userDataStr);
        login(token, user);
        showToast('Registration successful!', 'success');

        if (user.role === 'admin' || user.role === 'superadmin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } catch (e) {
        console.error('Failed to parse user data from URL', e);
      }
    }
  }, [searchParams, login, navigate, showToast]);

  // Step 1: Account
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2: Profile & Company
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companySite, setCompanySite] = useState('');
  const [industry, setIndustry] = useState('');
  const [teamSize, setTeamSize] = useState('');

  // Step 3: CRM Settings
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [language, setLanguage] = useState('English');

  const [loading, setLoading] = useState(false);

  const validateStep1 = () => {
    if (!email || !password || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return false;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return false;
    }
    if (password.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!name || !companyName) {
      showToast('Please fill in required fields', 'error');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name,
        email,
        password,
        companyName,
        companySite,
        industry,
        teamSize,
        settings: {
          currency,
          timezone,
          dateFormat,
          language,
        },
        role: 'user'
      });

      showToast('Registration successful!', 'success');
      setCurrentStep(4);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      showToast(Array.isArray(message) ? message[0] : message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-200 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-indigo-200 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative w-full max-w-[520px] animate-fade-in-up">
        {/* Header - Hide on Success Step */}
        {currentStep < 4 && (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                  <img src={Logo} alt="AlineCRM" className="h-9 w-9 rounded-xl" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-primary">AlineCRM</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
              <p className="text-slate-500 font-medium">Step {currentStep} of 3 - {currentStep === 1 ? 'Account Setup' : currentStep === 2 ? 'Company Details' : 'CRM Preferences'}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${step <= currentStep ? 'bg-black' : 'bg-slate-200'
                      }`}
                  ></div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="bg-white rounded-3xl shadow-premium border border-slate-100 p-8">
          {/* Step 4: Success View */}
          {currentStep === 4 && (
            <div className="text-center py-8 animate-fade-in-up">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <img src="/icons/check-icon-small.svg" className="h-10 w-10 text-green-600 filter invert-[.40] sepia-[1] saturate-[3] hue-rotate-[80deg]" alt="" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful!</h2>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                Your workspace <strong className="text-slate-800">{companyName}</strong> has been created successfully. You can now log in to start setting up your CRM.
              </p>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full bg-black text-white py-4 px-6 rounded-2xl font-bold hover:bg-black/90 transition-all shadow-xl shadow-primary/20"
              >
                Go to Login
                <img src="/icons/arrow-right.svg" className="h-5 w-5 invert" alt="" />
              </Link>
            </div>
          )}

          {/* Step 1: Account */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
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

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <img src="/icons/settings-icon.svg" className="h-5 w-5 opacity-40 group-focus-within:opacity-100 transition-opacity" alt="" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="block w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center group/btn"
                  >
                    <img
                      src={showConfirmPassword ? "/icons/visibility-off.svg" : "/icons/visibility-on.svg"}
                      className="h-5 w-5 opacity-40 group-hover/btn:opacity-90 transition-opacity"
                      alt=""
                    />
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-500 leading-relaxed px-1 pt-2">
                By continuing, you agree to our <button className="text-primary font-bold hover:underline">Terms</button> and <button className="text-primary font-bold hover:underline">Privacy Policy</button>.
              </div>

              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 group bg-black text-white py-4 px-6 rounded-2xl font-bold hover:bg-black/90 transition-all shadow-xl shadow-primary/20 mt-4"
              >
                Continue
                <img src="/icons/arrow-right.svg" className="h-5 w-5 invert transition-transform group-hover:translate-x-1" alt="" />
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center py-2">
                <div className="absolute w-full border-t border-slate-100"></div>
                <span className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
              </div>

              {/* Google Sign-In Button */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full py-4 px-4 rounded-2xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3"
              >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                Continue with Google
              </button>
            </div>
          )}

          {/* Step 2: Company & Profile */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Full Name <span className="text-red-500">*</span></label>
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

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Company Name <span className="text-red-500">*</span></label>
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

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Company Website</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <img src="/icons/link-icon.svg" className="h-5 w-5 opacity-40 group-focus-within:opacity-100 transition-opacity" alt="" />
                  </div>
                  <input
                    type="url"
                    value={companySite}
                    onChange={(e) => setCompanySite(e.target.value)}
                    placeholder="https://acme.com"
                    className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Industry</label>
                  <div className="relative">
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="block w-full appearance-none px-4 py-3.5 pr-10 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-medium"
                    >
                      <option value="">Select...</option>
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="retail">Retail</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Team Size</label>
                  <div className="relative">
                    <select
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      className="block w-full appearance-none px-4 py-3.5 pr-10 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-medium"
                    >
                      <option value="">Select...</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                      <option value="500+">500+</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <img src="/icons/chevron-left.svg" className="h-4 w-4 opacity-60" alt="" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 group bg-black text-white py-4 px-6 rounded-2xl font-bold hover:bg-black/90 transition-all shadow-xl shadow-primary/20"
                >
                  Continue
                  <img src="/icons/arrow-right.svg" className="h-5 w-5 invert transition-transform group-hover:translate-x-1" alt="" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: CRM Settings */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
                <p className="text-sm font-semibold text-blue-900">Almost there!</p>
                <p className="text-xs text-blue-700 mt-1">Customize your CRM settings. You can change these later.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Currency</label>
                  <div className="relative">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="block w-full appearance-none px-4 py-3.5 pr-10 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-medium"
                    >
                      {availableCurrencies.map(c => (
                        <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Timezone</label>
                  <div className="relative">
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="block w-full appearance-none px-4 py-3.5 pr-10 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-medium"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Asia/Kolkata">India</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Date Format</label>
                  <div className="relative">
                    <select
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                      className="block w-full appearance-none px-4 py-3.5 pr-10 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-medium"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Language</label>
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="block w-full appearance-none px-4 py-3.5 pr-10 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-medium"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <img src="/icons/chevron-left.svg" className="h-4 w-4 opacity-60" alt="" />
                  Back
                </button>
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 group bg-black text-white py-4 px-6 rounded-2xl font-bold hover:bg-black/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                >
                  {loading ? 'Creating your workspace...' : 'Create Account'}
                  <img src="/icons/check-icon-small.svg" className="h-5 w-5 invert transition-transform group-hover:scale-110" alt="" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm font-medium text-slate-500">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline ml-1">Log in</Link>
          </p>
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors mt-4">
            <img src="/icons/chevron-left.svg" className="h-3 w-3 opacity-40" alt="" /> Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
