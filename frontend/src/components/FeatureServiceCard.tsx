import { Button } from './ui/button';
import { Clock } from 'lucide-react';

interface FeatureServiceCardProps {
  title: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  buttonText?: string;
}

export const FeatureServiceCard: React.FC<FeatureServiceCardProps> = ({
  title,
  description,
  duration,
  price,
  image,
  buttonText = "Book Now",
}) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between bg-[#FFF5E5] p-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">{description}</p>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {duration}
            </div>
            <div className="text-lg font-semibold text-salon-lavender">
              {price}
            </div>
          </div>
        </div>
        <Button className="w-full bg-salon-pink hover:bg-salon-pink/90 text-gray-800 font-semibold">
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
