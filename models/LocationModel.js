const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const locationModel = new Schema(
    {
        locationName: String,
        locationType: String, //found , foundStorage
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('location', locationModel)