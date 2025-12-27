import { useState, useEffect } from 'react';
import AdminSidebar from "../../components/AdminSidebar";
import UsersHeader from "../../components/UsersHeader";
import AddUserModal from "../../components/AddUserModal";
import EditUserModal from "../../components/EditUserModal";
import { useSidebar } from "../../context/SidebarContext";
import { usersApi, type User, type CreateUserDto, type UpdateUserDto } from "../../api/users";
import { useToast } from "../../context/ToastContext";

export default function Users() {
  const { isExpanded } = useSidebar();
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAll();
      setUsers(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });

  const handleAddUser = async (data: CreateUserDto) => {
    try {
      await usersApi.create(data);
      showToast('User created successfully', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      showToast('Failed to create user', 'error');
    }
  };

  const handleEditUser = async (id: number, data: UpdateUserDto) => {
    try {
      await usersApi.update(id, data);
      showToast('User updated successfully', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      showToast('Failed to update user', 'error');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await usersApi.delete(id);
      showToast('User deleted successfully', 'success');
      fetchUsers();
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
      <AdminSidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'
        }`}>
        <UsersHeader
          onRefresh={fetchUsers}
          lastUpdated={lastUpdated}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Controls Toolbar */}
        <div className="px-8 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Search Users */}
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <img src="/icons/search-icon.svg" alt="Search" className="h-4 w-4 opacity-100" />
              </div>
              <input
                type="text"
                placeholder="search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-[280px] rounded-full border border-transparent bg-gray-100/50 pl-10 pr-4 text-sm text-foreground placeholder:text-gray-500 focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-gray-100 outline-none transition-all"
              />
            </div>

            {/* Filter */}
            <button className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-gray-700 transition-colors">
              <img src="/icons/filter-list-on.svg" alt="Filter" className="h-4 w-4" />
              Filter
            </button>

            {/* Sort By */}
            <button className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-gray-700 transition-colors">
              <img src="/icons/sort-icon.svg" alt="Sort" className="h-4 w-4" />
              Sort By
            </button>
          </div>

          {/* Add User */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-foreground px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-foreground/90 hover:shadow-md active:scale-[0.98]"
          >
            <img src="/icons/plus-icon.svg" alt="Add" className="h-5 w-5 invert brightness-0 filter" />
            Add User
          </button>
        </div>

        <main className="flex-1 px-8 pb-8">
          <div className="w-full bg-white rounded-lg pt-2">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-6 text-left text-[14px] font-semibold text-foreground">Name</th>
                  <th className="py-4 px-6 text-left text-[14px] font-semibold text-foreground">Email</th>
                  <th className="py-4 px-6 text-left text-[14px] font-semibold text-foreground">Role</th>
                  <th className="py-4 px-6 text-right text-[14px] font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
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
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-gray-400 hover:text-foreground hover:bg-gray-100 rounded-lg transition-all"
                          >
                            <img src="/icons/edit-icon.svg" alt="Edit" className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
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
