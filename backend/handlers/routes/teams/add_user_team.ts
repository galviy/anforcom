// routes/user/index.ts
import { encryptCookie,parseCookie, decryptCookie } from '../../cookies'
import {TeamRepository} from "../../../DB/repositories"

const authRepo = new TeamRepository()


const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const allowedExtensions = new Set([
  "jpg", 
  "jpeg", 
  "png",
  "webp"
]);

let folder_upload = "../../../../data_ktm";


export async function handler(req: Request): Promise<Response> {
  console.log("masuk ke dalam /api/teams/add_user_team")
 
  const cookieHeader = req.headers.get('cookie')
   
  
   if (req.method != 'POST')  return new Response(null, {status:404});
   

  if (!cookieHeader) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }


  const raw = parseCookie(cookieHeader)?.session
  if (!raw) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  let decrypted = await decryptCookie(raw)

  if (!decrypted) {
    return Response.json({ success: false, error: "Session tidak valid" }, { status: 401 })
  }

  try {
    let json = JSON.parse(decrypted);

    if (!json) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
    if (!json.userId) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
    if (Math.floor(Date.now() / 1000) > json.valid_until) return Response.json({ success: false, error: "inactived session" }, { status: 401 })
  
    const formdata = await req.formData(); 
    if (!formdata.get("nama_lengkap") || !formdata.get("asal_instansi") || !formdata.get("tim_id") || !formdata.get("nomor_induk") || !formdata.get("data_photo")) {
       return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
    }

    const photo = formdata.get("data_photo") as File;
    if (!photo || !(photo instanceof File)) {
      return Response.json({ success: false, error: "File tidak ditemukan" }, { status: 400 });
    }

    const ext = photo.name.split('.').pop()?.toLowerCase() ?? '';
    
    if (!allowedTypes.has(photo.type) || !allowedExtensions.has(ext)) {
      return Response.json({ success: false, error: "Tipe file tidak didukung" }, { status: 400 });
    }
    if (photo instanceof File) {
      let nama_lengkap = formdata.get("nama_lengkap");
      let asal_instansi = formdata.get("asal_instansi");
      let tim_id = Number(formdata.get("tim_id"));
      let nomor_induk = formdata.get("nomor_induk");
      let ukuran_foto = photo.size / (1000 * 1000);

      if (typeof nama_lengkap !== "string" || typeof asal_instansi !== "string" || typeof nomor_induk !== "string") {
        return Response.json({ success: false, error: "Missing or invalid form fields" }, { status: 400 });
      }

      let result = await authRepo.timIdCheck(json.userId, Number(tim_id));
      if (result.length == 0) return Response.json({ success: false, error: "hayo pentester kah bang??" }, { status: 403 });

      console.log(`nama_lengkap: ${nama_lengkap}\nasal_instansi: ${asal_instansi}\ntim_id: ${tim_id}\nnomor_induk: ${nomor_induk}\nukuran_foto: ${ukuran_foto} MB\nnama_foto: ${photo.name}`);
      
      if (ukuran_foto >= 10) return Response.json({ success: false, error: `Size file is way too big ${ukuran_foto}` });
      
      let nama_file = `${crypto.randomUUID()}.${ext}`;

      let up_data = await authRepo.upload_ktm(nama_lengkap, asal_instansi, json.userId, tim_id, nomor_induk, photo,nama_file);
      if (up_data.success) {
         
         return Response.json({ success: true, message: `Uploaded ${photo.name} with size of ${ukuran_foto}`, nama_file: `${nama_file}` }, { status: 200 });
      }
      return Response.json({ up_data }, { status: 403 })
    }
    return Response.json({ success: false }, { status: 403 })
   

  } catch(e){
    console.error(e)
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
  
}

