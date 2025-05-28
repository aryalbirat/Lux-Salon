import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, User, Scissors } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getAllServices } from '@/data/serviceData';
import { appointmentAPI, staffAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationService } from '@/services/notifications';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  preselectedService?: string;
  onOpenAuthModal?: () => void; // Add this to open the auth modal when needed
}

interface Staff {
  id: string;
  name: string;
  specialty: string;
}

interface Service {
  id: number;
  name: string;
  price: string;
  duration: string;
  description: string;
}

interface Package {
  id: number;
  name: string;
  price: string;
  description: string;
  features: string[];
}

// Default time slots - these will be filtered based on availability
const defaultTimeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
];

// Function to generate pricing packages based on selected service
const generatePricingPackages = (basePrice: string = '$85'): Package[] => {
  const priceValue = parseInt(basePrice.replace(/\D/g, ''));
  const standardPrice = priceValue;
  const premiumPrice = Math.round(priceValue * 1.4); // 40% more
  const deluxePrice = Math.round(priceValue * 1.8);  // 80% more
  
  return [
    {
      id: 1,
      name: 'Standard Package',
      price: `$${standardPrice}`,
      description: 'Basic service without additional features',
      features: ['Standard service', 'Regular products']
    },
    {
      id: 2,
      name: 'Premium Package',
      price: `$${premiumPrice}`,
      description: 'Enhanced service with premium products',
      features: ['Premium service', 'High-quality products', 'Extended time']
    },
    {
      id: 3,
      name: 'Deluxe Package',
      price: `$${deluxePrice}`,
      description: 'Our most luxurious service package',
      features: ['Deluxe service', 'Premium products', 'Extended time', 'Complimentary refreshments']
    }
  ];
};

