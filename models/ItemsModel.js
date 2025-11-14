const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const itemsModel = new Schema(
    {
        itemName: String,
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('item', itemsModel)