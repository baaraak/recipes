import BaseController from './base.controller';
import Product from '../models/product';
import User from '../models/user';
import Match from '../models/match';
import { validator } from '../services/validator';
import createError from '../services/error';

class ProductController extends BaseController {


    // Middleware to populate post based on url param
    _populate = async (req, res, next) => {
        const { id } = req.params;

        try {
            const post = await Product.findById(id);

            if (!post) {
                const err = new Error('Product not found.');
                err.status = 404;
                return next(err);
            }

            req.post = post;
            next();
        } catch (err) {
            err.status = err.name === 'CastError' ? 404 : 500;
            next(err);
        }
    }


    search = async (req, res, next) => {
        try {
            const posts =
                await Product.find({})
                    .populate({ path: '_user', select: '-posts -role' });

            res.json(posts);
        } catch (err) {
            next(err);
        }
    }

    /**
     * req.post is populated by middleware in routes.js
     */

    getById = async (req, res, next) => {
        const { id } = req.params;
        try {
            const product = await Product.findById(id).populate('user');
            if (!product) {
                const err = new Error('Product not found.');
                err.status = 404;
                return next(err);
            }
            res.json({ product });
            next();
        } catch (err) {
            err.status = err.name === 'CastError' ? 404 : 500;
            next(err);
        }
    }

    /**
     * req.user is populated by middleware in routes.js
     */

    create = async (req, res, next) => {
        const user = req.user || req.currentUser;
        const { title, description, price, category, location, wanted, images } = req.body;
        const locationStr = location ? `${location.lat},${location.lng}` : '';

        if (!validator.productTitle(title)) return next(createError('title not valid'));
        if (!validator.productDescription(description)) return next(createError('description not valid'));
        if (!validator.productPrice(price)) return next(createError('price not valid'));
        if (!validator.location(locationStr)) return next(createError('location not valid'));
        if (!validator.category(category)) return next(createError('category not valid'));
        if (!Array.isArray(wanted)) return next(createError('wanted not valid'));
        const match = new Match();
        const productInc = new Product({
            title,
            description,
            category,
            price,
            location,
            images,
            wanted,
            matches: match._id,
            user: req.currentUser._id,
        });
        const product = await productInc.save();
        User.update({ _id: user._id }, {
            products: [...user.products, product._id],
        }, (err) => err && console.log(err));
        try {
            res.status(201).json({ product });
        } catch (err) {
            next(err);
        }
    }

    delete = async (req, res, next) => {
        /**
         * Ensure the user attempting to delete the product owns the post
         *
         * ~~ toString() converts objectIds to normal strings
         */
        if (req.post.user.toString() === req.currentUser._id.toString()) {
            try {
                await req.post.remove();
                res.sendStatus(204);
            } catch (err) {
                next(err);
            }
        } else {
            res.sendStatus(403);
        }
    }

    update = async (req, res, next) => {
        const user = req.user || req.currentUser;
        const { title, description, price, category, location, wanted, images, _id, createdBy } = req.body;
        const locationStr = location ? `${location.lat},${location.lng}` : '';

        if (createdBy !== String(user._id)) return next(createError('Not Authorized', 403));

        let newData = {};

        if (validator.productTitle(title)) newData.title = title;
        if (validator.productDescription(description)) newData.description = description;
        if (validator.productPrice(price)) newData.price = price;
        if (validator.location(locationStr)) newData.location = location;
        if (validator.category(category)) newData.category = category;
        if (Array.isArray(wanted)) newData.wanted = wanted;
        if (images) newData.images = images;

        Product.findOneAndUpdate({ _id }, { $set: { ...newData } }, { new: true }, function(err, product) {
            if (err) {
                return next(createError('Something went wrong, please try again later'));
            }
            res.status(201).json({ product });
        });
    };

    uploadImage = async (req, res, next) => {
        if (req.file) {
            res.json({ path: req.file.path });
        }
    }

    like = async (req, res, next) => {
        const { from, to } = req.body;
        Match.findOneAndUpdate(
            { productId: from },
            { $push: { likes: to } },
            { safe: true, upsert: true },
            (err, model) => err ? next(createError('server error')) : res.json({ success: true })
        );
    }

    dislike = async (req, res, next) => {
        const { from, to } = req.body;
        Match.findOneAndUpdate(
            { productId: from },
            { $push: { dislikes: to } },
            { safe: true, upsert: true },
            (err, model) => err ? next(createError('server error')) : res.json({ success: true })
        );
    }

    swipe = async (req, res, next) => {
        const user = req.user || req.currentUser;
        const products = await Product.find({ 'user': { $ne: user._id } }).populate('matches');
        console.log('****************************')
        console.log(products)
        console.log('****************************')
        res.json({ products });
    }
}

export default new ProductController();
