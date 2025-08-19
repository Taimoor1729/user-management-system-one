import mongoose, { Schema, Document } from 'mongoose';

export interface IPermission extends Document {
  name: string; // unique slug like 'create_user'
  description?: string;
}

const PermissionSchema = new Schema<IPermission>({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String },
}, { timestamps: true });

export const Permission = mongoose.model<IPermission>('Permission', PermissionSchema);
