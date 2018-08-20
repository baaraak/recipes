import BaseController from './base.controller';
import Product from '../models/product';
import User from '../models/user';
import Message from '../models/message';
import Match from '../models/match';
import Bid from '../models/bid';
import { validator } from '../services/validator';
import createError from '../services/error';

class ProductController extends BaseController {
    // getMatchesBids = async (productId, callback) => {
    //     const bids = await Bid.find({ to: productId });
    //     let bidsList = [];
    //     if (bids.length === 0) callback([]);
    //     for (let i = 0; i < bids.length; i++) {
    //         await Message.findOne(
    //             { roomId: bids[i]._id },
    //             null,
    //             { sort: { date: 1 } },
    //             async function (err, m) {
    //                 if (err) {
    //                     callback(err);
    //                 } else {
    //                     await bidsList.push({
    //                         roomId: bids[i]._id,
    //                         bid: bids[i],
    //                         lastMessage: m,
    //                     });
    //                     if (bidsList.length === bids.length)
    //                         return callback(bidsList);
    //                 }
    //             }
    //         );
    //     }
    // };

    getMatchesProductList = async (productId, callback) => {
        const product = await Product.findOne({ _id: productId });
        const matches = await Match.find({ $or: [{ p1: productId }, { p2: productId }], isActive: true });
        let products = [];
        if (matches.length === 0) callback([]);
        for (let i = 0; i < matches.length; i++) {
            let matchedProductId = matches[i].p1 !== productId ? matches[i].p1 : matches[i].p2;
            await Product.findOne({ _id: matchedProductId }, async function (
                err,
                p
            ) {
                if (err) {
                    callback(err);
                } else {
                    await Message.findOne(
                        { match: matches[i]._id },
                        null,
                        { sort: { date: 1 } },
                        async function (err, m) {
                            if (err) {
                                callback(err);
                            } else {
                                await products.push({
                                    matchId: matches[i]._id,
                                    product: p,
                                    lastMessage: m,
                                });
                                if (products.length === matches.length)
                                    return callback(products);
                            }
                        }
                    );
                }
            });
        }
    };

    shuffle = (array) => {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
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
    };

