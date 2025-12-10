'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic
    setEmail('');
    alert('Thank you for subscribing!');
  };

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 text-gray-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <h3 className="text-2xl font-bold">EShop</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your premium destination for quality products. Shop smart, live better.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              {[
                { icon: '📘', label: 'Facebook' },
                { icon: '𝕏', label: 'Twitter' },
                { icon: '📷', label: 'Instagram' },
                { icon: '🔗', label: 'LinkedIn' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transform hover:scale-110 transition-all"
                  title={social.label}
                >
                  <span className="text-white text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/products' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-2"
                  >
                    <span>→</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Support</h4>
            <ul className="space-y-3">
              {[
                { label: 'Help Center', href: '#' },
                { label: 'Track Order', href: '#' },
                { label: 'Returns', href: '#' },
                { label: 'Shipping Info', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-2"
                  >
                    <span>→</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Newsletter</h4>
            <p className="text-gray-300">
              Subscribe for exclusive deals and latest updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-500"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-8"></div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {/* Left */}
          <div className="text-gray-400 text-sm">
            <p>&copy; {currentYear} EShop. All rights reserved.</p>
            <p className="mt-2">Crafted with ❤️ for better shopping</p>
          </div>

          {/* Center - Legal Links */}
          <div className="flex justify-center space-x-6 text-sm flex-wrap gap-4">
            {[
              { label: 'Privacy Policy', href: '#' },
              { label: 'Terms of Service', href: '#' },
              { label: 'Cookie Policy', href: '#' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right - Payment Methods */}
          <div className="flex justify-end items-center space-x-4">
            <span className="text-gray-400 text-sm">We Accept:</span>
            <div className="flex space-x-3 text-xl">
              <span title="Visa">💳</span>
              <span title="Mastercard">🏦</span>
              <span title="PayPal">🌐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Border Accent */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
    </footer>
  );
}
