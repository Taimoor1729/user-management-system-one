import { Router } from 'express';
import * as Permission from '../controllers/permission.controller';
import { requireAuth, requirePermission } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, requirePermission('read_permission'), Permission.listPermissions);
router.post('/', requireAuth, requirePermission('create_permission'), Permission.createPermission);
router.get('/:id', requireAuth, requirePermission('read_permission'), Permission.getPermission);
router.patch('/:id', requireAuth, requirePermission('update_permission'), Permission.updatePermission);
router.delete('/:id', requireAuth, requirePermission('delete_permission'), Permission.deletePermission);

export default router;
