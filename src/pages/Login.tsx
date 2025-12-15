import Mascot from '../assets/aline-mascot.png';
import Logo from '../assets/aline-logo.svg';

export default function Login() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F5F5F5]">
            <div className="flex w-full max-w-[1200px] items-center justify-between rounded-[40px] bg-white p-12 shadow-sm md:flex-row flex-col gap-10">

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
                        <img src={Logo} alt="AlineCRM" className="h-10 w-10" />
                        <span className="text-2xl font-bold text-black">AlineCRM</span>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Email Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-600">Enter your email</label>
                            <input
                                type="email"
                                placeholder="johndoe@gmail.com"
                                className="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-200"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-600">Enter your password</label>
                            <input
                                type="password"
                                placeholder="********"
                                className="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-200"
                            />
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
                        <button className="w-full rounded-lg bg-[#2B2B2B] py-3.5 text-base font-bold text-white transition hover:bg-black">
                            Login
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center justify-center">
                            <div className="absolute w-full border-t border-gray-300"></div>
                            <span className="relative bg-white px-2 text-sm text-gray-500">or</span>
                        </div>

                        {/* Mail link option */}
                        <button className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                            Mail me a login link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}