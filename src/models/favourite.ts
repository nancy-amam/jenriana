import mongoose, { Schema, Document } from "mongoose";

export interface IFavorite extends Document {
  user: mongoose.Types.ObjectId;
  apartment: mongoose.Types.ObjectId;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    apartment: { type: Schema.Types.ObjectId, ref: "Apartment", required: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, apartment: 1 }, { unique: true });

export const Favorite =
  mongoose.models.Favorite || mongoose.model<IFavorite>("Favorite", favoriteSchema);
