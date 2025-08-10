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
    features: {
      type: [String],
      enum: [
        "air-conditioning",
        "wifi",
        "smart-tv",
        "kitchen",
        "workspace",
        "generator",
        "parking",
        "security"
      ], // enforce valid values
      default: [],
    },
    gallery: [String],
    address: { type: String, required: true },
    ratings: { type: Number, default: 0 },
    rules: {
      type: [String],
      enum: [
        "no-smoking",
        "no-parties",
        "children-allowed",
        "do-not-exceed-guest-count",
        "check-in-3pm-11pm",
      ],
      default: [],
    },
    isTrending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Apartment: Model<IApartment> = mongoose.models.Apartment || mongoose.model<IApartment>("Apartment", ApartmentSchema);
export default Apartment;