export const BookingModal = ({ isOpen, onClose, onSuccess, preselectedService, onOpenAuthModal }: BookingModalProps) => {
  const { user, isAuthenticated } = useAuth();
  const notifications = useNotificationService();
  
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedServiceDuration, setSelectedServiceDuration] = useState('');
  const [selectedStylist, setSelectedStylist] = useState('');
  const [selectedStylistId, setSelectedStylistId] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>(getAllServices());
  const [stylists, setStylists] = useState<Staff[]>([]);
  const [pricingPackages, setPricingPackages] = useState<Package[]>(generatePricingPackages());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [clientInfo, setClientInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    notes: ''
  });

  // Fetch staff members on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const response = await staffAPI.getAllStaff();
        if (response.success && response.data) {
          const formattedStaff = response.data.map((staff: { _id: string; name: string; specialty?: string }) => ({
            id: staff._id,
            name: staff.name,
            specialty: staff.specialty || 'Hair Specialist'
          }));
          setStylists(formattedStaff);
        }
      } catch (error) {
        console.error('Failed to fetch staff:', error);
        // Fallback to default stylists if API call fails
        setStylists([
          { id: '1', name: 'Sarah Thompson', specialty: 'Hair Styling' },
          { id: '2', name: 'Maria Garcia', specialty: 'Color Specialist' },
          { id: '3', name: 'Emma Wilson', specialty: 'Skincare Expert' },
          { id: '4', name: 'Lisa Chen', specialty: 'Nail Technician' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen) {
      fetchStaff();
      
      // Pre-fill client info if user is logged in
      if (user) {
        setClientInfo(prev => ({
          ...prev,
          name: user.name,
          email: user.email,
          phone: user.phone || ''
        }));
      }
    }
  }, [isOpen, user]);

  // Fetch available time slots when date and stylist are selected
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (selectedDate && selectedStylistId) {
        try {
          setLoading(true);
          const formattedDate = format(selectedDate, 'yyyy-MM-dd');
          const response = await appointmentAPI.getAvailableTimeSlots(formattedDate, selectedStylistId);
          
          if (response.success) {
            setAvailableTimeSlots(response.data);
          } else {
            setAvailableTimeSlots(defaultTimeSlots);
          }
        } catch (error) {
          console.error('Failed to fetch time slots:', error);
          setAvailableTimeSlots(defaultTimeSlots);
        } finally {
          setLoading(false);
        }
      }
    };
    
    if (selectedDate && selectedStylistId) {
      fetchTimeSlots();
    }
  }, [selectedDate, selectedStylistId]);
  useEffect(() => {
    if (preselectedService) {
      const found = services.find(s => s.name === preselectedService);
      if (found) {
        setSelectedService(found.name);
        setSelectedServiceId(found.id);
        setSelectedServiceDuration(found.duration);
        
        // Update pricing packages based on the preselected service
        const basePrice = found.price.replace('From ', '');
        setPricingPackages(generatePricingPackages(basePrice));
      }
    }
  }, [preselectedService, services]);
  const nextStep = () => {
    const newStep = step + 1;
    console.log(`Moving from step ${step} to step ${newStep}`);
    setStep(newStep);
  };
  
  const prevStep = () => {
    const newStep = step - 1;
    console.log(`Moving from step ${step} to step ${newStep}`);
    setStep(newStep);
  };
    const handleServiceSelection = (service: Service) => {
    setSelectedService(service.name);
    setSelectedServiceId(service.id);
    setSelectedServiceDuration(service.duration);
    
    // Update pricing packages based on the selected service price
    const basePrice = service.price.replace('From ', '');
    setPricingPackages(generatePricingPackages(basePrice));
  };
  
  const handleStylistSelection = (stylist: Staff) => {
    setSelectedStylist(stylist.name);
    setSelectedStylistId(stylist.id);
  };    const handlePackageSelection = (pkg: Package) => {
    setSelectedPackage(pkg.name);
    setSelectedPackageId(pkg.id);
    console.log(`Selected package: ${pkg.name}, ID: ${pkg.id}, Price: ${pkg.price}`); // Debug log
  };
    const handleSignup = () => {
    // If the user is already authenticated, proceed to the next step
    // For demo/testing purposes, we'll allow non-authenticated users to continue as well
    // In a real app, this would integrate with your authentication system
    if (isAuthenticated) {
      nextStep();
    } else {
      // For demo purposes, we'll just show a notification but still allow them to continue
      // You'd typically handle authentication here before proceeding
      notifications.showError(
        'Demo Mode',
        'In a real app, you would need to sign in or register here. For demo purposes, we\'ll let you continue.'
      );
      // Allow progress despite not being authenticated (for demo only)
      nextStep();
    }
  };  // Interface for appointment data
  interface AppointmentData {
    service: string;
    serviceId: number;
    package: string;
    packageId: number;
    staff: string;
    date: string | Date; // Allow both string and Date types to support storage
    time: string;
    duration: string;
    notes: string;
    clientInfo: {
      name: string;
      email: string;
      phone: string;
    };
  }
  
  // This stores the appointment data temporarily when the user is not authenticated
  const [pendingAppointmentData, setPendingAppointmentData] = useState<AppointmentData | null>(null);

  const handleSubmit = async () => {    // Store the appointment data in case we need it after authentication
    const appointmentData = {
      service: selectedService,
      serviceId: selectedServiceId as number,
      package: selectedPackage,
      packageId: selectedPackageId as number,
      staff: selectedStylistId,
      date: selectedDate ? selectedDate.toISOString() : '', // Convert date to string for storage
      time: selectedTime,
      duration: selectedServiceDuration,
      notes: clientInfo.notes,
      clientInfo: {
        name: clientInfo.name,
        email: clientInfo.email,
        phone: clientInfo.phone
      }
    };
    
    // Store the booking data for later use
    setPendingAppointmentData(appointmentData);
    
    // Also store in localStorage so it can be retrieved after authentication
    localStorage.setItem('pendingBooking', JSON.stringify(appointmentData));
      // If the user is not authenticated, close the booking modal and open authentication dialog
    if (!isAuthenticated) {
      // Close the booking modal
      onClose();
      
      // Show notification about authentication being required
      notifications.showAuthRequired(
        'Please sign in to complete your booking',
        'Your booking details have been saved and will be completed after you sign in.'
      );
      
      // Open the authentication modal if the callback is provided
      if (onOpenAuthModal) {
        onOpenAuthModal();
      }
      
      return;
    }
    
    // User is authenticated, proceed with booking
    try {
      setLoading(true);
      
      // Make sure we have a proper Date object for the API call
      const apiAppointmentData = {
        ...appointmentData,
        date: typeof appointmentData.date === 'string' 
          ? new Date(appointmentData.date) 
          : appointmentData.date as Date
      };
      
      const response = await appointmentAPI.createAppointment(apiAppointmentData);
      
      if (response.success) {
        const formattedDate = format(selectedDate as Date, 'PPP');
        notifications.appointmentBooked(formattedDate, selectedTime);
        
        // Reset form
        setStep(1);
        setSelectedService('');
        setSelectedServiceId(null);
        setSelectedPackage('');
        setSelectedPackageId(null);
        setSelectedStylist('');
        setSelectedStylistId('');
        setSelectedDate(undefined);
        setSelectedTime('');
        setClientInfo({
          name: user?.name || '',
          email: user?.email || '',
          phone: '',
          notes: ''
        });
        
        // Call onSuccess if provided
        if (onSuccess) {
          onSuccess();
        }
        
        onClose();
      } else {
        throw new Error(response.message || 'Failed to book appointment');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'There was an error booking your appointment. Please try again.';
      
      notifications.showError('Booking Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log(`Current step: ${step}`);
  }, [step]);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" aria-describedby="booking-dialog-description">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gradient">
            Book Your Appointment
          </DialogTitle>
          <DialogDescription id="booking-dialog-description" className="sr-only">
            Book a salon appointment by following the steps
          </DialogDescription>
        </DialogHeader>        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                step >= i ? "bg-salon-pink text-gray-800" : "bg-gray-200 text-gray-500"
              )}>
                {i}
              </div>
              {i < 5 && (
                <div className={cn(
                  "w-10 h-1 mx-1",
                  step > i ? "bg-salon-pink" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center">
              <Scissors className="mr-2 h-5 w-5 text-salon-pink" />
              Select a Service
            </h3>
            <div className="grid gap-4">            {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelection(service)}
                  className={cn(
                    "p-4 border rounded-lg text-left transition-all duration-200 hover:shadow-md",
                    selectedService === service.name
                      ? "border-salon-pink bg-salon-pink-light/20"
                      : "border-gray-200 hover:border-salon-pink/50"
                  )}
                >
                  <div className="font-semibold">{service.name}</div>
                  <div className="text-sm text-gray-600 flex justify-between mt-1">
                    <span>{service.duration}</span>
                    <span className="font-semibold text-salon-lavender">{service.price}</span>
                  </div>
                </button>
              ))}
            </div>
            <Button 
              onClick={nextStep} 
              disabled={!selectedService}
              className="w-full bg-salon-pink hover:bg-salon-pink/90 text-gray-800"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Stylist Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="mr-2 h-5 w-5 text-salon-pink" />
              Choose Your Stylist
            </h3>          <div className="grid gap-4">
              {loading ? (
                <div className="text-center py-8">Loading stylists...</div>
              ) : stylists.length > 0 ? (
                stylists.map((stylist) => (
                  <button
                    key={stylist.id}
                    onClick={() => handleStylistSelection(stylist)}
                    className={cn(
                      "p-4 border rounded-lg text-left transition-all duration-200 hover:shadow-md",
                      selectedStylist === stylist.name
                        ? "border-salon-pink bg-salon-pink-light/20"
                        : "border-gray-200 hover:border-salon-pink/50"
                    )}
                  >
                    <div className="font-semibold">{stylist.name}</div>
                    <div className="text-sm text-salon-gold">{stylist.specialty}</div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">No stylists available</div>
              )}
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={prevStep} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={nextStep} 
                disabled={!selectedStylist}
                className="flex-1 bg-salon-pink hover:bg-salon-pink/90 text-gray-800"
              >
                Continue
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 3: Pricing Selection */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center">
              <Clock className="mr-2 h-5 w-5 text-salon-pink" />
              Choose Your Pricing
            </h3>
            <div className="grid gap-4">
              {pricingPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => handlePackageSelection(pkg)}
                  className={cn(
                    "p-4 border rounded-lg text-left transition-all duration-200 hover:shadow-md",
                    selectedPackage === pkg.name
                      ? "border-salon-pink bg-salon-pink-light/20"
                      : "border-gray-200 hover:border-salon-pink/50"
                  )}
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">{pkg.name}</span>
                    <span className="font-semibold text-salon-gold">{pkg.price}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{pkg.description}</div>
                  <ul className="mt-2 text-sm text-gray-600">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-salon-pink mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>            <div className="flex gap-4">
              <Button variant="outline" onClick={prevStep} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={() => {
                  console.log("Continue button clicked from pricing step");
                  nextStep();
                }} 
                disabled={!selectedPackage}
                className="flex-1 bg-salon-pink hover:bg-salon-pink/90 text-gray-800"
              >
                Continue
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 4: Date & Time */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-salon-pink" />
              Select Date & Time
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto" style={{ pointerEvents: 'auto' as const }}
                    />
                  </PopoverContent>
                </Popover>
              </div>              <div>
                <Label>Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <SelectItem value="loading" disabled>Loading time slots...</SelectItem>
                    ) : availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-slots" disabled>No available times</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={prevStep} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={nextStep} 
                disabled={!selectedDate || !selectedTime}
                className="flex-1 bg-salon-pink hover:bg-salon-pink/90 text-gray-800"
              >
                Continue
              </Button>
            </div>
          </div>
        )}
          {/* Step 5: Client Information (formerly Step 6) */}
          {/* Step 5: Client Information */}
        {step === 5 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Your Information</h3>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={clientInfo.name}
                  onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Special Requests (Optional)</Label>
                <Input
                  id="notes"
                  value={clientInfo.notes}
                  onChange={(e) => setClientInfo({...clientInfo, notes: e.target.value})}
                  placeholder="Any special requests or notes"
                />
              </div>
            </div>            {/* Booking Summary */}
            <div className="bg-salon-cream p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <div>Service: {selectedService}</div>
                <div>Package: {selectedPackage}</div>
                <div>Stylist: {selectedStylist}</div>
                <div>Date: {selectedDate && format(selectedDate, "PPP")}</div>
                <div>Time: {selectedTime}</div>
                <div className="mt-2 font-semibold text-salon-gold">
                  Price: {pricingPackages.find(pkg => pkg.name === selectedPackage)?.price || ''}
                </div>
              </div>
            </div>            <div className="flex gap-4 justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={loading || !clientInfo.name || !clientInfo.email || !clientInfo.phone}
                className="bg-salon-gold hover:bg-salon-gold/90 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Finish'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
