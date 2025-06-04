import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navigation } from '../Navigation';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useNotificationService } from '@/services/notifications';

interface Client {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const notifications = useNotificationService();
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/clients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      notifications.showError(
        "Error",
        "Failed to load clients. Please try again."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-salon-pink"></div>
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
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{client.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize">{client.role}</td>                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/admin/clients/${client._id}`)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminClients; 