# Full Stack Ecommerce Website

A modern, full-stack ecommerce application built with Next.js, Express.js, MongoDB, and Stripe integration.

## Features

- 🛒 **Shopping Cart** - Add/remove products, manage quantities
- 👤 **User Authentication** - Register, login, profile management
- 📦 **Product Management** - Browse, search, filter products by category
- 💳 **Payment Integration** - Stripe payment processing
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🔒 **Secure** - JWT authentication, encrypted passwords
- 📊 **Order Management** - View order history and status
- 🚀 **Performance** - Optimized with Next.js App Router

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Axios** - HTTP client
- **Stripe.js** - Payment processing

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Stripe** - Payment gateway

## Project Structure

```
ecommerce-fullstack/
├── backend/
│   ├── src/
│   │   ├── server.ts          # Express app setup
│   │   ├── models/            # MongoDB schemas
│   │   ├── controllers/       # Route controllers
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth & error handling
│   │   └── utils/             # Helper functions
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── app/               # Next.js pages
    │   ├── components/        # React components
    │   ├── lib/               # Utilities & store
    │   └── styles/
    ├── public/                # Static assets
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    └── .env.example
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Stripe account (for payments)

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLIC_KEY=pk_test_your_key
NODE_ENV=development
```

5. **Start backend server**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env.local file**
```bash
cp .env.example .env.local
```

4. **Configure environment variables**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_KEY=pk_test_your_public_key
```

5. **Start frontend development server**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Products
- `GET /api/products` - Get all products with pagination
- `GET /api/products/:id` - Get product details
- `GET /api/products/search?q=keyword` - Search products

### Cart
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart/add` - Add product to cart (protected)
- `POST /api/cart/remove` - Remove product from cart (protected)
- `POST /api/cart/update` - Update cart item quantity (protected)
- `POST /api/cart/clear` - Clear entire cart (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get order details (protected)
- `POST /api/orders/payment-intent` - Create Stripe payment intent (protected)
- `PUT /api/orders/:id` - Update order status (protected)

## Database Schema

### User
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  profileImage: String,
  address: String,
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
  rating: Number,
  reviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: Number,
  status: String (pending/processing/shipped/delivered/cancelled),
  shippingAddress: String,
  paymentId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart
```javascript
{
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    quantity: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Features Implementation Guide

### Authentication Flow
1. User registers with email, password, and profile info
2. Password is hashed using bcryptjs
3. JWT token is generated and stored in localStorage
4. Token is sent with every protected API request
5. Auth middleware verifies token validity

### Shopping Cart
1. Cart is fetched from database when user logs in
2. Items can be added with specified quantity
3. Quantities can be updated or items removed
4. Cart totals are calculated on frontend
5. Cart is cleared after successful order

### Payment Processing
1. User completes order with shipping address
2. Order is created with pending status
3. Stripe payment intent is created
4. User completes payment with card
5. Order status is updated to processing

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## Adding Sample Products

Connect to MongoDB and add sample products:

```javascript
db.products.insertMany([
  {
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 99.99,
    category: "Electronics",
    image: "https://via.placeholder.com/300x300?text=Headphones",
    stock: 50,
    rating: 4.5,
    reviews: 120
  },
  {
    name: "T-Shirt",
    description: "Comfortable cotton T-shirt",
    price: 29.99,
    category: "Clothing",
    image: "https://via.placeholder.com/300x300?text=T-Shirt",
    stock: 100,
    rating: 4.0,
    reviews: 45
  }
  // Add more products...
])
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify connection string format

### JWT Token Error
- Clear browser localStorage
- Log in again to get new token
- Check JWT_SECRET matches frontend and backend

### CORS Error
- Ensure backend and frontend URLs match in CORS config
- Check origin in requests

### Stripe Error
- Verify Stripe keys are correct
- Check Stripe test mode is enabled
- Ensure publishable key is in frontend .env

## 📸 Screenshots  

### **Home Page**

<img width="1908" height="4819" alt="image" src="https://github.com/user-attachments/assets/0535af4b-f77d-426c-abf5-632ad3628900" />

### **Register Page**

<img width="1908" height="2280" alt="image" src="https://github.com/user-attachments/assets/4384ff7f-7109-4d58-b9fc-30fea1707536" />

### **Login Page**

<img width="1908" height="2280" alt="image" src="https://github.com/user-attachments/assets/f0095562-cec7-491c-b499-fc7298e1e62b" />

### **Products List Page**

<img width="1908" height="4921" alt="image" src="https://github.com/user-attachments/assets/2b35e44f-7183-4472-8f73-eb7ec4ed9254" />

### **Product Page**

<img width="1908" height="3040" alt="image" src="https://github.com/user-attachments/assets/ae5387b0-0eea-4372-bd82-4171c7fb4336" />

### **Cart Page**

<img width="1908" height="1956" alt="image" src="https://github.com/user-attachments/assets/92dab493-29bd-41bc-923e-09b04c271dc8" />

### **Checkout Page**

<img width="1908" height="2463" alt="image" src="https://github.com/user-attachments/assets/0c37fbde-9a95-40a2-a9cd-77a92d0732ef" />

### **Order Page**

<img width="1908" height="2875" alt="image" src="https://github.com/user-attachments/assets/a8e58b98-d3f0-42c6-92a7-dd5aaa0b59ce" />

### **Orders List Page**

<img width="1908" height="2217" alt="image" src="https://github.com/user-attachments/assets/21512afd-16eb-4690-9b7a-366ef410bed6" />

### **Profile Page**

<img width="1908" height="2518" alt="image" src="https://github.com/user-attachments/assets/36716614-21fb-4cad-b047-07f1167309f1" />

### **Admin Page**

<img width="1908" height="2158" alt="image" src="https://github.com/user-attachments/assets/6e161a0e-8cfa-4438-9ef8-c0cea9243844" />
<img width="1908" height="1998" alt="image" src="https://github.com/user-attachments/assets/4594ed4f-adfc-436a-9518-316606ea7837" />
<img width="1908" height="1998" alt="image" src="https://github.com/user-attachments/assets/b17080ad-bf52-409b-9298-9fd478a1d0ba" />

## Future Enhancements

- Admin dashboard for product management
- Product reviews and ratings
- Wishlist functionality
- Email notifications
- Inventory management
- Multiple payment methods
- Order tracking
- User analytics

## License

MIT

## Author

Kartikey Gautam
