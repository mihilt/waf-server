const redis = require('redis');

const redisClient = redis.createClient(6379);

redisClient.on('error', err => {
  // eslint-disable-next-line no-console
  console.error(err);
});

redisClient.connect();

module.exports = redisClient;
