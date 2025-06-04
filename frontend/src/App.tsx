import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";
import ClientDetailsPage from "./pages/ClientDetails";
import AdminDashboard from "./components/AdminDashboard";
import AdminBookings from "./components/admin/AdminBookings";
import AdminClients from "./components/admin/AdminClients";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Protected Client Routes */}
            <Route path="/bookings" element={
              <ProtectedRoute roles={['client', 'admin']}>
                <Bookings />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute roles={['client', 'staff', 'admin']}>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute roles={['client', 'staff', 'admin']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />            <Route path="/admin/bookings" element={
              <ProtectedRoute roles={['admin']}>
                <AdminBookings />
              </ProtectedRoute>
            } />
            <Route path="/admin/clients" element={
              <ProtectedRoute roles={['admin']}>
                <AdminClients />
              </ProtectedRoute>
            } />
            <Route path="/admin/clients/:id" element={
              <ProtectedRoute roles={['admin']}>
                <ClientDetailsPage />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
