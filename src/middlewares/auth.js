const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { jwtSecret } = require('../config/vars');

exports.checkIsLoggedIn = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      res.status(401).json({
        message: 'Do not have header authorization',
      });
      return;
    }

    const token = authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, jwtSecret);
    const { userId } = decodedToken;

    if (!userId) {
      res.status(401).json({
        message: 'Invalid token',
      });
      return;
    }

    const user = await User.exists({ userId });

    if (!user) {
      res.status(401).json({
        message: 'Invalid user',
      });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
};

exports.checkAdminAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      res.status(401).json({
        message: 'Do not have header authorization',
      });
      return;
    }

    const token = authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, jwtSecret);
    const { userId } = decodedToken;

    const user = await User.findOne({ userId });

    if (user.auth !== 'A') {
      res.status(401).json({
        message: 'Invalid auth',
      });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
};
