const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobCardSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    job_type: {
        type: String,
        enum: ['Residential', 'Commercial', 'Emergency'],
        default: "Residential"
    },
    status: {
        type: String,
        enum: ["New", "In Progress", "Completed", "Cancelled"],
        default: "New"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low"
    },
    description: {
        type: String
    },
    location: {
        address_1: {
            type: String
        },
        address_2: {
            type: String
        },
        city: {
            type: String,
            type: Schema.Types.ObjectId,
            ref: 'citys'
        },
        state: {
            type: String,
            type: Schema.Types.ObjectId,
            ref: 'state'
        },
        country: {
            type: String,
            type: Schema.Types.ObjectId,
            ref: 'countrys'
        }
    },
    schedule: {
        type: Date
    },
    costing: {
        type: Number
    },
    notes: {
        type: String
    },
    category: {
        type: String,
        enum: ["Drain Cleaning", "Pipe Repair", "Water Heater Installation"],
        default: "Drain Cleaning"
    },
    tags: {
        type: Array
    },
    isDeleted: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("jobCard", jobCardSchema)