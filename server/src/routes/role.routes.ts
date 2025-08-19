import { Router } from 'express';
import * as Role from '../controllers/role.controller';
import { requireAuth, requirePermission } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, requirePermission('read_role'), Role.listRoles);
router.post('/', requireAuth, requirePermission('create_role'), Role.createRole);
router.get('/:id', requireAuth, requirePermission('read_role'), Role.getRole);
router.patch('/:id', requireAuth, requirePermission('update_role'), Role.updateRole);
router.delete('/:id', requireAuth, requirePermission('delete_role'), Role.deleteRole);
router.patch('/:id/permissions', requireAuth, requirePermission('update_role_permissions'), Role.patchRolePermissions);

export default router;
