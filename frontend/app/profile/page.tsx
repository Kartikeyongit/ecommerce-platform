'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEcommerceStore } from '@/lib/store';

export default function ProfilePage() {
  const { user } = useEcommerceStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
  });
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        address: user.address || '',
        phone: user.phone || '',
      });
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Update profile logic here
    alert('Profile updated successfully!');
  };

  if (!user) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ marginTop: '20px' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600 mb-8">Manage your account information and preferences</p>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h2>
                <p className="text-blue-100">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition bg-gray-50"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.5 3A1.5 1.5 0 001 4.5v.006c0 .556.447 1.007 1.006 1.007A2.5 2.5 0 105.5 2c0 .006 0 .006-.006 0A1.5 1.5 0 002.5 3z" /><path d="M14 12a4 4 0 110-8 4 4 0 010 8z" />
              </svg>
              Security
            </h3>
            <p className="text-gray-600 text-sm mb-4">Manage your password and security settings</p>
            <button className="text-blue-600 hover:text-blue-700 font-semibold">Change Password →</button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414L10 1.586l4.707 4.707a1 1 0 01-1.414 1.414L11 4.414V15a1 1 0 11-2 0V4.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Notifications
            </h3>
            <p className="text-gray-600 text-sm mb-4">Control your notification preferences</p>
            <button className="text-blue-600 hover:text-blue-700 font-semibold">Manage Notifications →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
