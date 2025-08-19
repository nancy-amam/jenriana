// models/bookings.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  apartmentId: mongoose.Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  status: "pending" | "confirmed" | "declined" | "cancelled";
  totalAmount: number;
  paymentMethod: "card" | "bank";
  addons: {
    name: string;
    price: number;
    pricingType: "perNight" | "oneTime";
    total: number;
  }[];
  serviceCharge: number;
  tax: number;

  // 👇 New customer details
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequest?: string;

  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    apartmentId: { type: Schema.Types.ObjectId, ref: "Apartment", required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guests: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "declined", "cancelled"],
      default: "pending",
    },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["card", "bank"], required: true },
    addons: [
      {
        name: String,
        price: Number,
        pricingType: { type: String, enum: ["perNight", "oneTime"] },
        total: Number,
      },
    ],
    serviceCharge: { type: Number, required: true },
    tax: { type: Number, required: true },

    // 👇 New fields
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    specialRequest: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);
