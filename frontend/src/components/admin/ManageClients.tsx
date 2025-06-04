import React, { useState, useEffect } from 'react';
import { Navigation } from '../Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import ClientDetails from './ClientDetails';

interface Client {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const ManageClients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const filteredClients = response.data.data.filter((client: Client) => client.role === 'client');
      setClients(filteredClients);
      setError(null);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleViewDetails = (clientId: string) => {
    setSelectedClientId(clientId);
    setShowClientDetails(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-salon-pink" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-red-600 text-center">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Clients</h1>
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map(client => (
                    <tr key={client._id}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{client.role}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><Button onClick={() => handleViewDetails(client._id)} className="bg-salon-pink hover:bg-salon-pink/90 text-white font-medium" size="sm">View Details</Button></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      {showClientDetails && selectedClientId && (
        <ClientDetails
          isOpen={showClientDetails}
          onClose={() => {
            setShowClientDetails(false);
            setSelectedClientId(null);
          }}
          clientId={selectedClientId}
        />
      )}
    </div>
  );
};

export default ManageClients; 