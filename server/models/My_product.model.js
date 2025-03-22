const {Schema, model} = require('mongoose')
const My_product = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    favicon: {type: String, required: false},
    images: { type: [String], required: true },
    price: {type: Number, required: true},
    category: {type: String, required: true},
    my_id: {type: Schema.Types.ObjectId, require: true, ref: "Products", unique: true}, 
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = model('My_product',My_product)