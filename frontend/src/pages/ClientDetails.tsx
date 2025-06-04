import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, ArrowLeft, User, Mail, Phone, CalendarDays } from 'lucide-react';
import { useClientDetails } from '@/hooks/useClientDetails';

const ClientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { client, loading, error } = useClientDetails(id);

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
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'no-show':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-salon-pink"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Error</h2>
            <p className="text-gray-600">{error || 'Client not found'}</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/admin/clients')}
            >
              Back to Clients
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/clients')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to All Clients
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Client Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{client.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                </div>
                {client.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{client.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">{formatDate(client.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
            </CardHeader>
            <CardContent>
              {client.bookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No bookings found for this client.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {client.bookings.map((booking) => (
                    <div 
                      key={booking._id} 
                      className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{booking.service}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm mt-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(booking.date)}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{booking.time}</span>
                      </div>
                      {booking.staff && (
                        <div className="text-sm text-gray-600 mt-1">
                          Staff: {booking.staff.name}
                        </div>
                      )}
                      {booking.package && (
                        <div className="text-sm text-gray-600 mt-1">
                          Package: {booking.package}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsPage;
