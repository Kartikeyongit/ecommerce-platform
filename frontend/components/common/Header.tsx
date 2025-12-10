'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useEcommerceStore } from '@/lib/store';

export default function Header() {
  const { user, logout, cart } = useEcommerceStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cartTotal = cart.reduce((total, item) => total + item.quantity, 0);

  const handleMenuEnter = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setUserMenuOpen(true);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setUserMenuOpen(false);
    }, 150);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 hidden sm:inline">EShop</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            {[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartTotal > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {cartTotal}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div 
                className="relative"
                onMouseEnter={handleMenuEnter}
                onMouseLeave={handleMenuLeave}
              >
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span>{user.firstName}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                    >
                      👤 My Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                    >
                      📦 My Orders
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4 border-t pt-4">
            {[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-all"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {!user && (
              <div className="flex space-x-2 pt-2">
                <Link href="/login" className="flex-1 px-3 py-2 text-center text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Login
                </Link>
                <Link href="/register" className="flex-1 px-3 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
