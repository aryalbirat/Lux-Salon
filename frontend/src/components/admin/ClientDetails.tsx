import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useClientDetails } from '@/hooks/useClientDetails';

interface ClientDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
}

const ClientDetails = ({ isOpen, onClose, clientId }: ClientDetailsProps) => {
  const { client, loading, error } = useClientDetails(clientId, {
    enabled: isOpen,
    onError: () => onClose()
  });

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

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Client Details</DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-salon-pink" />
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="text-salon-pink hover:text-salon-pink/80 font-medium"
            >
              Back to Clients
            </button>
          </div>
        )}

        {!loading && !error && client && (
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
                            {booking.package && (
                              <p className="text-sm text-gray-600">{booking.package}</p>
                            )}
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
                          {booking.staff && (
                            <div className="mt-1">
                              Stylist: {booking.staff.name}
                            </div>
                          )}
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetails; 