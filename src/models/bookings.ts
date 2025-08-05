import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  apartmentId: mongoose.Types.ObjectId;
  amountPaid: number;
  arrivalDate: Date;
  departureDate: Date;
  bookingDate: Date;
  status: "pending" | "confirmed" | "cancelled";
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    apartmentId: { type: Schema.Types.ObjectId, ref: "Apartment", required: true },
    amountPaid: { type: Number, required: true },
    arrivalDate: { type: Date, required: true },
    departureDate: { type: Date, required: true },
    bookingDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    rating: { type: Number },
  },
  { timestamps: true }
);

const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;