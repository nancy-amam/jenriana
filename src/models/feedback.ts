import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeedback extends Document {
  userId: mongoose.Types.ObjectId;
  apartmentId?: mongoose.Types.ObjectId;
  comment: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    apartmentId: { type: Schema.Types.ObjectId, ref: "Apartment" },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  { timestamps: true }
);

const Feedback: Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", FeedbackSchema);
export default Feedback;