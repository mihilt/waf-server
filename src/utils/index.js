const Counter = require('../models/counter');

const getNextSequence = async name => {
  const ret = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return ret.seq;
};

const checkRequiredFields = arr => {
  if (arr.some(field => !field)) {
    const err = new Error('Missing required fields');
    err.statusCode = 400;
    throw err;
  }
};

module.exports = {
  getNextSequence,
  checkRequiredFields,
};
