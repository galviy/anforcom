import {TeamRepository} from "../../../../DB/repositories"
import path from 'path';


const authRepo = new TeamRepository()
let folder_upload = path.join(import.meta.dir, "../../../../../data_pembayaran");


export async function handler(req: Request, json?: any): Promise<Response> {
 
  if (req.method != 'GET')  return new Response(null, {status:404});
  let url = new URL(req.url);
  const filename = url.searchParams.get("id");
  if(!filename) return new Response(null, {status:404});

  if(filename.length > 250) return Response.json({ success: false, error: "Gk kepanjangan itu broo" }, { status: 401 })
  
  let validasi = await authRepo.check_file_pembayaran_sesuai(json.userId,filename);
  if (!validasi.success){
    return Response.json(validasi , { status: 404 }) 
  }
  
  const file = Bun.file(folder_upload + `/${filename}`);
  const fileExists = await file.exists();
  if (!fileExists) {
    return new Response("Internal corruption??", { status: 500 });
  }
  return new Response(file);
}

