import {db} from './connect'
import path from 'path'; 
import crypto from "node:crypto";
import { unlink } from 'node:fs/promises';


export class administrator{
    async cek_all_tim(){
        const cek_tim = await db.query(`
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
    }

    async cek_bukti(){
        const cek_buktiwoy= await db.query(`
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
            
        `)
    }

    async cek_data_tim(user_id:number){
        const sql = await db.query(`
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
        `,[user_id])
    }

    async show_data_proposal(){
        const sql = await db.query(`
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
        `)
    }

    async show_bukti_pembayaran(){
        const sql = await db.query(`
            SELECT 
                t.id AS tim_id,
                t.nama_tim,
                l.nama_lomba AS tipe_lomba,
                COALESCE(dpb.foto_qris, 'Belum Upload') AS foto_bukti_pembayaran
            FROM tim t
            JOIN lomba l ON t.tim_lomba = l.id
            LEFT JOIN data_pembayaran dpb ON dpb.id_tim = t.id
            ORDER BY l.nama_lomba, t.nama_tim;
        `)
    }
    async show_surat_pernyataan(){
        const sql = await db.query(`
            SELECT 
                t.id AS tim_id,
                t.nama_tim,
                l.nama_lomba AS tipe_lomba,
                COALESCE(dpr.foto_pernyataan, 'Belum Upload') AS foto_surat_pernyataan
            FROM tim t
            JOIN lomba l ON t.tim_lomba = l.id
            LEFT JOIN data_pernyataan dpr ON dpr.id_tim = t.id
            ORDER BY l.nama_lomba, t.nama_tim;
        `)
    }
    
}

