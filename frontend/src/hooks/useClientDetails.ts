import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Booking {
  _id: string;
  service: string;
  package?: string;
  date: string;
  time: string;
  status: string;
  staff?: {
    name: string;
  };
}

interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  bookings: Booking[];
}

interface UseClientDetailsOptions {
  onError?: (error: string) => void;
  enabled?: boolean;
}

export function useClientDetails(clientId: string | undefined, options: UseClientDetailsOptions = {}) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { onError, enabled = true } = options;

  const fetchClientDetails = useCallback(async () => {
    if (!clientId || !enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`http://localhost:5000/api/users/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.data.success || !response.data.data) {
        throw new Error('Invalid response format from server');
      }

      setClient(response.data.data);
      setError(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load client details';
      setError(errorMessage);
      
      if (error.response?.status === 401) {
        logout();
        navigate('/');
      } else if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [clientId, enabled, logout, navigate, onError]);

  useEffect(() => {
    fetchClientDetails();
  }, [fetchClientDetails]);

  return {
    client,
    loading,
    error,
    refetch: fetchClientDetails
  };
} 