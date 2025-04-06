import mongoose, { Schema, Document } from "mongoose";

export interface IScript extends Document {
  title: string;
  filePath: string;
  type: "job-alert" | "email" | "custom";
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}

const scriptSchema = new Schema<IScript>(
  {
    title: { type: String, required: true },
    filePath: { type: String, required: true },
    type: {
      type: String,
      enum: ["job-alert", "email", "custom"],
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IScript>("Script", scriptSchema);
