import  connectDB  from '../config/db';
import { Permission } from '../models/Permission';
import { Role } from '../models/Role';
import { User } from '../models/User';
import { hashPassword } from '../utils/hash';

async function run() {
  await connectDB();

  const perms = [
    // permission CRUD
    'create_permission', 'read_permission', 'update_permission', 'delete_permission',
    // role CRUD
    'create_role', 'read_role', 'update_role', 'delete_role', 'update_role_permissions',
    // user CRUD
    'create_user', 'read_user', 'update_user', 'delete_user', 'assign_role', 'override_user_permission',
  ];

  const permDocs = [];
  for (const name of perms) {
    const doc = await Permission.findOneAndUpdate({ name }, { name }, { upsert: true, new: true });
    permDocs.push(doc);
  }

  const adminRole = await Role.findOneAndUpdate(
    { name: 'Admin' },
    { name: 'Admin', permissions: permDocs.map(p => p._id) },
    { upsert: true, new: true }
  );

  // create admin user if not exists
  const adminEmail = 'admin@example.com';
  const exists = await User.findOne({ email: adminEmail });
  if (!exists) {
    const password = await hashPassword('Admin@123');
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password,
      role: adminRole._id,
    });
    console.log('✅ Admin user created: admin@example.com / Admin@123');
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  console.log('✅ Seed completed');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
