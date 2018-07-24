import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
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
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    category: String,
    wanted: Array,
    likes: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    matches: [
      {
        room: { type: Schema.Types.ObjectId, ref: 'Room' },
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
      },
    ],
    notification: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    delete obj.__v;
    return obj;
  },
});

const ProductModel = mongoose.model('Product', ProductSchema);

export default ProductModel;
