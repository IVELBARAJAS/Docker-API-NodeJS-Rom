import express, { Request, response, Response } from 'express';
import settings from './settings';
import apiEmpl from './routes/empleados.route';
import apiUsua from './routes/usuarios.route';
import apiAuth from './routes/auth.route';
import MongoDBHelper from './helpers/mongodb.helpers';
import fileUpload from 'express-fileupload';
import cors from 'cors';

//MongoDB connnect
const mongo = MongoDBHelper.getInstance(false);

//Express App
const app = express();

//Serializacion en formato JSON
app.use(express.json());

//Express File Upload
app.use(fileUpload({
    limits: {fileSize: 50 * 1024 * 1024}
}));

//Habilita CORS para consumir API 
app.use(cors({origin: true, credentials: true}));

//Routes for api
app.use('/empleados', apiEmpl);
app.use('/usuarios', apiUsua);
app.use('/auth', apiAuth);

//Start Servers
const startServers = async () => {
    //Connect to MongoDB
    await mongo.connect('dbromanis');

    if(mongo.statusCnn=='success'){
        //Listen Express Server
        app.listen(settings.api.port, () => {
            console.log(`Servidor express corriendo en puerto ${settings.api.port}`);
        });

    }else{
        console.log('No se puede arrancar express hasta conectar con BD')
    }

};

//Excecute startServers function
startServers();