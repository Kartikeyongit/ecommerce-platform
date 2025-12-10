import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Product from '../models/Product';

export const getAllProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { category, sort, limit = '10', page = '1' } = req.query;
    
    let query: any = {};
    if (category) {
      query.category = category;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .limit(limitNum)
      .skip(skip)
      .sort(sort ? { price: sort === 'asc' ? 1 : -1 } : { createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error });
  }
};

export const searchProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ],
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error });
  }
};

// Admin CRUD functions
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      stock,
    });

    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, image, stock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error });
  }
};
