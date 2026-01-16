import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useSidebar } from "../../context/SidebarContext";
import SoundMixer from "../../components/SoundMixer";
import { mindfulnessApi } from "../../api/mindfulness.api";
import { X, Grid3X3, Blocks, Hash, Link2, Type, Worm, type LucideIcon } from "lucide-react";

type GameConfig = { name: string; color: string; icon: LucideIcon; url: string };

// Game Data
const GAMES: GameConfig[] = [
  {
    name: "Sudoku",
    color: "bg-gray-900",
    icon: Grid3X3,
    url: "https://playpager.com/embed/sudoku/index.html"
  },
  {
    name: "Tetris",
    color: "bg-blue-600",
    icon: Blocks,
    url: "https://www.play-tetris-online.com/tetris-html5/"
  },
  {
    name: "2048",
    color: "bg-yellow-400",
    icon: Hash,
    url: "https://play2048.co/"
  },
  {
    name: "Color Connect",
    color: "bg-purple-500",
    icon: Link2,
    url: "https://www.mathplayground.com/logic_color_connect.html"
  },
  {
    name: "Wordle Clone",
    color: "bg-green-600",
    icon: Type,
    url: "https://wordlewebsite.com/embed"
  },
  {
    name: "Snake",
    color: "bg-orange-400",
    icon: Worm,
    url: "https://patorjk.com/games/snake/"
  },
];

const PLAYLIST = [
  {
    title: "Meditation Guide",
    duration: "10 min",
    videoId: "inpok4MKVLM"
  },
  {
    title: "Daily Motivation",
    duration: "15 min",
    videoId: "yaQZFhrW0fU" // Admiral McRaven - Make Your Bed
  },
  {
    title: "Deep Focus",
    duration: "Live",
    videoId: "jfKfPfyJRdk"
  },
  {
    title: "Rainy Jazz Cafe",
    duration: "3 hours",
    videoId: "NJuSStkIZBg" // Rainy Jazz Cafe - Coffee Shop Vibes
  },
];

import { useAuth } from "../../context/AuthContext";

