require('dotenv').config();

const app = require('./config/express');
const mongoose = require('./config/mongoose');
const { port, env } = require('./config/vars');

mongoose.connect();

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`server started on port ${port} (${env})`));
