const User = require('../models/user_model');
const TryCatch = require('../middleware/tryCatch');
const ErrorHandler = require('../utils/errorHandler');
const { sendOTP } = require('./twilio-sms');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// register user
exports.registerUser = TryCatch(
    async (req, res, next) => {
        const { name, email, password, phoneNo } = req.body;

        // Validate required fields
        if (!name || !email || !password || !phoneNo) {
            return next(new ErrorHandler('All Filed Are Required', 400));
        }

        // remove existing  unique index on the googleId field
        User.collection.indexes().then(data => {
            data.forEach(index => {
                if (index.name.includes('googleId')) {
                    User.collection.dropIndex(index.name);
                }
            });
        });

        // Validate phone number
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNo)) {
            return next(new ErrorHandler('Invalid phone number', 400));
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorHandler('User already exists', 400));
        }

        // Create new user
        const user = new User({
            name,
            email,
            phoneNo,
            password,
        });

        // Save user to database
        await user.save();

        return res.json({
            status: true,
            message: "User created successfully",
        });
    }
)

//  login user 
exports.loginUser = TryCatch(
    async (req, res, next) => {
        const { email, password, name, googleId, isLoginWithGoogle, profilePicture } = req.body;

        // Validate required fields
        if (isLoginWithGoogle && (!googleId || !profilePicture)) {
            return next(new ErrorHandler('Google ID and profile picture are required', 400));
        }

        // Check if user exists
        let user;
        if (isLoginWithGoogle) {
            user = await User.findOne({ googleId });
            if (!user) {
                // Create a new user with Google ID and profile picture
                user = new User({
                    googleId,
                    profilePicture,
                    name,
                    email,
                    isLoginWithGoogle
                });
                await user.save();
            }
        } else {
            user = await User.findOne({ email, isDeleted: null });
            console.log("user >>>", user);
            if (!user) {
                return next(new ErrorHandler('Invalid email or password', 400));
            }

            // Compare password
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                return next(new ErrorHandler('Invalid email or password', 400));
            }

            // send Otp to user
            // const countryCode = '+91'
            // const phoneNumber = `${countryCode}${user.phoneNo}`
            // const sendotp = await sendOTP(phoneNumber);

            // if (sendotp.status == false) {
            //     return next(new ErrorHandler(`${sendotp.message}`, 500));
            // }
        }

        // Generate JWT token
        const token = user.getJwtToken();

        return res.json({
            success: true,
            token: token,
            userDetail: user,
            message: `Wellcome Buddy !`,
        });
    }
)

//  create new user
exports.createUser = TryCatch(async (req, res, next) => {
    const {
        name,
        email,
        password,
        phoneNo,
        isLoginWithGoogle,
        googleId,
        address_info,
        rating,
        role,
        profilePicture
    } = req.body;

    const user = await User.create(
        {
            name,
            email,
            password,
            phoneNo,
            isLoginWithGoogle,
            googleId,
            address_info,
            rating,
            role,
            profilePicture
        }
    );

    return res.json({
        status: true,
        user,
        message: 'User Create Successfully'
    })
})

//  get all user 
exports.getAllUser = TryCatch(async (req, res, next) => {

    const users = await User.find({ isDeleted: null }).sort({ createdAt: -1 });

    return res.json({
        status: true,
        users,
        message: 'Users fetch successfully',
    });
})

// get single user
exports.getSingleUser = TryCatch(async (req, res, next) => {
    const id = req.params._id;
    if (!id) {
        return next(new ErrorHandler('User _id is required.', 400));
    }
    const user = await User.find({ _id: id, isDeleted: null });

    if (!user)
        return next(new ErrorHandler('User not found', 404));

    return res.json({
        status: true,
        user,
        message: 'Client fetch successfully',
    });
});

exports.updateUser = TryCatch(async (req, res, next) => {
    const id = req.params._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler('Invalid User Id', 400));
    }

    // Check if user not exists
    const users = await User.findOne({ _id: id, isDeleted: null });
    if (!users) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Hash the password if it's provided in the request body
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    await User.findByIdAndUpdate(id, req.body, { new: true })
        .then(data => {
            if (data) {
                return res.json({
                    status: true,
                    data: data,
                    message: "User update successfully",
                });
            } else {
                return next(new ErrorHandler(`Cannot update user with id=${id}. Maybe user was not found!`))
            }
        })
        .catch((err) => {
            return next(new ErrorHandler(err.message, 500));
        })
});

exports.deleteUser = TryCatch(async (req, res, next) => {

    // Check if id not Provided
    const id = req.params._id;
    if (!id) {
        return next(new ErrorHandler('user _id is required for deleting.', 400));
    }

    const deletedUser = await User.findByIdAndUpdate(
        id,
        {
            $set: {
                isDeleted: new Date().getTime(),
            }
        },
        { new: true }
    )
        .catch((err) => {
            console.log("err??", err);
        })

    if (!deletedUser) {
        return res.json({
            status: false,
            message: 'User not found for the given _id.',
        });
    }

    res.json({
        status: true,
        data: deletedUser,
        message: 'User deleted successfully.',
    });
});

// Search User
exports.searchUser = TryCatch(async (req, res, next) => {
    let data = [];
    if (req.body.searchText) {
        let search = req.body.searchText;
        data = await User.find({
            _id: { $ne: req.body.user_id },
            isDeleted: null,
            $or: [
                { "name": { $regex: search, '$options': 'i' } },
                { "email": { $regex: search, '$options': 'i' } },
                // { "phoneNo": { $regex: search, '$options': 'i' } },
                { "address_info": { $regex: search, '$options': 'i' } }
            ]
        });
    }

    console.log("data >>", data);
    if (data && !data.length) {
        return next(new ErrorHandler('No match found.', 400));
    }

    res.json(data);
}); 