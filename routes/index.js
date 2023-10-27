const router = require('express').Router();
const { passport } = require('../utils/auth');

router.get('/protected',passport.authenticate('jwt', { session: false }),
(req, res)=> {
try {
    const {username ,email}=req.user;
    res.status(200).send({ user: {username,email }});
    
} catch (error) {
        return res.status(500).send('Internal Server Error.');
}
})

module.exports = router;