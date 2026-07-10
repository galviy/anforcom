import {db} from './connect'
import path from 'path'; 

export class TeamRepository{
    private folder_upload: string = path.join(import.meta.dir, "../../data_ktm");

   async check_file_sesuai(idUser: number, nama_file: string) {
        const conn = await db.getConnection();
        try {
            const sql = await conn.query(
                `SELECT ut.user_id 
                FROM isi_tim it
                JOIN user_tim ut ON it.tim_id = ut.tim_id
                WHERE it.data_image = ?`, 
                [nama_file]
            );
            if (sql.length == 0) {
                return { success: false, message: 'not found' }; 
            }

            if (Number(idUser) !== Number(sql[0].user_id)) {
                return { success: false, message: 'pentester kah bang?' };
            }
            
            return { success: true };  
        } catch (e) {
            console.error(e);
            return { success: false, message: 'terjadi kesalahan, coba lagi' };
        } finally {
           
            conn.release();
        }
    }

    async cek_dummy_user(token: string) {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();

            const rows = await conn.query(
                `SELECT * FROM dummy_user WHERE token_verifikasi = ? FOR UPDATE`,
                [token]
            );

            if (rows.length === 0) {
                await conn.rollback();
                return {
                    success: false,
                    message: "Token verifikasi tidak valid."
                };
            }

            const dummy = rows[0];

            const createdAt = new Date(dummy.date_register);
            const now = new Date();

            const diffMs = now.getTime() - createdAt.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);

            if (diffHours > 24) {
                await conn.rollback();
                return {
                    success: false,
                    message: "Token verifikasi sudah kedaluwarsa."
                };
            }

            const emailCheck  = await conn.query(
                `SELECT COUNT(*) AS total FROM user WHERE email = ?`,
                [dummy.email]
            );

            if (emailCheck[0].total > 0) {
                await conn.rollback();
                return {
                    success: false,
                    message: `${dummy.email} sudah terdaftar mungkin bisa cek email anda :) ??`
                };
            }

            await conn.query(
                `
                INSERT INTO user
                (
                    username,
                    password,
                    email,
                    no_tlp,
                    tingkat_pendidikan_id,
                    role_user
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [dummy.username,dummy.password,dummy.email,dummy.no_tlp,dummy.tingkat_pendidikan_id,dummy.role_user]
            );

            await conn.query(
                `DELETE FROM dummy_user WHERE id = ?`,
                [dummy.id]
            );

            await conn.commit();

            return {
                success: true,
                message: `Successfully created the account, please login using your email ${dummy.email} and password.`
            };

        } catch (e) {
            await conn.rollback();
            console.error(e);
            throw e;
        } finally {
            conn.release();
        }
    }


    async upload_ktm_file(filecoy: File, nama_ktm: string) {
        try {
            const filePath = path.join(this.folder_upload, nama_ktm);
            await Bun.write(filePath, filecoy);
            //console.log("Saved to:", filePath);
            return filePath;
        } catch (e) {
            console.error(e);
            throw e; 
        }
    }
    
    async upload_ktm(nama_lengkap: string, asal_instansi: string, user_id: number, tim_id: number, nomor_induk: string, filecoy: File,nama_ktm:string) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const sql1 = await conn.query(
                `SELECT COUNT(*) as jumlah FROM isi_tim WHERE tim_id = ? FOR UPDATE`,
                [tim_id]
            );

            if (sql1[0].jumlah >= 3) {
                await conn.rollback();
                return { success: false, message: `Tim kamu sudah memiliki ${sql1[0].jumlah} anggota, kamu tidak bisa create_member lagi.` };
            }
            await this.upload_ktm_file(filecoy,nama_ktm)
            //console.log(nama_ktm)
            const sql2 = await conn.query(
                `INSERT INTO isi_tim (nama_lengkap, asal_instansi, tim_id, nomor_induk,data_image) VALUES (?, ?, ?, ?, ?)`,
                [nama_lengkap, asal_instansi, tim_id, nomor_induk,nama_ktm]
            );

            await conn.commit();
            return { success: true, message: `successfully created a team member, id ${sql2.insertId}` };

        } catch (e) {
            console.error(e);
            await conn.rollback();
            return { success: false, message: 'terjadi kesalahan, coba lagi' };
        } finally {
            conn.release();
        }
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
        const result = await db.query(sql,[idUser,idTeam]);

        return result;
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

    async create_dummy_user(user: string,pass: string,email: string,no_telp: string,pendidikan: number,token_verif: string) {
        try {
            const hashedPassword = await Bun.password.hash(pass, {
                algorithm: "bcrypt",
                cost: 10,
            });

            const sql = `
                INSERT INTO dummy_user (
                    username,
                    password,
                    email,
                    no_tlp,
                    tingkat_pendidikan_id,
                    role_user,
                    token_verifikasi
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            return await db.query(sql, [
                user,
                hashedPassword,
                email,
                no_telp,
                pendidikan,
                1,              
                token_verif      
            ]);
        } catch (e) {
            console.error("Gagal membuat akun dummy:", e);
            throw e;
        }
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
    async updatePassword(userId: number, hashedPassword: string) {
        const result = await db.query(
            `UPDATE user 
            SET password = ? 
            WHERE id = ?;`,
            [hashedPassword, userId]
        );
        return result;
       
    }

    async createTeam(pendidikan_id: number, userId: string, nama_tim: string, timLomba: string) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            await conn.query("SELECT id FROM user WHERE id = ? FOR UPDATE", [userId]);

            switch (pendidikan_id) {
            case 1: {
                const rows = await conn.query('select count(*) as jumlah from user_tim ut join tim t on ut.tim_id = t.id  where user_id = ? and tim_lomba = ?', [userId,timLomba]);
                    if (Number(rows[0].jumlah) >= 1) {
                        await conn.rollback();
                        return { error: true, message: `Kamu sebelumnya sudah memiliki tim dengan kategori lomba tersebut!.` };
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
                const rows = await conn.query('select count(*) as jumlah from user_tim ut join tim t on ut.tim_id = t.id  where user_id = ? and tim_lomba = ?', [userId,timLomba]);
                if (Number(rows[0].jumlah) >= 1) {
                    await conn.rollback();
                    return { error: true, message: `Kamu sebelumnya sudah memiliki tim dengan kategori lomba tersebut!` };
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



