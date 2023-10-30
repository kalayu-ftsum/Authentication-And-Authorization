const mongoose = require('mongoose');
const emailValidator = require('email-validator');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String
  },
  twitterId: {
    type: String
  },
  facebookId: {
    type: String
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    minlength: 6,
    maxlength: 255,
    validate: {
      validator: emailValidator.validate,
      message: props => `${props.value} is not valid`
    }
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 1024
  },
  role:{
    type:String
  }
});

UserSchema.pre('save', async function preSave(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  if (!user.password) return next();
  try {
    var salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};


const User = mongoose.model('User', UserSchema);
module.exports = User;

