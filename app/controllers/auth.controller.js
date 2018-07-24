import BaseController from './base.controller';
import User from '../models/user';
import createError from '../services/error';
import categories from '../models/categories.json';

class AuthController extends BaseController {
  login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
      return next(createError('please enter valid email and password'));
    try {
      const user = await User.findOne({ email });

      if (!user || !user.authenticate(password)) {
        return next(createError('invalid email or password'));
      }
      return res.status(200).json({ token: user.generateToken() });
    } catch (err) {
      next(createError('db error'));
    }
  };

  categories = async (req, res, next) => {
    res.send(categories);
  };
}

export default new AuthController();
