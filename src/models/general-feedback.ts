import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGeneralFeedback extends Document {
  name: string;
  contact: string;

  bookingProcess: "Excellent" | "Good" | "Average" | "Poor" | null;
  cleanliness: "Excellent" | "Good" | "Average" | "Poor" | null;
  amenitiesComfort: "Excellent" | "Good" | "Average" | "Poor" | null;
  customerService: "Excellent" | "Good" | "Average" | "Poor" | null;
  valueForMoney: "Excellent" | "Good" | "Average" | "Poor" | null;

  enjoyedMost: string;
  improvements: string;

  recommend: "Yes" | "No" | null;
  publish: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const GeneralFeedbackSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },

    bookingProcess: { type: String, enum: ["Excellent", "Good", "Average", "Poor", null], default: null },
    cleanliness: { type: String, enum: ["Excellent", "Good", "Average", "Poor", null], default: null },
    amenitiesComfort: { type: String, enum: ["Excellent", "Good", "Average", "Poor", null], default: null },
    customerService: { type: String, enum: ["Excellent", "Good", "Average", "Poor", null], default: null },
    valueForMoney: { type: String, enum: ["Excellent", "Good", "Average", "Poor", null], default: null },

    enjoyedMost: { type: String, default: "" },
    improvements: { type: String, default: "" },
    publish: { type: Boolean, default: false },

    recommend: { type: String, enum: ["Yes", "No", null], default: null },
  },
  { timestamps: true }
);

const GeneralFeedback: Model<IGeneralFeedback> =
  mongoose.models.GeneralFeedback || mongoose.model<IGeneralFeedback>("GeneralFeedback", GeneralFeedbackSchema);

export default GeneralFeedback;
