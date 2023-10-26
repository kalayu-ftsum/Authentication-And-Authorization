const User = require('../models/user');

const register= async (req, res, next) => {
    try {
        await User.create(req.body);
        res.status(200).json({
            success:true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }

};


module.exports={
    register
};