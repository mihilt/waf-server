const mongoose = require('mongoose');
const { env, mongoUri } = require('./vars');

mongoose.set('strictQuery', false);

// Exit application on error
mongoose.connection.on('error', err => {
  // eslint-disable-next-line no-console
  console.log(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// print mongoose logs in dev env
if (env === 'development') {
  mongoose.set('debug', true);
}

exports.connect = () => {
  // eslint-disable-next-line no-console
  mongoose.connect(mongoUri).then(() => console.log('mongoDB connected...'));
  return mongoose.connection;
};
