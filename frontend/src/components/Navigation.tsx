import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
}

interface NavigationProps {
  onOpenAuthModal?: () => void;
  onOpenBookingModal?: () => void;
}

export const Navigation = ({ onOpenAuthModal, onOpenBookingModal }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  
  const navItems: Record<string, NavItem[]> = {
    guest: [
      { label: 'Services', href: '#services' },
      { label: 'Gallery', href: '#gallery' },
      { label: 'Testimonials', href: '#testimonials' },
      { label: 'Contact', href: '#contact' }
    ],
    client: [
      { label: 'Dashboard', href: '/client/dashboard' },
      { label: 'My Bookings', href: '/client/bookings' },
      { label: 'Profile', href: '/client/profile' }
    ],
    admin: [
      { label: 'Dashboard', href: '/admin' },
      { label: 'Bookings', href: '/admin/bookings' },
      { label: 'Clients', href: '/admin/clients' }
    ]
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleServicesClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      // Add a small delay to ensure navigation completes before scrolling
      setTimeout(() => {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Effect to handle hash navigation after page load
  useEffect(() => {
    if (location.hash === '#services') {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]);

  // Determine which navigation items to show
  const getNavItems = () => {
    if (!isAuthenticated) return navItems.guest;
    if (isAdmin) return navItems.admin;
    return navItems.client;
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-2xl font-bold text-gradient">LuxSalon</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {getNavItems().map((item) => (
              item.href.startsWith('#') ? (
                <button
                  key={item.href}
                  onClick={() => {
                    const sectionId = item.href.substring(1);
                    const section = document.getElementById(sectionId);
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-salon-pink"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-salon-pink"
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={onOpenAuthModal}>
                  Sign In
                </Button>
                <Button 
                  className="bg-salon-pink hover:bg-salon-pink/90 text-slate-900"
                  onClick={onOpenBookingModal}
                >
                  Book Now
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onOpenBookingModal}
                >
                  Book
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-800" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-lg mt-2">
            {getNavItems().map((item) => (
              item.href.startsWith('#') ? (
                <button
                  key={item.href}
                  onClick={() => {
                    const sectionId = item.href.substring(1);
                    const section = document.getElementById(sectionId);
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth' });
                    }
                    setIsOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 text-gray-700 hover:text-salon-pink hover:bg-salon-pink-light/20 rounded-md transition-colors duration-200"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-salon-pink hover:bg-salon-pink-light/20 rounded-md transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
            {!isAuthenticated && (
              <div className="pt-4 border-t border-gray-200">
                <Button variant="ghost" className="w-full justify-start" onClick={onOpenAuthModal}>
                  Sign In
                </Button>
                <Button className="w-full mt-2 bg-salon-pink hover:bg-salon-pink/90 text-white" onClick={onOpenBookingModal}>
                  Book Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
