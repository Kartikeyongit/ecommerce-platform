'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEcommerceStore } from '@/lib/store';
import Image from 'next/image';

export default function CartPage() {
  const { cart, fetchCart, removeFromCart, updateCart, user, clearCart } = useEcommerceStore();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
      setLoading(false);
    };
    loadCart();
  }, [fetchCart]);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const product = item as any;
      const productData = product.productId || product.product;
      const price = typeof productData === 'string' ? 0 : productData?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ marginTop: '20px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart Empty</h2>
            <p className="text-gray-600 mb-6">Please log in to view your cart.</p>
            <Link href="/login" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ marginTop: '20px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Shopping Cart</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-2xl mx-auto">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Discover amazing products and start shopping!</p>
            <Link href="/products" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const product = item as any;
                const productData = product.productId || product.product;
                const productName = typeof productData === 'string' ? 'Product' : productData?.name;
                const productImage = typeof productData === 'string' ? '' : productData?.image;
                const productPrice = typeof productData === 'string' ? 0 : productData?.price;
                const productCategory = typeof productData === 'string' ? '' : productData?.category;
                
                return (
                  <div
                    key={item.productId}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex gap-6"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {productImage && (
                        <Image
                          src={productImage}
                          alt={productName || 'Product'}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{productName}</h3>
                      <p className="text-gray-600 text-sm mb-3">{productCategory}</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${((productPrice || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={async () => {
                          setActionLoading(true);
                          try {
                            const productId = typeof item.productId === 'string' ? item.productId : item.productId?._id;
                            await removeFromCart(productId);
                          } catch (error) {
                            console.error('Error removing item:', error);
                            alert('Failed to remove item');
                          } finally {
                            setActionLoading(false);
                          }
                        }}
                        disabled={actionLoading}
                        className="text-red-600 hover:text-red-800 font-semibold transition disabled:opacity-50"
                      >
                        Remove
                      </button>

                      <div className="flex items-center bg-gray-100 rounded-lg p-2">
                        <button
                          onClick={async () => {
                            setActionLoading(true);
                            try {
                              const productId = typeof item.productId === 'string' ? item.productId : item.productId?._id;
                              await updateCart(productId, Math.max(1, item.quantity - 1));
                            } catch (error) {
                              console.error('Error updating quantity:', error);
                            } finally {
                              setActionLoading(false);
                            }
                          }}
                          disabled={actionLoading || item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 transition font-bold disabled:opacity-50"
                        >
                          −
                        </button>
                        <span className="font-bold text-gray-900 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={async () => {
                            setActionLoading(true);
                            try {
                              const productId = typeof item.productId === 'string' ? item.productId : item.productId?._id;
                              await updateCart(productId, item.quantity + 1);
                            } catch (error) {
                              console.error('Error updating quantity:', error);
                            } finally {
                              setActionLoading(false);
                            }
                          }}
                          disabled={actionLoading}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 transition font-bold disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="h-fit">
              <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>

                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping:</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (10%):</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</span>
                </div>

                <Link href="/checkout" className="block">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                    Proceed to Checkout
                  </button>
                </Link>

                <button
                  onClick={async () => {
                    setActionLoading(true);
                    try {
                      await clearCart();
                    } catch (error) {
                      console.error('Error clearing cart:', error);
                      alert('Failed to clear cart');
                    } finally {
                      setActionLoading(false);
                    }
                  }}
                  disabled={actionLoading}
                  className="w-full text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
                >
                  Clear Cart
                </button>

                <Link href="/products" className="block text-center text-blue-600 hover:text-blue-800 font-semibold transition">
                  Continue Shopping
                </Link>

                {subtotal < 100 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      Free shipping on orders over $100. Add ${(100 - subtotal).toFixed(2)} more!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
