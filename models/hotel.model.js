'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = Schema({
    cuh: Number,
    password: String,
    data: {
        name: String,
        email: String,
        phone: Number,
        ubication: String,
        capacity: Number,
        image: String,
        date: {
            ini: Date,
            fin: Date
        },
        stars: Number,
        price: Number,
        hola: Date
    }
});

module.exports = mongoose.model('hotel', hotelSchema);