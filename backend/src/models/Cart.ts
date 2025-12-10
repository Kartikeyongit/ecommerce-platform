import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
}

const cartItemSchema: Schema<ICartItem> = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const cartSchema: Schema<ICart> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model<ICart>('Cart', cartSchema);
