'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function saveUser(req, res){
    var user = new User();
    var params = req.body;

    if( params.name &&
        params.username &&
        params.email &&
        params.password){
            User.findOne({$or:[{username: params.username}, {email: params.email}]}, (err, userFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general, intentelo mas tarde'})
                }else if(userFind){
                    res.send({message: 'usuario o correo ya utilizado'});
                }else{
                    user.name = params.name;
                    user.username = params.username;
                    user.email = params.email;
                    user.role = 'USER';

                    bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                        if(err){
                            res.status(500).send({message: 'Error al encriptar contraseña'});
                        }else if(passwordHash){
                            user.password = passwordHash;

                            user.save((err, userSaved)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general al guardar usuario'});
                                }else if(userSaved){
                                    res.send({user: userSaved});
                                }else{
                                    res.status(404).send({message: 'Usuario no guardado'});
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

    if(params.username || params.email){
        if(params.password){
            User.findOne({$or:[{username: params.username}, 
                {email: params.email}]}, (err, check)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(check){
                        bcrypt.compare(params.password, check.password, (err, passworOk)=>{
                            if(err){
                                res.status(500).send({message: 'Error al comparar'});
                            }else if(passworOk){
                                if(params.gettoken == 'true'){
                                    res.send({token: jwt.createToken(check), user: check.name});
                                }else{
                                    res.send({message: 'Error en el servidor al generar autenticación'});
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
           res.send({message: 'Ingresa tu contraseña'}); 
        }
    }else{
        res.send({message: 'Ingresa tu correo o tu username'});
    }
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos, usuario no logeado'});
    }else{
        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error general al actualizar'});
            }else if(userUpdated){
                res.send({user: userUpdated});
            }else{
                res.status(404).send({message: 'No se ha podido actualizar'});
            }
        });
    }
}

function removeUser(req, res){
    var userId = req.params.id;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos, usuario no logeado'});
    }else{
        User.findByIdAndRemove(userId, (err, userRemoved)=>{
            if(err){
                res.status(500).send({message: 'Error general al actualizar'});
            }else if(userRemoved){
                res.send({message: 'Se ha eliminado al siguiente usuario: ',user: userRemoved});
            }else{
                res.status(404).send({message: 'No se ha podido eliminar'});
            }
        });
    }
}
module.exports = {
    saveUser,
    login,
    updateUser,
    removeUser
}