import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { CreateLeadDto } from '../../../types/lead.types';
import { useGetAllContacts } from '../../../api/contacts.api';
import { useGetAllUsers } from '../../../api/users.api';
import { useAuth } from '../../../context/AuthContext';
import { LEAD_STATUS, LEAD_SOURCE } from '../../../constants/lead.constants';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeadDto) => Promise<void>;
}

export default function AddLeadModal({ isOpen, onClose, onSubmit }: AddLeadModalProps) {
  const { user: currentUser } = useAuth();
  const { data: contacts = [] } = useGetAllContacts();
  const { data: users = [] } = useGetAllUsers();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting, errors }
  } = useForm<CreateLeadDto>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      companyName: '',
      jobTitle: '',
      status: LEAD_STATUS.NEW,
      source: LEAD_SOURCE.ORGANIC,
      inquiredFor: '',
      potentialValue: 0,
      probability: 0,
      notes: '',
      assignedToIds: currentUser ? [currentUser.id] : []
    }
  });

  const selectedAssignedToIds = watch('assignedToIds') || [];
  const contactId = watch('contactId');
  const selectedContact = contacts.find(c => c.id === contactId);

  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        jobTitle: '',
        status: LEAD_STATUS.NEW,
        source: LEAD_SOURCE.ORGANIC,
        inquiredFor: '',
        potentialValue: 0,
        probability: 0,
        notes: '',
        assignedToIds: currentUser ? [currentUser.id] : []
      });
    }
  }, [isOpen, currentUser, reset]);

  const handleFormSubmit = async (data: CreateLeadDto) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  const handleContactSelect = (contact: any) => {
    setValue('name', contact.name);
    setValue('email', contact.email);
    setValue('phone', contact.phone);
    setValue('companyName', contact.companyName || '');
    setValue('contactId', contact.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white p-6 shadow-xl max-h-[95vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Add New Lead</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <img src="/icons/close-icon-large.svg" alt="Close" className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name *</label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                {...register('phone')}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Company Name</label>
              <input
                {...register('companyName')}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                placeholder="Acme Inc."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Job Title</label>
              <input
                {...register('jobTitle')}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                placeholder="CEO"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="relative">
                <select
                  {...register('status')}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-10 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 font-semibold"
                >
                  {Object.values(LEAD_STATUS).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Lead Source</label>
              <div className="relative">
                <select
                  {...register('source')}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-10 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 font-semibold"
                >
                  {Object.values(LEAD_SOURCE).map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Inquired For / Service</label>
              <input
                {...register('inquiredFor')}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                placeholder="e.g. Web Development"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Assigned To</label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-3 bg-gray-50">
                {users.map(u => (
                  <label key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedAssignedToIds.includes(u.id)}
                      onChange={(e) => {
                        const newIds = e.target.checked
                          ? [...selectedAssignedToIds, u.id]
                          : selectedAssignedToIds.filter(id => id !== u.id);
                        setValue('assignedToIds', newIds);
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-foreground focus:ring-2 focus:ring-gray-200"
                    />
                    {u.profilePicture ? (
                      <img src={u.profilePicture} className="h-7 w-7 rounded-full object-cover" alt={u.name} />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-gray-600">
                          {u.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">{u.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Potential Value ($)</label>
              <input
                {...register('potentialValue', { valueAsNumber: true })}
                type="number"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Probability (%)</label>
              <input
                {...register('probability', { valueAsNumber: true, min: 0, max: 100 })}
                type="number"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Link Existing Contact (Optional)</label>
            {!selectedContact ? (
              <div className="flex flex-wrap gap-2">
                {contacts.slice(0, 5).map(contact => (
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
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
                  <span className="font-medium">{selectedContact.name}</span>
                  <button
                    type="button"
                    onClick={() => setValue('contactId', undefined)}
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
              {...register('notes')}
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
              disabled={isSubmitting}
              className="rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
