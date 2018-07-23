import BaseController from './base.controller';
import User from '../models/user';
import { validator } from '../services/validator';
import createError from '../services/error';
import Product from '../models/product';

class UsersController extends BaseController {

    _populate = async (req, res, next) => {
        const { email } = req.params;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                const err = new Error('User not found.');
                err.status = 404;
                return next(err);
            }

            req.user = user;
            next();
        } catch (err) {
            next(err);
        }
    };

    getAll = async (req, res, next) => {
        try {
            // @TODO Add pagination
            res.json(await User.find());
        } catch (err) {
            next(err);
        }
    };

    me = async (req, res, next) => {
        const user = req.user || req.currentUser;


        if (!user) {
            return res.sendStatus(404);
        }
        const { lat, lng } = req.query;
        if (lat && lng) {
            user.location = { lat, lng };
            res.send(user);
            User.findOneAndUpdate({ _id: user._id }, { $set: { location: { lat, lng } } });
        } else {
            res.send(user);
        }
    };

    signup = async (req, res, next) => {
        const { firstName, lastName, email, country, password } = req.body;

        if (!validator.firstName(firstName)) return next(createError('not valid firstName'));
        if (!validator.lastName(lastName)) return next(createError('not valid lastName'));
        if (!validator.email(email)) return next(createError('not valid email'));
        if (!validator.country(country)) return next(createError('not valid country'));
        if (!validator.password(password)) return next(createError('not valid password'));
        User.find({ email }, (err, user) => {
            if (user.length) return next(createError('Email already exist'));
        });
        let newUser = new User({
            firstName,
            lastName,
            email,
            country,
            password,
        });

        try {
            const savedUser = await newUser.save();
            const token = savedUser.generateToken();
            return res.status(201).json({ token });
        } catch (err) {
            err.status = 400;
            next(err);
        }
    };

    update = async (req, res, next) => {
        const { firstName, lastName, email, country, avatar } = req.body;
        let newAttributes = {};
        if (validator.firstName(firstName)) newAttributes.firstName = firstName;
        if (validator.lastName(lastName)) newAttributes.lastName = lastName;
        if (validator.email(email)) newAttributes.email = email;
        if (validator.country(country)) newAttributes.country = country;
        if (validator.avatar(avatar)) newAttributes.avatar = avatar;
        User.findOne({ email }, (err, user) => {
            if (user.length > 0 && user._id !== req.currentUser._id) return next(createError('Email already exist'));
        });
        User.findOneAndUpdate(
            { _id: req.currentUser._id },
            { $set: { ...newAttributes } },
            { new: true },
            function (err, user) {
                if (err) {
                    return next(createError('Something went wrong, please try again later'));
                }
                res.status(201).json({ success: true });
            });
    };

    delete = async (req, res, next) => {
        if (!req.currentUser) {
            return res.sendStatus(403);
        }

        try {
            await req.currentUser.remove();
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    }

    changeAvatar = async (req, res, next) => {
        if (req.file) {
            res.json({ path: req.file.path });
        }
    }
}

export default new UsersController();
