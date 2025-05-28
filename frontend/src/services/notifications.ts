import { useToast } from "@/components/ui/use-toast";
import { ReactNode } from "react";

// Notification types
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Notification service
export const useNotificationService = () => {
  const { toast } = useToast();

  // Success notification
  const showSuccess = (title: string, message?: string) => {
    toast({
      title,
      description: message,
      variant: "default",
      duration: 4000,
    });
  };

  // Error notification
  const showError = (title: string, message?: string) => {
    toast({
      title,
      description: message,
      variant: "destructive",
      duration: 5000,
    });
  };

  // Warning notification
  const showWarning = (title: string, message?: string) => {
    toast({
      title,
      description: message,
      variant: "default",
      className: "bg-yellow-50 border-yellow-200 text-yellow-900",
      duration: 5000,
    });
  };

  // Info notification
  const showInfo = (title: string, message?: string) => {
    toast({
      title,
      description: message,
      variant: "default",
      className: "bg-blue-50 border-blue-200 text-blue-900",
      duration: 4000,
    });
  };

  // Custom notification with icon
  const showCustom = (title: string, message: string, icon?: ReactNode, type: NotificationType = 'info') => {
    let className = '';
    switch (type) {
      case 'success':
        className = 'bg-green-50 border-green-200 text-green-900';
        break;
      case 'error':
        className = 'bg-red-50 border-red-200 text-red-900';
        break;
      case 'warning':
        className = 'bg-yellow-50 border-yellow-200 text-yellow-900';
        break;
      case 'info':
      default:
        className = 'bg-blue-50 border-blue-200 text-blue-900';
    }

    toast({
      title,
      description: message,
      variant: "default",
      className,
      duration: 4000,
    });
  };

  // Appointment status notifications
  const appointmentBooked = (date: string, time: string) => {
    showSuccess(
      "Appointment Booked!",
      `Your appointment has been scheduled for ${date} at ${time}.`
    );
  };

  const appointmentCancelled = () => {
    showInfo(
      "Appointment Cancelled",
      "Your appointment has been cancelled successfully."
    );
  };

  const appointmentRescheduled = (date: string, time: string) => {
    showSuccess(
      "Appointment Rescheduled",
      `Your appointment has been rescheduled to ${date} at ${time}.`
    );
  };

  // Authentication notifications
  const loginSuccess = (name: string) => {
    showSuccess(
      "Welcome back!",
      `You're now signed in as ${name}.`
    );
  };

  const logoutSuccess = () => {
    showInfo(
      "Signed Out",
      "You have been signed out successfully."
    );
  };

  const profileUpdated = () => {
    showSuccess(
      "Profile Updated",
      "Your profile information has been updated successfully."
    );
  };
  // Authentication required notification - used when a user needs to authenticate to complete an action
  const showAuthRequired = (title: string, message: string) => {
    showWarning(
      title,
      message
    );
    // In a real app, you might want to trigger the authentication modal here
    // or use a custom component that includes login buttons
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCustom,
    appointmentBooked,
    appointmentCancelled,
    appointmentRescheduled,
    loginSuccess,
    logoutSuccess,
    profileUpdated,
    showAuthRequired
  };
};
