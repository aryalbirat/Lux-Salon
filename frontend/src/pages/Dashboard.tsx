import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentAPI } from '@/services/api';
import { Calendar, Clock, AlertCircle, Filter, Search, RefreshCw, User } from 'lucide-react';
import { UserProfile } from '@/components/UserProfile';
import { useNotificationService } from '@/services/notifications';
import { BookingModal } from '@/components/BookingModal';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

const Dashboard = () => {  const { user } = useAuth();
  const notifications = useNotificationService();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);  const [currentAppointments, setCurrentAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [bookings, setBookings] = useState<Appointment[]>([]);
  
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // Fetch current appointments
      const currentResponse = await appointmentAPI.getAppointments(1, 20);
      
      // Fetch appointment history
      const historyResponse = await appointmentAPI.getAppointmentHistory(1, 20);
      
      if (currentResponse?.success && historyResponse?.success) {
        // Handle different response structures
        const currentData = currentResponse.data || currentResponse.appointments || [];
        const historyData = historyResponse.data || historyResponse.appointments || [];
        
        // Combine both sets of appointments
        const allAppointments = [...currentData, ...historyData];
        
        setCurrentAppointments(currentData);
        setPastAppointments(historyData);
        setAppointments(allAppointments);
        
        // Initially filter based on active tab
        if (activeTab === 'upcoming') {
          setFilteredAppointments(currentData);
        } else {
          setFilteredAppointments(historyData);
        }
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

  const fetchBookings = async () => {
    try {
      console.log('Fetching bookings from database');
      const response = await appointmentAPI.getAppointments();

      if (response.success) {
        console.log('Bookings fetched successfully:', response.data);
        setBookings(response.data);
      } else {
        console.error('Failed to fetch bookings:', response.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
    fetchBookings();
  }, []);
    // Handle filtering and searching appointments
  useEffect(() => {
    // Select the appropriate appointment set based on tab
    const baseAppointments = activeTab === 'upcoming' ? currentAppointments : pastAppointments;
    
    // Apply filters and search
    let filtered = [...baseAppointments];
    
    // Apply status filter if not 'all'
    if (filter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === filter);
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(appointment => 
        appointment.service?.toLowerCase().includes(searchLower) ||
        appointment.staff?.name?.toLowerCase().includes(searchLower) ||
        (appointment.notes && appointment.notes.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredAppointments(filtered);
  }, [filter, search, currentAppointments, pastAppointments, activeTab]);
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
      <Navigation 
        onOpenAuthModal={() => {}} 
        onOpenBookingModal={() => setIsBookingModalOpen(true)} 
      />

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        onSuccess={() => {
          handleRefresh();
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || 'Guest'}!</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost"
              className="flex items-center gap-2 border border-gray-200"
              onClick={() => setShowProfileModal(true)}
            >
              <User size={16} />
              <span>Profile</span>
            </Button>
            <Button 
              className="bg-salon-pink hover:bg-salon-pink/90 text-gray-800"
              onClick={() => setIsBookingModalOpen(true)}
            >
              Book New Appointment
            </Button>
          </div>
        </div>

        <Card className="shadow-md mb-8">
          <CardContent className="p-6">
            <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-6">
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
                  <TabsTrigger value="past">Past Appointments</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleRefresh} 
                    disabled={loading || refreshing} 
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
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
                </div>
              </div>

              <TabsContent value="upcoming">
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
                    <p className="text-xl font-medium mb-2">No upcoming appointments</p>
                    <p>Book your next appointment now!</p>
                    <Button
                      className="mt-6 bg-salon-pink hover:bg-salon-pink/90 text-gray-800"
                      onClick={() => setIsBookingModalOpen(true)}
                    >
                      Book Appointment
                    </Button>
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
              </TabsContent>

              <TabsContent value="past">
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
                    <p className="text-xl font-medium mb-2">No past appointments</p>
                    <p>Your appointment history will appear here.</p>
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
                              {appointment.status === 'completed' && (
                                <div className="mt-4">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="bg-salon-pink/10 hover:bg-salon-pink/20 text-salon-pink"
                                    onClick={() => setIsBookingModalOpen(true)}
                                  >
                                    Book Again
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* My Bookings Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Bookings</h2>
          <Card className="shadow-md">
            <CardContent className="p-6">
              {bookings.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Calendar className="mx-auto h-16 w-16 mb-4 text-gray-400" />
                  <p className="text-xl font-medium mb-2">No bookings found</p>
                  <p>Your bookings will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="p-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold">{booking.service}</h3>
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
                        <div className="text-sm text-gray-600 mt-1">
                          Stylist: {booking.staff.name}
                        </div>
                        {booking.notes && (
                          <div className="mt-3 text-sm text-gray-500">
                            <p className="italic">"{booking.notes}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* User Profile Modal */}
      {showProfileModal && (
        <UserProfile 
          isOpen={showProfileModal} 
          onClose={() => setShowProfileModal(false)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
