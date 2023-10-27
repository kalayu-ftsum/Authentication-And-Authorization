require('dotenv').config();

module.exports={
    oauth2Credentials:{
      clientID: process.env.client_id,
      clientSecret:process.env.client_secret,
      callbackURL:process.env.callback_url
    }
};