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
