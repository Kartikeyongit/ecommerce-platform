'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEcommerceStore } from '@/lib/store';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useEcommerceStore();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
            <h1 className="text-3xl font-bold text-white text-center">Join Us Today</h1>
            <p className="text-blue-100 text-center mt-2">Create your account to start shopping</p>
          </div>

          {/* Form Content */}
          <div className="px-8 py-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition bg-gray-50"
                />
              </div>

              <div className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600" required />
                <label className="ml-2 text-sm text-gray-700">
                  I agree to the{' '}
                  <Link href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <p className="text-center text-gray-700">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
