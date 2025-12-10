'use client';

import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-blue-200 text-lg font-semibold uppercase tracking-wider">Welcome to EShop</p>
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                Discover Amazing Products
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Shop the finest collection of products with premium quality, fast delivery, and exceptional customer service.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                Shop Now
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                { number: '10K+', label: 'Products' },
                { number: '50K+', label: 'Customers' },
                { number: '24/7', label: 'Support' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold">{stat.number}</p>
                  <p className="text-blue-200 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Featured Image */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-2xl opacity-75"></div>
              <div className="relative bg-gradient-to-br from-white to-gray-100 rounded-3xl p-8 shadow-2xl">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1511317559916-56d5ddb62563?q=80&w=693&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Featured Product"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
