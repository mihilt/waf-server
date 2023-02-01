const jwt = require('jsonwebtoken');

const { jwtSecret, jwtExpirationHours, jwtRefreshExpirationDays } = require('../config/vars');
const User = require('../models/user');

const { checkRequiredFields } = require('../utils');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    checkRequiredFields({ email, password });

    const user = await User.findOne({ email, password });

    if (!user) {
      res.status(401).json({
        message: 'Invalid email or password',
        code: 'invalid-email-or-password',
      });
      return;
    }

    const accessToken = jwt.sign(
      {
        userId: user.userId,
      },
      jwtSecret,
      {
        expiresIn: `${jwtExpirationHours}h`,
      },
    );

    const refreshToken = jwt.sign(
      {
        userId: user.userId,
      },
      jwtSecret,
      {
        expiresIn: `${jwtRefreshExpirationDays}d`,
      },
    );

    res.set('Authorization', `Bearer ${accessToken}`);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });

    res.status(200).json({
      message: 'Login success',
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    checkRequiredFields({ refreshToken });

    const decodedToken = jwt.verify(refreshToken, jwtSecret);

    const accessToken = jwt.sign(
      {
        userId: decodedToken.userId,
      },
      jwtSecret,
      {
        expiresIn: `${jwtExpirationHours}h`,
      },
    );

    const newRefreshToken = jwt.sign(
      {
        userId: decodedToken.userId,
      },
      jwtSecret,
      {
        expiresIn: `${jwtRefreshExpirationDays}d`,
      },
    );

    res.set('Authorization', `Bearer ${accessToken}`);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
    });

    res.status(200).json({
      message: 'Refresh token success',
    });
  } catch (err) {
    next(err);
  }
};
