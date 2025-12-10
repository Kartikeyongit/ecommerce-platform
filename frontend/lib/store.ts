import { create } from 'zustand';
import axios from 'axios';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  images?: string[]; // Added images array for multiple images
  stock: number;
  rating: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
}

export interface Order {
  _id: string;
  userId: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  items: Array<{
    product: string | Product;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  total?: number; // Alias for totalAmount for backward compatibility
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

interface EcommerceStore {
  // Auth
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => void;

  // Products
  products: Product[];
  selectedProduct: Product | null;
  fetchProducts: (category?: string) => Promise<void>;
  getProduct: (id: string) => Promise<void>;

  // Admin Product CRUD
  createProduct: (data: any) => Promise<void>;
  updateProduct: (id: string, data: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Cart
  cart: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCart: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;

  // Orders
  orders: Order[];
  selectedOrder: Order | null;
  fetchOrders: () => Promise<void>;
  getOrder: (id: string) => Promise<void>;
  createOrder: (shippingAddress: any) => Promise<Order>;
  createPaymentIntent: (orderId: string) => Promise<{ clientSecret: string }>;

  // Admin Orders
  fetchAllOrders: (status?: string) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;

  // Admin Users
  fetchUserCount: () => Promise<number>;
}

export const useEcommerceStore = create<EcommerceStore>((set, get) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const api = axios.create({
    baseURL: API_URL,
  });

  // Load token and user from localStorage
  let initialUser = null;
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      
      // Try to parse the token to get user info
      try {
        const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
        initialUser = {
          id: tokenPayload.userId,
          username: '',
          email: '',
          firstName: '',
          lastName: '',
          role: tokenPayload.role || 'user' // Default to 'user' if role is not in token
        };
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    }
  }

  // Add request interceptor to ensure token is always sent
  api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  return {
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    loading: false,
    products: [],
    selectedProduct: null,
    cart: [],

    login: async (email: string, password: string) => {
      set({ loading: true });
      try {
        const response = await api.post('/api/auth/login', { email, password });
        const { token, user } = response.data;
        
        if (!token || !user) {
          throw new Error('Invalid response from server');
        }
        
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Ensure user object has all required fields including role
        const userWithRole = {
          id: user.id || user._id,
          username: user.username || '',
          email: user.email || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          role: (user.role || 'user').toLowerCase() // Ensure lowercase and default to 'user'
        };
        
        // Update the store with the user data
        set({ 
          token, 
          user: userWithRole,
          loading: false
        });
        
        // Return the user data for potential redirects
        return userWithRole;
      } catch (error) {
        console.error('Login failed:', error);
        // Clear any partial state on error
        localStorage.removeItem('token');
        set({ token: null, user: null, loading: false });
        throw error;
      }
    },

    register: async (data: any) => {
      set({ loading: true });
      try {
        const response = await api.post('/api/auth/register', data);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Ensure user object has all required fields including role
        const userWithRole = {
          id: user.id || user._id,
          username: user.username || '',
          email: user.email || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          role: (user.role || 'user').toLowerCase() // Ensure lowercase and default to 'user'
        };
        
        set({ token, user: userWithRole, loading: false });
        return userWithRole;
      } catch (error) {
        console.error('Registration failed:', error);
        set({ loading: false });
        throw error;
      }
    },

    logout: () => {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      set({ token: null, user: null, cart: [], loading: false });
    },

    fetchProducts: async (category?: string) => {
      try {
        const response = await api.get('/api/products', {
          params: { category },
        });
        set({ products: response.data.products || [] });
      } catch (error) {
        console.error('Failed to fetch products:', error);
        set({ products: [] });
      }
    },

    getProduct: async (id: string) => {
      try {
        const response = await api.get(`/api/products/${id}`);
        set({ selectedProduct: response.data });
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    },

    fetchCart: async () => {
      try {
        const response = await api.get('/api/cart');
        set({ cart: response.data.items });
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        set({ cart: [] });
      }
    },

    addToCart: async (productId: string, quantity: number) => {
      try {
        await api.post('/api/cart/add', { productId, quantity });
        await get().fetchCart();
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    },

    removeFromCart: async (productId: string) => {
      try {
        console.log('Removing product from cart:', productId);
        const response = await api.post('/api/cart/remove', { productId });
        console.log('Remove response:', response.data);
        await get().fetchCart();
      } catch (error: any) {
        console.error('Failed to remove from cart:', error.response?.data || error.message);
        throw error;
      }
    },

    updateCart: async (productId: string, quantity: number) => {
      try {
        console.log('Updating cart:', productId, quantity);
        const response = await api.post('/api/cart/update', { productId, quantity });
        console.log('Update response:', response.data);
        await get().fetchCart();
      } catch (error: any) {
        console.error('Failed to update cart:', error.response?.data || error.message);
        throw error;
      }
    },

    clearCart: async () => {
      try {
        console.log('Clearing cart');
        const response = await api.post('/api/cart/clear');
        console.log('Clear response:', response.data);
        await get().fetchCart();
      } catch (error: any) {
        console.error('Failed to clear cart:', error.response?.data || error.message);
        throw error;
      }
    },

    // Orders
    orders: [],
    selectedOrder: null,

    fetchOrders: async () => {
      try {
        const response = await api.get('/api/orders');
        set({ orders: response.data });
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        throw error;
      }
    },

    getOrder: async (id: string) => {
      try {
        const response = await api.get(`/api/orders/${id}`);
        set({ selectedOrder: response.data });
      } catch (error) {
        console.error('Failed to fetch order:', error);
        throw error;
      }
    },

    createOrder: async (shippingAddress: any) => {
      try {
        const response = await api.post('/api/orders', { shippingAddress });
        set((state) => ({ orders: [...state.orders, response.data.order] }));
        return response.data.order;
      } catch (error) {
        console.error('Failed to create order:', error);
        throw error;
      }
    },

    createPaymentIntent: async (orderId: string) => {
      try {
        const response = await api.post('/api/orders/payment-intent', { orderId });
        return response.data;
      } catch (error) {
        console.error('Failed to create payment intent:', error);
        throw error;
      }
    },

    // Admin Product CRUD
    createProduct: async (data: any) => {
      try {
        await api.post('/api/admin/products', data);
        await get().fetchProducts();
      } catch (error) {
        console.error('Failed to create product:', error);
        throw error;
      }
    },

    updateProduct: async (id: string, data: any) => {
      try {
        await api.put(`/api/admin/products/${id}`, data);
        await get().fetchProducts();
      } catch (error) {
        console.error('Failed to update product:', error);
        throw error;
      }
    },

    deleteProduct: async (id: string) => {
      try {
        await api.delete(`/api/admin/products/${id}`);
        await get().fetchProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
        throw error;
      }
    },

    // Admin Orders
    fetchAllOrders: async (status?: string) => {
      try {
        console.log('Fetching orders with status:', status || 'all');
        const response = await api.get('/api/orders', {
          params: status ? { status } : {},
        });
        console.log('Orders fetched successfully:', response.data);
        set({ orders: response.data });
        return response.data;
      } catch (error: any) {
        console.error('Failed to fetch all orders:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method,
        });
        // Set empty orders to prevent UI from breaking
        set({ orders: [] });
        throw error;
      }
    },

    updateOrderStatus: async (id: string, status: string) => {
      try {
        await api.put(`/api/orders/${id}`, { status });
        await get().fetchAllOrders();
      } catch (error) {
        console.error('Failed to update order status:', error);
        throw error;
      }
    },

    // Admin Users
    fetchUserCount: async () => {
      try {
        const response = await api.get('/api/users/count');
        return response.data.count;
      } catch (error) {
        console.error('Failed to fetch user count:', error);
        return 0;
      }
    },
  };
});
