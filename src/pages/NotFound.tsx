import { Link } from 'react-router-dom';
import SadMascot from '../assets/aline-mascot-sad.png';

export default function NotFound() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#fafafa] px-6 font-sans">
      <div className="relative z-10 text-center flex flex-col items-center max-w-2xl">
        {/* Separated 404 Header */}
        <div className="mb-2 select-none">
          <h2 className="text-[10rem] font-black leading-none text-black flex items-center justify-center gap-6">
            <span>4</span>
            <span>0</span>
            <span>4</span>
          </h2>
        </div>

        {/* Mascot Image */}
        <div className="mb-6">
          <img
            src={SadMascot}
            alt="Sad Mascot"
            className="w-44 h-44 object-contain drop-shadow-lg"
          />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-3 border-none">
          Lost in Space?
        </h1>
        <p className="text-base leading-7 text-gray-600 max-w-md mx-auto mb-8">
          It looks like you've wandered into an uncharted corner of AlineCRM.
          Even the mascot is confused about how you got here.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="relative inline-flex items-center justify-center px-7 py-3.5 font-bold text-white transition-all duration-200 bg-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-black/90 active:scale-95 shadow-md"
          >
            Back to Earth
          </Link>

          <Link
            to="/contact"
            className="text-sm font-bold text-gray-900 flex items-center gap-2 group px-4 py-2"
          >
            Signal for Help
            <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Decorative Grid - Static */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px]">
        <div className="absolute left-0 right-0 top-0 bottom-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-blue-50 opacity-10 blur-[100px]"></div>
      </div>

      {/* Bottom Card (Glassmorphism) - Static */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center shrink-0 shadow-inner">
          <img src="/icons/ohno.svg" alt="" className="w-6 h-6 invert opacity-90" />
        </div>
        <div className="text-left">
          <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest opacity-40 mb-0.5">Aline Fact</p>
          <p className="text-xs text-gray-700 font-medium leading-tight">Mascots don't actually need oxygen, but they do need you to find a valid page.</p>
        </div>
      </div>
    </div>
  );
}
