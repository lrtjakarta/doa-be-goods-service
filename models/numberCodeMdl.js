const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const numberCode = new Schema(
    {
        code: String, // FO,
        count: Number
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('numberCode', numberCode)