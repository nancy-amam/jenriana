import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  dateOfBirth?: Date;
  membershipNumber?: string;
  membershipTier: "Silver" | "Gold" | "VIP";
  role: "admin" | "user";
  totalBookings: number;
  favorites: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },

    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date },
    membershipNumber: { type: String },
    membershipTier: {
      type: String,
      enum: ["Silver", "Gold", "VIP"],
      default: "Silver",
    },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    totalBookings: { type: Number, default: 0 },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Apartment" }],
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
