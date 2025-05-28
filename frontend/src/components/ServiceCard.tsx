import { Card, CardContent } from './ui/card';
// Update the import path if Button is in a different location, for example:
import { Button } from './ui/button';
// Or, if using a library like 'shadcn/ui', you might use:
// import { Button } from 'shadcn-ui';
// Make sure the path matches your actual file structure.
import { Clock, LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  icon: LucideIcon;
}

export const ServiceCard = ({
  name,
  description,
  duration,
  price,
  image,
  icon: Icon
}: ServiceCardProps) => {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2 backdrop-blur-sm">
          <Icon className="h-5 w-5 text-salon-pink" />
        </div>
      </div>
      
      <CardContent className="p-6 bg-salon-cream">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {name}
        </h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {duration}
          </div>
          <div className="text-lg font-semibold text-salon-lavender">
            {price}
          </div>
        </div>
        
        <Button className="w-full bg-salon-pink hover:bg-salon-pink/90 text-gray-800 font-semibold">
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
};
