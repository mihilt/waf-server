const nodemailer = require('nodemailer');
const { gmailID, gmailPassword, gmailName } = require('../config/vars');
const Counter = require('../models/counter');

exports.getNextSequence = async name => {
  const ret = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return ret.seq;
};

exports.checkRequiredFields = obj => {
  const undefinedFields = [];

  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined) {
      undefinedFields.push(key);
    }
  });

  if (undefinedFields.length > 0) {
    const err = new Error(`Required fields are missing: ${undefinedFields.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }
};

exports.generateRandomString = () => Math.random().toString(36).substring(2);

exports.sendMail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailID,
      pass: gmailPassword,
    },
  });

  await transporter.sendMail({
    from: {
      name: gmailName,
      address: gmailID,
    },
    to,
    subject,
    html,
  });
};
