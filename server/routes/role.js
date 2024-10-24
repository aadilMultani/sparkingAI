const express = require('express');
const { getRole } = require('../controller/role');
const router = express.Router();

router.route('/get-role').get(getRole);

module.exports = router;