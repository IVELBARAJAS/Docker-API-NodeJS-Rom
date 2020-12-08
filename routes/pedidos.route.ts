import{NextFunction, Request, Response, Router} from 'express';
import MongoDBHelper from '../helpers/mongodb.helpers';

const api= Router();
const mongo = MongoDBHelper.getInstance();

//Registro de pedido
api.post('/add',async(req: Request,res:Response,next:NextFunction)=>{

    const{codigo,user,productos,total,fecha,hora,estatus,comentarios}=req.body;

    mongo.setDataBase('dbromanis')

    const result = await mongo.db.collection('pedidos').insertOne({
        codigo,user,productos,total,fecha,hora,estatus,comentarios
    })
    .then((result: any) =>{
        return{
            uid: result.insertedId,
            rowsAffected: result.insertedCount
        }
    })
    .catch((err:any)=>{
        return err;
    });

    res.status(201).json({
        uid: result.uid,
        codigo,
        user,
        productos,
        total,
        fecha,
        hora,
        estatus,
        comentarios,
        rowsAffected : result.rowsAffected
    });
});


export default api;