const express = require('express');
const { addClient, getSingleClient, updateClient, deleteClient, getAllClient } = require('../controller/client');
const router = express.Router();

router.route('/add-client').post(addClient);
router.route('/get-client').get(getAllClient);
router.route('/get-single-client/:_id').get(getSingleClient);
router.route('/update-client/:_id').post(updateClient);
router.route('/delete-client/:_id').get(deleteClient);

module.exports = router;