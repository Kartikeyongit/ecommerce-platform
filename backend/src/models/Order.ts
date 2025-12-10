import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema: Schema<IOrderItem> = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
});

const shippingAddressSchema: Schema<ShippingAddress> = new Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
}, { _id: false });

const orderSchema: Schema<IOrder> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: { type: shippingAddressSchema, required: true },
    paymentId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', orderSchema);
