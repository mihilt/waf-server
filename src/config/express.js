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

// TODO: 너무 잦은 요청에 대한 처리(express-rate-limit), 도배 방지도 생각해보기 (브라우저 스토리지, req header 말고 냅다 http 쏘는 것도 생각)

app.use('/v1', routes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  const status = err.statusCode || 500;
  const { message, data } = err;
  res.status(status).json({ message, data });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

module.exports = app;
