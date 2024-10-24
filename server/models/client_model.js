const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    contact_information: {
        email: {
            type: String,
            required: true
        },
        phone_number: {
            type: Number,
            required: true
        }
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
    type: {
        type: String
    },
    category: {
        type: String
    },
    notes: {
        type: String
    },
    rating: {
        type: Number
    },
    isDeleted: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('clients', clientSchema);