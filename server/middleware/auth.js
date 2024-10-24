const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');
const TryCatch = require('./tryCatch');
const { JSON_SECRET_KEY } = process.env;

exports.verifyToken = TryCatch(async (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log("authHeader >>>", authHeader);
    const token = authHeader && authHeader.split(' ')[1];  // Bearer <token>
    console.log("token >>>", token);

    if (!token) return next(new ErrorHandler('Access denied', 400));
    const decode = jwt.verify(token, `${JSON_SECRET_KEY}`);
    console.log("decode >>>", decode);
    req.userId = decode.id;
    next();
});