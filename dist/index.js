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
const express_1 = __importDefault(require("express"));
const settings_1 = __importDefault(require("./settings"));
const empleados_route_1 = __importDefault(require("./routes/empleados.route"));
const usuarios_route_1 = __importDefault(require("./routes/usuarios.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const pedidos_route_1 = __importDefault(require("./routes/pedidos.route"));
const mongodb_helpers_1 = __importDefault(require("./helpers/mongodb.helpers"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
//MongoDB connnect
const mongo = mongodb_helpers_1.default.getInstance(false);
//Express App
const app = express_1.default();
//Serializacion en formato JSON
app.use(express_1.default.json());
//Express File Upload
app.use(express_fileupload_1.default({
    limits: { fileSize: 50 * 1024 * 1024 }
}));
//Habilita CORS para consumir API 
app.use(cors_1.default({ origin: true, credentials: true }));
//Routes for api
app.use('/empleados', empleados_route_1.default);
app.use('/usuarios', usuarios_route_1.default);
app.use('/auth', auth_route_1.default);
app.use('/pedidos', pedidos_route_1.default);
//Start Servers
const startServers = () => __awaiter(void 0, void 0, void 0, function* () {
    //Connect to MongoDB
    yield mongo.connect('dbromanis');
    if (mongo.statusCnn == 'success') {
        //Listen Express Server
        app.listen(settings_1.default.api.port, () => {
            console.log(`Servidor express corriendo en puerto ${settings_1.default.api.port}`);
        });
    }
    else {
        console.log('No se puede arrancar express hasta conectar con BD');
    }
});
//Excecute startServers function
startServers();