    search = async (req, res, next) => {
        try {
            const posts = await Product.find({}).populate({
                path: '_user',
                select: '-posts -role',
            });

            res.json(posts);
        } catch (err) {
            next(err);
        }
    };

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
    };

    /**
     * req.user is populated by middleware in routes.js
     */

    create = async (req, res, next) => {
        const user = req.user || req.currentUser;
        const {
            title,
            description,
            price,
            category,
            location,
            wanted,
            images,
        } = req.body;
        const locationStr = location ? `${location.lat},${location.lng}` : '';

        if (!validator.productTitle(title))
            return next(createError('title not valid'));
        if (!validator.productDescription(description))
            return next(createError('description not valid'));
        if (!validator.productPrice(price))
            return next(createError('price not valid'));
        if (!validator.location(locationStr))
            return next(createError('location not valid'));
        if (!validator.category(category))
            return next(createError('category not valid'));
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
        User.update(
            { _id: user._id },
            {
                products: [...user.products, product._id],
            },
            err => err && console.log(err)
        );
        try {
            res.status(201).json({ product });
        } catch (err) {
            next(err);
        }
    };

    delete = async (req, res, next) => {
        /**
         * Ensure the user attempting to delete the product owns the post
         *
         * ~~ toString() converts objectIds to normal strings
         */
        if (req.post.user.toString() === req.currentUser._id.toString()) {
            Product.findOneAndUpdate(
                { _id: req.post._id },
                { $set: { active: false } },
                { new: true },
                function (err, product) {
                    if (err) return next(res.sendStatus(403));
                    return res.sendStatus(204);
                }
            );
        }
    };

    update = async (req, res, next) => {
        const user = req.user || req.currentUser;
        const {
            title,
            description,
            price,
            category,
            location,
            wanted,
            images,
            _id,
            createdBy,
        } = req.body;
        const locationStr = location ? `${location.lat},${location.lng}` : '';

        if (createdBy !== String(user._id))
            return next(createError('Not Authorized', 403));

        let newData = {};

        if (validator.productTitle(title)) newData.title = title;
        if (validator.productDescription(description))
            newData.description = description;
        if (validator.productPrice(price)) newData.price = price;
        if (validator.location(locationStr)) newData.location = location;
        if (validator.category(category)) newData.category = category;
        if (Array.isArray(wanted)) newData.wanted = wanted;
        if (images) newData.images = images;

        Product.findOneAndUpdate(
            { _id },
            { $set: { ...newData } },
            { new: true },
            function (err, product) {
                if (err) {
                    return next(
                        createError('Something went wrong, please try again later')
                    );
                }
                res.status(201).json({ product });
            }
        );
    };

    uploadImage = async (req, res, next) => {
        if (req.file) {
            res.json({ path: req.file.path });
        }
    };

    like = async (req, res, next) => {
        const { from, to } = req.body;
        const likedProduct = await Product.findOne({ _id: to });
        const isMatch = likedProduct.likes.some(
            l => l.toString() === from.toString()
        );
        if (isMatch) {
            const match = (new Match({ p1: from, p2: to, })).save();
            Product.findOneAndUpdate(
                { _id: from },
                {
                    $addToSet: {
                        likes: to,
                    },
                },
                { safe: true, upsert: true },
                async (error, fromProduct) => {
                    if (error) {
                        return next(createError('server error'))
                    }

                    return res.json({
                        success: true,
                        isMatch: {
                            from: fromProduct,
                            to: likedProduct,
                            matchId: match._id,
                        },
                    })
                }
            );
        } else {
            Product.findOneAndUpdate(
                { _id: from },
                { $addToSet: { likes: to } },
                { safe: true, upsert: true },
                (error, user) =>
                    error
                        ? next(createError('server error'))
                        : res.json({ success: true, isMatch })
            );
        }
    };

    dislike = async (req, res, next) => {
        const { from, to } = req.body;
        Product.findOneAndUpdate(
            { _id: from },
            { $addToSet: { dislikes: to } },
            { safe: true, upsert: true },
            error =>
                error ? next(createError('server error')) : res.json({ success: true })
        );
    };

    unmatch = async (req, res, next) => {
        const { matchId } = req.params;
        Match.findOneAndUpdate(
            { _id: matchId },
            { isActive: false },
            { safe: true, upsert: true },
            error => {
                if (error) {
                    next(createError('server error'))
                } else {
                    res.json({ success: true })
                }
            }
        );
    };

    swipe = async (req, res, next) => {
        const user = req.user || req.currentUser;
        const product = user.products.filter(
            p => p._id.toString() === req.params.id
        )[0];
        let query = { user: { $ne: user._id } };
        const products = await Product.find(query);
        const allLikes = [...product.likes, ...product.dislikes];
        const newProducts = products.filter(
            p => !allLikes.some((id, test) => id.toString() === p._id.toString())
        );
        res.json({ products: this.shuffle(newProducts) });
    };

    matches = async (req, res, next) => {
        const user = req.user || req.currentUser;
        const productId = req.params.id;
        this.getMatchesProductList(productId, matches => {
            res.send(matches);
        });
    };

    messages = async (req, res, next) => {
        const user = req.user || req.currentUser;
        const match = req.params.id;
        const messages = await Message.find({ match });
        res.json({ messages });
    };

    createMessage = async (req, res, next) => {
        const { to, from, body, match } = req.body;
        const message = new Message({ to, from, body, match });
        message.save((err, m) => {
            if (err) return res.send({ success: false });
            res.send({ success: true });
        });
    };

    browse = async (req, res, next) => {
        const user = req.user || req.currentUser;
        const { text, category, location, minPrice, maxPrice } = req.query;
        const product = user.products.filter(
            p => p._id.toString() === req.params.id
        )[0];
        const limit = 20;
        const offset = 0;
        let query = [{ $match: { user: { $ne: user._id } } }];
        if (text) {
            query.push({
                $match: {
                    $or: [
                        { title: { $regex: text, $options: 'i' } },
                        { description: { $regex: text, $options: 'i' } },
                    ],
                },
            });
        }
        if (category && category !== '0') {
            query.push({ $match: { category: { $in: category.split(',') } } });
        }
        if (minPrice && minPrice !== 'undefined') {
            query.push({ $match: { 'price.min': { $gt: Number(minPrice) } } });
        }
        if (maxPrice && maxPrice !== 'undefined') {
            query.push({ $match: { 'price.max': { $lt: Number(maxPrice) } } });
        }
        const products = await Product.aggregate(query);

        if (product) {
            const allLikes = [...product.likes, ...product.dislikes];
            const newProducts = products.filter(
                p => !allLikes.some((id, test) => id.toString() === p._id.toString())
            );
            return res.json({ products: newProducts });
        }
        return res.json({ products });
    };

}

export default new ProductController();
