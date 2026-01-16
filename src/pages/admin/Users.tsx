import { useState, useMemo } from 'react';
import Sidebar from "../../components/Sidebar";
import UsersHeader from "../../features/admin/components/UsersHeader";
import AddUserModal from "../../features/admin/components/AddUserModal";
import EditUserModal from "../../features/admin/components/EditUserModal";
import AdminAnnouncementModal from "../../features/admin/components/AdminAnnouncementModal";
import { useSidebar } from "../../context/SidebarContext";
import { useGetAllUsers, useCreateUser, useUpdateUser, useDeleteUser } from "../../api/users.api";
import { useToast } from "../../context/ToastContext";
import type { User, CreateUserDto, UpdateUserDto } from "../../types/user.types";

export default function Users() {
  const { isExpanded } = useSidebar();
  const { showToast } = useToast();

  // React Query Hooks
  const { data: users = [], isLoading, refetch } = useGetAllUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Local UI State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    });
  }, [users, searchQuery]);

  const handleAddUser = async (data: CreateUserDto) => {
    try {
      await createUserMutation.mutateAsync(data);
      showToast('User created successfully', 'success');
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
      showToast('Failed to create user', 'error');
    }
  };

  const handleEditUser = async (id: number, data: UpdateUserDto) => {
    try {
      await updateUserMutation.mutateAsync({ id, data });
      showToast('User updated successfully', 'success');
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      showToast('Failed to update user', 'error');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUserMutation.mutateAsync(id);
      showToast('User deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Failed to delete user', 'error');
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>
        <UsersHeader
          onRefresh={refetch}
          lastUpdated={new Date()}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="px-8 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <img src="/icons/search-icon.svg" alt="Search" className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-[280px] rounded-full border border-transparent bg-gray-100/50 pl-10 pr-4 text-sm text-foreground focus:bg-white focus:border-gray-200 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAnnouncementModalOpen(true)}
              className="group flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:translate-y-0"
            >
              <img src="/icons/campaign-icon.svg" alt="Broadcast" className="h-4 w-4 brightness-0 invert" />
              Broadcast
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-all"
            >
              <img src="/icons/plus-icon.svg" alt="Add" className="h-5 w-5 brightness-0 invert" />
              Add User
            </button>
          </div>
        </div>

        <main className="flex-1 px-8 pb-8">
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <img src="/icons/account-icon.svg" alt="No users" className="w-8 h-8 opacity-20" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No users found</h3>
                <p className="text-gray-500 text-sm mt-1">Try adjusting your search or add a new user.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">User Details</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="group hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 border border-gray-200 ring-2 ring-white">
                              {user.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${user.role === 'superadmin'
                            ? 'bg-red-50 text-red-700 border-red-100'
                            : user.role === 'admin'
                              ? 'bg-purple-50 text-purple-700 border-purple-100'
                              : 'bg-green-50 text-green-700 border-green-100'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.role === 'superadmin' ? 'bg-red-500' : user.role === 'admin' ? 'bg-purple-500' : 'bg-green-500'}`}></span>
                            {user.role === 'superadmin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditModal(user)}
                              className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-all shadow-sm"
                              title="Edit User"
                            >
                              <img src="/icons/edit-icon.svg" alt="Edit" className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-500 hover:text-red-600 transition-all shadow-sm"
                              title="Delete User"
                            >
                              <img src="/icons/delete-icon.svg" alt="Delete" className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={handleEditUser}
      />

      <AdminAnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
      />
    </div>
  );
}
