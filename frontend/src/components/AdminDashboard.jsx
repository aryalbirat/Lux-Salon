import React from 'react';
import { Navigation } from './Navigation';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Manage Bookings</h2>
              <p className="text-gray-600 mb-4">
                View and manage all salon bookings. Update status, cancel appointments, and more.
              </p>
              <Button
                onClick={() => navigate('/admin/bookings')}
                className="w-full"
              >
                Go to Bookings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Manage Clients</h2>
              <p className="text-gray-600 mb-4">
                View all registered clients, their booking history, and manage their accounts.
              </p>
              <Button
                onClick={() => navigate('/admin/clients')}
                className="w-full"
              >
                Go to Clients
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 