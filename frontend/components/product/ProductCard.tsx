'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/store';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Overlay */}
      <Link href={`/products/${product._id}`} className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden block">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Discount Badge */}
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          Sale
        </div>
        
        {/* Hover Overlay */}
        {isHovered && product.stock > 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all">
            <div className="text-center text-white space-y-2">
              <p className="text-lg font-bold">Quick View</p>
              <p className="text-sm">View Details</p>
            </div>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Product Name */}
        <div>
          <Link href={`/products/${product._id}`}>
            <h3 className="font-bold text-lg mb-1 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline justify-between pt-2 border-t border-gray-200">
          <div className="space-y-1">
            <p className="text-gray-500 text-sm line-through">
              ${(product.price * 1.2).toFixed(2)}
            </p>
            <p className="text-3xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Stock</p>
            <p className={`text-lg font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? product.stock : 'Out'}
            </p>
          </div>
        </div>

        {/* Add to Cart Section */}
        {product.stock > 0 ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 transition"
              >
                −
              </button>
              <span className="font-bold text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 transition"
              >
                +
              </button>
            </div>
            <button
              onClick={() => onAddToCart(product)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1h7.586a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM5 16a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Add to Cart</span>
            </button>
          </div>
        ) : (
          <button 
            disabled 
            className="w-full bg-gray-300 text-gray-500 font-bold py-3 rounded-lg cursor-not-allowed opacity-50"
          >
            Out of Stock
          </button>
        )}
      </div>

      {/* Bottom Badge */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-purple-600"></div>
    </div>
  );
}
