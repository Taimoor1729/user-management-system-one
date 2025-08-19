import { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User';
import { hashPassword, comparePassword } from '../utils/hash';
import { signJwt } from '../utils/jwt';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function register(req: Request, res: Response) {
  try {
    const body = registerSchema.parse(req.body);
    const exists = await User.findOne({ email: body.email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });
    const password = await hashPassword(body.password);
    const user = await User.create({ name: body.name, email: body.email, password });
    const token = signJwt({ sub: String(user._id), email: user.email });
    return res.status(201).json({ token });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const body = loginSchema.parse(req.body);
    const user = await User.findOne({ email: body.email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await comparePassword(body.password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signJwt({ sub: String(user._id), email: user.email });
    return res.json({ token });
  } catch (err: any) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function me(req: Request, res: Response) {
  return res.json({ user: req.user });
}
