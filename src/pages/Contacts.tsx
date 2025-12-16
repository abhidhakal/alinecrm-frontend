import { useState } from 'react';
import Sidebar from "../components/Sidebar";
import ContactsHeader from "../components/ContactsHeader";

const contactsData = [
  {
    id: 1,
    name: 'Abhinav Dhakal',
    company: 'ABC Company',
    priority: 'High',
    email: 'john@abc.com',
    phone: '(977) 989 9999999',
    createdDate: '20/11/2025'
  },
  {
    id: 2,
    name: 'Oleg Fitzergald',
    company: 'XYZ Company',
    priority: 'Medium',
    email: 'oleg@xyz.com',
    phone: '(91) 96745894',
    createdDate: '20/11/2025'
  },
  {
    id: 3,
    name: 'Andre Silva',
    company: 'BBB Company',
    priority: 'Low',
    email: 'hello@bbb.co',
    phone: '(977) 970 189675',
    createdDate: '18/11/2025'
  }
];

export default function Contacts() {
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);

  const toggleSelectAll = () => {
    if (selectedContacts.length === contactsData.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contactsData.map(c => c.id));
    }
  };

  const toggleSelectContact = (id: number) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(c => c !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      <Sidebar />
      <div className="flex flex-1 flex-col ml-[312px] transition-all max-w-[calc(100vw-312px)]">

        <ContactsHeader />

        {/* Main Content Area */}
        <main className="flex-1 px-8 pb-8">
          <div className="w-full bg-white rounded-lg pt-2">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 pl-4 pr-3 text-left w-[50px]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black/5"
                      checked={selectedContacts.length === contactsData.length && contactsData.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="py-4 px-3 text-left text-xs font-bold text-black uppercase tracking-wide">Name</th>
                  <th className="py-4 px-3 text-left text-xs font-bold text-black uppercase tracking-wide">Company</th>
                  <th className="py-4 px-3 text-center text-xs font-bold text-black uppercase tracking-wide">Priority</th>
                  <th className="py-4 px-3 text-left text-xs font-bold text-black uppercase tracking-wide">Email</th>
                  <th className="py-4 px-3 text-center text-xs font-bold text-black uppercase tracking-wide">Phone</th>
                  <th className="py-4 px-3 text-center text-xs font-bold text-black uppercase tracking-wide">Created Date</th>
                  <th className="py-4 pl-3 pr-4 text-center text-xs font-bold text-black uppercase tracking-wide">
                    <img src="/icons/settings-icon.svg" alt="Settings" className="h-4 w-4 mx-auto opacity-70" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {contactsData.map((contact, index) => (
                  <tr
                    key={contact.id}
                    className={`group transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-50`}
                  >
                    <td className="py-4 pl-4 pr-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black/5"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleSelectContact(contact.id)}
                      />
                    </td>
                    <td className="py-4 px-3 text-sm font-semibold text-gray-900">{contact.name}</td>
                    <td className="py-4 px-3 text-sm font-medium text-gray-900">{contact.company}</td>
                    <td className="py-4 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-medium text-white
                                            ${contact.priority === 'High' ? 'bg-[#D3455B]' : ''}
                                            ${contact.priority === 'Medium' ? 'bg-[#E88F2C]' : ''}
                                            ${contact.priority === 'Low' ? 'bg-[#4CA76D]' : ''}
                                        `}>
                        {contact.priority}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-sm font-semibold text-gray-900">{contact.email}</td>
                    <td className="py-4 px-3 text-center text-sm font-medium text-gray-900">{contact.phone}</td>
                    <td className="py-4 px-3 text-center text-sm font-medium text-gray-900">{contact.createdDate}</td>
                    <td className="py-4 pl-3 pr-4 text-center">
                      <button className="p-1 rounded hover:bg-gray-200 transition-colors">
                        <img src="/icons/more-vertical.svg" alt="Options" className="h-4 w-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Empty Rows for visual spacing matching design if needed */}
                {[...Array(5)].map((_, i) => (
                  <tr key={`empty-${i}`} className={`h-[57px] ${i % 2 !== 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="py-4 pl-4 pr-3">
                      <div className="h-4 w-4 rounded border border-gray-200/50"></div>
                    </td>
                    <td colSpan={7}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
