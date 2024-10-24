const TryCatch = require("../middleware/tryCatch");
const Country = require('../models/country');
const State = require('../models/state');
const Cities = require('../models/city');
const ErrorHandler = require("../utils/errorHandler");

exports.getCountry = TryCatch(async (req, res, next) => {
    const country = await Country.find();
    if (!country) {
        return next(new ErrorHandler("Country not found", 404));
    }

    return res.json({
        status: true,
        data: country,
        message: 'Country get success'
    });
});

exports.getState = TryCatch(async (req, res, next) => {
    const countryId = req.params._id;
    const state = await State.find({ country_id: countryId });

    if (!state) {
        return next(new ErrorHandler("State not found", 404));
    }

    return res.json({
        status: true,
        data: state,
        message: 'State get success'
    });
});

exports.getAllStates = TryCatch(async (req, res, next) => {
    const allState = await State.find();
    if (!allState) {
        return next(new ErrorHandler("State not found", 404));
    }

    return res.json({
        status: true,
        data: allState,
        message: 'State get success'
    });
})  

exports.getCities = TryCatch(async (req, res, next) => {
    const stateId = req.params._id;
    const cities = await Cities.find({ state_id: stateId });

    if (!cities) {
        return next(new ErrorHandler("Cities not found", 404));
    }

    return res.json({
        status: true,
        data: cities,
        message: 'Cities get success'
    });
});

exports.getAllCities = TryCatch(async (req, res, next) => {
    const allCities = await Cities.find();
    if (!allCities) {
        return next(new ErrorHandler("Cities not found", 404));
    }

    return res.json({
        status: true,
        data: allCities,
        message: 'Cities get success'
    });
})  