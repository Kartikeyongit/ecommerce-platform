import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Cart from '../models/Cart';
import Product from '../models/Product';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
    
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart', error });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product or quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId: productId as any, quantity });
    }

    await cart.save();
    await cart.populate('items.productId');

    res.json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add to cart', error });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;
    console.log('[CART] removeFromCart called - userId:', req.userId, 'productId:', productId);

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      console.log('[CART] Cart not found for userId:', req.userId);
      return res.status(404).json({ message: 'Cart not found' });
    }

    console.log('[CART] Before remove - items:', cart.items.length);
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    console.log('[CART] After remove - items:', cart.items.length);

    await cart.save();
    console.log('[CART] Cart saved successfully');
    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error('[CART] removeFromCart error:', error);
    res.status(500).json({ message: 'Failed to remove from cart', error });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    console.log('[CART] updateCartItem called - userId:', req.userId, 'productId:', productId, 'quantity:', quantity);

    if (!productId || !quantity || quantity < 1) {
      console.log('[CART] Invalid product or quantity');
      return res.status(400).json({ message: 'Invalid product or quantity' });
    }

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      console.log('[CART] Cart not found for userId:', req.userId);
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      console.log('[CART] Item not found in cart');
      return res.status(404).json({ message: 'Item not in cart' });
    }

    item.quantity = quantity;
    await cart.save();
    console.log('[CART] Cart item updated and saved');
    res.json({ message: 'Item updated', cart });
  } catch (error) {
    console.error('[CART] updateCartItem error:', error);
    res.status(500).json({ message: 'Failed to update cart', error });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;
    console.log('[CART] clearCart called - userId:', userId);

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      console.log('[CART] Cart not found for userId:', userId);
      return res.status(404).json({ message: 'Cart not found' });
    }

    console.log('[CART] Before clear - items:', cart.items.length);
    cart.items = [];
    await cart.save();
    console.log('[CART] Cart cleared successfully');
    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    console.error('[CART] clearCart error:', error);
    res.status(500).json({ message: 'Failed to clear cart', error });
  }
};
