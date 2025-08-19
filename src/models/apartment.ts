import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAddon {
   _id: mongoose.Types.ObjectId; 
  name: string;
  description?: string;
  price: number;
  pricingType: "perNight" | "oneTime"; // pricing model
  active: boolean;
}
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
  averageRating?: number;
  ratings: {
    userId: mongoose.Types.ObjectId;
    comment: string;
    rating: number;
    createdAt: Date;
  }[];
  rules: string[];
  isTrending: boolean;
  addons: IAddon[];
  createdAt: Date;
  updatedAt: Date;
}

const AddonSchema = new Schema<IAddon>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    pricingType: { type: String, enum: ["perNight", "oneTime"], required: true },
    active: { type: Boolean, default: true },
  },
  { _id: true }
);

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
    averageRating: { type: Number, default: 0 },
    ratings: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, required: true },
        rating: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    rules: [String],
    isTrending: { type: Boolean, default: false },
    addons: { type: [AddonSchema], default: [] },
  },
  { timestamps: true }
);


const Apartment: Model<IApartment> =
  mongoose.models.Apartment || mongoose.model<IApartment>("Apartment", ApartmentSchema);

export default Apartment;
