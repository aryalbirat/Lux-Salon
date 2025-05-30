import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Calendar, User as UserIcon, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface NavigationProps {
  onOpenAuthModal?: () => void;
  onOpenBookingModal?: () => void;
}

export const Navigation = ({ onOpenAuthModal, onOpenBookingModal }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { userRole = 'guest', logout, isAuthenticated } = useAuth();
  
  const navItems: Record<string, NavItem[]> = {
    guest: [
      { label: 'Services', href: '#services' },
      { label: 'Gallery', href: '#gallery' },
      { label: 'Contact', href: '#contact' }
    ],
    client: [
      { label: 'My Bookings', href: '/bookings', icon: Calendar },
      { label: 'Profile', href: '/profile', icon: UserIcon }
    ],
    admin: [
      { label: 'Dashboard', href: '/admin' },
      { label: 'Bookings', href: '/admin/bookings' },
      { label: 'Clients', href: '/admin/clients' },
      { label: 'Staff', href: '/admin/staff' },
      { label: 'Services', href: '/admin/services' }
    ],
    staff: [
      { label: 'My Schedule', href: '/staff/schedule', icon: Calendar },
      { label: 'Clients', href: '/staff/clients' },
      { label: 'Profile', href: '/profile', icon: UserIcon }
    ]
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
            {(navItems[userRole as keyof typeof navItems] || navItems.guest).map((item) => (
              item.href.startsWith('#') ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-700 hover:text-salon-pink transition-colors duration-200 font-medium"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-gray-700 hover:text-salon-pink transition-colors duration-200 font-medium"
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">            {!isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={onOpenAuthModal}>
                  Sign In
                </Button>
                <Button 
                  className="bg-salon-pink hover:bg-salon-pink/90 text-gray-800"
                  onClick={onOpenBookingModal}
                >
                  Book Now
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Dashboard button for all authenticated users */}
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                
                {/* Book appointment button */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onOpenBookingModal}
                >
                  Book
                </Button>
                
                {/* Logout button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 text-red-600 hover:text-red-800" 
                  onClick={logout}
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
        </div>        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-lg mt-2">
            {(navItems[userRole as keyof typeof navItems] || navItems.guest).map((item) => (
              item.href.startsWith('#') ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-salon-pink hover:bg-salon-pink-light/20 rounded-md transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon && <item.icon className="inline-block mr-2 h-4 w-4" />}
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-salon-pink hover:bg-salon-pink-light/20 rounded-md transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon && <item.icon className="inline-block mr-2 h-4 w-4" />}
                  {item.label}
                </Link>
              )
            ))}
            {!isAuthenticated && (
              <div className="pt-4 border-t border-gray-200">
                <Button variant="ghost" className="w-full justify-start" onClick={onOpenAuthModal}>
                  Sign In
                </Button>
                <Button className="w-full mt-2 bg-salon-pink hover:bg-salon-pink/90 text-gray-800" onClick={onOpenBookingModal}>
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
