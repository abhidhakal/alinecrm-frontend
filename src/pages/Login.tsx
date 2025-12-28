import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mascot from '../assets/aline-mascot.png';
import Logo from '../assets/aline-logo.svg';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

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

            // Store token and user data using AuthContext
            login(response.data.access_token, response.data.user);

            showToast('Login successful!', 'success');

            // Redirect based on role
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
        <div className="flex min-h-screen items-center justify-center bg-[#F5F5F5]">
            <div className="relative flex w-full max-w-[1200px] items-center justify-between rounded-[40px] bg-white p-12 shadow-sm md:flex-row flex-col gap-10">

                {/* Left Side - Mascot */}
                <div className="flex w-full md:w-1/2 items-center justify-center">
                    <img
                        src={Mascot}
                        alt="Aline Mascot"
                        className="max-w-[450px] w-full object-contain"
                    />
                </div>

                {/* Right Side - Login Form */}
                <div className="flex w-full md:w-[45%] flex-col gap-8 pr-12">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img src={Logo} alt="AlineCRM" className="h-10 w-10 rounded-full" />
                        <span className="text-2xl font-bold text-black">AlineCRM</span>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Email Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-foreground">Enter your email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="johndoe@gmail.com"
                                className="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-200"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-foreground">Enter your password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="********"
                                    className="w-full rounded-lg bg-gray-100 px-4 py-3 pr-12 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
                                >
                                    <img
                                        src={showPassword ? "/icons/visibility-off.svg" : "/icons/visibility-on.svg"}
                                        alt={showPassword ? "Hide password" : "Show password"}
                                        className="h-5 w-5"
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            <label htmlFor="remember" className="text-sm text-gray-600 select-none cursor-pointer">Remember Me</label>
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full rounded-lg bg-[#2b2b2b] py-3.5 text-base font-bold text-white transition hover:bg-black disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center justify-center">
                            <div className="absolute w-full border-t border-border"></div>
                            <span className="relative bg-white px-2 text-sm text-muted">or</span>
                        </div>

                        {/* Mail link option */}
                        <button className="flex items-center justify-center gap-2 text-sm font-medium text-foreground hover:text-black">
                            <img src="/icons/mail-icon.svg" alt="" />
                            Mail me a login link
                        </button>
                    </div>
                </div>

                {/* Return to HomePage */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute bottom-12 right-44 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
                >
                    <img src="/icons/chevron-left.svg" alt="Back" className="h-4 w-4" />
                    Return to HomePage
                </button>

                <button
                    onClick={() => navigate('/')}
                    className="absolute bottom-12 right-12 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
                >
                    Click to Sign Up
                </button>
            </div>
        </div>
    );
}