import { useState, useEffect, useRef } from 'react';
import Sidebar from "../../components/Sidebar";
import ContactsHeader from "../../components/ContactsHeader";
import AddContactModal from "../../components/AddContactModal";
import { contactsApi } from "../../api/contacts";
import type { Contact, CreateContactDto } from "../../api/contacts";
import { useSidebar } from "../../context/SidebarContext";

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isExpanded } = useSidebar();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactsApi.getAll();
      setContacts(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
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
        setLoading(true);
        await contactsApi.bulkCreate(newContacts);
        await fetchContacts();
        alert(`Successfully imported ${newContacts.length} contacts`);
      } catch (error) {
        console.error('Error importing contacts:', error);
        alert('Failed to import contacts. Please check your CSV format.');
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const filteredContacts = contacts.filter(contact => {
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      (contact.companyName && contact.companyName.toLowerCase().includes(query)) ||
      contact.email.toLowerCase().includes(query) ||
      contact.address.toLowerCase().includes(query)
    );
  });

  const handleSubmitContact = async (data: CreateContactDto) => {
    try {
      if (editingContact) {
        await contactsApi.update(editingContact.id, data);
      } else {
        await contactsApi.create(data);
      }
      await fetchContacts();
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
      setSelectedContacts(selectedContacts.filter(c => c !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };

  const toggleMenu = (contactId: number) => {
    setOpenMenuId(openMenuId === contactId ? null : contactId);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = async (contactId: number) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactsApi.delete(contactId);
        await fetchContacts();
        setOpenMenuId(null);
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const handleArchive = (contact: Contact) => {
    console.log('Archive contact:', contact);
    setOpenMenuId(null);
    // TODO: Implement archive functionality
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedContacts.length} contacts?`)) {
      try {
        setLoading(true);
        await contactsApi.bulkDelete(selectedContacts);
        await fetchContacts();
        setSelectedContacts([]);
      } catch (error) {
        console.error('Error deleting contacts:', error);
        alert('Failed to delete some contacts.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      <Sidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isExpanded ? 'ml-[280px] max-w-[calc(100vw-280px)]' : 'ml-[110px] max-w-[calc(100vw-110px)]'
        }`}>

        <ContactsHeader
          onRefresh={fetchContacts}
          lastUpdated={lastUpdated}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Controls Toolbar */}
        <div className="px-8 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Search Contacts */}
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <img src="/icons/search-icon.svg" alt="Search" className="h-4 w-4 opacity-100" />
              </div>
              <input
                type="text"
                placeholder="search contacts, companies..."
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

          <div className="flex items-center gap-3">
            {/* Selection Actions */}
            {selectedContacts.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 rounded-xl bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-all hover:bg-red-100 active:scale-[0.98]"
              >
                <img src="/icons/delete-icon.svg" alt="Delete" className="h-5 w-5 opacity-80" />
                Delete Selected ({selectedContacts.length})
              </button>
            )}

            {/* CSV Import */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCsvImport}
              accept=".csv"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-[0.98]"
            >
              <img src="/icons/csv-icon.svg" alt="CSV" className="h-5 w-5" />
              Import CSV
            </button>

            {/* Add Contact */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-foreground px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-foreground/90 hover:shadow-md active:scale-[0.98]"
            >
              <img src="/icons/contact-icon-filled.svg" alt="Add" className="h-5 w-5 invert brightness-0 filter" />
              Add Contact
            </button>
          </div>
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

        {/* Main Content Area */}
        <main className="flex-1 px-8 pb-8">
          <div className="w-full bg-white rounded-lg pt-2">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-gray-500">Loading contacts...</div>
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-4 pl-6 pr-3 text-center w-[40px]">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-foreground focus:ring-foreground/5 mx-auto"
                        checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="py-4 px-3 text-center text-[14px] font-semibold text-foreground">Name</th>
                    <th className="py-4 px-3 text-center text-[14px] font-semibold text-foreground">Company</th>
                    <th className="py-4 px-3 text-center text-[14px] font-semibold text-foreground">Address</th>
                    <th className="py-4 px-3 text-center text-[14px] font-semibold text-foreground">Priority</th>
                    <th className="py-4 px-3 text-center text-[14px] font-semibold text-foreground">Assigned To</th>
                    <th className="py-4 px-3 text-center text-[14px] font-semibold text-foreground">Email</th>
                    <th className="py-4 px-3 text-center text-[14px] font-semibold text-foreground">Phone</th>
                    <th className="py-4 px-3 text-center text-[14px] font-semibold text-foreground">Created Date</th>
                    <th className="py-4 px-3 text-center text-[14px] font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-20 text-center text-gray-500">
                        {contacts.length === 0 ? 'No contacts found. Click "Add Contact" to create one.' : 'No matching contacts found.'}
                      </td>
                    </tr>
                  ) : (
                    <>
                      {filteredContacts.map((contact) => (
                        <tr
                          key={contact.id}
                          onClick={() => handleEdit(contact)}
                          className={`group cursor-pointer transition-colors border-b border-gray-50 hover:bg-gray-50/50`}
                        >
                          <td
                            className="py-4 pl-6 pr-3 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-foreground focus:ring-foreground/5 mx-auto"
                              checked={selectedContacts.includes(contact.id)}
                              onChange={() => toggleSelectContact(contact.id)}
                            />
                          </td>
                          <td className="py-4 px-3 text-center text-sm font-semibold text-foreground">{contact.name}</td>
                          <td className="py-4 px-3 text-center text-sm font-medium text-foreground">{contact.companyName || '-'}</td>
                          <td className="py-4 px-3 text-center text-sm font-medium text-foreground">{contact.address}</td>
                          <td className="py-4 px-3 text-center">
                            <span
                              className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-bold
                                ${contact.priority === 'High' ? 'bg-red-50 text-red-600' : ''}
                                ${contact.priority === 'Medium' ? 'bg-orange-50 text-orange-600' : ''}
                                ${contact.priority === 'Low' ? 'bg-green-50 text-green-600' : ''}
                              `}>
                              {contact.priority}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-center">
                            {contact.assignedTo && contact.assignedTo.length > 0 ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="flex -space-x-2">
                                  {contact.assignedTo.slice(0, 3).map((user) => (
                                    user.profilePicture ? (
                                      <img
                                        key={user.id}
                                        src={user.profilePicture}
                                        alt={user.name}
                                        title={user.name}
                                        className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
                                      />
                                    ) : (
                                      <div
                                        key={user.id}
                                        className="h-6 w-6 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center"
                                        title={user.name}
                                      >
                                        <span className="text-[10px] font-bold text-gray-600">
                                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                        </span>
                                      </div>
                                    )
                                  ))}
                                </div>
                                {contact.assignedTo.length > 3 && (
                                  <span className="text-xs font-medium text-gray-500">+{contact.assignedTo.length - 3}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-4 px-3 text-center text-sm font-medium text-foreground">{contact.email}</td>
                          <td className="py-4 px-3 text-center text-sm font-medium text-foreground">{contact.phone}</td>
                          <td className="py-4 px-3 text-center text-sm font-medium text-foreground">{formatDate(contact.createdAt)}</td>
                          <td
                            className="py-4 px-3 text-center relative"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => toggleMenu(contact.id)}
                              className="flex items-center justify-center p-1.5 rounded-lg hover:bg-gray-100 transition-colors mx-auto"
                            >
                              <img src="/icons/more-vertical.svg" alt="Options" className="h-6 w-6 text-black" />
                            </button>

                            {/* Dropdown Menu */}
                            {openMenuId === contact.id && (
                              <div
                                ref={menuRef}
                                className="absolute right-0 top-12 z-50 w-48 rounded-xl bg-white shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                              >
                                <button
                                  onClick={() => handleArchive(contact)}
                                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-foreground hover:bg-gray-50 transition-colors flex items-center gap-3"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                  </svg>
                                  Archive
                                </button>

                                <div className="my-1 border-t border-gray-100"></div>

                                <button
                                  onClick={() => handleDelete(contact.id)}
                                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {/* Empty Rows for visual spacing if fewer than 8 contacts */}
                      {contacts.length < 8 && [...Array(8 - contacts.length)].map((_, i) => (
                        <tr key={`empty-${i}`} className={`h-[60px] ${(contacts.length + i) % 2 !== 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                          <td className="py-4 pl-4 pr-6 text-center">
                            <div className="h-4 w-4 rounded border border-gray-200/50 mx-auto"></div>
                          </td>
                          <td colSpan={8}></td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
