require('dotenv').config();

const app = require('./config/express');
const mongoose = require('./config/mongoose');
const { serverPort, env } = require('./config/vars');

mongoose.connect();

// eslint-disable-next-line no-console
app.listen(serverPort, () => console.log(`server started on port ${serverPort} (${env})`));
