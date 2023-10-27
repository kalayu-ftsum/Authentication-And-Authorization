const User = require('../models/user');

const register= async (req, res, next) => {
    try {
        if(!req.body.username || !req.body.password) return res.status(404).json({message:'Invalid input'});
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