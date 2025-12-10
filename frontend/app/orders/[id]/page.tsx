'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEcommerceStore } from '@/lib/store';
import Image from 'next/image';
import axios from 'axios';

export default function OrderPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { user } = useEcommerceStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        setError('Please log in to view orders');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user]);

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
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ marginTop: '60px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error || 'Order not found'}</p>
            <Link href="/orders" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Back to Orders
            </Link>
          </div>
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

  const statusColor = statusColors[order.status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ marginTop: '60px' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        {order.status === 'pending' && (
          <div className="mb-8 bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">✓</div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Order Confirmed!</h2>
            <p className="text-green-800">Thank you for your purchase. Your order is being processed.</p>
          </div>
        )}

        {/* Order Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order #{order._id?.substring(0, 8).toUpperCase()}</h1>
              <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`px-4 py-2 rounded-full font-semibold capitalize ${statusColor}`}>
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-gray-600 text-sm mb-1">Order Number</p>
              <p className="text-lg font-semibold text-gray-900">{order._id?.substring(0, 12)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Amount</p>
              <p className="text-lg font-semibold text-blue-600">${order.totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Items Count</p>
              <p className="text-lg font-semibold text-gray-900">{order.items.length} item(s)</p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>
          <div className="text-gray-700 space-y-2">
            <p className="font-semibold">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                {item.image && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm">Unit Price</p>
                  <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                  <p className="text-blue-600 font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span className="font-semibold">
                ${(order.totalAmount / 1.1).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax (10%):</span>
              <span className="font-semibold">
                ${((order.totalAmount / 1.1) * 0.1).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-gray-900 pt-4 border-t border-gray-200">
              <span>Total:</span>
              <span className="text-blue-600">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link href="/orders" className="block">
            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
              View All Orders
            </button>
          </Link>
          <Link href="/products" className="block">
            <button className="w-full bg-gray-200 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
