const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *         password:
 *           type: string
 *           description: The user's password
 *         name:
 *           type: string
 *           description: The user's first name
 *         surname:
 *           type: string
 *           description: The user's last name
 *         email:
 *           type: string
 *           description: The user's email
 *         role:
 *           type: string
 *           enum: [ 'user', 'admin' ]
 *           description: The user's role
 */


let userSchema = new Schema({
    username: {
      type: String,
      required: [true, 'Username is a required field'],
      maxLength: 20,
      unique: true,
      trim: true,
      lowercase: true 
    },
    password: {
      type: String, 
      required: [true, 'Password is a required field'],
      maxLength:60,
      minLength:6
    },
    name: { type: String },
    surname: { type: String },
    email: {
      type: String,
      required: [true, 'Email is a required field'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email address is not valid']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user' 
    }},
     {
        collection: 'users',
        timestamps: true
});

userSchema.plugin(uniqueValidator);

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('User', userSchema)