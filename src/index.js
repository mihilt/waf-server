require('dotenv').config();

const app = require('./config/express');
const { port, env } = require('./config/vars');

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`server started on port ${port} (${env})`));
