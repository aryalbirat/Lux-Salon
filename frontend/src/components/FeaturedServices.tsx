import { UniversalServiceCard } from '@/components/UniversalServiceCard';
import { getFeaturedServices } from '@/data/serviceData';

interface FeaturedServicesProps {
  onBookService?: (serviceName: string) => void;
}

export const FeaturedServices = ({ onBookService }: FeaturedServicesProps) => {
  const featuredServices = getFeaturedServices();
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl  text-gray-800  font-bold text-center mb-12">Featured Services</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <UniversalServiceCard
              key={service.id}
              title={service.name}
              description={service.description}
              duration={service.duration}
              price={service.price}
              image={service.image}
              icon={service.icon}
              variant="featured"
              onClick={onBookService ? () => onBookService(service.name) : undefined}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden bg-[#FFF5E5]"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
