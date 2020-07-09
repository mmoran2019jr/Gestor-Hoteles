'use strict'

var User = require('../models/user.model');
var Hotel = require('../models/hotel.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function saveHotel(req, res){
    var hotel = new Hotel();
    var params = req.body;

    if( params.name &&
        params.cuh &&
        params.password){
            Hotel.findOne({$or:[{'data.name': params.name}, {'cuh': params.cuh}]}, (err, hotelFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general, intentelo mas tarde'})
                }else if(hotelFind){
                    res.send({message: 'Nombre o CUH ya utilizado'});
                }else{
                    hotel.data.name = params.name;
                    hotel.cuh = params.cuh;

                    bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                        if(err){
                            res.status(500).send({message: 'Error al encriptar contraseña'});
                        }else if(passwordHash){
                            hotel.password = passwordHash;

                            hotel.save((err, hotelSaved)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general al guardar Hotel'});
                                }else if(hotelSaved){
                                    res.send({message: 'Hotel creado', hotel: hotelSaved});
                                }else{
                                    res.status(404).send({message: 'Hotel no guardado'});
                                }
                            });
                        }else{
                            res.status(418).send({message: 'Error inesperado'});
                        }
                    });
                }
            });
    }else{
        res.send({message: 'Ingresa todos los datos'});
    }
}

function login(req, res){
    var params = req.body;

    if(params.cuh && params.password){
            Hotel.findOne({cuh: params.cuh}, (err, check)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(check){
                        bcrypt.compare(params.password, check.password, (err, passworOk)=>{
                            if(err){
                                res.status(500).send({message: 'Error al comparar'});
                            }else if(passworOk){
                                if(params.gettoken = true){
                                    res.send({token: jwt.createTokenHotel(check)});
                                }else{
                                    res.send({message: 'Bienvenido',hotel:check});
                                }
                            }else{
                                res.send({message: 'Contraseña incorrecta'});
                            }
                        });
                    }else{
                        res.send({message: 'Datos de usuario incorrectos'});
                    }
                });
        
    }else{
        res.send({message: 'Ingresa los datos de autenticación'});
    }
}

function updateHotel(req, res){
    var hotelId = req.params.id;
    var update = req.body;

    if(hotelId != req.hotel.sub){
        res.status(403).send({message: 'Error de permisos, Hotel no logeado'});
    }else{
        Hotel.findByIdAndUpdate(hotelId, update, {new: true}, (err, hotelUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error general al actualizar', err});
            }else if(hotelUpdated){
                res.send({hotel: hotelUpdated});
            }else{
                res.status(404).send({message: 'No se ha podido actualizar'});
            }
        });
    }
}

function removeHotel(req, res){
    //Esperar la contraseña para ver si coinciden y así poder eliminarlo con seguridad
    var hotelId = req.params.id;
    if(hotelId != req.hotel.sub){
        res.status(403).send({message: 'Error de permisos, Hotel no logeado'});
    }else{
        Hotel.findByIdAndRemove(hotelId, (err, hotelRemoved)=>{
            if(err){
                res.status(500).send({message: 'Error general al eliminar'});
            }else if(hotelRemoved){
                res.send({message: 'El siguiente hotel ha sido eliminado: ',hotel: hotelRemoved});
            }else{
                res.status(404).send({message: 'No se ha podido eliminar, intente mas tarde'});
            }
        });
    }
}

function findByDateOrStars(req, res){
    var params = req.body;

    if(params){
        if(params.orderByPrice == 'menor'){
            Hotel.find({$or:[{ 'data.date.ini': { $gte: params.start, $lte: params.end} },{ 'data.date.fin': { $gte: params.start, $lte: params.end} }, {'data.stars': params.search}]}, (err, hotelFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general al buscar', err});
                }else if(hotelFind){
                    var dataHotels =[];
                    for(var i = 0; i< hotelFind.length; i++){
                        dataHotels.push(hotelFind[i].data);
                    }
                    res.send({hotels: dataHotels});
                }else{
                    res.status(404).send({message: 'No se ha podido buscar, intente mas tarde'});
                }
            }).sort({'data.price': 1});
        }else if(params.orderByPrice == 'mayor'){
            Hotel.find({$or:[{ 'data.date.ini': { $gte: params.start, $lte: params.end} },{ 'data.date.fin': { $gte: params.start, $lte: params.end} }, {'data.stars': params.search}]}, (err, hotelFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general al buscar', err});
                }else if(hotelFind){
                    var dataHotels =[];
                    for(var i = 0; i< hotelFind.length; i++){
                        dataHotels.push(hotelFind[i].data);
                    }
                    res.send({hotels: dataHotels});
                }else{
                    res.status(404).send({message: 'No se ha podido buscar, intente mas tarde'});
                }
            }).sort({'data.price': -1});
        }else{
            Hotel.find({$or:[{ 'data.date.ini': { $gte: params.start, $lte: params.end} },{ 'data.date.fin': { $gte: params.start, $lte: params.end} }, {'data.stars': params.search}]}, (err, hotelFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general al buscar', err});
                }else if(hotelFind){
                    var dataHotels =[];
                    for(var i = 0; i< hotelFind.length; i++){
                        dataHotels.push(hotelFind[i].data);
                    }
                    res.send({hotels: dataHotels});
                }else{
                    res.status(404).send({message: 'No se ha podido buscar, intente mas tarde'});
                }
            }).sort({'data.name': 1});
        }
        
    }else{
        res.status(200).send({message: 'Ingresa datos en el campo de búsqueda'});
    }
    
}

/*
function busquedaPorFechas(req, res) {
    var params = req.body;

    Hotel.find(
        { 'date.ini': { $gte: params.start, $lte: params.end } },
        (err, founds) => {
            if (err) {
                res.status(500).send({ message: "Error del servidor" });
            } else if (founds) {
                res.send({ message: founds });
            } else {
                res.status(404).send({ message: "Sin hoteles que mostrar" });
            }
        }
    );
}
*/
function findAll(req, res){
    Hotel.find({}, (err, response)=>{
        if (err) {
            res.status(500).send({ message: "Error del servidor" });
        } else if (response) {
            res.send({ message: response });
        } else {
            res.status(404).send({ message: "Sin hoteles que mostrar" });
        }
    })
}

module.exports = {
    saveHotel,
    login, 
    updateHotel,
    removeHotel,
    findByDateOrStars,
    findAll
}