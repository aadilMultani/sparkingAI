const express = require('express');
const {
    addJobCart,
    getAllJobCart,
    getSingleJobCart,
    updateJobcart,
    deleteJobcart
} = require('../controller/jobCard');
const router = express.Router();

router.route('/add-jobCart').post(addJobCart);
router.route('/get-jobCart').get(getAllJobCart);
router.route('/get-single-jobCart/:_id').get(getSingleJobCart);
router.route('/update-jobCart/:_id').post(updateJobcart);
router.route('/delete-jobCart/:_id').get(deleteJobcart);

module.exports = router;