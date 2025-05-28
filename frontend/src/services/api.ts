import axios from 'axios';

// Use Vite's import.meta.env for frontend environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: { name: string; email: string; password: string; phone?: string }) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  updateProfile: async (userData: { name?: string; email?: string; phone?: string }) => {
    const response = await apiClient.put('/auth/updatedetails', userData);
    return response.data;
  },
  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    const response = await apiClient.put('/auth/updatepassword', passwordData);
    return response.data;
  }
};

// Appointments API
export const appointmentAPI = {
  getAppointments: async (page = 1, limit = 10) => {
    const response = await apiClient.get(`/appointments?page=${page}&limit=${limit}`);
    return response.data;
  },
  getAppointment: async (id: string) => {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  },
  createAppointment: async (appointmentData: {
    client?: string;
    staff: string;
    service: string;
    serviceId: number;
    date: Date;
    time: string;
    duration: string;
    notes?: string;
  }) => {
    const response = await apiClient.post('/appointments', appointmentData);
    return response.data;
  },
  updateAppointment: async (
    id: string,
    updateData: {
      client?: string;
      staff?: string;
      service?: string;
      serviceId?: number;
      date?: Date;
      time?: string;
      duration?: string;
      notes?: string;
      status?: string;
    }
  ) => {
    const response = await apiClient.put(`/appointments/${id}`, updateData);
    return response.data;
  },
  cancelAppointment: async (id: string) => {
    const response = await apiClient.put(`/appointments/${id}`, { status: 'cancelled' });
    return response.data;
  },
  getAvailableTimeSlots: async (date: string, staffId?: string) => {
    const endpoint = staffId 
      ? `/appointments/available/${date}/${staffId}`
      : `/appointments/available/${date}`;
    const response = await apiClient.get(endpoint);
    return response.data;
  }
};

// Staff API
export const staffAPI = {
  getAllStaff: async () => {
    const response = await apiClient.get('/users/staff');
    return response.data;
  }
};

// Services API
export const servicesAPI = {
  getAllServices: async () => {
    const response = await apiClient.get('/services');
    return response.data;
  },
  getService: async (id: string) => {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  }
};

export default apiClient;
