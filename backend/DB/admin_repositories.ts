import {db} from './connect'

export class administrator{
    async cek_all_tim(){
        const rows = await db.query(`
           SELECT t.id AS tim_id, t.nama_tim,l.nama_lomba,
                CASE 
                    WHEN l.id IN (1, 3) THEN 'SMA/Sarjana'
                    WHEN l.id = 2 THEN 'SMA/Sederajat'
                    ELSE 'Lainnya'
                END AS kategori,
                CASE 
                    WHEN t.isVerified = 1 THEN 'Sudah'
                    ELSE 'Belum'
                END AS status_verifikasi,
                u.username,
                u.email,
                u.no_tlp,
                CASE 
                    WHEN l.id = 2 THEN '-'
                    WHEN dp.id IS NOT NULL THEN 'Sudah Upload'
                    ELSE 'Belum Upload'
                END AS status_proposal,
                CASE WHEN dpb.id IS NOT NULL THEN 'Sudah Upload' ELSE 'Belum Upload' END AS status_pembayaran,
                CASE WHEN dpr.id IS NOT NULL THEN 'Sudah Upload' ELSE 'Belum Upload' END AS status_pernyataan
            FROM tim t
            JOIN lomba l ON t.tim_lomba = l.id
            JOIN user_tim ut ON ut.tim_id = t.id
            JOIN user u ON u.id = ut.user_id
            LEFT JOIN data_proposal dp ON dp.id_tim = t.id
            LEFT JOIN data_pembayaran dpb ON dpb.id_tim = t.id
            LEFT JOIN data_pernyataan dpr ON dpr.id_tim = t.id
            ORDER BY l.nama_lomba, t.nama_tim;
        `);
        return rows;
    }

    async verify_team(timId:number){
        const rows = await db.query(`
            update 
            from tim 
            set isVerified = 1;
            where id = ?
        `, [timId])
        return rows;
    }

    async cek_bukti(){
        const rows = await db.query(`
            SELECT 
                t.id AS tim_id,
                t.nama_tim,
                l.nama_lomba AS tipe_lomba,
                CASE 
                    WHEN l.id = 2 THEN 'Tidak Wajib'
                    WHEN dp.data_proposal IS NOT NULL THEN dp.data_proposal
                    ELSE '-'
                END AS nama_proposal,
                COALESCE(dpb.foto_qris, '-') AS nama_bukti_pembayaran,
                COALESCE(dpr.foto_pernyataan, '-') AS nama_surat_pernyataan
            FROM tim t
            JOIN lomba l ON t.tim_lomba = l.id
            LEFT JOIN data_proposal dp ON dp.id_tim = t.id
            LEFT JOIN data_pembayaran dpb ON dpb.id_tim = t.id
            LEFT JOIN data_pernyataan dpr ON dpr.id_tim = t.id
            ORDER BY l.nama_lomba, t.nama_tim;
        `);
        return rows;
    }

    async cek_data_tim(tim_id:number){
        const rows = await db.query(`
            SELECT 
                t.id AS tim_id,
                t.nama_tim,
                l.nama_lomba AS tipe_lomba,
                CASE 
                    WHEN t.isVerified = 1 THEN 'Sudah'
                    ELSE 'Belum'
                END AS status_verifikasi,
                it.nama_lengkap,
                it.asal_instansi,
                it.nomor_induk,
                it.data_image AS foto_anggota,
                COALESCE(dpb.foto_qris, '-') AS foto_bukti_pembayaran,
                COALESCE(dpr.foto_pernyataan, '-') AS foto_surat_pernyataan
            FROM tim t
            JOIN lomba l ON t.tim_lomba = l.id
            LEFT JOIN isi_tim it ON it.tim_id = t.id
            LEFT JOIN data_pembayaran dpb ON dpb.id_tim = t.id
            LEFT JOIN data_pernyataan dpr ON dpr.id_tim = t.id
            WHERE t.id = ?
            ORDER BY it.nama_lengkap;    
        `,[tim_id]);
        return rows;
    }

