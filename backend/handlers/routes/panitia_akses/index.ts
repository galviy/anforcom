// routes/panitia/file.ts
import { administrator } from "../../../DB/admin_repositories";
import path from 'path';
const adminRepo = new administrator();

export async function handler(req: Request): Promise<Response> {
    if (req.method != 'GET') return new Response(null, { status: 404 });

    const url = new URL(req.url);
    const tim_id = Number(url.searchParams.get('tim_id'));
    const file_type = url.searchParams.get('file_type');

    if (!tim_id || !file_type) {
        return Response.json({ success: false, error: "Invalid data struct??" }, { status: 400 });
    }

    switch (file_type) {
        case "proposal": {
            const cari = await adminRepo.show_data_proposal_tim(tim_id);
            const data = cari[0];
            if (!data || !data.nama_proposal || data.nama_proposal === 'Belum Upload') {
                return Response.json({ success: false, error: "User belum upload proposal??" }, { status: 404 });
            }
            const filepath = path.join(import.meta.dir,"../../../../data_proposal/");
            const nama_file = Bun.file(filepath + `/${data.nama_proposal}`);
            const fileExists = await nama_file.exists();
            if (!fileExists) {
                return new Response("Internal corruption??", { status: 500 });
            }
           return new Response(nama_file);
        }

        case "pembayaran": {
            const cari = await adminRepo.show_data_pembayaran_tim(tim_id);
            const data = cari[0];
            
            if (!data || !data.foto_qris || data.foto_qris === 'Belum Upload') {
                return Response.json({ success: false, error: "User blm upload file pembayaran??" }, { status: 404 });
            }
            const filepath = path.join(import.meta.dir,"../../../../data_pembayaran/");
            const nama_file = Bun.file(filepath + `/${data.foto_qris}`);
            const fileExists = await nama_file.exists();
            if (!fileExists) {
                return new Response("Internal corruption??", { status: 500 });
            }
           return new Response(nama_file);
        }

        case "pernyataan": {
            const cari = await adminRepo.show_data_pernyataan_tim(tim_id);
            const data = cari[0];
            if (!data || !data.foto_pernyataan || data.foto_pernyataan === 'Belum Upload') {
                return Response.json({ success: false, error: "User blm upload surat pernyataan??" }, { status: 404 });
            }
            const filepath = path.join(import.meta.dir, "../../../../data_pernyataan/");
            const file = Bun.file(filepath + `/${data.foto_pernyataan}`);
            if (!(await file.exists())) {
                return Response.json({ success: false, message: "Tidak ketemu??" }, { status: 404 });
            }
            return new Response(file);
        }

        default: {
            return Response.json({ success: false, error: "unavailable file_type??" }, { status: 401 });
        }
    }
}