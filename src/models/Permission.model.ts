import mongoose from 'mongoose';

export const PermissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model('Permission', PermissionSchema);
