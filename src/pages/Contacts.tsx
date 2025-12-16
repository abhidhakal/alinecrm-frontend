import { useState, useEffect, useRef } from 'react';
import Sidebar from "../components/Sidebar";
import ContactsHeader from "../components/ContactsHeader";
import AddContactModal from "../components/AddContactModal";
import { contactsApi } from "../api/contacts";
import type { Contact, CreateContactDto } from "../api/contacts";
import { useSidebar } from "../context/SidebarContext";

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isExpanded } = useSidebar();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactsApi.getAll();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = async (data: CreateContactDto) => {
    await contactsApi.create(data);
    await fetchContacts();
  };

  const toggleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(c => c.id));
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
    console.log('Edit contact:', contact);
    setOpenMenuId(null);
    // TODO: Implement edit functionality
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
          onAddContact={() => setIsModalOpen(true)}
        />

        <AddContactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateContact}
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
                    <th className="py-4 pl-4 pr-6 text-center w-[60px]">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-foreground focus:ring-foreground/5"
                        checked={selectedContacts.length === contacts.length && contacts.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-foreground uppercase tracking-wide">Name</th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-foreground uppercase tracking-wide">Company</th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-foreground uppercase tracking-wide">Address</th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-foreground uppercase tracking-wide">Priority</th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-foreground uppercase tracking-wide">Email</th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-foreground uppercase tracking-wide">Phone</th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-foreground uppercase tracking-wide">Created Date</th>
                    <th className="py-4 pl-6 pr-4 text-center text-sm font-bold text-foreground uppercase tracking-wide">
                      <img src="/icons/settings-icon.svg" alt="Settings" className="h-4 w-4 mx-auto opacity-70" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-20 text-center text-gray-500">
                        No contacts found. Click "Add Contact" to create one.
                      </td>
                    </tr>
                  ) : (
                    <>
                      {contacts.map((contact, index) => (
                        <tr
                          key={contact.id}
                          className={`group transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-50`}
                        >
                          <td className="py-4 pl-4 pr-6 text-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-foreground focus:ring-foreground/5 mx-auto"
                              checked={selectedContacts.includes(contact.id)}
                              onChange={() => toggleSelectContact(contact.id)}
                            />
                          </td>
                          <td className="py-4 px-6 text-center text-base font-semibold text-foreground">{contact.name}</td>
                          <td className="py-4 px-6 text-center text-base font-medium text-foreground">{contact.companyName || '-'}</td>
                          <td className="py-4 px-6 text-center text-base font-medium text-foreground">{contact.address}</td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-medium text-white
                                ${contact.priority === 'High' ? 'bg-[#D3455B]' : ''}
                                ${contact.priority === 'Medium' ? 'bg-[#E88F2C]' : ''}
                                ${contact.priority === 'Low' ? 'bg-[#4CA76D]' : ''}
                              `}>
                              {contact.priority}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center text-base font-semibold text-foreground">{contact.email}</td>
                          <td className="py-4 px-6 text-center text-base font-medium text-foreground">{contact.phone}</td>
                          <td className="py-4 px-6 text-center text-base font-medium text-foreground">{formatDate(contact.createdAt)}</td>
                          <td className="py-4 pl-6 pr-4 text-center relative">
                            <button
                              onClick={() => toggleMenu(contact.id)}
                              className="p-1 rounded hover:bg-gray-200 transition-colors mx-auto"
                            >
                              <img src="/icons/more-vertical.svg" alt="Options" className="h-4 w-4 text-gray-500" />
                            </button>

                            {/* Dropdown Menu */}
                            {openMenuId === contact.id && (
                              <div
                                ref={menuRef}
                                className="absolute right-0 top-12 z-50 w-48 rounded-xl bg-white shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                              >
                                <button
                                  onClick={() => handleEdit(contact)}
                                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-foreground hover:bg-gray-50 transition-colors flex items-center gap-3"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                                </button>

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
