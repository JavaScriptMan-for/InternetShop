const {Schema, model} = require('mongoose')

const Products = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    favicon: {type: String, required: false},
    images: { type: [String], required: true },
    price: {type: Number, required: true},
    category: {type: String, required: true}
})

module.exports = model('Products', Products)