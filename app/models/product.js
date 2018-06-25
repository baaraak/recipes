import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: String,
    description: String,
    price: {
        min: String,
        max: String,
    },
    location: {
        lat: Number,
        lng: Number,
        address: String,
    },
    radius: Number,
    images: Array,
    matches: { type: Schema.Types.ObjectId, ref: 'Match' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    category: String,
    wanted: Array,
    notification: {
        type: Number,
        default: 0,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const ProductModel = mongoose.model('Product', ProductSchema);

export default ProductModel;
