const Passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy=require('passport-twitter').Strategy;

const User = require('../models/user');
const authConfig = require('../config/auth')

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
    const user = await User.findOne({ email: jwt_payload.email }).exec();
    if (!user) {
      return done(null, false, { message: 'UnAuthorized' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));


Passport.use(new GoogleStrategy({
  clientID: authConfig.oauth2Credentials.clientID,
  clientSecret: authConfig.oauth2Credentials.clientSecret,
  callbackURL: authConfig.oauth2Credentials.callbackURL,
  passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ googleId: profile.id });
    if (!user) {
      try {
        const newUser = await User.create({ googleId: profile.id,email: profile.emails[0].value,username: profile.displayName });
        if (!newUser) {
          return done(null, false, { message: 'Error Creating profile' });
        }
        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  return done(null, user);
  } catch (err) {
  return done(err);
}}
));

Passport.use(new TwitterStrategy({
  consumerKey: authConfig.twitter.clientID,
  consumerSecret: authConfig.twitter.clientSecret,
  callbackURL: "http://localhost:3000/auth/twitter/callback",
  passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ twitterId: profile.id });
    if (!user) {
      try {
        const newUser = await User.create({ twitterId: profile.id,username: profile.displayName });
        if (!newUser) {
          return done(null, false, { message: 'Error Creating profile' });
        }
        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  return done(null, profile);
  } catch (err) {
  return done(err);
}}
));



module.exports = {
  initialize: Passport.initialize(),
  passport: Passport
};
