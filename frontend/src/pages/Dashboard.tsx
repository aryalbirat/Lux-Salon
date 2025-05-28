import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentAPI } from '@/services/api';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { UserProfile } from '@/components/UserProfile';
import { useNotificationService } from '@/services/notifications';
import { BookingModal } from '@/components/BookingModal';

interface Appointment {
  _id: string;
  service: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  staff: {
    _id: string;
    name: string;
  };
}

const Dashboard = () => {
  const { user } = useAuth();
  const notifications = useNotificationService();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentAPI.getAppointments();

        if (response.success) {
          setAppointments(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch appointments');
        }      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };  // Handle cancel appointment
  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const response = await appointmentAPI.cancelAppointment(appointmentId);
      if (response.success) {
        // Update the appointments list
        setAppointments(prevAppointments => 
          prevAppointments.map(appointment => 
            appointment._id === appointmentId 
              ? { ...appointment, status: 'cancelled' as const } 
              : appointment
          )
        );
        
        notifications.appointmentCancelled();
      } else {
        throw new Error(response.message || 'Failed to cancel appointment');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      notifications.showError("Cancellation Failed", errorMessage);
    }
  };
  // Handle booking success
  const handleBookingSuccess = async () => {
    // Refresh appointments list
    try {
      setLoading(true);
      const response = await appointmentAPI.getAppointments();
      
      if (response.success) {
        setAppointments(response.data);
        notifications.showSuccess(
          "Success",
          "Your appointment list has been refreshed."
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        onOpenAuthModal={() => {}} 
        onOpenBookingModal={() => setIsBookingModalOpen(true)} 
      />
      
      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        onSuccess={handleBookingSuccess}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">          <div className="md:col-span-2">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
                  <Button 
                    variant="outline" 
                    className="text-salon-lavender border-salon-lavender"
                    onClick={() => setIsBookingModalOpen(true)}
                  >
                    Book New Appointment
                  </Button>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-salon-pink"></div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-8 text-red-600">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    {error}
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="mx-auto h-12 w-12 mb-3 text-gray-400" />
                    <p>You don't have any appointments scheduled.</p>
                    <Button className="mt-4 bg-salon-pink hover:bg-salon-pink/90 text-gray-800">
                      Book Your First Appointment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{appointment.service}</h3>
                            <div className="flex items-center text-gray-600 text-sm mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{formatDate(appointment.date)}</span>
                              <span className="mx-2">•</span>
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{appointment.time}</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Stylist: {appointment.staff.name}
                            </div>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                        </div>                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" onClick={() => setIsBookingModalOpen(true)}>Reschedule</Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleCancelAppointment(appointment._id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>          <div>
            <UserProfile />

            <Card className="shadow-md mt-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Appointment History</h2>
                <div>
                  <div className="flex justify-between text-sm text-gray-500 border-b pb-2 mb-2">
                    <span>Service</span>
                    <span>Date</span>
                  </div>                  {appointments
                    .filter(a => a.status === 'completed')
                    .slice(0, 5)
                    .map((appointment) => (
                      <div key={appointment._id} className="flex justify-between text-sm py-2 border-b">
                        <span>{appointment.service}</span>
                        <span>{formatDate(appointment.date)}</span>
                      </div>
                    ))
                  }
                  {appointments.filter(a => a.status === 'completed').length === 0 && (
                    <div className="text-gray-500 text-sm py-4 text-center">
                      No past appointments
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
