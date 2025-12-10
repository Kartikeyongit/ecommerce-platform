'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 pt-12 pb-24" style={{ marginTop: '60px' }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About EShop</h1>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            EShop was founded with a simple mission: to provide customers with
            access to high-quality products at unbeatable prices. Since our
            launch, we've grown to serve thousands of satisfied customers
            worldwide.
          </p>
          <p className="text-gray-700">
            We believe in making online shopping convenient, secure, and
            enjoyable for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-3xl mb-2">🌍</div>
            <h3 className="font-bold text-lg mb-2">Global Reach</h3>
            <p className="text-gray-700 text-sm">
              Serving customers in over 50 countries with fast shipping
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="font-bold text-lg mb-2">Quality Products</h3>
            <p className="text-gray-700 text-sm">
              Carefully curated products from trusted brands
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-3xl mb-2">💪</div>
            <h3 className="font-bold text-lg mb-2">Customer Support</h3>
            <p className="text-gray-700 text-sm">
              24/7 customer support to help with any questions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
