import mongoose, { Schema, Document } from "mongoose";

export interface ITrendingApartment extends Document {
  apartmentId: mongoose.Types.ObjectId;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TrendingApartmentSchema = new Schema<ITrendingApartment>(
  {
    apartmentId: { type: Schema.Types.ObjectId, ref: "Apartment", required: true, unique: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const TrendingApartment =
  mongoose.models.TrendingApartment || mongoose.model<ITrendingApartment>("TrendingApartment", TrendingApartmentSchema);
