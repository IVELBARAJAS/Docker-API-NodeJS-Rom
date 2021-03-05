"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settings_1 = __importDefault(require("../settings"));
const mongodb_helpers_1 = __importDefault(require("../helpers/mongodb.helpers"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api = express_1.Router();
const mongo = mongodb_helpers_1.default.getInstance();
api.get('/test', (req, res, next) => {
    res.status(200).json({
        status: "success",
        code: 200,
        enviroment: settings_1.default.api.enviroment,
        msg: 'API Auth Works111!!'
    });
});
//Login usuario
api.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    mongo.setDataBase('dbromanis');
    const user = yield mongo.db.collection('usuarios').findOne({ email })
        .then((result) => {
        return {
            status: 'success',
            data: result
        };
    })
        .catch((err) => {
        return {
            status: 'err',
            data: err
        };
    });
    //Valida si encontro usuario
    if (user.status == 'success' && user.data != null) {
        //Se comprueba contrasena
        if (bcryptjs_1.default.compareSync(password, user.data.password)) {
            res.status(200).json({
                token: jsonwebtoken_1.default.sign(user, 'roma'),
                status: "success",
                code: 200,
                enviroment: settings_1.default.api.enviroment,
                msg: 'Inicio de sesión exitoso',
                _id: user.data._id,
                nombre: user.data.nombre,
                apellido: user.data.apellido,
                email: user.data.email,
                direccion: user.data.direccion,
                tarjeta: user.data.tarjeta,
                saldo: user.data.saldo,
                rol: 'Usuario',
                info: user.data
            });
        }
        else {
            res.status(401).json({
                status: "No encontrado",
                code: 401,
                enviroment: settings_1.default.api.enviroment,
                msg: 'Usuario o contrasena incorrectos'
            });
        }
    }
    else {
        res.status(401).json({
            status: "No autorizado",
            code: 401,
            enviroment: settings_1.default.api.enviroment,
            msg: 'Usuario o contrasena incorrectos'
        });
    }
}));
//Login de empleado
api.post('/login/empleado', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    mongo.setDataBase('dbromanis');
    const user = yield mongo.db.collection('empleados').findOne({ email })
        .then((result) => {
        return {
            status: 'success',
            data: result
        };
    })
        .catch((err) => {
        return {
            status: 'err',
            data: err
        };
    });
    //Valida si encontro usuario
    if (user.status == 'success' && user.data != null) {
        //Se comprueba contrasena
        if (bcryptjs_1.default.compareSync(password, user.data.password)) {
            res.status(200).json({
                token: jsonwebtoken_1.default.sign(user, 'roma'),
                status: "success",
                code: 200,
                enviroment: settings_1.default.api.enviroment,
                msg: 'Inicio de sesión exitoso',
                _id: user.data._id,
                nombre: user.data.nombre,
                apellido: user.data.apellido,
                email: user.data.email,
                rol: user.data.rol,
                turno: user.data.turno
            });
        }
        else {
            res.status(401).json({
                status: "No encontrado",
                code: 401,
                enviroment: settings_1.default.api.enviroment,
                msg: 'Usuario o contrasena incorrectos'
            });
        }
    }
    else {
        res.status(401).json({
            status: "No autorizado",
            code: 401,
            enviroment: settings_1.default.api.enviroment,
            msg: 'Usuario o contrasena incorrectos'
        });
    }
}));
exports.default = api;
