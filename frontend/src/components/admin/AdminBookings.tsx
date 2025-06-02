import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigation } from '../Navigation';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useNotificationService } from '@/services/notifications';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const notifications = useNotificationService();

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/bookings/all?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.data);
      setTotalPages(response.data.pagination.pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      notifications.showError(
        "Error",
        "Failed to load bookings. Please try again."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
      notifications.showSuccess("Success", "Booking status updated successfully");
    } catch (error) {
      console.error('Error updating booking status:', error);
      notifications.showError(
        "Error",
        "Failed to update booking status. Please try again."
      );
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:5000/api/bookings/${bookingId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchBookings();
        notifications.showSuccess("Success", "Booking deleted successfully");
      } catch (error) {
        console.error('Error deleting booking:', error);
        notifications.showError(
          "Error",
          "Failed to delete booking. Please try again."
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-salon-pink"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Bookings</h1>
        
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stylist</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking: any) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{booking.user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{booking.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{booking.package}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{booking.staff}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(booking.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{booking.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Select
                          value={booking.status}
                          onValueChange={(value) => handleStatusChange(booking._id, value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteBooking(booking._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? "default" : "outline"}
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings; 