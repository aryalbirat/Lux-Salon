import { useState } from 'react';
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

const Index = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | null>(null);
  const { login } = useAuth();
  
  const handleAuthSuccess = (user: any, token: string) => {
    login(user, token);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenBookingModal={() => setShowBookingModal(true)}
      />
      <HeroSection onBookAppointment={() => setShowBookingModal(true)} />
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
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
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

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
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
              className="bg-purple-500 hover:bg-salon-lavender text-salon-lavender hover:text-white border border-salon-lavender font-semibold px-8"
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
        onClose={() => setShowAuthModal(false)} 
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
