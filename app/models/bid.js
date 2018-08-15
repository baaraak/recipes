import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const BidSchema = new Schema(
    {
        from: { type: Schema.Types.ObjectId, ref: 'User' },
        to: { type: Schema.Types.ObjectId, ref: 'Product' },
        isMatch: { type: Boolean, default: false },
        title: String,
        description: String,
        price: Number,
    },
    {
        timestamps: true,
    }
);

const BidModel = mongoose.model('Bid', BidSchema);

export default BidModel;
