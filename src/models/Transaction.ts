import mongoose, { Schema, Document } from "mongoose";

export type TransactionType = "income" | "expense";
export type TransactionCategory =
  | "food" | "transport" | "shopping" | "entertainment"
  | "health" | "education" | "bills" | "salary" | "investment" | "other";

export interface ITransaction extends Document {
  userId: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: Date;
  isRecurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: String, required: true, index: true },
    accountId: { type: String, required: true, index: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true },
    category: {
      type: String,
      enum: ["food","transport","shopping","entertainment","health","education","bills","salary","investment","other"],
      required: true,
    },
    description: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    isRecurring: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
