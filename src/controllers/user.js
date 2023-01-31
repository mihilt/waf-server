const WaitingEmail = require('../models/waiting-email');
const User = require('../models/user');
const { checkRequiredFields, getNextSequence, generateRandomString } = require('../utils');

exports.postUser = async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body;

    checkRequiredFields({ email, password, nickname });

    if (await User.findOne({ email })) {
      res.status(409).json({
        message: 'Email already exists',
      });
      return;
    }

    if (await User.findOne({ nickname })) {
      res.status(409).json({
        message: 'Nickname already exists',
      });
      return;
    }

    await User.create({
      userId: await getNextSequence('userId'),
      email,
      password,
      nickname,
    });

    res.status(201).json({
      message: 'User created',
    });
  } catch (err) {
    next(err);
  }
};

exports.checkEmailDuplication = async (req, res, next) => {
  try {
    const { email } = req.body;

    checkRequiredFields({ email });

    if (await User.findOne({ email })) {
      res.status(409).json({
        message: 'Email already exists',
      });
      return;
    }

    res.status(200).json({
      message: 'Email is available',
    });
  } catch (err) {
    next(err);
  }
};

exports.checkNicknameDuplication = async (req, res, next) => {
  try {
    const { nickname } = req.body;

    checkRequiredFields({ nickname });

    if (await User.findOne({ nickname })) {
      res.status(409).json({
        message: 'Nickname already exists',
      });
      return;
    }

    res.status(200).json({
      message: 'Nickname is available',
    });
  } catch (err) {
    next(err);
  }
};

exports.sendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    checkRequiredFields({ email });

    const verificationCode = generateRandomString();

    await WaitingEmail.findOneAndUpdate(
      { email },
      { email, verificationCode, expiredAt: Date.now() + 1000 * 60 * 60 * 24 },
      { upsert: true },
    );

    // send email verification

    res.status(200).json({
      message: 'Email verification sent',
    });
  } catch (err) {
    next(err);
  }
};
