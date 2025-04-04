import mongoose, { Document, Schema, Types } from "mongoose";

export interface IScript extends Document {
  owner: Types.ObjectId;
  query: string;
  result: string;
  createdAt: Date;
}

const scriptSchema = new Schema<IScript>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    query: { type: String, required: true },
    result: { type: String, required: true }
  },
  { timestamps: true }
);

const Script = mongoose.model<IScript>("Script", scriptSchema);

export default Script;
