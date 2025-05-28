import { Navigation } from '@/components/Navigation';
import { UserProfile } from '@/components/UserProfile';
import { useState } from 'react';
import { BookingModal } from '@/components/BookingModal';
import { useToast } from '@/components/ui/use-toast';

const Profile = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { toast } = useToast();

  const handleBookingSuccess = () => {
    toast({
      title: "Success",
      description: "Your appointment has been booked successfully!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        onOpenAuthModal={() => {}} 
        onOpenBookingModal={() => setIsBookingModalOpen(true)} 
      />
      
      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        onSuccess={handleBookingSuccess}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
          <p className="text-gray-600">Manage your account details and preferences</p>
        </div>
        
        <div className="mt-8">
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default Profile;
