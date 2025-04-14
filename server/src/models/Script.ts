import mongoose from "mongoose";

const ScriptSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  emailRecipient: { type: String, required: true },
  query: { type: String, required: true },
  resultLimit: { type: Number, default: 10 },

  frequencyType: {
    type: String,
    enum: ["Every day", "Every week"],
    required: true,
  },

  executionTime: {
    type: String,
    required: true,
  },

  weeklyDay: {
    type: String,
    validate: {
      validator: function (this: any) {
        return this.frequencyType !== "Every week" || !!this.weeklyDay;
      },
      message: "weeklyDay is required when frequencyType is 'Every week'",
    },
  },

  customization: { type: String, default: "" },


  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Script", ScriptSchema);
