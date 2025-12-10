'use client';

import React, { useEffect, useState } from 'react';
import Hero from '@/components/product/Hero';
import ProductCard from '@/components/product/ProductCard';
import { useEcommerceStore, Product } from '@/lib/store';

export default function Home() {
  const { products, fetchProducts, addToCart } = useEcommerceStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    };
    loadProducts();
  }, [fetchProducts]);

  return (
    <>
      <Hero />
      
      <section className="container mx-auto px-4 py-12" style={{ marginTop: '40px' }}>
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
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
            <p className="text-gray-600">No products available. Please add products to the database.</p>
          </div>
        )}
      </section>

      <section className="bg-gray-100 py-12 mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $50</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-bold text-lg mb-2">Best Prices</h3>
              <p className="text-gray-600">Guaranteed lowest prices in the market</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="font-bold text-lg mb-2">Secure Checkout</h3>
              <p className="text-gray-600">Safe and secure payment processing</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
