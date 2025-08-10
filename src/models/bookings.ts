// models/booking.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  userId: Types.ObjectId;
  apartmentId: Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  status: 'pending' | 'confirmed' | 'declined';
  totalAmount: number;
  paymentMethod: 'card' | 'bank';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    apartmentId: { type: Schema.Types.ObjectId, ref: 'Apartment', required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guests: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'declined'], default: 'pending' },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['card', 'bank'], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
