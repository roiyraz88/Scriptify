// src/models/GeneratedScript.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IGeneratedScript extends Document {
  user: mongoose.Types.ObjectId;
  prompt: string;
  script: string;
  executed: boolean;
  createdAt: Date;
}

const GeneratedScriptSchema: Schema = new Schema<IGeneratedScript>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    prompt: { type: String, required: true },
    script: { type: String, required: true },
    executed: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IGeneratedScript>("GeneratedScript", GeneratedScriptSchema);