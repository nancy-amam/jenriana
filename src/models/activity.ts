// models/activity.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export type ActivityType =
  | "USER_SIGNEDUP"
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "APPPARTEMNT_ADDED"
  | "APARTMENT_UPDATED"
  | "APARTMENT_DELETED"
  | 'REVIEW_ADDED';

export interface IActivity extends Document {
  type: ActivityType;
  message: string;
  createdAt: Date;
}

const ActivitySchema: Schema<IActivity> = new Schema(
  {
    type: {
      type: String,
      enum: ["USER_SIGNEDUP", "USER_LOGGEDIN", "BOOKING_CONFIRMED", "BOOKING_CANCELLED","APARTMENT_REVIEWED", "APPPARTEMNT_ADDED", "APARTMENT_UPDATED", "APARTMENT_DELETED", 'REVIEW_ADDED'],
      required: true,
    },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Activity: Model<IActivity> =
  mongoose.models.Activity ||
  mongoose.model<IActivity>("Activity", ActivitySchema);

export default Activity;
