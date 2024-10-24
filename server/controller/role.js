const TryCatch = require("../middleware/tryCatch");
const Role = require('../models/roles');
const ErrorHandler = require("../utils/errorHandler");

exports.getRole = TryCatch(async (req, res, next) => {
    const roles = await Role.find();
    if (!roles) {
        return next(new ErrorHandler("Role not found", 404));
    }

    return res.json({
        status: true,
        data: roles,
        message: 'role get success'
    });
});