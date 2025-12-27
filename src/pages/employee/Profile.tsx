import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../context/AuthContext';
import { usersApi, type UpdateUserDto } from '../../api/users';
import { uploadApi } from '../../api/upload';
import { useToast } from '../../context/ToastContext';

export default function Profile() {
  const { isExpanded } = useSidebar();
  const { user: currentUser, updateUser } = useAuth();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        password: '',
        confirmPassword: '',
        profilePicture: currentUser.profilePicture || ''
      });
      setPreviewImage(currentUser.profilePicture || '');
    }
  }, [currentUser]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showToast('Please select a valid image file (JPEG, PNG, or WebP)', 'error');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        showToast('Image size must be less than 5MB', 'error');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (!currentUser) return;

    setLoading(true);
    try {
      let profilePictureUrl = formData.profilePicture;

      // Upload image to Cloudinary if a new file is selected
      if (selectedFile) {
        setUploadingImage(true);
        try {
          profilePictureUrl = await uploadApi.uploadProfilePicture(selectedFile);
          setUploadingImage(false);
        } catch (error: any) {
          setUploadingImage(false);
          showToast(error.response?.data?.message || 'Failed to upload image', 'error');
          setLoading(false);
          return;
        }
      }

      const updateData: UpdateUserDto = {
        name: formData.name,
        email: formData.email,
        profilePicture: profilePictureUrl
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const updatedUser = await usersApi.update(currentUser.id, updateData);
      
      // Update local storage and context
      localStorage.setItem('user', JSON.stringify(updatedUser));
      updateUser(updatedUser);
      
      showToast('Profile updated successfully', 'success');
      
      // Clear password fields and selected file
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      setSelectedFile(null);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex min-h-screen w-full bg-white relative font-sans">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>
        
        {/* Main Content */}
        <main className="flex-1 p-10">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Profile Settings</h1>
              <p className="text-sm text-gray-500 font-medium">Manage your account information and preferences</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-[24px] overflow-hidden">
              {/* Profile Header Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-8 py-10 border-b border-gray-200">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                      {previewImage ? (
                        <img src={previewImage} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-3xl font-bold text-gray-600">
                          {currentUser.name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                        </span>
                      )}
                    </div>
                    <label 
                      htmlFor="profile-upload" 
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Upload an image"
                    >
                      <img src="/icons/upload-icon.svg" alt="Upload" className="h-8 w-8 invert" />
                    </label>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-1">{currentUser.name}</h2>
                    <p className="text-sm text-gray-600 mb-3">{currentUser.email}</p>
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border ${getRoleBadgeColor(currentUser.role)}`}>
                      {getRoleLabel(currentUser.role)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8">
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 outline-none transition-all"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 outline-none transition-all"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Change Password */}
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-foreground mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 outline-none transition-all"
                          placeholder="Leave blank to keep current"
                          minLength={6}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 outline-none transition-all"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    {formData.password && (
                      <p className="mt-2 text-xs text-gray-500">Password must be at least 6 characters long</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          name: currentUser.name || '',
                          email: currentUser.email || '',
                          password: '',
                          confirmPassword: '',
                          profilePicture: currentUser.profilePicture || ''
                        });
                        setPreviewImage(currentUser.profilePicture || '');
                        setSelectedFile(null);
                      }}
                      className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      Reset Changes
                    </button>
                    <button
                      type="submit"
                      disabled={loading || uploadingImage}
                      className="px-6 py-3 rounded-xl bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {uploadingImage ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Uploading Image...
                        </>
                      ) : loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Updating...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
