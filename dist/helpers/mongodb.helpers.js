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
const settings_1 = __importDefault(require("../settings"));
const mongodb_1 = require("mongodb");
class MongoDBHelper {
    constructor(isAuth = false) {
        if (isAuth) {
            this.dbUri = `mongodb://${settings_1.default.mongodb.userName}:${settings_1.default.mongodb.password}@${settings_1.default.mongodb.host}:${settings_1.default.mongodb.port}`;
        }
        else {
            this.dbUri = `mongodb://${settings_1.default.mongodb.host}:${settings_1.default.mongodb.port}`;
        }
    }
    ;
    static getInstance(isAuth = false) {
        return this._instance || (this._instance = new this(isAuth));
    }
    connect(dataBase, options = { useNewUrlParser: true, useUnifiedTopology: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_1.MongoClient.connect(this.dbUri, options)
                .then((cnn) => {
                return { status: 'success', cnn: cnn, err: null, msg: 'Conexión MongoDB funcional' };
            })
                .catch((err) => {
                return { status: 'error', cnn: null, err: err, msg: 'Error al intentar establecer conexión con MongoDB' };
            });
            console.log('El resultado es: ', result);
            this.statusCnn = result.status;
            if (result.status == 'success') {
                console.log(`Servidor de MongoDB corriendo en puerto ${settings_1.default.api.port}`);
                this.cnn = result.cnn;
                this.db = this.cnn.db(dataBase);
            }
            else {
                this.cnn = null;
                this.db = null;
            }
        });
    }
    setDataBase(dataBase) {
        this.db = this.cnn.db(dataBase);
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cnn.close();
        });
    }
}
exports.default = MongoDBHelper;
