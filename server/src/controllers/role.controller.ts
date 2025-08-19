import { Request, Response } from 'express';
import { z } from 'zod';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';
import { idParamSchema } from '../validators/common';

const upsertSchema = z.object({
  name: z.string().min(2),
});

const permPatchSchema = z.object({
  add: z.array(z.string()).optional(),
  remove: z.array(z.string()).optional(),
});

export async function listRoles(_req: Request, res: Response) {
  const items = await Role.find().populate('permissions').sort({ name: 1 });
  res.json(items);
}

export async function createRole(req: Request, res: Response) {
  try {
    const data = upsertSchema.parse(req.body);
    const exists = await Role.findOne({ name: data.name });
    if (exists) return res.status(409).json({ message: 'Role already exists' });
    const item = await Role.create({ name: data.name });
    res.status(201).json(item);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getRole(req: Request, res: Response) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const item = await Role.findById(id).populate('permissions');
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
}

export async function updateRole(req: Request, res: Response) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const data = upsertSchema.parse(req.body);
    const item = await Role.findByIdAndUpdate(id, { name: data.name }, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
}

export async function deleteRole(req: Request, res: Response) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const item = await Role.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
}

export async function patchRolePermissions(req: Request, res: Response) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const { add = [], remove = [] } = permPatchSchema.parse(req.body);

    const role = await Role.findById(id);
    if (!role) return res.status(404).json({ message: 'Not found' });

    const toAdd = await Permission.find({ name: { $in: add } });
    const toRemove = await Permission.find({ name: { $in: remove } });

    const addIds = toAdd.map((p: { _id: any; }) => p._id);
    const removeIds = new Set(toRemove.map((p: { _id: any; }) => String(p._id)));

    const existing = new Set(role.permissions.map((p: any) => String(p)));
    for (const id of addIds) existing.add(String(id));
    const afterRemove = Array.from(existing).filter(idStr => !removeIds.has(idStr));

    role.permissions = afterRemove as any;
    await role.save();
    await role.populate('permissions');

    res.json(role);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
}
