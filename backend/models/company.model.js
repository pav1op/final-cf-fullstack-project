const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - companyName
 *         - password
 *         - email
 *       properties:
 *         companyName:
 *           type: string
 *           description: The name of the company
 *         password:
 *           type: string
 *           description: The company's password
 *         email:
 *           type: string
 *           description: The company's email
 *         address:
 *           type: object
 *           properties:
 *             area:
 *               type: string
 *             road:
 *               type: string
 *           description: The company's address
 *         phone:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               number:
 *                 type: string
 *           description: The company's phone numbers
 *         role:
 *           type: string
 *           enum: [ 'company' ]
 *           description: The company's role
 */

let addressSchema = new Schema({
    area: { type: String},
    road: {type: String}
  }, {_id: false})

let phoneSchema = new Schema({
  type: { type: String },
  number: { type: String }
}, {_id: false})

let companySchema = new Schema({
    companyName: { type: String, required: [true, 'The name of the company is a required field'] },
    password: {
        type: String, 
        required: [true, 'Password is a required field'],
        maxLength:60,
        minLength:6
      },
      email: {
        type: String,
        required: [true, 'Email is a required field'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email address is not valid']
      },
      address: addressSchema,
      phone: { type: [phoneSchema], null: true }, 
    role: {
      type: String,
      enum: ['company'],
      default: 'company' 
    }},
    {
    collection: 'companies',
    timestamps: true
});

companySchema.plugin(uniqueValidator);

companySchema.pre('save', async function(next) {
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
  
module.exports = mongoose.model('company', companySchema);