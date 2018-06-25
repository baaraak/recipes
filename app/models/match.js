import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
    likes: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    matches: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
}, {
    timestamps: true,
});

const MatchModel = mongoose.model('Match', MatchSchema);

export default MatchModel;