export default function AdminMindfulness() {
  const { isExpanded } = useSidebar();
  const { user } = useAuth();
  const [thought, setThought] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isSaved, setIsSaved] = useState(false); // Track if today's thought is saved
  const [zenMode, setZenMode] = useState(false);
  const [activeGame, setActiveGame] = useState<GameConfig | null>(null);
  const [activeVideo, setActiveVideo] = useState<{ title: string; videoId: string } | null>(null);

  useEffect(() => {
    // Reset state on user change to avoid showing stale data
    setThought("");
    setIsPinned(false);
    setIsSaved(false);
    loadThought();
  }, [user?.id]);

  const loadThought = async () => {
    try {
      const data = await mindfulnessApi.getTodayThought();
      if (data) {
        setThought(data.content);
        setIsPinned(data.isPinned);
        setIsSaved(true);
      }
    } catch (e) {
      console.error("Failed to load thought", e);
    }
  };

  const handleSave = async () => {
    if (!thought.trim()) return;
    try {
      await mindfulnessApi.saveThought({ content: thought, isPinned });
      setIsSaved(true);
    } catch (e) {
      console.error("Failed to save thought", e);
    }
  };

  const handlePinToggle = async (checked: boolean) => {
    setIsPinned(checked);
    // Auto-save if already saved once or if user wants to pin immediately
    if (thought.trim()) {
      try {
        await mindfulnessApi.saveThought({ content: thought, isPinned: checked });
      } catch (e) {
        console.error("Failed to update pin", e);
      }
    }
  };

  return (
    <div className={`flex min-h-screen w-full font-sans transition-colors duration-500 ${zenMode ? 'bg-black' : 'bg-white'}`}>
      {!zenMode && <Sidebar />}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${zenMode
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
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-all ${zenMode
                ? 'border-white/20 bg-white/10 text-gray-200 hover:bg-white/20'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
            >
              <img src="/icons/target-icon.svg" alt="Zen Mode" className={`h-4 w-4 ${zenMode ? '' : 'filter invert-0 brightness-0'}`} />
              {zenMode ? 'Exit Zen' : 'Zen Mode'}
            </button>

            <button className={`rounded-full border border-dotted px-6 py-2 text-sm font-medium shadow-sm transition-colors ${zenMode
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
              <div className={`rounded-2xl border p-6 shadow-sm transition-colors duration-500 ${zenMode
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
                    <button
                      key={game.name}
                      onClick={() => setActiveGame(game)}
                      className="flex flex-col items-center gap-2 transition-transform hover:scale-105"
                    >
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-xl shadow-sm transition-opacity ${game.color} ${zenMode ? 'opacity-90 hover:opacity-100' : ''}`}
                      >
                        {(() => { const Icon = game.icon; return <Icon className="w-7 h-7 text-white" />; })()}
                      </div>
                      <span className={`text-center text-xs font-medium transition-colors ${zenMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {game.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              {/* Playlist */}
              <div className={`rounded-2xl border p-6 shadow-sm transition-colors duration-500 ${zenMode
                ? 'border-white/10 bg-white/5 backdrop-blur-sm'
                : 'border-gray-100 bg-white'
                }`}>
                <h2 className={`mb-4 text-lg font-semibold transition-colors ${zenMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  <span className="italic">Aline</span> your thoughts with this
                  calming playlist
                </h2>
                <div className="flex flex-col gap-4">
                  {PLAYLIST.map((item: any, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveVideo(item)}
                      className={`flex items-center gap-4 rounded-xl p-3 transition-colors text-left group ${zenMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                    >
                      <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={item.image || `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white/90 rounded-full p-1.5 shadow-sm">
                            <img src="/icons/play-icon.svg" className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h3 className={`font-semibold transition-colors ${zenMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {item.title}
                        </h3>
                        <span className={`text-sm transition-colors ${zenMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.duration}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Thoughts */}
              <div className={`rounded-2xl border p-6 shadow-sm transition-colors duration-500 ${zenMode
                ? 'border-white/10 bg-white/5 backdrop-blur-sm'
                : 'border-gray-100 bg-white'
                }`} style={{ maxHeight: '270px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <h2 className={`mb-3 text-lg font-semibold transition-colors ${zenMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  What's on your mind?
                </h2>

                {isSaved ? (
                  <div className="flex-1 flex flex-col">
                    <div
                      className={`flex-1 rounded-xl border p-4 transition-all overflow-y-auto ${zenMode
                        ? 'border-white/10 bg-white/5 text-gray-200'
                        : 'border-yellow-100 bg-yellow-50/50 text-gray-800'
                        }`}
                      style={{ fontFamily: 'cursive', fontSize: '1.1rem', lineHeight: '1.6' }}
                    >
                      "{thought}"
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={() => handlePinToggle(!isPinned)}
                        className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all ${isPinned
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : zenMode
                            ? 'bg-white/10 text-gray-400 hover:bg-white/20'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                      >
                        <img
                          src="/icons/target-icon.svg"
                          className={`h-3 w-3 ${isPinned ? 'filter invert-[.25] sepia-[.8] saturate-[3] hue-rotate-[240deg]' : zenMode ? '' : 'filter grayscale opacity-50'}`}
                        />
                        {isPinned ? 'Pinned to Dashboard' : 'Pin to Dashboard'}
                      </button>
                      <button
                        onClick={() => setIsSaved(false)}
                        className="text-xs font-semibold text-gray-400 hover:text-gray-600"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={thought}
                      onChange={(e) => setThought(e.target.value)}
                      placeholder="Write out your thoughts...or motivation for the day..."
                      className={`resize-none rounded-xl border p-3 transition-all focus:outline-none focus:ring-0 ${zenMode
                        ? 'border-white/10 bg-black/20 text-gray-200 placeholder-gray-500 focus:border-gray-500'
                        : 'border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:border-gray-900'
                        }`}
                      style={{ minHeight: '60px', maxHeight: '80px', overflow: 'auto' }}
                    />
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={() => setIsPinned(!isPinned)}
                        className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all ${isPinned
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : zenMode
                            ? 'bg-white/10 text-gray-400 hover:bg-white/20'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                      >
                        <img
                          src="/icons/target-icon.svg"
                          className={`h-3 w-3 ${isPinned ? 'filter invert-[.25] sepia-[.8] saturate-[3] hue-rotate-[240deg]' : zenMode ? '' : 'filter grayscale opacity-50'}`}
                        />
                        {isPinned ? 'Pinned to Dashboard' : 'Pin to Dashboard'}
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={!thought.trim()}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800 p-0 disabled:opacity-50"
                      >
                        <img src="/icons/send-icon.svg" alt="Send" className="h-5 w-5 m-0" style={{ filter: 'invert(1)' }} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Game Modal */}
        {activeGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
              className={`relative flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border shadow-2xl transition-all ${zenMode
                ? 'bg-gray-900 border-white/10'
                : 'bg-white border-gray-200'
                }`}
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between border-b px-6 py-4 ${zenMode ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${activeGame.color}`}>
                    {(() => { const Icon = activeGame.icon; return <Icon className="w-5 h-5 text-white" />; })()}
                  </div>
                  <div>
                    <h3 className={`font-bold ${zenMode ? 'text-white' : 'text-gray-900'}`}>{activeGame.name}</h3>
                    <p className={`text-xs ${zenMode ? 'text-gray-400' : 'text-gray-500'}`}>Focus Mode</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveGame(null)}
                  className={`rounded-full p-2 transition-colors ${zenMode
                    ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
                    }`}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Game Frame */}
              <div className="flex-1 bg-black relative">
                <iframe
                  src={activeGame.url}
                  title={activeGame.name}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="autoplay; fullscreen; microphone; camera"
                />
              </div>

              {/* Modal Footer (Optional Tip) */}
              <div className={`px-6 py-2 text-center text-xs ${zenMode ? 'bg-white/5 text-gray-500' : 'bg-gray-50 text-gray-400'
                }`}>
                Press ESC to close • Game runs externally from {new URL(activeGame.url).hostname}
              </div>
            </div>
          </div>
        )}

        {/* Video Modal */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-black">
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setActiveVideo(null)}
                  className="rounded-full bg-black/50 p-2 text-white hover:bg-white hover:text-black transition-colors backdrop-blur-sm"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1`}
                  title={activeVideo.title}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
