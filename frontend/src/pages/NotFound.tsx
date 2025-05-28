import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <Button 
          asChild
          className="border-salon-lavender text-salon-lavender bg-salon-cream hover:bg-salon-lavender hover:text-white font-semibold px-6"
        >
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
