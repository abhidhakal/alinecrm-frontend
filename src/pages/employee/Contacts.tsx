import { useState, useMemo, useRef } from 'react';
import Sidebar from "../../components/Sidebar";
import ContactsHeader from "../../features/contacts/components/ContactsHeader";
import AddContactModal from "../../features/contacts/components/AddContactModal";
import { useGetAllContacts, useCreateContact, useUpdateContact, useDeleteContact, useBulkCreateContacts, useBulkDeleteContacts } from "../../api/contacts.api";
import { useSidebar } from "../../context/SidebarContext";
import type { Contact, CreateContactDto } from "../../types/contact.types";

export default function Contacts() {
  const { isExpanded } = useSidebar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // React Query Hooks
  const { data: contacts = [], isLoading, refetch } = useGetAllContacts();
  const createContactMutation = useCreateContact();
  const updateContactMutation = useUpdateContact();
  const deleteContactMutation = useDeleteContact();
  const bulkCreateMutation = useBulkCreateContacts();
  const bulkDeleteMutation = useBulkDeleteContacts();

  // Local UI State
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    try {
      if (editingContact) {
        await updateContactMutation.mutateAsync({ id: editingContact.id, data });
      } else {
        await createContactMutation.mutateAsync(data);
      }
      setIsModalOpen(false);
      setEditingContact(null);
    } catch (error) {
      console.error('Error submitting contact:', error);
    }
  };

  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id));
    }
  };

  const toggleSelectContact = (id: number) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(cid => cid !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  const handleDelete = async (contactId: number) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      await deleteContactMutation.mutateAsync(contactId);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedContacts.length} contacts?`)) {
      await bulkDeleteMutation.mutateAsync(selectedContacts);
      setSelectedContacts([]);
    }
  };

  const handleCsvImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').map(row => row.split(','));
      const headers = rows[0].map(h => h.trim().toLowerCase());

      const newContacts: CreateContactDto[] = rows.slice(1)
        .filter(row => row.length >= headers.length && row[0].trim() !== '')
        .map(row => {
          const contact: any = {};
          headers.forEach((header, index) => {
            if (header === 'name') contact.name = row[index].trim();
            if (header === 'email') contact.email = row[index].trim();
            if (header === 'phone') contact.phone = row[index].trim();
            if (header === 'address') contact.address = row[index].trim();
            if (header === 'company') contact.companyName = row[index].trim();
            if (header === 'industry') contact.industry = row[index].trim();
            if (header === 'priority') contact.priority = (row[index].trim() as any) || 'Medium';
          });
          return contact as CreateContactDto;
        });

      try {
        await bulkCreateMutation.mutateAsync(newContacts);
        alert(`Successfully imported ${newContacts.length} contacts`);
      } catch (error) {
        console.error('Error importing contacts:', error);
        alert('Failed to import contacts.');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
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

        <div className="px-8 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <img src="/icons/search-icon.svg" alt="Search" className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-[280px] rounded-full border border-transparent bg-gray-100/50 pl-10 pr-4 text-sm focus:bg-white focus:border-gray-200 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedContacts.length > 0 && (
              <button onClick={handleBulkDelete} className="flex items-center gap-2 rounded-xl bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-all">
                Delete Selected ({selectedContacts.length})
              </button>
            )}
            <input type="file" ref={fileInputRef} onChange={handleCsvImport} accept=".csv" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold">
              Import CSV
            </button>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white">
              Add Contact
            </button>
          </div>
        </div>

        <main className="flex-1 px-8 pb-8 overflow-x-auto">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 pl-6 pr-3 w-[40px]"><input type="checkbox" checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0} onChange={toggleSelectAll} /></th>
                <th className="py-4 px-3 text-left text-sm font-semibold">Name</th>
                <th className="py-4 px-3 text-left text-sm font-semibold">Company</th>
                <th className="py-4 px-3 text-left text-sm font-semibold">Priority</th>
                <th className="py-4 px-3 text-left text-sm font-semibold">Email</th>
                <th className="py-4 px-3 text-left text-sm font-semibold">Phone</th>
                <th className="py-4 px-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="py-20 text-center text-gray-500">Loading contacts...</td></tr>
              ) : filteredContacts.map((contact) => (
                <tr key={contact.id} className="border-b border-gray-50 hover:bg-gray-50/50 group cursor-pointer" onClick={() => { setEditingContact(contact); setIsModalOpen(true); }}>
                  <td className="py-4 pl-6 pr-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedContacts.includes(contact.id)} onChange={() => toggleSelectContact(contact.id)} /></td>
                  <td className="py-4 px-3 text-sm font-semibold">{contact.name}</td>
                  <td className="py-4 px-3 text-sm text-gray-600">{contact.companyName || '-'}</td>
                  <td className="py-4 px-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${contact.priority === 'High' ? 'bg-red-50 text-red-600' : contact.priority === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                      {contact.priority}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-sm text-gray-600">{contact.email}</td>
                  <td className="py-4 px-3 text-sm text-gray-600">{contact.phone}</td>
                  <td className="py-4 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => handleDelete(contact.id)} className="p-2 text-gray-400 hover:text-red-600"><img src="/icons/delete-icon.svg" className="h-4 w-4" alt="Delete" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>

        <AddContactModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingContact(null); }}
          onSubmit={handleSubmitContact}
          contact={editingContact}
        />
      </div>
    </div>
  );
}
