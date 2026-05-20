import mongoose, { Schema, Document } from "mongoose";

export type GoalStatus = "active" | "completed" | "paused";
export type GoalCategory = "emergency" | "travel" | "education" | "home" | "vehicle" | "wedding" | "retirement" | "gadget" | "other";

export interface IGoal extends Document {
  userId: string;
  accountId: string;
  title: string;
  description?: string;
  targetAmount: number;
  savedAmount: number;
  deadline: Date;
  category: GoalCategory;
  status: GoalStatus;
  color: string;
  emoji: string;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>(
  {
    userId: { type: String, required: true, index: true },
    accountId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    targetAmount: { type: Number, required: true },
    savedAmount: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    category: {
      type: String,
      enum: ["emergency", "travel", "education", "home", "vehicle", "wedding", "retirement", "gadget", "other"],
      required: true,
    },
    status: { type: String, enum: ["active", "completed", "paused"], default: "active" },
    color: { type: String, default: "blue" },
    emoji: { type: String, default: "🎯" },
  },
  { timestamps: true }
);

export default mongoose.models.Goal || mongoose.model<IGoal>("Goal", GoalSchema);
