const express = require('express');
const { registerUser, loginUser, createUser, getAllUser, getSingleUser, updateUser, deleteUser, searchUser } = require('../controller/user-controller');
const { sendOTP, verifyOTP, createCall, voiceResponse, Transcribe } = require('../controller/twilio-sms');
const { verifyToken } = require('../middleware/auth');
const { getCountry, getState, getCities, getAllStates, getAllCities } = require('../controller/userAddress');
const router = express.Router();

// All Get Route
router.route('/get-country').get(getCountry);
router.route('/get-state/:_id').get(getState);
router.route('/get-cities/:_id').get(getCities);
router.route('/get-allUser').get(getAllUser);
router.route('/get-allState').get(getAllStates);
router.route('/get-allCities').get(getAllCities);
router.route('/get-singleUser/:_id').get(getSingleUser);
router.route('/delete-user/:_id').get(deleteUser);

// All Post Route
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/send-otp').post(sendOTP);
router.route('/verify-otp').post(verifyOTP);
router.route('/create-user').post(createUser);
router.route('/create-call').post(createCall);
router.route('/voice-response').post(voiceResponse);
router.route('/transcribe').post(Transcribe);
router.route('/update-user/:_id').post(updateUser);
router.route('/search-user').post(searchUser);

module.exports = router;