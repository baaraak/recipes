import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Product from './product';
import Constants from '../config/constants';

const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    avatar: {
      type: String,
      default: 'uploads/avatar.png',
    },
    email: {
      type: String,
      unique: true,
    },
    location: {
      lat: Number,
      lng: Number,
    },
    country: String,
    password: String,
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  {
    timestamps: true,
  }
);

// Strip out password field when sending user object to client
UserSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    obj.id = obj._id;
    obj.fullName = `${obj.firstName} ${obj.lastName}`;
    delete obj._id;
    delete obj.__v;
    delete obj.password;
    return obj;
  },
});

// Ensure email has not been taken
UserSchema.path('email').validate((email, respond) => {
  UserModel.findOne({ email })
    .then(user => {
      respond(!user);
    })
    .catch(() => {
      respond(false);
    });
}, 'Email already in use.');

//
UserSchema.pre('save', function (done) {
  // Encrypt password before saving the document
  if (this.isModified('password')) {
    const { saltRounds } = Constants.security;
    this._hashPassword(this.password, saltRounds, (err, hash) => {
      this.password = hash;
      done();
    });
  } else {
    done();
  }
});

/**
 * User Methods
 */
UserSchema.methods = {
  getProducts() {
    return Product.find({ _user: this._id });
  },

  /**
   * Authenticate - check if the passwords are the same
   * @public
   * @param {String} password
   * @return {Boolean} passwords match
   */
  authenticate(password) {
    return bcrypt.compareSync(password, this.password);
  },

  /**
   * Generates a JSON Web token used for route authentication
   * @public
   * @return {String} signed JSON web token
   */
  generateToken() {
    return jwt.sign({ _id: this._id }, Constants.security.sessionSecret, {
      expiresIn: Constants.security.sessionExpiration,
    });
  },

  generatePasswordHash(password, done) {
    const { saltRounds } = Constants.security;
    this._hashPassword(password, saltRounds, (err, hash) => {
      done(hash);
    });
  },

  /**
   * Create password hash
   * @private
   * @param {String} password
   * @param {Number} saltRounds
   * @param {Function} callback
   * @return {Boolean} passwords match
   */
  _hashPassword(
    password,
    saltRounds = Constants.security.saltRounds,
    callback
  ) {
    return bcrypt.hash(password, saltRounds, callback);
  },
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
