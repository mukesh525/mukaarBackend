const jwt = require('jsonwebtoken');
const {User} = require('../models/user');
const config = require('../config');

module.exports = async (req, res, next)=> {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send({"message":"Access denied. No token provided."});
  try {
    const decoded = jwt.verify(token, config.SECRET);
    var user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(401).send({"message":'Invalid token .'});
    else req.user = user; 
    //req.user = decoded; 
    next();
  }
  catch (ex) {
    res.status(401).send({"message":"Invalid token."});
  }
}