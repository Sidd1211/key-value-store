const express = require('express');
const kvRouter = require('./kv');

const router = express.Router();

router.use('/kv', kvRouter);

module.exports = router;