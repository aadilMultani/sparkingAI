const mongoose = require('mongoose');
const { Schema } = mongoose;

const citySchema = new Schema({
    name: {
        type: String
    },
    state_id:{
        type: Schema.Types.ObjectId,
        ref: 'state'
    }
});

module.exports = mongoose.model("citys", citySchema);