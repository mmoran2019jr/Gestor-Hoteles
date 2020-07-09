'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'EncriptionK';
var keyh = 'HotelEncriptionMoreSecure';
exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        iat:  moment().unix(),
        exp: moment().add(15, "hours").unix()
    }
    return jwt.encode(payload, key);
}

exports.createTokenHotel = (hotel)=>{
    var payload = {
        sub: hotel._id,
        cuh: hotel.cuh,
        name: hotel.data.name,
        iat:  moment().unix(),
        exp: moment().add(15, "hours").unix()
    }
    return jwt.encode(payload, keyh);
}