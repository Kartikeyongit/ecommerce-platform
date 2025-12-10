import mongoose from 'mongoose';
import Product from './src/models/Product';
import dotenv from 'dotenv';

dotenv.config();

const sampleProducts = [
  {
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1674658556545-f18d4080ab6c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 15,
    rating: 4.8,
    reviews: 127,
  },
  {
    name: 'Smartwatch Pro',
    description: 'Advanced smartwatch with health tracking, GPS, and 7-day battery life.',
    price: 199.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?q=80&w=786&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 22,
    rating: 4.6,
    reviews: 98,
  },
  {
    name: 'Ultra HD Camera',
    description: '4K digital camera with 20MP sensor and professional-grade lens.',
    price: 599.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 8,
    rating: 4.9,
    reviews: 156,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with 360-degree sound and 12-hour battery.',
    price: 79.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 45,
    rating: 4.5,
    reviews: 203,
  },
  {
    name: 'Gaming Laptop',
    description: 'High-performance laptop with RTX 3080, 32GB RAM, and 1TB SSD for gaming and work.',
    price: 1299.99,
    category: 'Computers',
    image: 'https://images.unsplash.com/photo-1684127987312-43455fd95925?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 5,
    rating: 4.7,
    reviews: 87,
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Comfortable ergonomic chair with lumbar support, perfect for long work sessions.',
    price: 249.99,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1688578735427-994ecdea3ea4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 18,
    rating: 4.4,
    reviews: 112,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with Cherry switches and programmable keys.',
    price: 139.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 32,
    rating: 4.8,
    reviews: 234,
  },
  {
    name: 'USB-C Hub Pro',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0 ports, SD card reader, and charging support.',
    price: 49.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1595756630452-736bc8ef3693?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 56,
    rating: 4.3,
    reviews: 89,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${createdProducts.length} sample products`);

    // Display inserted products
    console.log('\n📦 Sample Products:');
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price}`);
    });

    console.log('\n✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
