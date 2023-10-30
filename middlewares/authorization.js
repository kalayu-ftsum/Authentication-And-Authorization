const jwt = require('jsonwebtoken');
require('dotenv').config()

const RBACAuthorization=(role)=>{
  return (req, res, next)=> {
    const token =  req.headers.authorization.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          // handle error
          res.status(403).json({msg:'Invalid token'});
        } else if (role !== user.role) {
            res.status(403).json({msg:'Invalid token'});
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      res.status(403).json({msg:'No token provided'});
    }
  };
};



function ABACAuthorization(attributes) {
    return (req, res, next)=> {
        const token =  req.headers.authorization.split(' ')[1];
        if (token) {
          jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
              // handle error
              res.status(403).json({msg:'Invalid token'});
            } else if (!attributes.every(attr => user[attr])) {
                res.status(403).json({msg:'Invalid token'});
            } else {
              req.user = user;
              next();
            }
          });
        } else {
          res.status(403).json({msg:'No token provided'});
        }
      };
}


module.exports={
    RBACAuthorization,
    ABACAuthorization
}
