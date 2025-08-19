import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }
    const token = auth.split(' ')[1];
    const payload = verifyJwt<{ sub: string, email: string }>(token);

    // Load user, populate role and permissions
    const user = await User.findById(payload.sub)
      .populate({ path: 'role', populate: { path: 'permissions', model: 'Permission' } })
      .populate('overrides')
      .exec();

    if (!user) return res.status(401).json({ message: 'User not found' });

    // Compute effective permissions: role.permissions ∪ user.overrides
    const rolePerms = (Array.isArray((user.role as any)?.permissions) ? (user.role as any).permissions : [])
      .map((p: any) => p.name);
    const overridePerms = (user.overrides as any[]).map((p: any) => p.name);
    const effective = Array.from(new Set([...rolePerms, ...overridePerms]));

    req.user = {
      _id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role ? {
        _id: String((user.role as any)._id),
        name: (user.role as any).name,
        permissions: rolePerms
      } : null,
      overrides: overridePerms,
      effectivePermissions: effective,
    };

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!req.user.effectivePermissions.includes(permission)) {
      return res.status(403).json({ message: 'Forbidden: missing permission ' + permission });
    }
    next();
  };
}
