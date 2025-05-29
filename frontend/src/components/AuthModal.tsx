import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI, appointmentAPI } from '@/services/api';
import { useNotificationService } from '@/services/notifications';

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
  const { login } = useAuth();
  const navigate = useNavigate();
  const notifications = useNotificationService();

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
  });  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use the authAPI service instead of direct fetch call
      const response = await authAPI.login(loginData.email, loginData.password);

      if (!response.success) {
        throw new Error(response.message || 'Failed to login');
      }

      // Use the login function from AuthContext
      login(response.user, response.token);
      
      // Process any pending booking
      await processPendingBooking(response.token, response.user);

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(response.user, response.token);
      }
      
      // Close the modal
      onClose();
      
      // Redirect to dashboard
      navigate('/dashboard');
      
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
    const processPendingBooking = async (token: string, user: User) => {
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
        
        // Use the appointmentAPI to create the booking
        // This will automatically include the auth token from localStorage
        // because of the API client interceptor
        const response = await appointmentAPI.createAppointment(apiBookingData);
        
        if (response.success) {
          // Remove the pending booking from localStorage
          localStorage.removeItem('pendingBooking');
          
          // Show success message using the notification service
          notifications.showSuccess(
            'Booking Completed',
            `Your appointment has been successfully booked for ${new Date(apiBookingData.date).toLocaleDateString()} at ${apiBookingData.time}.`
          );
        } else {
          throw new Error(response.message || 'Failed to process booking');
        }
      } catch (bookingError) {
        console.error('Failed to process pending booking:', bookingError);
        notifications.showError(
          'Booking Failed',
          'We couldn\'t complete your pending booking. Please try again.'
        );
      }
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
      // Create user object with proper formatting for name
      const userData = {
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone.length >= 10 ? registerData.phone : '0000000000',
        password: registerData.password
      };

      // Use authAPI instead of direct fetch
      const response = await authAPI.register(userData);

      if (!response.success) {
        throw new Error(response.message || 'Failed to register');
      }
      
      // Use the login function from AuthContext
      login(response.user, response.token);
      
      notifications.showSuccess(
        'Registration successful!',
        `Welcome to LuxSalon, ${response.user.name}!`
      );

      // Process any pending booking
      await processPendingBooking(response.token, response.user);

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(response.user, response.token);
      }
      
      // Close the modal
      onClose();
      
      // Redirect to dashboard
      navigate('/dashboard');
      
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
