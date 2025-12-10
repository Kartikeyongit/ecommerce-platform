'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { useEcommerceStore, Product } from '@/lib/store';

export default function ProductsPage() {
  const { products, fetchProducts, addToCart } = useEcommerceStore();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    };
    loadProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase())
      );
    }
  }, [products, selectedCategory]);

  const categories = ['All', 'Electronics', 'Computers', 'Furniture', 'Accessories'];

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product._id, 1);
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ marginTop: '20px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">All Products</h1>
          <p className="text-gray-600 text-lg">Discover our complete collection of premium products</p>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filter by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-gray-600 mt-4">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
            
            {/* Results Info */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> of{' '}
                <span className="font-bold text-gray-900">{products.length}</span> products
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h2>
            <p className="text-gray-600 mb-6">Try adjusting your filters or browse all products</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition"
            >
              View All Products
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Fast Shipping</h3>
            <p className="text-gray-600">Get your products delivered in 3-5 business days</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="text-4xl mb-3">💯</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Quality Guaranteed</h3>
            <p className="text-gray-600">All products are 100% authentic and brand new</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="text-4xl mb-3">↩️</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Easy Returns</h3>
            <p className="text-gray-600">30-day money-back guarantee on all products</p>
          </div>
        </div>
      </div>
    </div>
  );
}
