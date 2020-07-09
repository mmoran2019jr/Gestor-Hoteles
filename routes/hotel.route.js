'use strict'

var express = require('express');
var hotelController = require('../controllers/hotel.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

api.post('/admin/saveHotel', mdAuth.ensureAuthAdmin, hotelController.saveHotel);
api.post('/login', hotelController.login);
api.put('/updateHotel/:id', mdAuth.ensureAuthHotel, hotelController.updateHotel);
api.delete('/removeHotel/:id', mdAuth.ensureAuthHotel, hotelController.removeHotel);
api.post('/find', mdAuth.ensureAuth, hotelController.findByDateOrStars);
api.get('/findAll', hotelController.findAll);



module.exports = api;