import { useState, useEffect } from 'react';
import type { Lead, UpdateLeadDto } from '../api/leads';
import { contactsApi, type Contact } from '../api/contacts';
import { usersApi, type User } from '../api/users';
import { useAuth } from '../context/AuthContext';

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: UpdateLeadDto) => Promise<void>;
  lead: Lead | null;
}

export default function EditLeadModal({ isOpen, onClose, onSubmit, lead }: EditLeadModalProps) {
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState<UpdateLeadDto>({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    jobTitle: '',
    status: 'New',
    source: '',
    potentialValue: 0,
    probability: 0,
    notes: '',
    contactId: undefined,
    assignedToId: undefined
  });
  const [submitting, setSubmitting] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contactSearch, setContactSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (isOpen && lead) {
      setFormData({
        name: lead.name,
        email: lead.email || '',
        phone: lead.phone || '',
        companyName: lead.companyName || '',
        jobTitle: lead.jobTitle || '',
        status: lead.status,
        source: lead.source || '',
        potentialValue: lead.potentialValue || 0,
        probability: lead.probability || 0,
        notes: lead.notes || '',
        contactId: lead.contactId,
        assignedToId: lead.assignedToId
      });
      contactsApi.getAll().then(setContacts).catch(console.error);
      if (isAdmin) {
        usersApi.getAll().then(setUsers).catch(console.error);
      }
    }
  }, [isOpen, lead, isAdmin]);

  // Try to find the selected contact if contactId exists
  useEffect(() => {
    if (lead?.contactId && contacts.length > 0) {
      const contact = contacts.find(c => c.id === lead.contactId);
      if (contact) {
        setSelectedContact(contact);
      }
    }
  }, [lead, contacts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;
    
    setSubmitting(true);
    try {
      await onSubmit(lead.id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating lead:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setFormData(prev => ({
      ...prev,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      companyName: contact.companyName || '',
      contactId: contact.id
    }));
    setContactSearch('');
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) || 
    c.email.toLowerCase().includes(contactSearch.toLowerCase())
  ).slice(0, 5);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'potentialValue' || name === 'probability' ? Number(value) : value
    }));
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white p-6 shadow-xl max-h-[95vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Lead Details</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <img src="/icons/close-icon-large.svg" alt="Close" className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name *</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Company Name</label>
              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                placeholder="Acme Inc."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Job Title</label>
              <input
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                placeholder="CEO"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
              </select>
            </div>
            {isAdmin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Assigned To</label>
                <select
                  name="assignedToId"
                  value={formData.assignedToId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignedToId: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Potential Value ($)</label>
              <input
                type="number"
                name="potentialValue"
                value={formData.potentialValue}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Probability (%)</label>
              <input
                type="number"
                name="probability"
                min="0"
                max="100"
                value={formData.probability}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                placeholder="50"
              />
            </div>
          </div>

          {/* Contact Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Link Existing Contact (Optional)</label>
            {!selectedContact ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  placeholder="Search contacts by name or email..."
                />
                <div className="flex flex-wrap gap-2">
                  {filteredContacts.map(contact => (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => handleContactSelect(contact)}
                      className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
                    >
                      <span className="font-medium">{contact.name}</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-500">{contact.email}</span>
                    </button>
                  ))}
                  {filteredContacts.length === 0 && contactSearch && (
                    <p className="text-sm text-gray-500 px-2">No contacts found</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
                  <span className="font-medium">{selectedContact.name}</span>
                  <span className="opacity-60">|</span>
                  <span>{selectedContact.email}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedContact(null);
                      setFormData(prev => ({ ...prev, contactId: undefined }));
                    }}
                    className="ml-2 rounded-full p-0.5 hover:bg-blue-100"
                  >
                    <img src="/icons/close-icon-small.svg" alt="Remove" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
