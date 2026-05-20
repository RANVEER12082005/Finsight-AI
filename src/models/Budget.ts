import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  userId: string;
  accountId: string;
  category: string;
  amount: number;
  spent: number;
  month: number;
  year: number;
  alertSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>(
  {
    userId: { type: String, required: true, index: true },
    accountId: { type: String, required: true, index: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    spent: { type: Number, default: 0 },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    alertSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Budget ||
  mongoose.model<IBudget>("Budget", BudgetSchema);
