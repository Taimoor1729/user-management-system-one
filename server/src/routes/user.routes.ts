import { Router } from 'express';
import * as User from '../controllers/user.controller';
import { requireAuth, requirePermission } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, requirePermission('read_user'), User.listUsers);
router.post('/', requireAuth, requirePermission('create_user'), User.createUser);
router.get('/:id', requireAuth, requirePermission('read_user'), User.getUser);
router.patch('/:id', requireAuth, requirePermission('update_user'), User.updateUser);
router.delete('/:id', requireAuth, requirePermission('delete_user'), User.deleteUser);
router.patch('/:id/assign-role', requireAuth, requirePermission('assign_role'), User.assignRole);
router.patch('/:id/overrides', requireAuth, requirePermission('override_user_permission'), User.patchOverrides);

export default router;
