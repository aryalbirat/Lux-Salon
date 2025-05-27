
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Scissors, Calendar } from 'lucide-react';

const services = [
  {
    id: 1,
    name: 'Hair Styling & Cut',
    description: 'Professional cuts, styling, and treatments for all hair types',
    duration: '60 min',
    price: 'From $85',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    icon: Scissors
  },
  {
    id: 2,
    name: 'Hair Coloring',
    description: 'Expert color treatments, highlights, and custom color matching',
    duration: '120 min',
    price: 'From $150',
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    icon: Scissors
  },
  {
    id: 3,
    name: 'Facial Treatments',
    description: 'Rejuvenating facials and skincare treatments for glowing skin',
    duration: '75 min',
    price: 'From $120',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    icon: Clock
  },
  {
    id: 4,
    name: 'Manicure & Pedicure',
    description: 'Luxurious nail care services with premium products',
    duration: '90 min',
    price: 'From $65',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    icon: Calendar
  },
  {
    id: 5,
    name: 'Makeup Services',
    description: 'Professional makeup for special events and occasions',
    duration: '45 min',
    price: 'From $95',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    icon: Scissors
  },
  {
    id: 6,
    name: 'Spa Packages',
    description: 'Complete relaxation packages combining multiple services',
    duration: '180 min',
    price: 'From $299',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    icon: Clock
  }
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our Premium Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive range of beauty and wellness services, 
            each designed to enhance your natural beauty and provide a luxurious experience.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2 backdrop-blur-sm">
                  <service.icon className="h-5 w-5 text-salon-pink" />
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.duration}
                  </div>
                  <div className="text-lg font-semibold text-salon-gold">
                    {service.price}
                  </div>
                </div>
                
                <Button className="w-full bg-salon-pink hover:bg-salon-pink/90 text-gray-800 font-semibold">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-salon-lavender text-salon-lavender hover:bg-salon-lavender hover:text-white font-semibold px-8"
          >
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};
