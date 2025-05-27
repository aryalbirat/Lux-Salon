
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, User, Scissors } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const services = [
  { id: 1, name: 'Hair Cut & Style', duration: '60 min', price: '$85' },
  { id: 2, name: 'Hair Coloring', duration: '120 min', price: '$150' },
  { id: 3, name: 'Facial Treatment', duration: '75 min', price: '$120' },
  { id: 4, name: 'Manicure & Pedicure', duration: '90 min', price: '$65' },
];

const stylists = [
  { id: 1, name: 'Sarah Thompson', specialty: 'Hair Styling' },
  { id: 2, name: 'Maria Garcia', specialty: 'Color Specialist' },
  { id: 3, name: 'Emma Wilson', specialty: 'Skincare Expert' },
  { id: 4, name: 'Lisa Chen', specialty: 'Nail Technician' },
];

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
];

export const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedStylist, setSelectedStylist] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = () => {
    // Handle booking submission
    console.log('Booking submitted:', {
      service: selectedService,
      stylist: selectedStylist,
      date: selectedDate,
      time: selectedTime,
      client: clientInfo
    });
    onClose();
    setStep(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gradient">
            Book Your Appointment
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                step >= i ? "bg-salon-pink text-gray-800" : "bg-gray-200 text-gray-500"
              )}>
                {i}
              </div>
              {i < 4 && (
                <div className={cn(
                  "w-16 h-1 mx-2",
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
                  onClick={() => setSelectedService(service.name)}
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
                    <span className="font-semibold text-salon-gold">{service.price}</span>
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
              {stylists.map((stylist) => (
                <button
                  key={stylist.id}
                  onClick={() => setSelectedStylist(stylist.name)}
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
              ))}
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

        {/* Step 3: Date & Time */}
        {step === 3 && (
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
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
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

        {/* Step 4: Client Information */}
        {step === 4 && (
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
            <div className="bg-salon-cream p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <div>Service: {selectedService}</div>
                <div>Stylist: {selectedStylist}</div>
                <div>Date: {selectedDate && format(selectedDate, "PPP")}</div>
                <div>Time: {selectedTime}</div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={prevStep} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!clientInfo.name || !clientInfo.email || !clientInfo.phone}
                className="flex-1 bg-salon-gold hover:bg-salon-gold/90 text-white"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
