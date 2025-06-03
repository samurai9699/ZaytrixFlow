import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
}

interface ClientStepProps {
  data: Client | null;
  onUpdate: (client: Client) => void;
}

const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', company: 'Acme Inc' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', company: 'Tech Corp' },
];

const ClientStep: React.FC<ClientStepProps> = ({ data, onUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(data);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    company: '',
  });

  const filteredClients = MOCK_CLIENTS.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    onUpdate(client);
  };

  const handleNewClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = {
      id: Math.random().toString(36).substr(2, 9),
      ...newClient,
    };
    handleClientSelect(client);
    setShowNewClientForm(false);
  };

  return (
    <div className="space-y-6">
      {!showNewClientForm ? (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
            />
          </div>

          <div className="grid gap-4">
            {filteredClients.map(client => (
              <button
                key={client.id}
                onClick={() => handleClientSelect(client)}
                className={`p-4 rounded-lg border ${
                  selectedClient?.id === client.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                } text-left transition-colors`}
              >
                <h3 className="font-medium text-gray-900 dark:text-white">{client.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{client.email}</p>
                {client.company && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{client.company}</p>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowNewClientForm(true)}
            className="w-full p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Plus size={20} />
            Add New Client
          </button>
        </>
      ) : (
        <form onSubmit={handleNewClientSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={newClient.email}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Company (Optional)
            </label>
            <input
              type="text"
              value={newClient.company}
              onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setShowNewClientForm(false)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add Client
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ClientStep;