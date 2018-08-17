import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MatchSchema = new Schema(
    {
        p1: { type: Schema.Types.ObjectId, ref: 'Product' },
        p2: { type: Schema.Types.ObjectId, ref: 'Product' },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

const MatchModel = mongoose.model('Match', MatchSchema);

export default MatchModel;
