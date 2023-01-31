const mongoose = require('mongoose');

const { Schema } = mongoose;

const waitingEmailSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    verificationCode: {
      type: String,
      required: true,
    },
    expiredAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('waiting_email', waitingEmailSchema);
