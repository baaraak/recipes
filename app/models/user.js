import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Constants from '../config/constants';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    password: String,
  },
  {
    timestamps: true,
  }
);

/**
 * User Methods
 */
UserSchema.methods = {
  generateToken() {
    return jwt.sign({ _id: this._id }, Constants.security.sessionSecret, {
      expiresIn: Constants.security.sessionExpiration,
    });
  },
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
