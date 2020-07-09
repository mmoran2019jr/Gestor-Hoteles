'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

api.post('/saveUser', userController.saveUser);
api.post('/login', userController.login);
api.put('/updateUser/:id', mdAuth.ensureAuth, userController.updateUser);
api.delete('/removeUser/:id', mdAuth.ensureAuth, userController.removeUser);

module.exports = api;