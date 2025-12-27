import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useSidebar } from "../../context/SidebarContext";
import SoundMixer from "../../components/SoundMixer";

// Mock Data

const GAMES = [
  { name: "Sudoku", color: "bg-gray-900", icon: "🔢" },
  { name: "Color Connect", color: "bg-yellow-400", icon: "🔗" },
  { name: "Super Mario", color: "bg-red-500", icon: "🍄" },
  { name: "Tetris", color: "bg-blue-600", icon: "🧱" },
  { name: "Ludo", color: "bg-white border", icon: "🎲" },
  { name: "Snakes & Ladders", color: "bg-orange-400", icon: "🐍" },
];

const PLAYLIST = [
  {
    title: "Meditation",
    duration: "12m53s",
    thumbnail: "bg-blue-200",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    title: "Motivation",
    duration: "7m26s",
    thumbnail: "bg-gray-800",
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bW90aXZhdGlvbnxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    title: "Meditation",
    duration: "12m53s",
    thumbnail: "bg-orange-200",
    image: "https://images.unsplash.com/photo-1528319725582-ddc096101511?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1lZGl0YXRpb258ZW58MHx8MHx8fDA%3D"
  },
  {
    title: "Learning",
    duration: "5m13s",
    thumbnail: "bg-red-900",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGVhcm5pbmd8ZW58MHx8MHx8fDA%3D"
  },
];

export default function Mindfulness() {
  const { isExpanded } = useSidebar();
  const [thought, setThought] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [zenMode, setZenMode] = useState(false);

  return (
    <div className={`flex min-h-screen w-full font-sans transition-colors duration-500 ${zenMode ? 'bg-black' : 'bg-white'}`}>
      {!zenMode && <Sidebar />}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          zenMode 
            ? "ml-0 max-w-full" 
            : isExpanded
              ? "ml-[280px] max-w-[calc(100vw-280px)]"
              : "ml-[110px] max-w-[calc(100vw-110px)]"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <h1 className={`text-3xl font-bold font-cursive transition-colors ${zenMode ? 'text-gray-100' : 'text-gray-900'}`}>Mindfulness</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setZenMode(!zenMode)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-all ${
                zenMode 
                  ? 'border-white/20 bg-white/10 text-gray-200 hover:bg-white/20' 
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <img src="/icons/target-icon.svg" alt="Zen Mode" className={`h-4 w-4 ${zenMode ? '' : 'filter invert-0 brightness-0'}`} />
              {zenMode ? 'Exit Zen' : 'Zen Mode'}
            </button>

            <button className={`rounded-full border border-dotted px-6 py-2 text-sm font-medium shadow-sm transition-colors ${
              zenMode
                ? 'border-gray-600 bg-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200'
                : 'border-foreground bg-white text-gray-600 hover:bg-gray-50'
            }`}>
              Forget everything for a moment
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 pt-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              {/* Ambient Sounds */}
              <SoundMixer zenMode={zenMode} />

              {/* Games */}
              <div className={`rounded-2xl border p-6 shadow-sm transition-colors duration-500 ${
                zenMode 
                  ? 'border-white/10 bg-white/5 backdrop-blur-sm' 
                  : 'border-gray-100 bg-white'
              }`}>
                <div className="mb-4">
                  <h2 className={`text-lg font-semibold transition-colors ${zenMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    Play some refreshing games
                  </h2>
                  <p className={`text-xs transition-colors ${zenMode ? 'text-gray-400' : 'text-gray-500'}`}>*20 mins daily limit</p>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {GAMES.map((game) => (
                    <div
                      key={game.name}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-xl shadow-sm text-2xl transition-opacity ${game.color} ${zenMode ? 'opacity-90 hover:opacity-100' : ''}`}
                      >
                        {game.icon}
                      </div>
                      <span className={`text-center text-xs font-medium transition-colors ${zenMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {game.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              {/* Playlist */}
              <div className={`rounded-2xl border p-6 shadow-sm transition-colors duration-500 ${
                zenMode 
                  ? 'border-white/10 bg-white/5 backdrop-blur-sm' 
                  : 'border-gray-100 bg-white'
              }`}>
                <h2 className={`mb-4 text-lg font-semibold transition-colors ${zenMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  <span className="italic">Aline</span> your thoughts with this
                  calming playlist
                </h2>
                <div className="flex flex-col gap-4">
                  {PLAYLIST.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 rounded-xl p-3 transition-colors ${
                        zenMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div
                        className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg ${item.thumbnail}`}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h3 className={`font-semibold transition-colors ${zenMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {item.title}
                        </h3>
                        <span className={`text-sm transition-colors ${zenMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thoughts */}
              <div className={`rounded-2xl border p-6 shadow-sm transition-colors duration-500 ${
                zenMode 
                  ? 'border-white/10 bg-white/5 backdrop-blur-sm' 
                  : 'border-gray-100 bg-white'
              }`} style={{ maxHeight: '270px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <h2 className={`mb-3 text-lg font-semibold transition-colors ${zenMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  What's on your mind?
                </h2>
                <textarea
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  placeholder="Write out your thoughts...or motivation for the day..."
                  className={`resize-none rounded-xl border p-3 transition-all focus:outline-none focus:ring-0 ${
                    zenMode 
                      ? 'border-white/10 bg-black/20 text-gray-200 placeholder-gray-500 focus:border-gray-500' 
                      : 'border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:border-gray-900'
                  }`}
                  style={{ minHeight: '60px', maxHeight: '80px', overflow: 'auto' }}
                />
                <div className="mt-3 flex items-center justify-between">
                  <label className={`flex items-center gap-2 text-sm ${zenMode ? 'text-gray-400' : 'text-gray-600'}`}> 
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className={`h-4 w-4 rounded border-gray-300 focus:ring-gray-900 ${zenMode ? 'bg-gray-700 border-gray-600' : ''}`}
                    />
                    Pin to dashboard
                  </label>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800 p-0">
                    <img src="/icons/send-icon.svg" alt="Send" className="h-5 w-5 m-0" style={{ filter: 'invert(1)' }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
