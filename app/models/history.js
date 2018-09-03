import mongoose from 'mongoose';
import Constants from '../config/constants';

const Schema = mongoose.Schema;

const HistorySchema = new Schema(
    {
        icon: String,
        name: String,
        preparation: String,
        steps: [{
            name: String,
            quantity: String,
            icon: String,
            done: {
                type: Boolean,
                default: false,
            }
        }],
    },
    {
        timestamps: true,
    }
);

const HistoryModel = mongoose.model('History', HistorySchema);

export default HistoryModel;
