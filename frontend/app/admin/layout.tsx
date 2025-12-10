'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useEcommerceStore } from '@/lib/store';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, token, loading, logout } = useEcommerceStore();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Memoize the logout function to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  useEffect(() => {
    const checkAuth = async () => {
      // If we have a token but no user, try to fetch the user
      if (token && !user) {
        try {
          // You might need to add a getCurrentUser function to your store
          // that fetches the current user using the token
          // await useEcommerceStore.getState().fetchCurrentUser();
        } catch (error) {
          console.error('Failed to fetch user:', error);
          useEcommerceStore.getState().logout();
        }
      }
      
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [token, user]);

  useEffect(() => {
    if (!loading && !isCheckingAuth) {
      if (!token) {
        // No token, redirect to login
        router.push(`/login?redirect=${encodeURIComponent('/admin')}`);
      } else if (user && user.role !== 'admin') {
        // User is not an admin, redirect to home
        router.push('/');
      }
    }
  }, [user, token, loading, isCheckingAuth, router]);

  if (loading || isCheckingAuth || !user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
          <p className="mt-2">Checking admin permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.firstName} {user.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-5 px-2">
            <Link
              href="/admin"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 mt-1"
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 mt-1"
            >
              Orders
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
