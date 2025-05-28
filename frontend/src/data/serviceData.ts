import { Clock, Scissors, Calendar, LucideIcon } from 'lucide-react';

// Define a single ServiceItem type that can be used throughout the application
export interface ServiceItem {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  icon?: LucideIcon;
  featured?: boolean;
}

// Define a single source of truth for service data
export const serviceData: ServiceItem[] = [
  {
    id: 1,
    name: 'Hair Styling & Cut',
    description: 'Professional cuts, styling, and treatments for all hair types',
    duration: '60 min',
    price: 'From $85',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    icon: Scissors,
    featured: false
  },
  {
    id: 2,
    name: 'Hair Coloring',
    description: 'Expert color treatments, highlights, and custom color matching',
    duration: '120 min',
    price: 'From $150',
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    icon: Scissors,
    featured: false
  },
  {
    id: 3,
    name: 'Facial Treatments',
    description: 'Rejuvenating facials and skincare treatments for glowing skin',
    duration: '75 min',
    price: 'From $120',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    icon: Clock,
    featured: false
  },
  {
    id: 4,
    name: 'Manicure & Pedicure',
    description: 'Luxurious nail care services with premium products',
    duration: '90 min',
    price: 'From $65',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    icon: Calendar,
    featured: true
  },
  {
    id: 5,
    name: 'Makeup Services',
    description: 'Professional makeup for special events and occasions',
    duration: '45 min',
    price: 'From $95',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    icon: Scissors,
    featured: true
  },
  {
    id: 6,
    name: 'Spa Packages',
    description: 'Complete relaxation packages combining multiple services',
    duration: '180 min',
    price: 'From $299',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    icon: Clock,
    featured: true
  }
];

// Helper function to get only featured services
export const getFeaturedServices = () => serviceData.filter(service => service.featured);

// Helper function to get all services
export const getAllServices = () => serviceData;
