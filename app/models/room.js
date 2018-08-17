import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RoomSchema = new Schema(
  {
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const RoomModel = mongoose.model('Room', RoomSchema);

export default RoomModel;
