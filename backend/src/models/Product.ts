import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', productSchema);
