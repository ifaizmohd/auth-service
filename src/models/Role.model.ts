import mongoose from 'mongoose';
import { ROLES } from './constants';
import { PermissionSchema } from './Permission.model';

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ROLES,
    required: true,
  },
  permissions: {
    type: Array,
    of: PermissionSchema,
  },
});

export default mongoose.model('Role', RoleSchema);
