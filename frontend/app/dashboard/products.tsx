'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useEcommerceStore, Product } from '@/lib/store';
import ProductCard from '@/components/product/ProductCard';

export default function ProductsPage() {
  const { products, fetchProducts, addToCart } = useEcommerceStore();
  const [category, setCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await fetchProducts(category || undefined);
      setLoading(false);
    };
    loadProducts();
  }, [category, fetchProducts]);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => setCategory('')}
                className={`w-full text-left px-3 py-2 rounded ${
                  category === '' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded ${
                    category === cat ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={async (p: Product) => {
                    await addToCart(p._id, 1);
                    alert('Product added to cart!');
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
