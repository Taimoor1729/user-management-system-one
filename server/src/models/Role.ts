import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRole extends Document {
  name: string; // e.g., 'Admin', 'Teacher'
  permissions: Types.ObjectId[]; // references Permission
}

const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true, unique: true, trim: true },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission', default: [] }],
}, { timestamps: true });

export const Role = mongoose.model<IRole>('Role', RoleSchema);
