import{Router, Request, Response, NextFunction}from 'express';
import settings from '../settings'
import MongoDBHelper from '../helpers/mongodb.helpers'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const api = Router();
const mongo = MongoDBHelper.getInstance();

api.get('/test', (req: Request, res: Response, next: NextFunction)=>{
    res.status(200).json({
        status: "success",
        code: 200,
        enviroment: settings.api.enviroment,
        msg: 'API Auth Works111!!'
    })
    

});

api.post('/login',async(req: Request, res: Response, next: NextFunction)=>{

    const{email,password}=req.body;
    mongo.setDataBase('dbromanis');

    const user : any = await mongo.db.collection('usuarios').findOne({email})
    .then((result: any)=>{
        return{
            status: 'success',
            data: result
        }
    })
    .catch((err : any)=>{
        return{
            status: 'err',
            data: err
        }
    });

 
    //Valida si encontro usuario
    if(user.status=='success' && user.data != null){
        //Se comprueba contrasena
        if(bcrypt.compareSync(password,user.data.password)){
          res.status(200).json({
            token: jwt.sign(user,'roma'),
            status: "success",
            code: 200,
            enviroment: settings.api.enviroment,
            msg: 'Inicio de sesión exitoso',
            info: user.data
        })  
        }else{
            res.status(401).json({
                status: "No encontrado",
                code: 401,
                enviroment: settings.api.enviroment,
                msg: 'Usuario o contrasena incorrectos'
            })
        }
        
    }else{
        res.status(401).json({
            status: "No autorizado",
            code: 401,
            enviroment: settings.api.enviroment,
            msg: 'Usuario o contrasena incorrectos'
        })
    }

});


export default api;