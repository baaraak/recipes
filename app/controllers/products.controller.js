import BaseController from './base.controller';
import Product from '../models/product';
import User from '../models/user';
import Room from '../models/room';
import Message from '../models/message';
import { validator } from '../services/validator';
import createError from '../services/error';
import { Z_VERSION_ERROR } from 'zlib';

class ProductController extends BaseController {

    getSwipingList = async (productId, callback) => {
        const product = await Product.findOne({ _id: productId });
        let products = [];
        if (product.matches.length === 0) callback([]);
        for (let i = 0; i < product.matches.length; i++) {
            await Product.findOne({ _id: product.matches[i].product }, async function (err, p) {
                if (err) {
                    callback(err);
                } else {
                    const { room } = product.matches[i];
                    await Message.findOne({ roomId: room }, null, { sort: { date: 1 } }, async function (err, m) {
                        if (err) {
                            callback(err);
                        } else {
                            await products.push({
                                roomId: room,
                                product: p,
                                lastMessage: m,
                            });
                            if (products.length === product.matches.length) return callback(products);
                        }
                    });
                }
            });
        }
    }

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

        const productInc = new Product({
            title,
            description,
            category,
            price,
            location,
            images,
            wanted,
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

        Product.findOneAndUpdate({ _id }, { $set: { ...newData } }, { new: true }, function (err, product) {
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
        const likedProduct = await Product.findOne({ _id: to });
        const isMatch = likedProduct.likes.some((l) => l.toString() === from.toString());
        if (isMatch) {
            const room = await new Room();
            Product.findOneAndUpdate({ _id: from }, {
                $addToSet: {
                    likes: to,
                    matches: { room: room._id, product: to },
                },
            }, { safe: true, upsert: true },
                (error) => error
                    ? next(createError('server error'))
                    : Product.findOneAndUpdate({ _id: to }, {
                        $addToSet: {
                            matches: {
                                room: room._id,
                                product: from,
                            },
                        },
                    }, { safe: true, upsert: true },
                        (error) => error ? next(createError('server error')) : res.json({ success: true, isMatch })));
        } else {
            Product.findOneAndUpdate({ _id: from }, { $addToSet: { likes: to } }, { safe: true, upsert: true },
                (error, user) => error ? next(createError('server error')) : res.json({ success: true, isMatch }));
        }
    }

    dislike = async (req, res, next) => {
        const { from, to } = req.body;
        Product.findOneAndUpdate({ _id: from }, { $addToSet: { dislikes: to } }, { safe: true, upsert: true },
            (error) => error ? next(createError('server error')) : res.json({ success: true }));
    }

    swipe = async (req, res, next) => {
        const user = req.user || req.currentUser;
        const product = user.products.filter((p) => p._id.toString() === req.params.id)[0];
        let query = { user: { $ne: user._id } };
        const products = await Product.find(query);
        const allLikes = [...product.likes, ...product.dislikes];
        const newProducts = products.filter((p) => !allLikes.some((id, test) => id.toString() === p._id.toString()));
        res.json({ products: newProducts });
    }

    matches = async (req, res, next) => {
        const user = req.user || req.currentUser;
        const productId = req.params.id;
        this.getSwipingList(productId, (data) => {
            res.send(data);
        });
    }

    messages = async (req, res, next) => {
        const user = req.user || req.currentUser;
        const roomId = req.params.id;
        const messages = await Message.find({ roomId });
        res.json({ messages });
    }

    createMessage = async (req, res, next) => {
        const { to, from, body, roomId } = req.body;
        const message = new Message({ to, from, body, roomId });
        message.save((err, m) => {
            if (err) return res.send({ success: false });
            res.send({ success: true });
        });
    }

    browse = async (req, res, next) => {
        const user = req.user || req.currentUser;
        const { text, category, location, minPrice, maxPrice } = req.query;
        const product = user.products.filter((p) => p._id.toString() === req.params.id)[0];
        const limit = 20;
        const offset = 0;
        let query = [{ $match: { user: { $ne: user._id } } }];
        if (text) {
            query.push({
                $match: { $or: [{ title: { $regex: text, $options: 'i' } }, { description: { $regex: text, $options: 'i' } }] }
            })
        }
        if (category && category !== "0") {
            query.push({ $match: { category: { $in: category.split(',') } } })
        }
        if (minPrice) {
            query.push({ $match: { 'price.min': { $gt: minPrice } } })
        }
        if (minPrice) {
            query.push({ $match: { 'price.max': { $lt: maxPrice } } })
        }
        const products = await Product.aggregate(query);
        res.json({ products });
    }
}

export default new ProductController();
