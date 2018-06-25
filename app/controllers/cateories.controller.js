import BaseController from './base.controller';
import createError from '../services/error';
import Category from '../models/category';

class CategoriesController extends BaseController {
    create = async (req, res, next) => {
        const { id, displayName } = req.body;
        if (!id) return next(createError('not valid id'));
        if (!displayName) return next(createError('not valid displayName'));

        let category = new Category({ id, displayName });

        try {
            await category.save();
            return res.status(201).json({ success: true });
        } catch (err) {
            err.status = 400;
            next(err);
        }
    };
}

export default new CategoriesController();
