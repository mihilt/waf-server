const mongoose = require('mongoose');

const { Schema } = mongoose;

// TODO: need to add sequence, author (ip), date
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    contents: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('post', postSchema);
