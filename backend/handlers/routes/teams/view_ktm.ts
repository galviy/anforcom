// routes/user/index.ts
import { decryptCookie,parseCookie } from '../../cookies'
import {TeamRepository} from "../../../DB/repositories"
import path from 'path';

const authRepo = new TeamRepository()
let folder_upload = path.join(import.meta.dir, "../../../../data_ktm");


export async function handler(req: Request): Promise<Response> {
  const cookieHeader = req.headers.get('cookie')
  
   if (req.method != 'GET')  return new Response(null, {status:404});

  if (!cookieHeader) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const raw = parseCookie(cookieHeader)?.session
  if (!raw) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }
  let url = new URL(req.url);
  const filename = url.searchParams.get("id");
  if(!filename) return new Response(null, {status:404});

  let decrypted = await decryptCookie(raw)

  if (!decrypted) {
    return Response.json({ success: false, error: "Session tidak valid" }, { status: 401 })
  }

  try {

    let json = JSON.parse(decrypted);
    if (!json) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
    if (!json.userId) return Response.json({ success: false, error: "Invalid data struct??" }, { status: 401 })
    if (Math.floor(Date.now() / 1000) > json.valid_until) return Response.json({ success: false, error: "inactived session" }, { status: 401 })
    let validasi = await authRepo.check_file_sesuai(json.userId,filename);
    if (!validasi.success){
         return Response.json({  validasi }, { status: 404 }) 
    }
   
    const file = Bun.file(folder_upload + `/${filename}`);
    console.log(file)
      const fileExists = await file.exists();
      console.log(fileExists)
      if (!fileExists) {
        return new Response("Internal corruption??", { status: 505 });
      }

      return new Response(file);


  } catch(e){
    console.error(e)
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
  
}

