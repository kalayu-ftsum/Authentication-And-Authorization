const router = require('express').Router();

const { passport } = require('../utils/auth');
const {RBACAuthorization, ABACAuthorization}= require('../middlewares/authorization');

router.get('/protected',passport.authenticate('jwt', { session: false }), RBACAuthorization("admin"),
    (req, res) => {
        try {
            if(!req.user) return res.status(401).send('Unauthorized')
            const { username, email } = req.user;
            res.status(200).send({ user: { username, email } });
        } catch (error) {
            return res.status(500).send('Internal Server Error.');
        }
        }
);

router.get('/allowed',passport.authenticate('jwt', { session: false }), ABACAuthorization(["role"]),
    (req, res) => {
        try {
            if(!req.user) return res.status(401).send('Unauthorized')
            const { username, email } = req.user;
            res.status(200).send({ user: { username, email } });
        } catch (error) {
            return res.status(500).send('Internal Server Error.');
        }
        }
);



module.exports = router;