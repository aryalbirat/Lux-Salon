import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Clock, AlertCircle, Filter, Search, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookingModal } from '@/components/BookingModal';
import { useNotificationService } from '@/services/notifications';
import { appointmentAPI } from '@/services/api';

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
  notes?: string;
}

const Bookings = () => {
  const notifications = useNotificationService();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // Get both current and historical appointments
      const [currentResponse, historyResponse] = await Promise.all([
        appointmentAPI.getAppointments(1, 25),
        appointmentAPI.getAppointmentHistory(1, 25)
      ]);
      
      if (currentResponse.success && historyResponse.success) {
        // Combine both types of appointments
        const currentData = currentResponse.data || currentResponse.appointments || [];
        const historyData = historyResponse.data || historyResponse.appointments || [];
        const allAppointments = [...currentData, ...historyData];
        
        setAppointments(allAppointments);
        setFilteredAppointments(allAppointments);
      } else {
        throw new Error('Failed to fetch appointments');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);      
      notifications.showError(
        "Error",
        "Failed to load appointments. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  // Using empty dependency array since fetchAppointments would cause an infinite loop
  // and we only want to fetch on component mount
  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    // Apply filters and search
    let filtered = [...appointments];
    
    // Status filter
    if (filter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === filter);
    }
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(appointment => 
        appointment.service.toLowerCase().includes(searchLower) ||
        appointment.staff.name.toLowerCase().includes(searchLower) ||
        (appointment.notes && appointment.notes.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredAppointments(filtered);
  }, [filter, search, appointments]);
  
  // The fetchAppointments function is intentionally excluded from dependencies
  // as it would cause an infinite loop

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
  };  
  
  const handleCancelAppointment = async (id: string) => {
    try {
      const response = await appointmentAPI.cancelAppointment(id);

      if (response.success) {
        // Update the appointments list
        setAppointments(prevAppointments => 
          prevAppointments.map(appointment => 
            appointment._id === id 
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
  
  // Handler for manual refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
          <Button 
            className="bg-salon-pink hover:bg-salon-pink/90 text-gray-800"
            onClick={() => setShowBookingModal(true)}
          >
            Book New Appointment
          </Button>
        </div>

        <Card className="shadow-md mb-8">
          <CardContent className="p-6">            
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search appointments..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 max-w-xs w-full md:w-auto">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No-show</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleRefresh} 
                  disabled={loading || refreshing} 
                  className="ml-1"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-salon-pink"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16 text-red-600">
            <AlertCircle className="mr-2 h-5 w-5" />
            {error}
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Calendar className="mx-auto h-16 w-16 mb-4 text-gray-400" />
            <p className="text-xl font-medium mb-2">No appointments found</p>
            <p>
              {filter !== 'all' ? 'Try changing your filter settings' : 'Book your first appointment now!'}
            </p>
            {filter === 'all' && (
              <Button
                className="mt-6 bg-salon-pink hover:bg-salon-pink/90 text-gray-800"
                onClick={() => setShowBookingModal(true)}
              >
                Book Appointment
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <Card key={appointment._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-xl font-semibold">{appointment.service}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm mt-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(appointment.date)}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Stylist: {appointment.staff.name}
                      </div>
                      {appointment.notes && (
                        <div className="mt-3 text-sm text-gray-500">
                          <p className="italic">"{appointment.notes}"</p>
                        </div>
                      )}
                      {appointment.status === 'scheduled' && (
                        <div className="mt-4 space-x-3 flex">
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleCancelAppointment(appointment._id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <BookingModal 
        isOpen={showBookingModal} 
        onClose={() => setShowBookingModal(false)} 
        onSuccess={() => {
          setShowBookingModal(false);
          handleRefresh();
        }} 
      />
    </div>
  );
};

export default Bookings;
