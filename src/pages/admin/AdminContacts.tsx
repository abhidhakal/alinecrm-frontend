import { useState, useMemo } from 'react';
import Sidebar from "../../components/Sidebar";
import ContactsHeader from "../../features/contacts/components/ContactsHeader";
import AddContactModal from "../../features/contacts/components/AddContactModal";
import { useGetAllContacts, useCreateContact, useUpdateContact, useDeleteContact } from "../../api/contacts.api";
import type { Contact, CreateContactDto } from "../../types/contact.types";
import { useSidebar } from "../../context/SidebarContext";
import AdminViewBanner from "../../features/admin/components/AdminViewBanner";
import { format } from "date-fns";

export default function AdminContacts() {
  const { isExpanded } = useSidebar();

  // React Query Hooks
  const { data: contacts = [], isLoading, refetch } = useGetAllContacts();
  const createContactMutation = useCreateContact();
  const updateContactMutation = useUpdateContact();
  const deleteContactMutation = useDeleteContact();

  // Local UI State
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const query = searchQuery.toLowerCase();
      return (
        contact.name.toLowerCase().includes(query) ||
        (contact.companyName && contact.companyName.toLowerCase().includes(query)) ||
        contact.email.toLowerCase().includes(query) ||
        contact.address.toLowerCase().includes(query)
      );
    });
  }, [contacts, searchQuery]);

  const handleSubmitContact = async (data: CreateContactDto) => {
    if (editingContact) {
      await updateContactMutation.mutateAsync({ id: editingContact.id, data });
    } else {
      await createContactMutation.mutateAsync(data);
    }
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedContacts.length} contacts?`)) {
      for (const id of selectedContacts) {
        await deleteContactMutation.mutateAsync(id);
      }
      setSelectedContacts([]);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      await deleteContactMutation.mutateAsync(id);
    }
    setOpenMenuId(null);
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'}`}>
        <ContactsHeader
          onRefresh={refetch}
          lastUpdated={new Date()}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <section className="px-8">
          <AdminViewBanner
            label="Viewing all contacts across all users"
            stats={`${contacts.length} Total Contacts`}
          />
        </section>

        <div className="px-8 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <img src="/icons/search-icon.svg" alt="Search" className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="search contacts, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-[280px] rounded-full border border-transparent bg-gray-100/50 pl-10 pr-4 text-sm text-foreground placeholder:text-gray-500 focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-gray-100 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedContacts.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 rounded-xl bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-all hover:bg-red-100 active:scale-[0.98]"
              >
                <img src="/icons/delete-icon.svg" alt="Delete" className="h-5 w-5 opacity-80" />
                Delete Selected ({selectedContacts.length})
              </button>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-black/90 hover:shadow-md active:scale-[0.98]"
            >
              <img src="/icons/contact-icon-filled.svg" alt="Add" className="h-5 w-5 invert brightness-0 filter" />
              Add Contact
            </button>
          </div>
        </div>

        <main className="flex-1 px-8 pb-8">
          <div className="w-full bg-white rounded-lg pt-2 overflow-x-auto">
            {isLoading ? (
              <div className="py-20 text-center text-gray-500">Loading contacts...</div>
            ) : (
              <table className="w-full border-collapse min-w-[1000px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-4 pl-6 pr-3 text-center w-[40px]">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                        onChange={() => {
                          if (selectedContacts.length === filteredContacts.length) setSelectedContacts([]);
                          else setSelectedContacts(filteredContacts.map(c => c.id));
                        }}
                      />
                    </th>
                    <th className="py-4 px-3 text-left text-[14px] font-semibold text-foreground">Name</th>
                    <th className="py-4 px-3 text-left text-[14px] font-semibold text-foreground">Company</th>
                    <th className="py-4 px-3 text-left text-[14px] font-semibold text-foreground">Priority</th>
                    <th className="py-4 px-3 text-left text-[14px] font-semibold text-foreground">Email</th>
                    <th className="py-4 px-3 text-left text-[14px] font-semibold text-foreground">Phone</th>
                    <th className="py-4 px-3 text-left text-[14px] font-semibold text-foreground">Date</th>
                    <th className="py-4 px-3 text-center text-[14px] font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      onClick={() => {
                        setEditingContact(contact);
                        setIsModalOpen(true);
                      }}
                      className="group cursor-pointer border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 pl-6 pr-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => {
                            if (selectedContacts.includes(contact.id)) setSelectedContacts(selectedContacts.filter(id => id !== contact.id));
                            else setSelectedContacts([...selectedContacts, contact.id]);
                          }}
                        />
                      </td>
                      <td className="py-4 px-3 text-sm font-semibold text-foreground">{contact.name}</td>
                      <td className="py-4 px-3 text-sm font-medium text-foreground">{contact.companyName || '-'}</td>
                      <td className="py-4 px-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${contact.priority === 'High' ? 'bg-red-50 text-red-600' :
                          contact.priority === 'Medium' ? 'bg-orange-50 text-orange-600' :
                            'bg-green-50 text-green-600'
                          }`}>
                          {contact.priority}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-sm font-medium text-foreground">{contact.email}</td>
                      <td className="py-4 px-3 text-sm font-medium text-foreground">{contact.phone}</td>
                      <td className="py-4 px-3 text-sm font-medium text-foreground">{format(new Date(contact.createdAt), "dd/MM/yyyy")}</td>
                      <td className="py-4 px-3 text-center relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === contact.id ? null : contact.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 mx-auto"
                        >
                          <img src="/icons/more-vertical.svg" alt="Options" className="h-5 w-5" />
                        </button>
                        {openMenuId === contact.id && (
                          <div className="absolute right-0 top-12 z-50 w-32 rounded-xl bg-white shadow-lg border border-gray-100 py-1">
                            <button
                              onClick={() => handleDelete(contact.id)}
                              className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      <AddContactModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContact(null);
        }}
        onSubmit={handleSubmitContact}
        contact={editingContact}
      />
    </div>
  );
}
