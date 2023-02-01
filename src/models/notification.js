const mongoose = require('mongoose');

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    notificationId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      ref: 'user',
    },
    content: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
    icon: {
      type: String,
      enum: ['info', 'warning', 'error', 'success'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('notification', notificationSchema);
