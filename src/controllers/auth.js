const jwt = require('jsonwebtoken');
const moment = require('moment');

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
        email: user.email,
        nickname: user.nickname,
      },
      jwtSecret,
      {
        expiresIn: `${jwtExpirationHours}h`,
      },
    );

    const accessTokenExpiresAt = moment().add(jwtExpirationHours, 'hours');

    const refreshToken = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        nickname: user.nickname,
      },
      jwtSecret,
      {
        expiresIn: `${jwtRefreshExpirationDays}d`,
      },
    );

    const refreshTokenExpiresAt = moment().add(jwtRefreshExpirationDays, 'days');

    res.status(200).json({
      tokenType: 'bearer',
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const decodedToken = jwt.verify(refreshToken, jwtSecret);

    const accessToken = jwt.sign(
      {
        userId: decodedToken.userId,
        email: decodedToken.email,
        nickname: decodedToken.nickname,
      },
      jwtSecret,
      {
        expiresIn: `${jwtExpirationHours}h`,
      },
    );

    const accessTokenExpiresAt = moment().add(jwtExpirationHours, 'hours');

    const newRefreshToken = jwt.sign(
      {
        userId: decodedToken.userId,
        email: decodedToken.email,
        nickname: decodedToken.nickname,
      },
      jwtSecret,
      {
        expiresIn: `${jwtRefreshExpirationDays}d`,
      },
    );

    const refreshTokenExpiresAt = moment().add(jwtRefreshExpirationDays, 'days');

    res.status(200).json({
      tokenType: 'bearer',
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    });
  } catch (err) {
    next(err);
  }
};
