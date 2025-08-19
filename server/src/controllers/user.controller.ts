import { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';
import { hashPassword } from '../utils/hash';
import { idParamSchema } from '../validators/common';

const userCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  roleId: z.string().optional(),
});

const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  roleId: z.string().optional(),
});

const overridePatchSchema = z.object({
  add: z.array(z.string()).optional(),
  remove: z.array(z.string()).optional(),
});

export async function listUsers(_req: Request, res: Response) {
  const items = await User.find().populate('role').populate('overrides').sort({ createdAt: -1 });
  res.json(items);
}

export async function createUser(req: Request, res: Response) {
  try {
    const data = userCreateSchema.parse(req.body);
    const exists = await User.findOne({ email: data.email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });
    const password = await hashPassword(data.password);
    const doc: any = { name: data.name, email: data.email, password };
    if (data.roleId) doc.role = data.roleId;
    const item = await User.create(doc);
    res.status(201).json(item);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const item = await User.findById(id).populate('role').populate('overrides');
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const data = userUpdateSchema.parse(req.body);
    const doc: any = {};
    if (data.name) doc.name = data.name;
    if (data.email) doc.email = data.email;
    if (data.password) doc.password = await hashPassword(data.password);
    if (typeof data.roleId !== 'undefined') doc.role = data.roleId || null;
    const item = await User.findByIdAndUpdate(id, doc, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const item = await User.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
}

export async function assignRole(req: Request, res: Response) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const schema = z.object({ roleId: z.string().nullable() });
    const { roleId } = schema.parse(req.body);
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) return res.status(400).json({ message: 'Role not found' });
    }
    const item = await User.findByIdAndUpdate(id, { role: roleId || null }, { new: true })
      .populate('role').populate('overrides');
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
}

export async function patchOverrides(req: Request, res: Response) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const { add = [], remove = [] } = overridePatchSchema.parse(req.body);

    const user = await User.findById(id).populate('overrides');
    if (!user) return res.status(404).json({ message: 'Not found' });

    const toAdd = await Permission.find({ name: { $in: add } });
    const toRemove = await Permission.find({ name: { $in: remove } });

    const existing = new Set(user.overrides.map((p: { _id: any; }) => String(p._id)));
    for (const p of toAdd) existing.add(String(p._id));
    for (const p of toRemove) existing.delete(String(p._id));

    user.overrides = Array.from(existing) as any;
    await user.save();
    await user.populate('role');
    await user.populate('overrides');

    res.json(user);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
}