    async show_data_proposal(){
        const rows = await db.query(`
            SELECT 
                t.id AS tim_id,
                t.nama_tim,
                l.nama_lomba AS tipe_lomba,
                COALESCE(dp.data_proposal, 'Belum Upload') AS nama_proposal
            FROM tim t
            JOIN lomba l ON t.tim_lomba = l.id
            LEFT JOIN data_proposal dp ON dp.id_tim = t.id
            WHERE l.id IN (1, 3)
            ORDER BY l.nama_lomba, t.nama_tim;
        `);
        return rows; 
    }

   async show_data_proposal_tim(id: number) {
    const rows = await db.query(`
            SELECT 
                t.id AS tim_id,
                t.nama_tim,
                l.nama_lomba AS tipe_lomba,
                COALESCE(dp.data_proposal, 'Belum Upload') AS nama_proposal
            FROM tim t
            JOIN lomba l ON t.tim_lomba = l.id
            LEFT JOIN data_proposal dp ON dp.id_tim = t.id
            WHERE l.id IN (1, 3) AND t.id = ?
            ORDER BY l.nama_lomba, t.nama_tim;
        `, [id]);
        return rows;
    }
    async show_data_pembayaran_tim(id: number) {
        const rows = await db.query(`
            SELECT 
                t.id AS tim_id,
                t.nama_tim,
                COALESCE(dpb.foto_qris, 'Belum Upload') AS foto_qris
            FROM tim t
            LEFT JOIN data_pembayaran dpb ON dpb.id_tim = t.id
            WHERE t.id = ?;
        `, [id]);
        return rows;
    }

    async show_data_pernyataan_tim(id: number) {
        const rows = await db.query(`
            SELECT 
                t.id AS tim_id,
                t.nama_tim,
                COALESCE(dpr.foto_pernyataan, 'Belum Upload') AS foto_pernyataan
            FROM tim t
            LEFT JOIN data_pernyataan dpr ON dpr.id_tim = t.id
            WHERE t.id = ?;
        `, [id]);
        return rows;
    }


    async show_bukti_pembayaran(){
        const rows = await db.query(`
            SELECT 
                t.id AS tim_id,
                t.nama_tim,
                l.nama_lomba AS tipe_lomba,
                COALESCE(dpb.foto_qris, 'Belum Upload') AS foto_bukti_pembayaran
            FROM tim t
            JOIN lomba l ON t.tim_lomba = l.id
            LEFT JOIN data_pembayaran dpb ON dpb.id_tim = t.id
            ORDER BY l.nama_lomba, t.nama_tim;
        `);
        return rows;
    }

    async show_surat_pernyataan(){
        const rows = await db.query(`
            SELECT 
                t.id AS tim_id,
                t.nama_tim,
                l.nama_lomba AS tipe_lomba,
                COALESCE(dpr.foto_pernyataan, 'Belum Upload') AS foto_surat_pernyataan
            FROM tim t
            JOIN lomba l ON t.tim_lomba = l.id
            LEFT JOIN data_pernyataan dpr ON dpr.id_tim = t.id
            ORDER BY l.nama_lomba, t.nama_tim;
        `);
        return rows;
    }

    async show_ktm(tim_id:string,nomor_induk:string){
        const rows = await db.query(`
             select data_image from isi_tim where tim_id = ? and nomor_induk = ?;
        `,[tim_id,nomor_induk])
        return rows
    }

    async show_pesebaran(){
        const rows = await db.query(`
            SELECT
                it.asal_instansi,
                l.nama_lomba,
                COUNT(DISTINCT t.id) AS total_tim,
                COUNT(*) AS total_peserta,
                COUNT(DISTINCT CASE WHEN t.isVerified = 1 THEN t.id END) AS tim_terverifikasi,
                COUNT(DISTINCT CASE WHEN t.isVerified = 0 THEN t.id END) AS tim_belum_terverifikasi
            FROM tim t
            JOIN isi_tim it
                ON t.id = it.tim_id
            JOIN lomba l
                ON l.id = t.tim_lomba
            GROUP BY
                it.asal_instansi,
                l.id,
                l.nama_lomba
            ORDER BY
                it.asal_instansi,
                l.nama_lomba;
        `)
        return rows;
    }
}