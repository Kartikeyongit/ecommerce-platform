'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEcommerceStore } from '@/lib/store';
import Image from 'next/image';
import axios from 'axios';

export default function OrdersPage() {
  const { user } = useEcommerceStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setError('Please log in to view your orders');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ marginTop: '60px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-600 mb-6">Please log in to view your orders.</p>
            <Link href="/login" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ marginTop: '60px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-block animate-spin">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ marginTop: '60px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Your Orders</h1>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            ✗ {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-2xl mx-auto">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to place your first order!</p>
            <Link href="/products" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {orders.map((order) => {
              const statusColor = statusColors[order.status] || 'bg-gray-100 text-gray-800';
              return (
                <div key={order._id} className="mb-8">
                  <Link href={`/orders/${order._id}`}>
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 cursor-pointer border border-gray-100 hover:border-blue-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-6 mb-6">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              Order #{order._id?.substring(0, 8).toUpperCase()}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <span className={`px-4 py-2 rounded-full font-semibold text-sm capitalize ${statusColor} whitespace-nowrap`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Items Preview */}
                        <div className="flex gap-3 mb-4">
                          {order.items.slice(0, 3).map((item: any, idx: number) => (
                            <div key={idx} className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                              {item.image && (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={56}
                                  height={56}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-gray-600 text-sm mb-1">Total</p>
                        <p className="text-3xl font-bold text-blue-600">${order.totalAmount.toFixed(2)}</p>
                      </div>

                      {/* Arrow */}
                      <div className="hidden md:block text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {orders.length > 0 && (
          <div className="mt-12">
            <Link href="/products" className="inline-block">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Continue Shopping
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
