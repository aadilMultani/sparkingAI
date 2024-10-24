const mongoose = require('mongoose');
const { Schema } = mongoose;

const stateSchema = new Schema({
    name: {
        type: String
    },
    country_id: {
        type: Schema.Types.ObjectId,
        ref: 'country'
    }
});

module.exports = mongoose.model("state", stateSchema);