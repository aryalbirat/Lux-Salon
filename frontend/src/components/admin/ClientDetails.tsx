import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

interface ClientDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
}

interface Booking {
  _id: string;
  service: string;
  package: string;
  date: string;
  time: string;
  status: string;
  staff: {
    name: string;
  };
}

interface Client {
  _id: string;
  name: string;
  email: string;
  bookings: Booking[];
}

const ClientDetails = ({ isOpen, onClose, clientId }: ClientDetailsProps) => {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!clientId || !isOpen) return;
      
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        // Fetch client details
        const clientResponse = await axios.get(`http://localhost:5000/api/users/${clientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch client's bookings
        const bookingsResponse = await axios.get(`http://localhost:5000/api/bookings/user/${clientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Combine the data
        const clientData = {
          ...clientResponse.data.data,
          bookings: bookingsResponse.data.data || []
        };

        setClient(clientData);
      } catch (error) {
        console.error('Error fetching client details:', error);
        setError('Failed to load client details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [isOpen, clientId]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setClient(null);
      setError(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Client Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-salon-pink"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            {error}
          </div>
        ) : client ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {client.name}</p>
                <p><span className="font-medium">Email:</span> {client.email}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Booking History</h3>
              {client.bookings && client.bookings.length > 0 ? (
                <div className="space-y-4">
                  {client.bookings.map((booking) => (
                    <Card key={booking._id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{booking.service}</h4>
                            <p className="text-sm text-gray-600">{booking.package}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(booking.date)}
                            <span className="mx-2">•</span>
                            <Clock className="h-4 w-4 mr-1" />
                            {booking.time}
                          </div>
                          <div className="mt-1">
                            Stylist: {booking.staff?.name || 'Not assigned'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No bookings found</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Client not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetails; 