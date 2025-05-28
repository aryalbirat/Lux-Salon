import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: User, token: string) => void;
}

export const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast({
        title: 'Login successful!',
        description: `Welcome back, ${data.user.name}!`,
      });

      // Check for pending booking and process it
      const pendingBooking = localStorage.getItem('pendingBooking');
      if (pendingBooking) {
        try {
          // Parse the pending booking data
          const bookingData = JSON.parse(pendingBooking);
          
          // Convert the date string back to a Date object
          const apiBookingData = {
            ...bookingData,
            date: new Date(bookingData.date)
          };
          
          // Submit the booking now that the user is authenticated
          const bookResponse = await fetch('http://localhost:5000/api/appointments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify(apiBookingData)
          });
          
          const bookResult = await bookResponse.json();
          
          if (bookResponse.ok && bookResult.success) {
            // Remove the pending booking from localStorage
            localStorage.removeItem('pendingBooking');
            
            // Show success message
            toast({
              title: 'Booking Completed',
              description: `Your appointment has been successfully booked.`,
            });
          }
        } catch (bookingError) {
          console.error('Failed to process pending booking:', bookingError);
          toast({
            title: 'Booking Failed',
            description: 'We couldn\'t complete your pending booking. Please try again.',
            variant: 'destructive'
          });
        }
      }

      // Call the success callback
      if (onSuccess) {
        onSuccess(data.user, data.token);
      }      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Login failed. Please try again.';
      
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          phone: registerData.phone,
          password: registerData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast({
        title: 'Registration successful!',
        description: `Welcome to LuxSalon, ${data.user.name}!`,
      });

      // Check for pending booking and process it
      const pendingBooking = localStorage.getItem('pendingBooking');
      if (pendingBooking) {
        try {
          // Parse the pending booking data
          const bookingData = JSON.parse(pendingBooking);
          
          // Convert the date string back to a Date object
          const apiBookingData = {
            ...bookingData,
            date: new Date(bookingData.date)
          };
          
          // Submit the booking now that the user is authenticated
          const bookResponse = await fetch('http://localhost:5000/api/appointments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify(apiBookingData)
          });
          
          const bookResult = await bookResponse.json();
          
          if (bookResponse.ok && bookResult.success) {
            // Remove the pending booking from localStorage
            localStorage.removeItem('pendingBooking');
            
            // Show success message
            toast({
              title: 'Booking Completed',
              description: `Your appointment has been successfully booked.`,
            });
          }
        } catch (bookingError) {
          console.error('Failed to process pending booking:', bookingError);
          toast({
            title: 'Booking Failed',
            description: 'We couldn\'t complete your pending booking. Please try again.',
            variant: 'destructive'
          });
        }
      }

      // Call the success callback
      if (onSuccess) {
        onSuccess(data.user, data.token);
      }onClose();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Registration failed. Please try again.';
      
      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-violer-2 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-slate-200 font-bold text-center text-gradient">
            Welcome to LuxSalon
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid bg-slate-2w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  className='bg-violer-2 text-gray-800'
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-0">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-salon-lavender hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                    className='bg-violer-2 text-gray-800'
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-salon-pink hover:bg-salon-pink/90 text-gray-800"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full Name</Label>
                <Input
                  id="reg-name"
                  placeholder="Jane Smith"
                  required
                  value={registerData.name}
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-0">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-0">
                <Label htmlFor="reg-phone">Phone Number</Label>
                <Input
                  id="reg-phone"
                  placeholder="(555) 123-4567"
                  required
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                />
              </div>
              
              <div className="space-y-0">
                <Label htmlFor="reg-password">Password</Label>
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                />
              </div>
              
              <div className="space-y-0">
                <Label htmlFor="reg-confirm-password">Confirm Password</Label>
                <Input
                  id="reg-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-salon-pink hover:bg-salon-pink/90 text-gray-800"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
