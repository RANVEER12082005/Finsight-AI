import mongoose, { Schema, Document } from "mongoose";

export type AccountType = "savings" | "current" | "credit" | "investment" | "cash";

export interface IAccount extends Document {
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  currencySymbol: string;
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["savings", "current", "credit", "investment", "cash"],
      required: true,
    },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, default: "INR" },
    currencySymbol: { type: String, default: "₹" },
    color: { type: String, default: "blue" },
    icon: { type: String, default: "wallet" },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Account ||
  mongoose.model<IAccount>("Account", AccountSchema);
