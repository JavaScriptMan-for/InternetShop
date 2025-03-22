const {Schema, model} = require('mongoose')

const Basket = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    favicon: {type: String, required: true},
    images: {type: [String], required: true},
    price: {type: String, required: true},
    my_id: {type: Schema.ObjectId, ref: 'Products', required: true},
    count: {type: Number, required: true},
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = model('Basket', Basket);