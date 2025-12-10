import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import Stripe from 'stripe';

const getStripeClient = (): Stripe => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('STRIPE_SECRET_KEY is not configured. Please check your .env file.');
  }
  
  return new Stripe(apiKey, {
    apiVersion: '2023-08-16' as const,
  });
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { shippingAddress } = req.body;
    console.log('[ORDER] Creating order for userId:', req.userId);
    console.log('[ORDER] Shipping address:', shippingAddress);

    if (!shippingAddress) {
      console.log('[ORDER] Missing shipping address');
      return res.status(400).json({ message: 'Shipping address required' });
    }

    const cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
    console.log('[ORDER] Cart found:', !!cart, 'Items:', cart?.items.length);
    
    if (!cart || cart.items.length === 0) {
      console.log('[ORDER] Cart is empty');
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = cart.items.map((item: any) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
      image: item.productId.image,
    }));

    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    console.log('[ORDER] Total amount calculated:', totalAmount);

    const order = new Order({
      userId: req.userId,
      items,
      totalAmount,
      shippingAddress,
      status: 'pending',
    });

    await order.save();
    console.log('[ORDER] Order saved:', order._id);
    
    // Don't clear cart yet - wait until payment succeeds
    // await cart.deleteOne();
    // console.log('[ORDER] Cart cleared');

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error: any) {
    console.error('[ORDER] Error creating order:', error.message);
    console.error('[ORDER] Stack:', error.stack);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error });
  }
};

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;
    console.log('[PAYMENT] Creating payment intent for orderId:', orderId);
    console.log('[PAYMENT] STRIPE_SECRET_KEY env:', process.env.STRIPE_SECRET_KEY ? `${process.env.STRIPE_SECRET_KEY.substring(0, 20)}...` : 'NOT SET');

    const order = await Order.findById(orderId);
    console.log('[PAYMENT] Order found:', !!order);
    
    if (!order) {
      console.log('[PAYMENT] Order not found');
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.userId) {
      console.log('[PAYMENT] Unauthorized - user mismatch');
      return res.status(403).json({ message: 'Unauthorized' });
    }

    console.log('[PAYMENT] Order total amount:', order.totalAmount);
    const amountInCents = Math.round(order.totalAmount * 100);
    console.log('[PAYMENT] Amount in cents:', amountInCents);

    const stripe = getStripeClient();
    console.log('[PAYMENT] Stripe client initialized successfully');
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: { orderId: orderId },
    });

    console.log('[PAYMENT] Payment intent created:', paymentIntent.id);
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('[PAYMENT] Error creating payment intent:', error.message);
    console.error('[PAYMENT] Stack:', error.stack);
    res.status(500).json({ message: 'Failed to create payment intent', error: error.message });
  }
};

export const confirmPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, paymentIntentId } = req.body;
    console.log('[PAYMENT-CONFIRM] Confirming payment for orderId:', orderId, 'paymentIntentId:', paymentIntentId);

    const order = await Order.findById(orderId);
    if (!order) {
      console.log('[PAYMENT-CONFIRM] Order not found');
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.userId) {
      console.log('[PAYMENT-CONFIRM] Unauthorized - user mismatch');
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update order status to processing
    order.status = 'processing';
    order.paymentId = paymentIntentId;
    await order.save();
    console.log('[PAYMENT-CONFIRM] Order status updated to processing');

    // Clear the cart
    await Cart.deleteOne({ userId: req.userId });
    console.log('[PAYMENT-CONFIRM] Cart cleared');

    res.json({
      message: 'Payment confirmed and order processing',
      order,
    });
  } catch (error: any) {
    console.error('[PAYMENT-CONFIRM] Error:', error.message);
    res.status(500).json({ message: 'Failed to confirm payment', error: error.message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error });
  }
};

// Admin function to get all orders
export const getAllOrdersAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
};

export const getOrdersByUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`[ADMIN] Fetching orders for user ID: ${id}`);

    const orders = await Order.find({ userId: id })
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    console.log(`[ADMIN] Found ${orders.length} orders for user ${id}`);
    res.json(orders);
  } catch (error) {
    console.error('[ADMIN] Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch user orders', error });
  }
};
