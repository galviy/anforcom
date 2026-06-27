
import mariadb, { type Pool,type PoolConnection } from 'mariadb';

export class Connect {
    private username: string
    private password: string
    private ip: string;
    private port: number;
    private db:string;
    private conn: PoolConnection | null; 
    private pool: Pool;

    constructor(ip:string,port:number,db:string){
        this.username = Bun.env.DB_Username || '';
        this.password = Bun.env.DB_Password || '';
        this.ip = ip;
        this.port = port;
        this.conn = null;
        this.db = db;
        this.pool = mariadb.createPool({
            host: this.ip,
            port: this.port,
            user: this.username,
            password: this.password,
            database: this.db,
            connectionLimit: 10
        })
        //console.log(this.username)
        //console.log(this.password)
   }

    public async connect(){
        try {
            this.conn = await this.pool.getConnection()
            console.log(`Connected to MariaDB\nThread ID: ${this.conn.threadId}`);
            this.conn.release()
        } catch (e){
            console.error(e)
        }
    }
    public async query(sql:string,params?: any[]){
        return await this.pool.query(sql,params);
    }
    
}
export const db = new Connect('localhost', 3306, 'anforcom_dummy')