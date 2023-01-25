const express = require('express');

const router = express.Router();
const testRoutes = require('./test.route');

router.use('/test', testRoutes);

module.exports = router;
