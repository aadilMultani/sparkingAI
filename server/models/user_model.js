const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JSON_SECRET_KEY } = process.env;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: [true, "Please Enter Your Name"],
    },
    email: {
        type: String,
        // required: [true, 'Please enter username or password'],
        unique: [true, 'Email Already exist'],
    },
    phoneNo: {
        type: Number,
    },
    password: {
        type: String,
    },
    address_info: {
        address_1: {
            type: String
        },
        address_2: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        country: {
            type: String
        }
    },
    rating: {
        type: Number
    },
    googleId: {
        type: String,
        default: null
    },
    profilePicture: {
        type: String
    },
    isLoginWithGoogle: {
        type: Boolean,
        default: false
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    },
    isDeleted: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, JSON_SECRET_KEY, {
        expiresIn: '1hr'
    });
};

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', userSchema);