import settings from '../settings';
import {MongoClient, MongoClientOptions} from 'mongodb';

export default class MongoDBHelper{

    public db: any;
    public statusCnn: string;

    private static _instance: MongoDBHelper;
    private cnn: any;
    private dbUri: string;

    constructor(isAuth: boolean=true){
        if(isAuth){
            this.dbUri= `mongodb://${settings.mongodb.userName}:${settings.mongodb.password}@${settings.mongodb.host}:${settings.mongodb.port}`
        }else{
            this.dbUri= `mongodb://${settings.mongodb.host}:${settings.mongodb.port}`
        }
    };

    public static getInstance(isAuth: boolean=true){
        return this._instance || (this._instance=new this(isAuth));
    }

    public async connect(dataBase: string,options:MongoClientOptions ={useNewUrlParser: true, useUnifiedTopology:true} ){
        const result = await MongoClient.connect(this.dbUri,options)
        .then((cnn: any)=>{
            return {status: 'success',cnn:cnn,err:null,msg:'Conexión MongoDB funcional'};
        })
        .catch((err:any)=>{
            return {status: 'error',cnn:null,err:err, msg:'Error al intentar establecer conexión con MongoDB'};
        });

        console.log('El resultado es: ',result);
        this.statusCnn = result.status;

        if(result.status == 'success'){
            console.log(`Servidor de MongoDB corriendo en puerto ${settings.api.port}`);
            this.cnn=result.cnn;
            this.db = this.cnn.db(dataBase);
        }else{
            this.cnn=null;
            this.db = null;
        }

    }
    

    public setDataBase(dataBase:string){
        this.db = this.cnn.db(dataBase)
    }

    public async disconnect(){
        this.cnn.close();
    }

}