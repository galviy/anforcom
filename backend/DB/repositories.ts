import {db} from './connect'
import path from 'path'; 
import crypto from "node:crypto";
import { unlink } from 'node:fs/promises';


export class TeamRepository{
    private folder_upload: string = path.join(import.meta.dir, "../../data_ktm");
    private folder_upload_proposal: string= path.join(import.meta.dir, "../../data_proposal");



   async check_file_ktm_sesuai(idUser: number, nama_file: string) {
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
    async check_file_proposal_sesuai(idUser: number, nama_file: string) {
        const conn = await db.getConnection();
        try {
            const sql = await conn.query(
                `select u.user_id as pemilik 
                from user_tim u 
                join data_proposal dp on u.tim_id = dp.id_tim 
                where data_proposal = ?`, 
                [nama_file]
            );
            if (sql.length == 0) {
                return { success: false, message: 'not found' }; 
            }
            //onsole.log(idUser)
            //console.log(sql[0])
            if (Number(idUser) !== Number(sql[0].pemilik)) {
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

            if (diffHours > 1) {
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
    
    async update_ktm_file(tim_id: number,user_id:number,nama_ktm:string,imagebase64:string){
        const MAX_SIZE = 10 * 1024 * 1024; 

        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const sql1 = await conn.query(
                `SELECT COUNT(*) as jumlah FROM isi_tim WHERE tim_id = ? and id = ? FOR UPDATE`,
                [tim_id,user_id]
            );
            if (sql1[0].jumlah == 0) {
                await conn.rollback();
                return { success: false, message: `Theres nothing to change isnt it???` };
            }
           const bytes = Buffer.from(imagebase64, "base64");
            if (bytes.length === 0 || bytes.length > MAX_SIZE) {
                await conn.rollback();
                return { success: false, message: "How do you expect me to accept that file my guy? isnt it way to big or small??" };
            }
           const filewow = new File([bytes],nama_ktm,
            {
                type: "image/jpeg" 
            });

            let upp_ktm = await this.upload_ktm_file(filewow,nama_ktm);
            if (!upp_ktm) {
                await conn.rollback();
                return { success: false, message: "Failed to upload that file to our internal storage" };
            }

            const change_ktm_data = await conn.query(
                `UPDATE isi_tim
                SET data_image = ?
                WHERE tim_id = ? AND id = ?`,
                [nama_ktm, tim_id, user_id]
            );
            if (change_ktm_data.affectedRows !== 1) {
                await conn.rollback();
                return {
                    success: false,
                    error: "Somehow it did not affect anything huh..?"
                };
            }
            await conn.commit();
            return {
                success: true,
                message: "Successfully changed your identity card!"
            };

        } catch(e){
            await conn.rollback();
            console.error(e)
            throw e;
        } finally{
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
    async upload_proposal_file(filecoy:File,nama_proposal:string){
        try {
            const filePath = path.join(this.folder_upload_proposal,nama_proposal)
            await Bun.write(filePath,filecoy);
        } catch (e){
            console.error(e)
            throw e
        }
    }
    async upload_proposal(tim_id: number, filecoy: File,nama_proposal:string) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const sql1 = await conn.query(
                `select count(*) as jumlah from data_proposal where id_tim = ?`
                ,[tim_id]
            );
            if(sql1[0].jumlah != 0){
                await conn.rollback();
                return { success: false, message: `Tim kamu sudah memiliki proposal sebelumnya, delete terlebih dahulu untuk upload proposal terbaru!` };
            }
            await this.upload_proposal_file(filecoy,nama_proposal);
            const sql2 = await conn.query(
                `INSERT INTO data_proposal (id_tim, data_proposal) VALUES (?, ?)`,
                [tim_id,nama_proposal]
            );
            await conn.commit();
            return { success: true, message: `successfully Uploaded prosal` };

        } catch(e){
            console.error(e);
            await conn.rollback();
            return { success: false, message: 'terjadi kesalahan, coba lagi' };
        } finally {
            conn.release();
        }
    }

    // Hapus proposal tim. upload_proposal() di atas menolak upload kalau tim
    // sudah punya proposal (satu tim cuma boleh satu proposal aktif), jadi
    // method ini yang jadi "jalan keluar" biar user bisa upload ulang.
    async deleteProposal(tim_id: number) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const rows = await conn.query(
                `SELECT data_proposal FROM data_proposal WHERE id_tim = ? FOR UPDATE`,
                [tim_id]
            );
            if (rows.length === 0) {
                await conn.rollback();
                return { success: false, message: `Tim ini belum punya proposal` };
            }

            const result = await conn.query(`DELETE FROM data_proposal WHERE id_tim = ?`, [tim_id]);
            if (result.affectedRows !== 1) {
                await conn.rollback();
                return { success: false, message: `Somehow it did not affect anything huh..?` };
            }

            await conn.commit();

            // Best-effort hapus file fisiknya juga. Kalau gagal (mis. file-nya
            // udah kehapus manual sebelumnya), jangan gagalin keseluruhan
            // request -- yang penting record DB-nya udah bersih & bisa upload lagi.
            const filePath = path.join(this.folder_upload_proposal, rows[0].data_proposal);
            try {
                await unlink(filePath);
            } catch (e) {
                console.error('Gagal hapus file proposal fisik:', e);
            }

            return { success: true, message: `Proposal berhasil dihapus` };
        } catch (e) {
            await conn.rollback();
            console.error(e);
            return { success: false, message: 'terjadi kesalahan, coba lagi' };
        } finally {
            conn.release();
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
    async ambil_proposal(idTeam:number){
        const sql = `
            select data_proposal 
            from user_tim u 
            join data_proposal dp on u.tim_id = dp.id_tim 
            where u.tim_id = ?
        `
         return await db.query(sql, [idTeam]);
    }
    async findByUsername(username: string) {
        const sql = `
            SELECT t.id,t.nama_tim, t.isVerified, t.tim_lomba, dp.data_proposal
            FROM tim t
            JOIN user_tim ut ON t.id = ut.tim_id
            JOIN user u ON ut.user_id = u.id
            LEFT JOIN data_proposal dp ON dp.id_tim = t.id
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
    async update_nomor_induk(idTeam:number,idUser:number,noInduk:string){

        const sql = `
            UPDATE isi_tim
            SET nomor_induk = ? 
            WHERE id = ? and tim_id = ?
        `
        
        const result = await db.query(sql, [noInduk,idUser,idTeam])
        if (result.affectedRows !== 1) {
            return {
                success: false,
                error: `Unable to change that data?`
            };
        }
        return {
            success: true,
            message: `Successfully changed nomor_induk to ${noInduk}`
        };
    }
    async updateAsalInstansi(idTeam:number,idUser:number,namaBaru:string){

        const sql = `
            UPDATE isi_tim 
            SET asal_instansi = ? 
            WHERE id = ? and tim_id = ?
        `
        
        const result = await db.query(sql, [namaBaru,idUser,idTeam])
        if (result.affectedRows !== 1) {
            return {
                success: false,
                error: `Unable to change that data?`
            };
        }
        return {
            success: true,
            message: `Successfully changed asal_instansi to ${namaBaru}`
        };
    }
    async updateNama_lengkap(idTeam:number,idUser:number,namaBaru:string){
        const sql = `
            UPDATE isi_tim 
            SET nama_lengkap = ? 
            WHERE id = ? and tim_id = ?
        `
        
        const result = await db.query(sql, [namaBaru,idUser,idTeam])
        if (result.affectedRows !== 1) {
            return {
                success: false,
                error: `Unable to change that data?`
            };
        }
        return {
            success: true,
            message: `Successfully changed nama_lengkap to ${namaBaru}`
        };
    }
    async deleteTeam(IdTeam: number) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            await conn.query(`DELETE from user_tim where tim_id = ?`, [IdTeam]);
            await conn.query(`DELETE FROM isi_tim WHERE tim_id = ?`, [IdTeam]);
            await conn.query(`DELETE FROM data_proposal where id_tim =? `, [IdTeam])
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

    async bisaUpProposal(Idteam:number){
        const sql = `
            select tim_lomba 
            from tim 
            where id = ?
        `;
        let result = await db.query(sql,[Idteam])
        if (result.length == 0){
             return { success: false, message: `Unable to find??` };
        } 
        if (result[0].tim_lomba != 1) return { success: false, message: `Anda tidak perlu proposal untuk kategori tersebut?` };
        return  { success: true, message: `Valid` };
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

   async createPasswordResetToken(email:string, token:string) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const dikecilinWOk = email.toLowerCase();
            const rows = await conn.query(
                `SELECT COUNT(*) as jumlah FROM user WHERE email = ? FOR UPDATE`,
                [dikecilinWOk]
            );

            if (rows[0].jumlah == 0) {
                await conn.rollback();
                return { success: false, message: `gak nemu jir` };
            }

            const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
            const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

            await conn.query(
                `INSERT INTO changepass_dummy (hashed_token, expires_at, email)
                VALUES (?, ?, ?)`,
                [hashedToken, expiresAt, dikecilinWOk]
            );

            await conn.commit();
            return { success: true, message: `Password reset token created` };
        } catch (e) {
            await conn.rollback();
            throw e;
        } finally {
            conn.release();
        }
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

    // Kirim ulang link verifikasi email. Menyasar baris dummy_user TERBARU untuk
    // email tsb (bisa ada lebih dari satu kalau user daftar berkali-kali sebelum
    // verifikasi), lalu men-generate token baru + reset `date_register` supaya
    // window kedaluwarsa 1 jam di cek_dummy_user() ikut ke-reset juga.
    async resendVerificationToken(email: string, newToken: string) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const rows = await conn.query(
                `SELECT id FROM dummy_user WHERE email = ? ORDER BY date_register DESC LIMIT 1 FOR UPDATE`,
                [email]
            );

            if (rows.length === 0) {
                await conn.rollback();
                // Tidak ada pendaftaran pending untuk email ini (mungkin sudah
                // terverifikasi, atau memang belum pernah daftar). Caller HARUS
                // tetap balas pesan generik ke client (anti email-enumeration).
                return { success: false, message: `Tidak ada pendaftaran pending untuk email ini` };
            }

            const result = await conn.query(
                `UPDATE dummy_user SET token_verifikasi = ?, date_register = NOW() WHERE id = ?`,
                [newToken, rows[0].id]
            );
            if (result.affectedRows !== 1) {
                await conn.rollback();
                return { success: false, message: `Somehow it did not affect anything huh..?` };
            }

            await conn.commit();
            return { success: true, message: `Verification token resent` };
        } catch (e) {
            await conn.rollback();
            console.error(e);
            return { success: false, message: 'terjadi kesalahan, coba lagi' };
        } finally {
            conn.release();
        }
    }

    // Sama seperti resendVerificationToken, tapi baris dummy_user dicari lewat
    // token LAMA (dari link verifikasi yang sudah kedaluwarsa/invalid), bukan
    // lewat email. Dipakai buat tombol "Kirim Ulang Link Verifikasi" di halaman
    // hasil klik link verifikasi yang gagal, jadi user tidak perlu ngetik ulang
    // emailnya. Token itu sendiri unik & tidak bisa ditebak (hasil enkripsi),
    // makanya aman balas pesan yang lebih spesifik (bukan pesan generik anti-
    // enumeration kayak versi email) kalau baris token-nya memang tidak ketemu.
    async resendVerificationTokenByOldToken(oldToken: string, newToken: string) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const rows = await conn.query(
                `SELECT id, email FROM dummy_user WHERE token_verifikasi = ? FOR UPDATE`,
                [oldToken]
            );

            if (rows.length === 0) {
                await conn.rollback();
                return { success: false, message: `Link verifikasi ini sudah tidak berlaku. Silakan daftar ulang atau minta link lewat email.` };
            }

            const result = await conn.query(
                `UPDATE dummy_user SET token_verifikasi = ?, date_register = NOW() WHERE id = ?`,
                [newToken, rows[0].id]
            );
            if (result.affectedRows !== 1) {
                await conn.rollback();
                return { success: false, message: `Somehow it did not affect anything huh..?` };
            }

            await conn.commit();
            return { success: true, email: rows[0].email, message: `Verification token resent` };
        } catch (e) {
            await conn.rollback();
            console.error(e);
            return { success: false, message: 'terjadi kesalahan, coba lagi' };
        } finally {
            conn.release();
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
        console.log(userId)
        return result;
       
    }
    async reset_password(new_password: string, token: string) {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();

            const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

            const rows = await conn.query(
                `SELECT expires_at, email, used
                FROM changepass_dummy
                WHERE hashed_token = ?
                FOR UPDATE`,
                [hashedToken]
            );

            if (rows.length === 0) {
                await conn.rollback();
                return {
                    success: false,
                    error: "Something went wrong. Maybe your token has expired?"
                };
            }

            const data = rows[0];

            if (new Date(data.expires_at) < new Date() || data.used !== 0) {
                await conn.rollback();
                return {
                    success: false,
                    error: "Something went wrong. Maybe your token has expired?"
                };
            }

            const hashedPassword = await Bun.password.hash(new_password, {
                algorithm: "bcrypt",
                cost: 10,
            });

            const updateUser = await conn.query(
                `UPDATE user SET password = ? WHERE email = ?`,
                [hashedPassword, data.email]
            );

            if (updateUser.affectedRows !== 1) {
                await conn.rollback();
                return {
                    success: false,
                    error: "Internal server error."
                };
            }

            const updateToken = await conn.query(
                `UPDATE changepass_dummy SET used = 1 WHERE hashed_token = ?`,
                [hashedToken]
            );

            if (updateToken.affectedRows !== 1) {
                await conn.rollback();
                return {
                    success: false,
                    error: "Internal server error."
                };
            }

            await conn.commit();

            return {
                success: true,
                message: "Password has been reset successfully."
            };

        } catch (e) {
            await conn.rollback();
            console.error("Gagal reset_password:", e);

            return {
                success: false,
                error: "Internal server error."
            };
        } finally {
            conn.release();
        }
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