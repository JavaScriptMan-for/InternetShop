const {Schema, model} = require('mongoose');

const User = new Schema({
    email: {type: String, required: true, unique: true},
    fullname: {type: String, required: true},
    gender: {type: String, required: true},
    password: {type: String, required: true}
})

module.exports = model('User', User)