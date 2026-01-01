import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../api/users.api';
import { uploadApi } from '../../api/clients/upload.client';
import { useToast } from '../../context/ToastContext';

type Tab = 'general' | 'security';

export default function Profile() {
  const { isExpanded } = useSidebar();
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Profile State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    image: user?.profilePicture || '',
  });

  // Security State
  const [securityData, setSecurityData] = useState({
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        image: user.profilePicture || '',
      });
    }
  }, [user]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      try {
        setUploadingImage(true);
        const imageUrl = await uploadApi.uploadProfilePicture(file);
        const updated = await usersApi.update(user.id, { profilePicture: imageUrl });
        updateUser(updated);
        showToast('Profile picture updated', 'success');
      } catch (error: any) {
        showToast(error.response?.data?.message || 'Failed to upload image', 'error');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setLoading(true);
      const updated = await usersApi.update(user.id, {
        name: profileData.name,
        email: profileData.email,
      });
      updateUser(updated);
      showToast('Profile updated successfully', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (securityData.password !== securityData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    try {
      setLoading(true);
      await usersApi.update(user.id, {
        password: securityData.password,
      });
      showToast('Password changed successfully', 'success');
      setSecurityData({ password: '', confirmPassword: '' });
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-gray-900 mt-4">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>

        <header className="flex h-16 items-center border-b border-gray-100 bg-white px-8">
          <h1 className="text-xl font-bold">User Profile</h1>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100 overflow-hidden">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 bg-white p-4">
            <nav className="flex flex-row lg:flex-col gap-1">
              {[
                { id: 'general', label: 'General Info', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { id: 'security', label: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-8 lg:p-12">
            <div className="max-w-2xl mx-auto">

              {activeTab === 'general' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold">General Information</h2>
                    <p className="text-gray-500 mt-1">Update your basic profile details and avatar.</p>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="flex items-center gap-6 pb-6">
                      <div className="relative group">
                        <div className="h-24 w-24 rounded-full bg-gray-100 border-2 border-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400 overflow-hidden">
                          {uploadingImage ? (
                            <div className="animate-spin h-6 w-6 border-2 border-black border-t-transparent rounded-full" />
                          ) : user?.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} className="h-full w-full object-cover" />
                          ) : (
                            user?.name?.[0].toUpperCase()
                          )}
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          </svg>
                        </label>
                      </div>
                      <div>
                        <h4 className="font-bold">Your Avatar</h4>
                        <p className="text-sm text-gray-500">JPG, PNG or WebP. 5MB max.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Full Name</label>
                        <input
                          type="text"
                          required
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Email Address</label>
                        <input
                          type="email"
                          required
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50/50"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-black px-8 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <h2 className="text-2xl font-bold">Security Settings</h2>
                    <p className="text-gray-500 mt-1">Manage your account password and security.</p>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">New Password</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={securityData.password}
                          onChange={(e) => setSecurityData({ ...securityData, password: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Confirm New Password</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={securityData.confirmPassword}
                          onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50/50"
                        />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-black px-8 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Change Password'}
                      </button>
                    </div>
                  </form>

                  <div className="pt-10 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-red-600">Danger Zone</h3>
                    <p className="text-sm text-gray-500 mt-1">Deleting your account is permanent. All your CRM data will be lost.</p>
                    <button className="mt-4 rounded-xl border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 transition-all">
                      Delete My Account
                    </button>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
