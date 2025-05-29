import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, LucideIcon } from 'lucide-react';

/**
 * Universal Service Card Component
 * 
 * A unified card component for displaying services across the application
 * Replaces the separate ServiceCard, FeatureServiceCard, and previous UniversalServiceCard
 */
interface ServiceCardProps {
  title: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  icon?: LucideIcon;
  buttonText?: string;
  variant?: 'default' | 'featured' | 'compact';
  onClick?: () => void;
  className?: string;
}

export const UniversalServiceCard = ({
  title,
  description,
  duration,
  price,
  image,
  icon: Icon,
  buttonText = "Book Now",
  variant = 'default',
  onClick,
  className = ''
}: ServiceCardProps) => {
  return (
    <Card className={`group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden bg-[#FFF5E5] ${className}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover ${variant === 'default' ? 'group-hover:scale-110 transition-transform duration-500' : ''}`}
        />
        {variant !== 'compact' && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            {Icon && (
              <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2 backdrop-blur-sm">
                <Icon className="h-5 w-5 text-salon-pink" />
              </div>
            )}
          </>
        )}
      </div>      
      <CardContent className="p-6  bg-[#FFF5E5]">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {title}
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

        <Button 
          onClick={onClick} 
          className="w-full bg-salon-pink hover:bg-salon-pink/90 text-gray-800 font-semibold"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
