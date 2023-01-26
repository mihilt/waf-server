const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const methodOverride = require('method-override');

const routes = require('../routes/v1');

const app = express();

app.use(bodyParser.json());

app.use(compression());
app.use(methodOverride());
app.use(helmet());
app.use(cors());

app.use('/v1', routes);

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  const status = err.statusCode || 500;
  const { message, data } = err;
  res.status(status).json({ message, data });
});

module.exports = app;
