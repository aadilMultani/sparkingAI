const mongoose = require('mongoose');
const { Schema } = mongoose;

const countrySchema = new Schema({
    name: {
        type: String
    },
});

module.exports = mongoose.model("countrys", countrySchema);