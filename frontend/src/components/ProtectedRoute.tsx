import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: ('client' | 'staff' | 'admin')[];
}

const ProtectedRoute = ({ children, roles = [] }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, userRole } = useAuth();

  // If still loading auth state, display a loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-salon-pink"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If roles are provided and user doesn't have the required role
  if (roles.length > 0 && !roles.includes(userRole as any)) {
    // Redirect to appropriate page based on role
    switch (userRole) {
      case 'client':
        return <Navigate to="/bookings" replace />;
      case 'staff':
        return <Navigate to="/staff/schedule" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has the required role
  return <>{children}</>;
};

export default ProtectedRoute;
