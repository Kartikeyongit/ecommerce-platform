'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useEcommerceStore } from '@/lib/store';
import Image from 'next/image';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, user, fetchCart } = useEcommerceStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Stripe not loaded');
      return;
    }

    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Create order
      console.log('[CHECKOUT] Creating order...');
      console.log('[CHECKOUT] API URL:', process.env.NEXT_PUBLIC_API_URL);
      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          shippingAddress: {
            fullName: formData.fullName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
        }),
      });

      console.log('[CHECKOUT] Order response status:', orderResponse.status);
      
      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('[CHECKOUT] Error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        throw new Error(errorData.message || `Failed to create order (${orderResponse.status})`);
      }

      const { order } = await orderResponse.json();
      console.log('[CHECKOUT] Order created:', order._id);

      // Step 2: Create payment intent
      console.log('[CHECKOUT] Creating payment intent...');
      const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ orderId: order._id }),
      });

      console.log('[CHECKOUT] Payment intent response status:', paymentResponse.status);
      
      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        console.error('[CHECKOUT] Payment intent error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        throw new Error(errorData.message || `Failed to create payment intent (${paymentResponse.status})`);
      }

      const { clientSecret } = await paymentResponse.json();
      console.log('[CHECKOUT] Payment intent created, client secret received');

      // Step 3: Confirm payment with Stripe
      console.log('[CHECKOUT] Confirming payment...');
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.fullName,
              email: formData.email,
            },
          },
        }
      );

      if (paymentError) {
        setError(paymentError.message || 'Payment failed');
        console.error('[CHECKOUT] Payment error:', paymentError);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        console.log('[CHECKOUT] Payment successful!');
        console.log('[CHECKOUT] Payment Intent ID:', paymentIntent.id);
        
        // Confirm payment on backend
        console.log('[CHECKOUT] Confirming payment with backend...');
        const confirmResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/confirm-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            orderId: order._id,
            paymentIntentId: paymentIntent.id,
          }),
        });

        if (!confirmResponse.ok) {
          const errorText = await confirmResponse.text();
          console.error('[CHECKOUT] Confirm payment error:', errorText);
          throw new Error('Failed to confirm payment with backend');
        }

        console.log('[CHECKOUT] Payment confirmed on backend');
        setSuccess(true);
        
        // Redirect to order confirmation
        setTimeout(() => {
          router.push(`/orders/${order._id}`);
        }, 1500);
      } else {
        setError('Payment was not completed');
      }
    } catch (err) {
      console.error('[CHECKOUT] Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ marginTop: '60px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-600 mb-6">Please log in to complete your purchase.</p>
            <Link href="/login" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ marginTop: '60px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart Empty</h2>
            <p className="text-gray-600 mb-6">Add items to your cart before checking out.</p>
            <Link href="/products" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ marginTop: '60px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Checkout</h1>

        {success && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            ✓ Payment successful! Redirecting to order confirmation...
          </div>
        )}

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            ✗ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Mexico</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
              <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424242',
                        '::placeholder': {
                          color: '#9e9e9e',
                        },
                      },
                      invalid: {
                        color: '#fa755a',
                      },
                    },
                  }}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading || !stripe}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="h-fit">
            <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto pb-4 border-b border-gray-200">
                {cart.map((item) => {
                  const product = item as any;
                  const productData = product.productId || product.product;
                  const productName = typeof productData === 'string' ? 'Product' : productData?.name;
                  const productImage = typeof productData === 'string' ? '' : productData?.image;
                  const productPrice = typeof productData === 'string' ? 0 : productData?.price;

                  return (
                    <div key={item.productId} className="flex gap-3">
                      {productImage && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={productImage}
                            alt={productName || 'Product'}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{productName}</p>
                        <p className="text-gray-600 text-sm">
                          {item.quantity}x ${(productPrice || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping:</span>
                  <span className="font-semibold">
                    {shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%):</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-gray-900 pt-4 border-t border-gray-200">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/cart" className="block text-center text-blue-600 hover:text-blue-700 font-semibold">
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const stripeLoaded = typeof window !== 'undefined' && !!window.location;

  return stripeLoaded ? (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  ) : (
    <div>Loading...</div>
  );
}
