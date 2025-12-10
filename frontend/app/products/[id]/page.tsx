'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEcommerceStore, Product } from '@/lib/store';

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { selectedProduct, getProduct, products, addToCart } = useEcommerceStore();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      if (!selectedProduct || selectedProduct._id !== id) {
        await getProduct(id);
      }
      setLoading(false);
    };
    loadProduct();
  }, [id, getProduct, selectedProduct]);

  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    
    setAddingToCart(true);
    try {
      await addToCart(selectedProduct._id, quantity);
      alert(`${quantity} ${selectedProduct.name}(s) added to cart!`);
      setQuantity(1);
    } catch (error) {
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  // Get related products
  const relatedProducts = products
    .filter((p) => p.category === selectedProduct?.category && p._id !== selectedProduct?._id)
    .slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ marginTop: '20px' }}>
        <div className="text-center">
          <div className="inline-block animate-spin">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-600 mt-4">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ marginTop: '20px' }}>
        <div className="text-center max-w-md">
          <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/products" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ marginTop: '20px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{selectedProduct.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-2xl opacity-75"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Category Badge */}
            <div>
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                {selectedProduct.category}
              </span>
            </div>

            {/* Product Name & Rating */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
                {selectedProduct.name}
              </h1>

              <div className="flex items-center space-x-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-700">
                  {selectedProduct.rating.toFixed(1)} / 5.0
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* Price Section */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border-2 border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Price</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-blue-600">
                  ${selectedProduct.price.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${(selectedProduct.price * 1.2).toFixed(2)}
                </span>
                <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  20% OFF
                </span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${selectedProduct.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-lg font-semibold ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'Out of Stock'}
              </span>
            </div>

            {/* Add to Cart Section */}
            {selectedProduct.stock > 0 ? (
              <div className="space-y-4 pt-4">
                <label className="block text-sm font-semibold text-gray-700">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-gray-100 rounded-lg p-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 transition font-bold text-lg"
                    >
                      −
                    </button>
                    <span className="font-bold text-gray-900 w-10 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 transition font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-600">
                    (Max: {selectedProduct.stock})
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1h7.586a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM5 16a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                </button>
              </div>
            ) : (
              <button 
                disabled 
                className="w-full bg-gray-300 text-gray-500 font-bold py-4 rounded-lg cursor-not-allowed opacity-50"
              >
                Out of Stock
              </button>
            )}

            {/* Additional Info */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
              <p className="text-gray-700">
                ✓ Free shipping on orders over $100<br />
                ✓ 30-day money-back guarantee<br />
                ✓ 24/7 customer support
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{product.name}</h3>
                    <p className="text-blue-600 font-bold text-lg mt-2">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
