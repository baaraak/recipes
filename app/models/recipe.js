import mongoose from 'mongoose';
import Constants from '../config/constants';

const Schema = mongoose.Schema;

const RecipeSchema = new Schema(
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
        done: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const RecipeModel = mongoose.model('Recipe', RecipeSchema);

export default RecipeModel;
