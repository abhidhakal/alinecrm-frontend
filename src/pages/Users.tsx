import { useState, useEffect } from 'react';
import AdminSidebar from "../components/AdminSidebar";
import UsersHeader from "../components/UsersHeader";
import { useSidebar } from "../context/SidebarContext";
import { usersApi, type User } from "../api/users";

export default function Users() {
  const { isExpanded } = useSidebar();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      <AdminSidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'
        }`}>
        <UsersHeader onRefresh={fetchUsers} />
        <main className="flex-1 p-8 bg-white">
             <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>
                    ) : users.length === 0 ? (
                        <tr><td colSpan={4} className="px-6 py-4 text-center">No users found</td></tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                        user.role === 'superadmin' ? 'bg-red-100 text-red-800' :
                                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                        'bg-green-100 text-green-800'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <img src="/icons/edit-icon.svg" alt="Edit" className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                  </tbody>
                </table>
             </div>
        </main>
      </div>
    </div>
  );
}
