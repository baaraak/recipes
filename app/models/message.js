import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: 'Product' },
    to: { type: Schema.Types.ObjectId, ref: 'Product' },
    isRead: { type: Boolean, default: false },
    body: String,
    match: { type: Schema.Types.ObjectId, ref: 'Match' },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model('Message', MessageSchema);

export default MessageModel;
