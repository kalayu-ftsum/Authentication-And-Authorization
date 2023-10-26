const router = require('express').Router();
const { passport } = require('../utils/auth');

router.get('/protected',passport.authenticate('jwt', { session: false }),
(req, res)=> {

    const {username ,email}=req.user;
    res.status(200).send({ user: {username,email }});
})

module.exports = router;