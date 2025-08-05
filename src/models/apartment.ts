import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApartment extends Document {
  name: string;
  location: string;
  pricePerNight: number;
  rooms: number;
  bathrooms: number;
  maxGuests: number;
  features: string[];
  gallery: string[];
  address: string;
  ratings?: number;
  rules: string[];
  isTrending: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ApartmentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    rooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    maxGuests: { type: Number, required: true },
    features: [String],
    gallery: [String],
    address: { type: String },
    ratings: { type: Number, default: 0 },
    rules: [String],
    isTrending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Apartment: Model<IApartment> = mongoose.models.Apartment || mongoose.model<IApartment>("Apartment", ApartmentSchema);
export default Apartment;