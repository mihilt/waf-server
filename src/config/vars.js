module.exports = {
  env: process.env.NODE_ENV,
  serverPort: process.env.SERVER_PORT,
  mongoUri: process.env.MONGO_URI,
  aes256Key: process.env.AES256_KEY,
  gmailID: process.env.GMAIL_ID,
  gmailPassword: process.env.GMAIL_PASSWORD,
  gmailName: process.env.GMAIL_NAME,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationHours: process.env.JWT_EXPIRATION_HOURS,
  jwtRefreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
};
