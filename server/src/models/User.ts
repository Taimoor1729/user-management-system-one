import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role?: Types.ObjectId | null;
  overrides: Types.ObjectId[]; // Permission ids
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: 'Role', default: null },
  overrides: [{ type: Schema.Types.ObjectId, ref: 'Permission', default: [] }],
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
