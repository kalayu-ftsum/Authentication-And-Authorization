const Passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

Passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username }).exec();
    if (!user) {
      return done(null, false, { message: 'Invalid username or password' });
    }
    const passwordOK = await user.comparePassword(password);
    if (!passwordOK) {
      return done(null, false, { message: 'Invalid username or password' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));


const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

Passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findOne({email:jwt_payload.email}).exec();
    if (!user) {
      return done(null, false, { message: 'UnAuthorized' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));



module.exports = {
  initialize: Passport.initialize(),
  passport: Passport
};
