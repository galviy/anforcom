import {db} from './connect'


export class TeamRepository{
    private folder_upload:string = "../../../../data_ktm";


    async upload_ktm(nama_lengkap:string,asal_instansi:string,user_id:Number,tim_id:Number,nomor_induk:string,filecoy:File){
         const conn = await db.getConnection();
         try {
            await conn.beginTransaction();

            const rows = await conn.query(`SELECT COUNT(*) as jumlah FROM isi_tim WHERE tim_id = ? AND id = ?`, [tim_id, user_id]);
            console.log(rows[0].jumlah)
            if (rows[0].jumlah >= 3){
                 await conn.rollback();
                 return { success: false, message: `Tim kamu sudah memiliki ${rows[0].jumlah} anggota, kamu tidak bisa create_member lagi.` }; 
            }
         } catch(e){

            console.error(e);
            await conn.rollback();
         } finally {
            conn.release();
        }
        /*
        let nama_lengkap = formdata.get("nama_lengkap");
        let asal_instansi = formdata.get("asal_instansi")
        let tim_id = Number(formdata.get("tim_id"));
        let nomor_induk = formdata.get("nomor_induk");
        */

    }
    async findByUsername(username: string) {
        const sql = `
            SELECT t.id, t.nama_tim ,t.isVerified
            FROM tim t
            JOIN user_tim ut ON t.id = ut.tim_id
            JOIN user u ON ut.user_id = u.id
            WHERE u.username = ?
        `;
        return await db.query(sql, [username]);
    }

    

    async deleteUserTeam(idTeam:number,idUser:number){
        const sql = `
            DELETE from
            isi_tim 
            where id = ? and tim_id = ?
        `
        return await db.query(sql,[idUser,idTeam])
    }
    async deleteTeam(IdTeam: number) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            await conn.query(`DELETE from user_tim where tim_id = ?`, [IdTeam]);
            await conn.query(`DELETE FROM isi_tim WHERE tim_id = ?`, [IdTeam]);
            const result = await conn.query(`DELETE FROM tim WHERE id = ?`, [IdTeam]);
            
            await conn.commit();
            return result;
        } catch (e) {
            console.error(e);
            await conn.rollback();
            throw e; 
        } finally {
            conn.release(); 
        }
    }   
    async timIdCheck(Iduser:number,Idteam:number){
       
        const sql = `
            select tim_id 
            from user_tim
            where user_id = ? and tim_id = ? 
        `;
        return await db.query(sql,[Iduser,Idteam]);
    }

    async isiTimCheck(Idteam:number){
        const sql = `
            select * 
            from isi_tim
            where tim_id = ?
        `;
        return await db.query(sql,[Idteam]);

    }
}

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
        return await db.query("select * from user where no_tlp = ?", [phone_number]);
    }

    async create_account(user: string, pass: string, email: string, no_telp: string, pendidikan: number) {
        try {

            const hashedPassword = await Bun.password.hash(pass, {
                algorithm: "bcrypt",
                cost: 10,
            });

            const sql = `
                INSERT INTO user (username, password, email, no_tlp, tingkat_pendidikan_id,role_user) 
                VALUES (?, ?, ?, ?, ?,?)
            `;
            
            return await db.query(sql, [user, hashedPassword, email, no_telp, pendidikan,1]);

        } catch (error) {
            console.error("Gagal membuat akun:", error);
            throw error;
        }
    }

    async createTeam(pendidikan_id: number, userId: string, nama_tim: string, timLomba: string) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            await conn.query("SELECT id FROM user WHERE id = ? FOR UPDATE", [userId]);

            switch (pendidikan_id) {
            case 1: {
                const rows = await conn.query('SELECT COUNT(*) AS jumlah FROM user_tim WHERE user_id = ?', [userId]);
                    if (Number(rows[0].jumlah) >= 1) {
                        await conn.rollback();
                        return { error: true, message: `Kamu sudah punya tim, untuk saat ini hanya tersedia 1 perlombaan untuk kategori sarjana, maka kamu tidak diizinkan untuk membuat tim baru lagi!.` };
                    }
                const result = await conn.query(
                    'INSERT INTO tim (nama_tim, tim_lomba, isVerified) VALUES (?, ?, false)',
                    [nama_tim, timLomba]
                );
                await conn.query(
                    'INSERT INTO user_tim (tim_id, user_id) VALUES (?, ?)',
                    [result.insertId, userId]
                );
                await conn.commit();
                return { error: false, message: `successfully created a team, team id ${result.insertId}` };
            }

            case 2: {
                const rows = await conn.query('SELECT COUNT(*) AS jumlah FROM user_tim WHERE user_id = ?', [userId]);
                if (Number(rows[0].jumlah) >= 1) {
                    await conn.rollback();
                    return { error: true, message: `Kamu sudah punya tim, untuk saat ini hanya tersedia 2 jenis perlombaan untuk kategori SMA/Sederajat, maka kamu tidak diizinkan untuk membuat tim baru lagi!.` };
                }
                const result = await conn.query(
                    'INSERT INTO tim (nama_tim, tim_lomba, isVerified) VALUES (?, ?, false)',
                    [nama_tim, timLomba]
                );
                await conn.query(
                    'INSERT INTO user_tim (tim_id, user_id) VALUES (?, ?)',
                    [result.insertId, userId]
                );
                await conn.commit();
                return { error: false, message: `successfully created a team, team id ${result.insertId}` };
            }

            default:
                await conn.rollback();
                return { error: true, message: 'Kategori pendidikan tidak valid.' };
            }
        } catch (e) {
            await conn.rollback();
            console.error("Gagal input tim", e);
            throw e;
        } finally {
            conn.release();
        }
    }
}
export class auth{
    async findEmail(email:string){
        return await db.query("select * from user where email = ?", [email]);
    }
    
}



