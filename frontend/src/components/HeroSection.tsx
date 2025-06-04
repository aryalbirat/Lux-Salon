import { Button } from '@/components/ui/button';
import { Calendar, Star, Users } from 'lucide-react';

export const HeroSection = ({ onBookAppointment }: { onBookAppointment?: () => void }) => {
  const handleViewServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center gradient-bg overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-salon-pink rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-salon-lavender rounded-full"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-salon-gold-light rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Your Beauty,
              <span className="text-gradient block">Our Passion</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Experience luxury beauty services in a serene environment. 
              Book your perfect appointment with our expert stylists and 
              discover your most beautiful self.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button 
                size="lg" 
                className="bg-salon-pink hover:bg-salon-pink/90 text-gray-800 font-semibold px-8 py-4 text-lg"
                onClick={onBookAppointment}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-salon-lavender text-gray-800 bg-salon-pink hover:bg-salon-pink/80 font-semibold px-8 py-4 text-lg"
                onClick={handleViewServices}
              >
                View Services
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-salon-lavender">500+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-salon-lavender">15+</div>
                <div className="text-sm text-gray-600">Expert Stylists</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-salon-lavender">4.9</div>
                <div className="text-sm text-gray-600">Star Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
                alt="Luxury salon interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-4 animate-slide-in">
              <div className="flex items-center space-x-3">
                <Star className="h-8 w-8 text-salon-lavender fill-current" />
                <div>
                  <div className="font-semibold text-gray-800">Premium Quality</div>
                  <div className="text-sm text-gray-600">5-Star Service</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-slide-in">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-salon-pink" />
                <div>
                  <div className="font-semibold text-gray-800">Expert Team</div>
                  <div className="text-sm text-gray-600">Certified Professionals</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
