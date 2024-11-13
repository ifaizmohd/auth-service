import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'others'],
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  },
  contactNumber: {
    type: Number,
  },
  address: {
    type: String,
  },
  fatherName: {
    type: String,
  },
  motherName: {
    type: String,
  },
  parentsContactNumber: {
    type: Map,
    of: Number,
  },
});

export default mongoose.model('UserProfile', UserProfileSchema);
