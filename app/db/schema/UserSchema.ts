import mongoose, { Schema } from 'mongoose';

const WalletSchema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
});

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  wallet: {
    type: WalletSchema,
    required: true,
  },
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', UserSchema);