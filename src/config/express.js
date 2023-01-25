const express = require('express');
const routes = require('../routes/v1');

const app = express();

app.use('/v1', routes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const { message, data } = error;
  res.status(status).json({ message, data });
});

module.exports = app;
