import{NextFunction, Request, Response, Router} from 'express';
import MongoDBHelper from '../helpers/mongodb.helpers'
import settings from '../settings';
import paginate from 'jw-paginate'
import mongoClient  from 'mongodb';
import bcrypt from 'bcryptjs';

const api= Router();
const mongo = MongoDBHelper.getInstance();

//Prueba de API
api.get('',(req:Request, res:Response, next:NextFunction)=>{
    res.status(200).json({
        status: "success",
        code: 200,
        enviroment: settings.api.enviroment,
        msg: 'API User Works!!'
    });

});

//Consulta usuarios por criterio id
api.get('/consultByCriterio/:pageNumber/:pageSize/:criterio',async(req: Request,res:Response,next:NextFunction)=>{
    
    mongo.setDataBase('dbromanis')
    
    //const{criterio}=req.params;
    const{pageNumber, pageSize, criterio}=req.params;
    const skips = parseInt(pageSize)* (parseInt(pageNumber)-1);
    const data: any []=[];
    let result ={
        totalRows: 0,
        data
        ,pager:{}
    }
    const search = new RegExp(criterio, 'mi')
    const count: any = await mongo.db.collection('usuarios').find({apellido: search}).toArray();

    result.totalRows=count.lenght;
    //result.data = await mongo.db.collection('empleados').find(search).toArray();
    result.data = await mongo.db.collection('usuarios').find({apellido: search}).skip(skips).limit(parseInt(pageSize)).toArray();
    
    if(result.data.length != 0 ){
        result.pager = paginate(result.totalRows,parseInt(pageNumber),parseInt(pageSize),5); 
        res.status(200).json({
            status: "success",
            code: 200,
            enviroment: settings.api.enviroment,
            msg: `Se encontraron criterios para ${criterio}`,
            result
        });
    }else{
        res.status(404).json({
            status: "error",
            code: 404,
            enviroment: settings.api.enviroment,
            msg: `No hay resultados para esa busqueda`,
        });
    }
});

//Consulta todos los usuarios
api.get('/consultAll/:pageNumber/:pageSize/',async(req: Request,res:Response,next:NextFunction)=>{
    
    mongo.setDataBase('dbromanis')
    //const{criterio}=req.params;
    const{pageNumber, pageSize}=req.params;
    const skips = parseInt(pageSize)* (parseInt(pageNumber)-1);
    const data: any []=[];
    let result ={
        totalRows: 0,
        data
        ,pager:{}
    }

    const count: any = await mongo.db.collection('usuarios').find().toArray();

    result.totalRows=count.lenght;
    //result.data = await mongo.db.collection('empleados').find(search).toArray();
    result.data = await mongo.db.collection('usuarios').find().skip(skips).limit(parseInt(pageSize)).toArray();
    result.pager = paginate(result.totalRows,parseInt(pageNumber),parseInt(pageSize),5); 

    res.status(200).json({
        status: "success",
        code: 200,
        enviroment: settings.api.enviroment,
        msg: `Se muestran todos los empleados`,
        data: result
    });
});

//Registro de usuario
api.post('/add',async(req: Request,res:Response,next:NextFunction)=>{
    const{nombre,apellido,email,password,direccion,tarjeta,saldo}=req.body;

    mongo.setDataBase('dbromanis')

    var salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    
    const result = await mongo.db.collection('usuarios').insertOne({
        nombre,apellido,email,password:hash,direccion,tarjeta,saldo
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
        nombre,
        apellido,
        email,
        direccion,
        tarjeta,
        saldo,
        rowsAffected : result.rowsAffected
    });
});

//Buscar usuario por id
api.get('/consultById/:uid',async(req: Request,res:Response,next:NextFunction)=>{
    
    const{uid}=req.params;
    const _id = new mongoClient.ObjectID(uid);

    mongo.setDataBase('dbromanis')
    const result = await mongo.db.collection('usuarios').findOne({_id});

    if(result != null){
        res.status(200).json({
            /*status: "success",
            code: 200,
            enviroment: settings.api.enviroment,
            msg: `Se encontro el correo ${email}`,*/
            result
        });
    }else{
        res.status(404).json({
            status: "error",
            code: 404,
            enviroment: settings.api.enviroment,
            msg: `No hay resultados para esa busqueda`,
        });
    }
});

//Borrar usuario por ID
api.delete('/delete/:uid',async(req: Request,res:Response,next:NextFunction)=>{
    const{uid}=req.params;
    const _id = new mongoClient.ObjectID(uid);

    mongo.setDataBase('dbromanis')
    const result = await mongo.db.collection('usuarios').deleteOne({_id});

    if(result.deletedCount == 1){
        res.status(200).json({
            status: "success",
            code: 200,
            enviroment: settings.api.enviroment,
            msg: 'Se borro el registro',
            result
        });
    }else{
        res.status(404).json({
            status: "Error",
            code: 404,
            enviroment: settings.api.enviroment,
            msg: 'No existe el ID',
        });
    }
    
});

//Modificar usuario por ID
api.put('/modify/:uid',async(req: Request,res:Response,next:NextFunction)=>{

    const{uid}=req.params;
    const{direccion,tarjeta}=req.body;
    const _id = new mongoClient.ObjectID(uid);

    mongo.setDataBase('dbromanis')
    const result = await mongo.db.collection('usuarios').findOneAndUpdate({_id},
        {
            $set:{direccion,tarjeta}
        });
        console.log(result)

        if(result.value != null ){
            res.status(200).json({
                status: "success",
                code: 200,
                enviroment: settings.api.enviroment,
                msg: `Se actulizaron los campos de ${uid}`,
                result
            });
        }else{
            res.status(404).json({
                status: "Error",
                code: 404,
                enviroment: settings.api.enviroment,
                msg: `No se pudo actualizar el ${uid}, revise los datos`,
                result
            });
        }
});


/*api.post('/upload',async(req:Request,res:Response,next:NextFunction)=>{

    console.log('Los arhicvos cargados son: ', req.files);
    mongo.setDataBase('dbromanis')
    var file_name = 'NO SUBIDO...';

    if (req.files) {
        var file_path = req.files.image.tempFilePath;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
 
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        //console.log(file_path);
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
 
        const result = await mongo.db.collection('fotos').insertOne({file_name });
                if (result == null) 
                {
                    res.status(404).send({ message: 'NO SE HA PODIDO ACTUALIZAR LA IMAGEN' });
                } else {
                    res.status(200).send({ image: file_name});
                }
                }else {
                    res.status(200).send({ message: 'EXTENSION DEL ARCHIVO NO VALIDO' });
                }
    }else {
        res.status(200).send({ message: 'NO HAS SUBIDO NINGUNA IMAGEN' });
    }
});*/

export default api;