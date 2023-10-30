const router = require('express').Router();
const jwt = require('jsonwebtoken')
const session = require('express-session');
require('dotenv').config()


const { passport } = require('../utils/auth');

const auth = require('../middlewares/auth');

router.post('/register', auth.register);
router.post('/login', passport.authenticate('local', { session: false }),
    (req, res) => {

        const { username, email,role,department } = req.user;
        const token = jwt.sign({ username, email, role,department}, process.env.JWT_SECRET);

        return res.json({ user: { username, email }, token });
    }
)

router.get('/protected', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        try {
            if(!req.user) return res.status(401).send('Unauthorized')
            const { username, email } = req.user;
            res.status(200).send({ user: { username, email } });
        } catch (error) {
            return res.status(500).send('Internal Server Error.');
        }
        }
    )



router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'], // You can add more scopes according to your needs
    prompt: 'select_account',
    session:false
}));

router.get('/google/callback', passport.authenticate('google',{session:false}),(req, res) => {
try {
    const { username, email } = req.user;
    const token = jwt.sign({ username, email }, process.env.JWT_SECRET);
    
    return res.json({ user: { username, email }, token });
    
} catch (error) {
    return res.status(500).send('Internal Server Error.');
}
});


const sessionMiddleware = session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true
  });
  

router.get('/twitter',sessionMiddleware, passport.authenticate('twitter',{session:false}));

router.get('/twitter/callback', sessionMiddleware,passport.authenticate('twitter',{session:false}),(req, res) => {
try {
    const { username, email } = req.user;
    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    
    return res.json({ user: { username }, token });
    
} catch (error) {
    return res.status(500).send('Internal Server Error.');
}
});



router.get('/facebook',sessionMiddleware, passport.authenticate('facebook',{session:false}));

router.get('/facebook/callback', sessionMiddleware,passport.authenticate('facebook',{session:false}),(req, res) => {
try {
    const { username, email } = req.user;
    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    
    return res.json({ user: { username }, token });
    
} catch (error) {
    return res.status(500).send('Internal Server Error.');
}
});

router.get('/logout',(req,res)=>{
     /*
       If you need to invalidate JWTs server-side, 
       one approach is to maintain a blacklist of tokens that should no longer be considered valid, 
       even if they haven't expired yet. When a user logs out, you add their token to this blacklist.
       Then, in your authentication middleware, you check incoming tokens against this blacklist and reject any that are on it
       This will negate the purpose of statelessness of jwt
        */
    res.logout(); // this only logout twitter authentication not the jwt
    res.status(200).json({
        msg:'Logged out'
    });
}
);
module.exports = router;