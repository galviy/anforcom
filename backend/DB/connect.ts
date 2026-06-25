
import mariadb, { type PoolConnection } from 'mariadb';

export class Connect {
    private username: string
    private password: string
    private ip: string;
    private port: number;
    private conn: PoolConnection | null; 

    constructor(ip:string,port:number){
        this.username = Bun.env.DB_Username || '';
        this.password = Bun.env.DB_Password || '';
        this.ip = ip;
        this.port = port;
        this.conn = null;
   }

    public async connect(){
        const pool = mariadb.createPool({
            host: '',
            user: 'root',
            password: 'password',
            database: 'test',
            connectionLimit: 10
        })
    }
    
}