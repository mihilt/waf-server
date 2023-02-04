const { createClient } = require('redis');
const { redisHost } = require('./vars');

const redisClient = createClient({
  url: `redis://${redisHost}:6379`,
});

redisClient.on('error', err => {
  // eslint-disable-next-line no-console
  console.error(err);
});

redisClient.connect();

module.exports = redisClient;
