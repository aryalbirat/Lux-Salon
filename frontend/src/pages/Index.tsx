import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { ServicesSection } from '@/components/ServicesSection';
import { FeaturedServices } from '@/components/FeaturedServices';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { BookingModal } from '@/components/BookingModal';
import { AuthModal } from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentAPI } from '@/services/api';
import { useNotificationService } from '@/services/notifications';

const Index = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | null>(null);
  const { login, authModalRequested, resetAuthModalRequested, authModalOpen, setAuthModalOpen, isAuthenticated } = useAuth();
  const notifications = useNotificationService();
  
  // Watch for auth modal requests from other components
  useEffect(() => {
    if (authModalRequested) {
      console.log('Index detected auth modal request');
      setShowAuthModal(true);
      resetAuthModalRequested();
    }
  }, [authModalRequested, resetAuthModalRequested]);

  // Watch for auth modal open state directly
  useEffect(() => {
    console.log('Auth modal open state changed:', authModalOpen);
    setShowAuthModal(authModalOpen);
  }, [authModalOpen]);
  
  // Process pending booking after successful login
  useEffect(() => {
    const processPendingBooking = async () => {
      // Check if there's a pending booking in localStorage
      const pendingBookingStr = localStorage.getItem('pendingBooking');
      if (!pendingBookingStr) return; // Exit if no pending booking
      
      try {
        console.log('Processing pending booking after login');
        const pendingBooking = JSON.parse(pendingBookingStr);
        
        // Enhanced logging with full object details
        console.log('Pending booking data:', JSON.stringify(pendingBooking, null, 2));
        
        // Prepare booking data for API - only include fields the backend expects
        const bookingData = {
          service: pendingBooking.service,
          date: pendingBooking.date,
          time: pendingBooking.time,
          // Optional fields
          serviceId: pendingBooking.serviceId || null,
          staff: pendingBooking.staff || null,
          staffId: pendingBooking.staffId || null,
          duration: pendingBooking.duration || '1 hour',
          notes: pendingBooking.notes || ''
        };
        
        // Enhanced logging with full object details
        console.log('Sending booking data:', JSON.stringify(bookingData, null, 2));
        
        const response = await appointmentAPI.createAppointment(bookingData);
        
        // Always clear the pending booking to prevent infinite loops
        localStorage.removeItem('pendingBooking');
        
        if (response.success) {
          notifications.showSuccess("Success", "Your appointment has been booked successfully!");
          setShowBookingModal(false);
        } else {
          // Enhanced error logging
          console.error('Booking failed with response:', JSON.stringify(response, null, 2));
          notifications.showError("Booking Failed", response.message || "There was an error booking your appointment.");
        }
      } catch (error) {
        // Clear pending booking on error to prevent infinite loops
        localStorage.removeItem('pendingBooking');
        // Enhanced error logging
        console.error('Error processing pending booking:', error);
        if (error.response) {
          console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
        }
        notifications.showError("Booking Error", "There was a problem completing your booking.");
      }
    };

    // Only process pending booking if user is authenticated
    if (isAuthenticated) {
      processPendingBooking();
    }
  }, [isAuthenticated, notifications]);

  interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'client' | 'staff' | 'admin';
  }
  
  const handleAuthSuccess = (user: User, token: string) => {
    login(user, token);
    setShowAuthModal(false);
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    setAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenBookingModal={() => setShowBookingModal(true)}
      />
      <HeroSection onBookAppointment={() => setShowBookingModal(true)} />
      
      {/* Services sections */}
      <ServicesSection onBookService={(serviceName) => {
        setShowBookingModal(true);
        setPreselectedService(serviceName);
      }} />
      <FeaturedServices onBookService={(serviceName) => {
        setShowBookingModal(true);
        setPreselectedService(serviceName);
      }} />
      <TestimonialsSection />
      
      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Salon Gallery
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take a peek inside our luxurious salon and see our beautiful transformations.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
            ].map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg group cursor-pointer">
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Visit Our Salon
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience luxury and relaxation in our beautiful downtown location.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="bg-[#FAF3E0] border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-salon-pink" />
                      <span>123 Beauty Avenue, Downtown, NY 10001</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-salon-pink" />
                      <span>(555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-salon-pink" />
                      <span>hello@luxsalon.com</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#FAF3E0] border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Opening Hours</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Thursday</span>
                      <span>9:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Friday - Saturday</span>
                      <span>9:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>10:00 AM - 6:00 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-4">
                <Button size="sm" variant="outline" className="p-2">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="p-2">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="p-2">
                  <Twitter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>Interactive Map Coming Soon</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => setShowBookingModal(true)}
              className=" text-gray-800  bg-salon-pink hover:bg-salon-lavender hover:text-white border border-salon-lavender font-semibold px-8"
            >
              Book Your Appointment Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gradient mb-4">LuxSalon</h3>
              <p className="text-gray-300">
                Where beauty meets luxury. Experience the finest in beauty and wellness services.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#services" className="block text-gray-300 hover:text-salon-pink transition-colors">Services</a>
                <a href="#gallery" className="block text-gray-300 hover:text-salon-pink transition-colors">Gallery</a>
                <a href="#contact" className="block text-gray-300 hover:text-salon-pink transition-colors">Contact</a>
                <a href="#" className="block text-gray-300 hover:text-salon-pink transition-colors">Gift Cards</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2">
                <span className="block text-gray-300">Hair Styling</span>
                <span className="block text-gray-300">Hair Coloring</span>
                <span className="block text-gray-300">Facial Treatments</span>
                <span className="block text-gray-300">Nail Services</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 LuxSalon. All rights reserved.</p>
          </div>
        </div>
      </footer>      <BookingModal 
        isOpen={showBookingModal} 
        onClose={() => { setShowBookingModal(false); setPreselectedService(null); }} 
        preselectedService={preselectedService}
        onOpenAuthModal={() => setShowAuthModal(true)}
      />
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleAuthModalClose} 
        onSuccess={handleAuthSuccess} 
      />
    </div>
  );
};

export default Index;
