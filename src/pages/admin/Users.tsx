import { useState, useMemo } from 'react';
import Sidebar from "../../components/Sidebar";
import UsersHeader from "../../features/admin/components/UsersHeader";
import AddUserModal from "../../features/admin/components/AddUserModal";
import EditUserModal from "../../features/admin/components/EditUserModal";
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

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-all"
          >
            <img src="/icons/plus-icon.svg" alt="Add" className="h-5 w-5 invert" />
            Add User
          </button>
        </div>

        <main className="flex-1 px-8 pb-8">
          <div className="w-full bg-white rounded-lg pt-2 overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-6 text-left text-[14px] font-semibold text-foreground">Name</th>
                  <th className="py-4 px-6 text-left text-[14px] font-semibold text-foreground">Email</th>
                  <th className="py-4 px-6 text-left text-[14px] font-semibold text-foreground">Role</th>
                  <th className="py-4 px-6 text-right text-[14px] font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="py-20 text-center text-gray-500">Loading users...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={4} className="py-20 text-center text-gray-500">No users found</td></tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="group transition-colors border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-4 px-6 text-sm font-semibold text-foreground">{user.name}</td>
                      <td className="py-4 px-6 text-sm font-medium text-foreground">{user.email}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-bold
                          ${user.role === 'superadmin' ? 'bg-red-50 text-red-600' :
                            user.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                              'bg-green-50 text-green-600'
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEditModal(user)} className="p-2 text-gray-400 hover:text-foreground">
                            <img src="/icons/edit-icon.svg" alt="Edit" className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-400 hover:text-red-600">
                            <img src="/icons/delete-icon.svg" alt="Delete" className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
    </div>
  );
}
