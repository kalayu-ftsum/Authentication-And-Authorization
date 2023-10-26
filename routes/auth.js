const router = require('express').Router();
const jwt = require('jsonwebtoken')
require('dotenv').config()

const { passport } = require('../utils/auth');

const auth = require('../middlewares/auth');

router.post('/register', auth.register);
router.post('/login', passport.authenticate('local', { session: false}), 
    (req, res) => {
   
        const { username, email} = req.user;
        const token = jwt.sign({ username, email}, process.env.JWT_SECRET);

        return res.json({user:{ username, email}, token });
    }
)

router.get('/protected',passport.authenticate('jwt', { session: false }),
(req, res)=> {

    const {username ,email}=req.user;
    res.status(200).send({ user: {username,email }});
})

module.exports = router;