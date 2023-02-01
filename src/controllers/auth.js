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

    res.set('Authorization', `Bearer ${accessToken}`);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: refreshTokenExpiresAt.toDate(),
    });

    res.status(200).json({
      message: 'Login success',
      tokenType: 'bearer',
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
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

    res.set('Authorization', `Bearer ${accessToken}`);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      expires: refreshTokenExpiresAt.toDate(),
    });

    res.status(200).json({
      message: 'Refresh token success',
      tokenType: 'bearer',
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    });
  } catch (err) {
    next(err);
  }
};
