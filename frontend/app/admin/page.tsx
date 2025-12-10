'use client';

import { useEffect, useState } from 'react';
import { useEcommerceStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const { user, loading, products, orders, fetchProducts, fetchAllOrders, fetchUserCount } = useEcommerceStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin');
    } else if (!loading && user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadData = async () => {
      if (user?.role !== 'admin') return;

      setIsLoading(true);
      setError('');

      try {
        const [userCount] = await Promise.all([
          fetchUserCount(),
          fetchProducts(),
          fetchAllOrders().catch(err => {
            console.error('Error fetching orders:', err);
            return [];
          })
        ]);

        setStats(prev => ({ ...prev, totalUsers: userCount }));
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, fetchProducts, fetchAllOrders, fetchUserCount]);

  useEffect(() => {
    if (products && orders) {
      setStats(prev => ({
        ...prev,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
      }));
    }
  }, [products, orders]);

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-600">
          Welcome back, <span className="font-medium">{user.firstName} {user.lastName}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl font-semibold">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Revenue</p>
              <p className="text-2xl font-semibold">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order._id?.substring(0, 8)}...
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user ? order.user.name || 'Unknown' : 'Guest'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' || order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800' // pending
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.total?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Products</h2>
            <Link href="/admin/products" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div key={product._id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md overflow-hidden">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                  ) : product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">${product.price?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="flex items-center p-3 border border-gray-100 rounded-lg">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md"></div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">No products found</p>
                  <p className="text-sm text-gray-500">$0.00</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
