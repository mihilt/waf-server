const WaitingEmail = require('../models/waiting-email');
const User = require('../models/user');
const {
  checkRequiredFields,
  getNextSequence,
  generateRandomString,
  sendMail,
} = require('../utils');

exports.postUser = async (req, res, next) => {
  try {
    const { email, password, nickname, verificationCode } = req.body;

    checkRequiredFields({ email, password, nickname, verificationCode });

    // TODO: email validation

    if (await User.findOne({ email })) {
      res.status(409).json({
        message: 'Email already exists',
        code: 'email-already-exists',
      });
      return;
    }

    if (await User.findOne({ nickname })) {
      res.status(409).json({
        message: 'Nickname already exists',
        code: 'nickname-already-exists',
      });
      return;
    }

    if (!(await WaitingEmail.findOneAndDelete({ email, verificationCode }))) {
      res.status(400).json({
        message: 'Invalid verification code',
        code: 'invalid-verification-code',
      });
      return;
    }

    // TODO: password hashing -> 로그인도 비교 필요

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

    const user = await User.findOne({ email });

    if (user) {
      res.status(409).json({
        message: 'Email already used',
        code: 'email-already-used',
      });
    }

    const verificationCode = generateRandomString();
    const expiredAt = Date.now() + 1000 * 60 * 60;

    await WaitingEmail.findOneAndUpdate(
      { email },
      { email, verificationCode, expiredAt },
      { upsert: true },
    );

    await sendMail({
      to: email,
      subject: 'Email verification',
      html: `
      <div>
        <p>안녕하세요.</p>
        <br />
        <p>인증번호: ${verificationCode}</p>
        <p>인증 유효 기간: ${new Date(expiredAt).toLocaleString('ko-KR')}</p>
      </div>`,
    });

    res.status(200).json({
      message: 'Email verification sent',
    });
  } catch (err) {
    next(err);
  }
};

exports.checkVerificationEmail = async (req, res, next) => {
  try {
    const { email, verificationCode } = req.body;

    checkRequiredFields({ email, verificationCode });

    const checkResult = await WaitingEmail.findOne({ email, verificationCode });

    if (!checkResult || checkResult.expiredAt < Date.now()) {
      res.status(400).json({
        message: 'Invalid email or verification code',
      });
      return;
    }

    res.status(200).json({
      message: 'Email verification success',
    });
  } catch (err) {
    next(err);
  }
};
