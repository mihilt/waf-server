const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const methodOverride = require('method-override');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');
const moment = require('moment');
const cookieParser = require('cookie-parser');

const routes = require('../routes/v1');
const { env } = require('./vars');

const app = express();

app.set('trust proxy', true);

morgan.token('date', () => moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));

if (env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: rfs.createStream('access.log', {
        interval: '1d',
        path: path.join(
          './logs',
          new Date().getFullYear().toString(),
          new Date().getMonth().toString(),
          new Date().getDate().toString(),
        ),
      }),
    }),
  );
}

app.use(cookieParser());
app.use(bodyParser.json());

app.use(compression());
app.use(methodOverride());
app.use(
  helmet({
    crossOriginResourcePolicy: false, // for public image's ERR_BLOCKED_BY_RESPONSE error
  }),
);
app.use(cors());

/**
 * TODO: 너무 잦은 요청에 대한 처리(https://github.com/express-rate-limit/express-rate-limit), 도배 방지도 생각해보기 (브라우저 스토리지, req header 말고 냅다 http 쏘는 것도 생각)
 * 프로덕션 환경에서의 refferer 검증, user-agent 검증
 */

app.use('/v1', routes);

app.use(express.static('public'));

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
