import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

export const BookingModal = ({ isOpen, onClose, onSuccess, preselectedService, onOpenAuthModal }: BookingModalProps) => {  const { user, isAuthenticated, openAuthModal, setAuthModalOpen } = useAuth();
  const notifications = useNotificationService();
  // Memoize notification functions to prevent them from causing re-renders
  const showInfoNotification = useCallback((title: string, message: string) => {
    notifications.showInfo(title, message);
  }, [notifications]);
  
  // Create ref to track if component is mounted
  const isMountedRef = useRef(true);
  
  // Ref to prevent redundant API calls for the same date/stylist combination
  const prevFetchParamsRef = useRef<{date: string, stylistId: string} | null>(null);
  
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
  });  // Initialize prevStepRef to track the previous step
  const prevStepRef = useRef<number>(step);
  
  useEffect(() => {
    // Update prevStepRef whenever step changes
    prevStepRef.current = step;
  }, [step]);
  
  // Default staff members to use as fallback
  const defaultStylists = useMemo(() => [
    { id: '1', name: 'Sarah Thompson', specialty: 'Hair Styling' },
    { id: '2', name: 'Maria Garcia', specialty: 'Color Specialist' },
    { id: '3', name: 'Emma Wilson', specialty: 'Skincare Expert' },
    { id: '4', name: 'Lisa Chen', specialty: 'Nail Technician' },
  ], []);
  
  // Store notification functions and modal state in refs to avoid dependency changes
  const notificationsRef = useRef(notifications);
  const isOpenRef = useRef(isOpen);
  
  // Update refs when their values change
  useEffect(() => {
    notificationsRef.current = notifications;
    isOpenRef.current = isOpen;
  }, [notifications, isOpen]);
  
  // Track if we've already fetched staff for this modal session
  const staffFetchedRef = useRef(false);
  
  // Fetch staff members when modal opens
  useEffect(() => {
    // Only fetch staff when the modal first opens
    if (!isOpen || staffFetchedRef.current) {
      return;
    }
    
    const fetchStaff = async () => {
      try {
        setLoading(true);
        staffFetchedRef.current = true;
        
        const response = await staffAPI.getAllStaff();
        
        // Only process if modal is still open
        if (!isOpenRef.current) return;
        
        if (response?.success && Array.isArray(response.data) && response.data.length > 0) {
          const formattedStaff = response.data.map((staff: { _id: string; name: string; specialty?: string }) => ({
            id: staff._id,
            name: staff.name,
            specialty: staff.specialty || 'Hair Specialist'
          }));
          
          setStylists(formattedStaff);
        } else {
          // Fallback to default stylists if API call returns empty data
          setStylists(defaultStylists);
          
          // Show notification only once and only if modal is still open
          if (isOpenRef.current) {
            notificationsRef.current.showInfo(
              'Using Default Stylists',
              'Using default stylists for demonstration purposes.'
            );
          }
        }
      } catch (error) {
        console.error('Failed to fetch staff:', error);
        
        // Fallback to default stylists if API call fails
        if (isOpenRef.current) {
          setStylists(defaultStylists);
        }
      } finally {
        if (isOpenRef.current) {
          setLoading(false);
        }
      }
    };
    
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
    
    // Reset staffFetched when modal closes
    return () => {
      staffFetchedRef.current = false;
    };
  }, [isOpen, user, defaultStylists]); // Only depend on modal opening, user, and defaultStylists// Ensure time slots are properly initialized when moving to date/time step 
  
  useEffect(() => {
    // Only run when first entering step 4
    if (step === 4 && prevStepRef.current !== 4) {
      // If we don't have a date and stylist yet, initialize with defaults
      const needsTimeSlots = !selectedDate || !selectedStylistId || 
                            (availableTimeSlots && availableTimeSlots.length === 0);
                            
      if (needsTimeSlots && !loading) {
        console.log('Initializing default time slots for step 4');
        setAvailableTimeSlots([...defaultTimeSlots]);
      }
    }
    // Update our ref
    prevStepRef.current = step;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, selectedDate, selectedStylistId, loading]);
    // Keep track of previous values to avoid unnecessary API calls
  const prevDateRef = useRef<Date | undefined>(undefined);
  const prevStylistIdRef = useRef<string>('');
  const timeSlotsRequestRef = useRef<{ fetching: boolean, key: string }>({ fetching: false, key: '' });

  // Fetch available time slots when date and stylist are selected
  useEffect(() => {
    // Skip if either value is not set
    if (!selectedDate || !selectedStylistId) {
      return;
    }

    // Create a key representing this date/stylist combination
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const fetchKey = `${formattedDate}_${selectedStylistId}`;

    // Check if we already have data for this combination or a request is in progress
    const dateChanged = !prevDateRef.current || prevDateRef.current.getTime() !== selectedDate.getTime();
    const stylistChanged = prevStylistIdRef.current !== selectedStylistId;
      // Only fetch if either date or stylist changed and no request is in progress
    if ((dateChanged || stylistChanged) && !timeSlotsRequestRef.current.fetching) {
      console.log(`Fetching time slots for date: ${formattedDate}, stylist: ${selectedStylistId}`);
      
      // Update our tracking refs
      prevDateRef.current = selectedDate;
      prevStylistIdRef.current = selectedStylistId;
      timeSlotsRequestRef.current = { fetching: true, key: fetchKey };
      
      // Clear existing time slots while loading new ones
      setLoading(true);
      setAvailableTimeSlots([]);
      
      const fetchTimeSlots = async () => {
        try {
          const response = await appointmentAPI.getAvailableTimeSlots(formattedDate, selectedStylistId);
          
          // Check if we're still on the same date/stylist (user may have changed selections)
          if (
            prevDateRef.current?.getTime() === selectedDate.getTime() && 
            prevStylistIdRef.current === selectedStylistId
          ) {
            if (response?.success && Array.isArray(response.data)) {
              setAvailableTimeSlots(response.data);
              console.log(`Received ${response.data.length} time slots`);
            } else {
              console.warn('API response format unexpected, using default time slots');
              setAvailableTimeSlots([...defaultTimeSlots]);
              showInfoNotification('Info', 'Using default available times');
            }
          }
        } catch (error) {
          console.error('Failed to fetch time slots:', error);
          // Only set default slots if we're still interested in this date/stylist combination
          if (
            prevDateRef.current?.getTime() === selectedDate.getTime() && 
            prevStylistIdRef.current === selectedStylistId
          ) {
            setAvailableTimeSlots([...defaultTimeSlots]);
            showInfoNotification('Connection Issue', 'Using default available times');
          }        } finally {
          setLoading(false);
          timeSlotsRequestRef.current.fetching = false;
        }
      };
      
      fetchTimeSlots();
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedStylistId]); // Intentionally exclude showInfoNotification to prevent infinite loop

  // Set preselected service if available
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
    // Make sure we set both the name and ID correctly
    console.log(`Selected stylist: ${stylist.name}, ID: ${stylist.id}`);
    setSelectedStylist(stylist.name);
    setSelectedStylistId(stylist.id);
  };

  const handlePackageSelection = (pkg: Package) => {
    setSelectedPackage(pkg.name);
    setSelectedPackageId(pkg.id);
    console.log(`Selected package: ${pkg.name}, ID: ${pkg.id}, Price: ${pkg.price}`);
  };

  const handleSignup = () => {
    // If the user is already authenticated, proceed to the next step
    if (isAuthenticated) {
      nextStep();
    } else {
      // For demo purposes, still allow them to continue
      notifications.showInfo(
        'Demo Mode',
        'In a real app, you would need to sign in here. For demo purposes, we\'ll let you continue.'
      );
      nextStep();
    }
  };

  // Interface for appointment data
  interface AppointmentData {
    service: string;
    serviceId: number;
    package: string;
    packageId: number;
    staff: string;
    date: string | Date;
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
  const handleSubmit = async () => {
    console.log('Submitting booking...');
    
    // Check if user is authenticated, if not, open auth modal
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to handleFinish to open login modal');
      handleFinish();
      return;
    }
    
    const bookingData = {
      service: selectedService,
      serviceId: selectedServiceId,
      package: selectedPackage,
      packageId: selectedPackageId,
      staff: selectedStylist,
      staffId: selectedStylistId,
      date: selectedDate ? new Date(selectedDate) : new Date(), // Ensure it's a Date object
      time: selectedTime,
      duration: selectedServiceDuration,
      client: clientInfo.name,
      notes: clientInfo.notes,
    };

    try {
      console.log('Booking data:', bookingData);
      const response = await appointmentAPI.createAppointment(bookingData);
      console.log('Booking response:', response);
      if (response.success) {
        if (onSuccess) {
          onSuccess();
        }
        notifications.showSuccess("Success", "Your appointment has been booked successfully!");
        onClose();
      } else if (response.needsAuth) {
        console.log('Authentication required for booking');
        // Open auth modal
        openAuthModal();
      } else {
        console.error('Failed to book appointment:', response.message);
        notifications.showError("Booking Failed", response.message || "There was an error booking your appointment.");
      }
    } catch (error) {
      console.error('Error during booking:', error);
    }
  };

  // Step 4: Handle API failure gracefully
  useEffect(() => {
    if (step === 4 && prevStepRef.current !== 4) {
      const fetchTimeSlots = async () => {
        try {          // Handle case where selectedDate might be undefined
          let formattedDate;
          if (selectedDate) {
            formattedDate = format(selectedDate, 'yyyy-MM-dd');
          } else {
            formattedDate = format(new Date(), 'yyyy-MM-dd');
          }
          
          console.log(`Fetching time slots for date: ${formattedDate}, stylist: ${selectedStylistId || 'all'}`);
          const response = await appointmentAPI.getAvailableTimeSlots(formattedDate, selectedStylistId);
          if (response.success && Array.isArray(response.data)) {
            setAvailableTimeSlots(response.data);
          } else {
            console.warn('API response format unexpected, using default time slots');
            setAvailableTimeSlots([...defaultTimeSlots]);
          }
        } catch (error) {
          console.error('Error fetching available time slots:', error);
          setAvailableTimeSlots([...defaultTimeSlots]);
        }
      };
      fetchTimeSlots();
    }
  }, [step, selectedDate, selectedStylistId]);
  // Step 5: Trigger login/signup modal if not authenticated
  const handleFinish = async () => {
    console.log('Finish button pressed');

    if (!isAuthenticated) {
      console.log('User not authenticated, opening login/signup modal');
      // Store appointment data for later
      const pendingData = {
        service: selectedService,
        serviceId: selectedServiceId,
        package: selectedPackage,
        packageId: selectedPackageId,
        staff: selectedStylist,
        staffId: selectedStylistId,
        date: selectedDate || new Date(),
        time: selectedTime,
        duration: selectedServiceDuration,
        notes: clientInfo.notes,
        clientInfo: {
          name: clientInfo.name,
          email: clientInfo.email,
          phone: clientInfo.phone
        }
      };
      
      setPendingAppointmentData(pendingData);
      console.log('Storing pending appointment data:', pendingData);
      
      // Open the auth modal and wait for login
      console.log('Opening authentication modal');
      openAuthModal();
      return; // Stop here and wait for auth
    }

    // Create booking data for API
    const bookingData = {
      service: selectedService,
      serviceId: selectedServiceId,
      package: selectedPackage,
      packageId: selectedPackageId,
      staff: selectedStylistId,  // Use ID directly since our backend expects an ID
      staffId: selectedStylistId,
      date: selectedDate ? new Date(selectedDate) : new Date(),  // Ensure it's a Date object
      time: selectedTime,
      duration: selectedServiceDuration,
      client: clientInfo.name,
      notes: clientInfo.notes,
    };

    try {
      console.log('Booking data:', bookingData);
      const response = await appointmentAPI.createAppointment(bookingData);
      console.log('Booking response:', response);
      if (response.success) {
        if (onSuccess) {
          onSuccess();
        }
        notifications.showSuccess("Success", "Your appointment has been booked successfully!");
        onClose();
      } else if (response.needsAuth) {
        console.log('Authentication required for booking');
        // Open auth modal
        openAuthModal();
      } else {
        console.error('Failed to book appointment:', response.message);
        notifications.showError("Booking Failed", response.message || "There was an error booking your appointment.");
      }
    } catch (error) {
      console.error('Error during booking:', error);
    }
  };

  // Debug component state
  useEffect(() => {
    console.log(`Current step: ${step}`);
  }, [step]);
  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gradient">
            Book Your Appointment
          </DialogTitle>
          <DialogDescription>
            Book a salon appointment by following the steps
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress Bar */}
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
            <div className="grid gap-4">
              {services.map((service) => (
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
            </h3>
            <div className="grid gap-4">
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
            </div>
            <div className="flex gap-4">
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
                      className="pointer-events-auto" 
                      style={{ pointerEvents: 'auto' as const }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <SelectItem value="loading" disabled>Loading time slots...</SelectItem>
                    ) : (Array.isArray(availableTimeSlots) && availableTimeSlots.length > 0) ? (
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
            </div>
            
            {/* Booking Summary */}
            <div className="bg-[#FAF3E0] p-4 rounded-lg">
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
            </div>
              <div className="flex gap-4 justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>              <Button 
                onClick={handleFinish}
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

export default BookingModal;