import { Button } from '@/components/ui/button';
import { UniversalServiceCard } from './UniversalServiceCard';
import { getAllServices } from '@/data/serviceData';
import { scrollToSection } from '@/lib/utils';

export const ServicesSection = ({ onBookService }: { onBookService?: (serviceName: string) => void }) => {
  const services = getAllServices();
  
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
        </div>        {/* Services Grid */}        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <UniversalServiceCard 
              key={service.id}
              title={service.name}
              description={service.description}
              duration={service.duration}
              price={service.price}
              image={service.image}
              icon={service.icon}
              variant="default"
              className="bg-[#FFF5E5]" // Explicitly set light cream background color
              onClick={() => onBookService && onBookService(service.name)}
            />
          ))}
        </div>        {/* CTA */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-salon-lavender text-gray-800 bg-salon-pink hover:bg-salon-lavender hover:text-white font-semibold px-8"
            onClick={() => scrollToSection('services')}
          >
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};
