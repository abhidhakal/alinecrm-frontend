import { useState, useCallback, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import SocialsHeader from "../../features/admin/components/SocialsHeader";
import { useSidebar } from "../../context/SidebarContext";
import { socialApi } from "../../api/social.api";
import type { SocialChannel, SocialPost } from "../../api/social.api";
import {
  Facebook,
  Twitter as TwitterIcon,
  Linkedin,
  Send,
  Share2,
  CheckCircle2,
  Plus,
  AlertCircle,
  ExternalLink,
  Trash2,
  Instagram,
  Youtube,
  Music2,
  LayoutDashboard,
  History,
  Settings2,
  Globe
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

export default function Socials() {
  const { isExpanded } = useSidebar();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [postContent, setPostContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter', 'facebook', 'linkedin']);
  const [showAddModal, setShowAddModal] = useState(false);
  const [channels, setChannels] = useState<SocialChannel[]>([]);
  const [recentPosts, setRecentPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [newPlatform, setNewPlatform] = useState("Twitter");
  const [newHandle, setNewHandle] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [fetchedChannels, fetchedPosts] = await Promise.all([
        socialApi.getChannels(),
        socialApi.getRecentPosts()
      ]);
      setChannels(fetchedChannels);
      setRecentPosts(fetchedPosts);
    } catch (error) {
      console.error("Failed to fetch social data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    setLastUpdated(new Date());
    fetchData();
  }, [fetchData]);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleBulkShare = async () => {
    const text = postContent;
    const url = "https://alinecrm.com";

    // Open windows
    if (selectedPlatforms.includes('twitter')) {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
    }
    if (selectedPlatforms.includes('facebook')) {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
    }
    if (selectedPlatforms.includes('linkedin')) {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
    }

    // Log to DB
    try {
      await socialApi.logPost({ content: text, platforms: selectedPlatforms });
      setPostContent("");
      fetchData();
    } catch (e) {
      console.error("Failed to log post", e);
    }
  };

  const handleAddChannel = async () => {
    if (!newHandle.trim()) return;
    try {
      await socialApi.addChannel({ platform: newPlatform, handle: newHandle });
      setNewHandle("");
      setShowAddModal(false);
      fetchData();
    } catch (e) {
      alert("Failed to add channel");
    }
  };

  const handleDeleteChannel = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await socialApi.deleteChannel(id);
      fetchData();
    } catch (e) {
      alert("Failed to delete channel");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white relative font-sans">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>
        <SocialsHeader onRefresh={handleRefresh} lastUpdated={lastUpdated} />

        <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto w-full">
          {/* Sub Header / Stats Overview */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Post & Manage</h2>
              <p className="text-sm font-medium text-gray-500">Coordinate your team's social presence across platforms.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-foreground/90 hover:shadow-md active:scale-[0.98]"
              >
                <Plus size={18} />
                Connect Channel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8 space-y-8">
              {/* Composer Section */}
              <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                        <Send size={16} />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Content Composer</h3>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 bg-gray-50/80 rounded-xl border border-gray-100">
                      <PlatformMiniToggle active={selectedPlatforms.includes('twitter')} onClick={() => togglePlatform('twitter')} icon={<TwitterIcon size={14} />} />
                      <PlatformMiniToggle active={selectedPlatforms.includes('facebook')} onClick={() => togglePlatform('facebook')} icon={<Facebook size={14} />} />
                      <PlatformMiniToggle active={selectedPlatforms.includes('linkedin')} onClick={() => togglePlatform('linkedin')} icon={<Linkedin size={14} />} />
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      className="w-full h-44 p-5 rounded-2xl bg-gray-50/30 border border-gray-100 focus:border-gray-200 focus:bg-white text-gray-700 placeholder:text-gray-400 resize-none transition-all outline-none leading-relaxed"
                      placeholder="What's on your mind? Share updates with your team's audience..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                    />
                    <div className="absolute bottom-4 right-4 text-[10px] font-medium text-gray-400">
                      {postContent.length} chars
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                      <AlertCircle size={14} />
                      <span>Syncs to company history automatically</span>
                    </div>
                    <button
                      onClick={handleBulkShare}
                      disabled={!postContent.trim() || selectedPlatforms.length === 0}
                      className="flex items-center gap-2 rounded-xl bg-foreground px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-foreground/90 disabled:opacity-30 disabled:pointer-events-none active:scale-[0.98]"
                    >
                      <Share2 size={18} />
                      Launch Bulk Share
                    </button>
                  </div>
                </div>
              </div>

              {/* History Section */}
              <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                      <History size={16} />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Recent Post History</h3>
                  </div>
                  <span className="text-[10px] font-medium text-gray-400">Global Feed</span>
                </div>

                <div className="divide-y divide-gray-50">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                      <div className="h-10 w-10 border-4 border-gray-50 border-t-foreground rounded-full animate-spin" />
                      <p className="text-sm font-semibold">Synchronizing history...</p>
                    </div>
                  ) : recentPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                      <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <History size={32} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-500">No activity logged yet.</p>
                        <p className="text-xs font-medium text-gray-400">Shares from your team will appear here.</p>
                      </div>
                    </div>
                  ) : (
                    recentPosts.map((post) => (
                      <div key={post.id} className="p-6 hover:bg-gray-50/50 transition-all group border-l-4 border-transparent hover:border-foreground">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-gray-400 tracking-widest">
                              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 text-[10px] font-semibold text-green-600 border border-green-100">
                            <CheckCircle2 size={10} />
                            Verified Share
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-700 leading-relaxed mb-4">{post.content}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-gray-400 mr-1">Platforms:</span>
                          {post.platforms.map(p => (
                            <div key={p} className="h-7 w-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-foreground group-hover:bg-white transition-all">
                              <PlatformIcon platform={p} size={14} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Tools */}
            <div className="xl:col-span-4 space-y-8">
              {/* Linked Accounts */}
              <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                      <LayoutDashboard size={16} />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Linked Profiles</h3>
                  </div>
                  <button onClick={() => fetchData()} className="text-gray-400 hover:text-foreground transition-colors p-1">
                    <Settings2 size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {channels.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-xs font-medium text-gray-400 italic">No reference channels added.</p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="mt-3 text-xs font-semibold text-foreground underline decoration-dotted underline-offset-4 hover:text-black transition-all"
                      >
                        + Add first channel
                      </button>
                    </div>
                  ) : (
                    channels.map(acc => (
                      <div key={acc.id} className="flex items-center justify-between group p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-foreground group-hover:bg-white border border-transparent group-hover:border-gray-100 transition-all">
                            <PlatformIcon platform={acc.platform} size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-900">{acc.platform}</p>
                            <p className="text-[11px] font-medium text-gray-400">{acc.handle}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => handleDeleteChannel(acc.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 size={14} />
                          </button>
                          <button className="p-1.5 text-gray-300 hover:text-foreground hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100">
                            <ExternalLink size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Utility Hubs */}
              <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                    <Globe size={16} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Utility Hubs</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <UtilityButton label="Meta Suite" url="https://business.facebook.com" />
                  <UtilityButton label="X Pro Hub" url="https://twitter.com/pro_dashboard" />
                  <UtilityButton label="Ads Manager" url="https://linkedin.com/campaignmanager" />
                  <UtilityButton label="Brand Wiki" url="#" />
                </div>
              </div>

              <div className="bg-blue-600 rounded-[20px] p-6 text-white overflow-hidden relative group">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-white/20 rounded-lg">
                      <AlertCircle size={14} className="text-white" />
                    </div>
                    <h4 className="text-sm font-bold">How Posting Works</h4>
                  </div>
                  <p className="text-xs font-medium text-white/90 leading-relaxed mb-4">
                    <strong>No login required!</strong> This tool uses your active browser sessions.
                  </p>
                  <ul className="text-[11px] font-medium text-white/80 space-y-2 list-disc pl-4">
                    <li>We open a <strong>new tab</strong> for each platform.</li>
                    <li>You must be logged into Twitter/ LinkedIn on your browser.</li>
                    <li>We pre-fill the text, you just hit "Post".</li>
                  </ul>
                </div>
                <div className="absolute -bottom-4 -right-4 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Share2 size={100} />
                </div>
              </div>

              {/* Pro Tip */}
              <div className="bg-foreground rounded-[20px] p-6 text-white overflow-hidden relative group">
                <div className="relative z-10">
                  <p className="text-[10px] font-semibold text-white/50 mb-2">Efficiency Pro Tip</p>
                  <h4 className="text-sm font-semibold mb-3">Bulk Sharing saves ~40 mins/week</h4>
                  <p className="text-xs font-medium text-white/70 leading-relaxed">
                    By coordinating posts from one window, your team maintains a consistent brand voice without platform fatigue.
                  </p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                  <Share2 size={80} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Connection Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Sync Profile</h3>
            <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">Entering your brand's handles helps the team reference and share to the correct accounts.</p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-gray-400 ml-1">Platform</label>
                <div className="relative">
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="w-full h-12 appearance-none bg-gray-50/50 rounded-2xl px-5 pr-12 border border-gray-100 font-semibold outline-none focus:border-gray-300 focus:bg-white transition-all"
                  >
                    <option>Twitter</option>
                    <option>Facebook</option>
                    <option>LinkedIn</option>
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>YouTube</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-gray-400 ml-1">Profile Handle / UID</label>
                <input
                  type="text"
                  value={newHandle}
                  onChange={(e) => setNewHandle(e.target.value)}
                  placeholder="@yourbrand"
                  className="w-full h-12 bg-gray-50/50 rounded-2xl px-5 border border-gray-100 font-semibold outline-none focus:border-gray-300 focus:bg-white transition-all"
                />
              </div>
              <div className="flex gap-4 mt-10">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-xs font-semibold text-gray-400 hover:bg-gray-50 rounded-full transition-all">Cancel</button>
                <button onClick={handleAddChannel} className="flex-1 py-4 text-xs font-semibold bg-foreground text-white rounded-full shadow-lg shadow-gray-200 hover:bg-black transition-all active:scale-[0.98]">Save Profile</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlatformMiniToggle({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ${active
        ? 'bg-white text-foreground shadow-sm border border-gray-100'
        : 'text-gray-400 hover:text-gray-600'
        }`}
    >
      {icon}
    </button>
  );
}

function PlatformIcon({ platform, size }: { platform: string, size: number }) {
  switch (platform.toLowerCase()) {
    case 'twitter': return <TwitterIcon size={size} />;
    case 'facebook': return <Facebook size={size} />;
    case 'linkedin': return <Linkedin size={size} />;
    case 'instagram': return <Instagram size={size} />;
    case 'youtube': return <Youtube size={size} />;
    case 'tiktok': return <Music2 size={size} />;
    default: return <Share2 size={size} />;
  }
}

function UtilityButton({ label, url }: { label: string, url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-4 bg-gray-50/50 rounded-2xl flex flex-col items-center justify-center gap-1.5 group hover:bg-foreground transition-all border border-gray-50 hover:border-foreground shadow-sm hover:shadow-md"
    >
      <ExternalLink size={14} className="text-gray-400 group-hover:text-white transition-colors" />
      <span className="text-[10px] font-semibold text-gray-600 group-hover:text-white transition-colors">{label}</span>
    </a>
  );
}