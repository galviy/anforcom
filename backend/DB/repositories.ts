import {db} from './connect'


export class UserRepository{
    async findByUsername(username: string) {
        return await db.query("SELECT * FROM user WHERE username = ?", [username])
    }
     async findEmail(email:string){
        return await db.query("select * from user where email = ?", [email]);
    }
     async findUsername(username:string){
        return await db.query("select * from user where username = ?", [username]);
    }
    async findPhoneNumber(phone_number:string){
        return await db.query("select * from user where email = ?", [phone_number]);
    }
    async create_account(user: string, pass: string, email: string, no_telp: string, pendidikan: number) {
    try {

        const hashedPassword = await Bun.password.hash(pass, {
            algorithm: "bcrypt",
            cost: 10,
        });

        const sql = `
            INSERT INTO user (username, password, email, no_tlp, tingkat_pendidikan_id) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        return await db.query(sql, [user, hashedPassword, email, no_telp, pendidikan]);

    } catch (error) {
        console.error("Gagal membuat akun:", error);
        throw error;
    }
}
}
export class auth{
    async findEmail(email:string){
        return await db.query("select * from user where email = ?", [email]);
    }
    
}



