import { Request, Response } from 'express';
import { z } from 'zod';
import { Permission } from '../models/Permission';
import { idParamSchema } from '../validators/common';

const upsertSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export async function listPermissions(_req: Request, res: Response) {
  const items = await Permission.find().sort({ name: 1 });
  res.json(items);
}

export async function createPermission(req: Request, res: Response) {
  try {
    const data = upsertSchema.parse(req.body);
    const exists = await Permission.findOne({ name: data.name });
    if (exists) return res.status(409).json({ message: 'Permission already exists' });
    const item = await Permission.create(data);
    res.status(201).json(item);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getPermission(req: Request, res: Response) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const item = await Permission.findById(id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
}

export async function updatePermission(req: Request, res: Response) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const data = upsertSchema.parse(req.body);

    const item = await Permission.findByIdAndUpdate(id, data, { new: true });

    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(item);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ message: "Server error" });
  }
}


export async function deletePermission(req: Request, res: Response) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const item = await Permission.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: 'Server error' });
  }
}
