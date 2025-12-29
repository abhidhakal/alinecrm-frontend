import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Mascot from '../assets/aline-mascot.png';
import Logo from '../assets/aline-logo.svg';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            showToast('Please enter both email and password', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/auth/login', {
                email,
                password
            });

            login(response.data.access_token, response.data.user);
            showToast('Login successful!', 'success');

            const userRole = response.data.user.role;
            if (userRole === 'admin' || userRole === 'superadmin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
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
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex w-full md:w-1/2 flex-col justify-center p-12 lg:p-16">
                    <div className="flex flex-col gap-10">
                        {/* Brand Section */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm">
                                <img src={Logo} alt="AlineCRM" className="h-8 w-8 rounded-full" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-primary">AlineCRM</span>
                        </div>

                        {/* Title Section */}
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-slate-900 leading-tight">Welcome Back</h1>
                            <p className="text-slate-500 font-medium">Log in to your workspace to continue.</p>
                        </div>

                        {/* Form Section */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Email address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <img src="/icons/mail-icon.svg" className="h-5 w-5 opacity-40 transition-opacity group-focus-within:opacity-100" alt="" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-sm font-semibold text-slate-700">Password</label>
                                    <button className="text-xs font-bold text-primary hover:underline">Forgot password?</button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <img src="/icons/settings-icon.svg" className="h-5 w-5 opacity-40 transition-opacity group-focus-within:opacity-100" alt="" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="block w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-medium"
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

                            <div className="flex items-center ml-1">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded-md transition-all"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 font-medium select-none cursor-pointer">
                                    Stay logged in for 30 days
                                </label>
                            </div>

                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 group bg-primary text-white py-4 px-6 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                            >
                                {loading ? 'Checking credentials...' : 'Sign In'}
                                <img src="/icons/arrow-right.svg" className="h-5 w-5 invert transition-transform group-hover:translate-x-1" alt="" />
                            </button>
                        </div>

                        {/* Footer Section */}
                        <div className="pt-4 space-y-4">
                            <div className="relative flex items-center justify-center py-2">
                                <div className="absolute w-full border-t border-slate-100"></div>
                                <span className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">or login with</span>
                            </div>

                            <button className="w-full py-4 px-4 rounded-2xl border border-slate-200 text-sm font-bold text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3">
                                <img src="/icons/mail-icon.svg" className="w-5 h-5 opacity-50" alt="" />
                                Magic Login Link
                            </button>

                            <p className="text-center text-sm font-medium text-slate-500 pt-2">
                                New to Aline? <Link to="/register" className="text-primary font-bold hover:underline ml-1">Create an account</Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation helpers */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute bottom-8 right-12 flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors"
                >
                    <img src="/icons/chevron-left.svg" className="h-4 w-4 opacity-40" alt="" />
                    Back to website
                </button>
            </div>
        </div>
    );
}
