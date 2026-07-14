import {TeamRepository} from "../../../DB/repositories"
import path from 'path';
import { decryptCookie } from '../../cookies'

const authRepo = new TeamRepository()
let folder_upload = path.join(import.meta.dir, "../../../../data_ktm");


export async function handler(req: Request, json?: any): Promise<Response> {
 
  if (req.method != 'GET')  return new Response(null, {status:404});
  let url = new URL(req.url);
  const token = url.searchParams.get("token");
  if(!token) return new Response(null, {status:404});

  /*
    Anti spam database, token hanya valid 1 jam :)
  */
  if (token.length > 255)  return Response.json({ success: false, error: "Gak kepanjangan tuh bro?" }, { status: 400 })
  let decrypted = await decryptCookie(token)
  if (!decrypted) {
    return Response.json({ success: false, error: "Invalid token ??" }, { status: 401 })
  }
  let hasil = JSON.parse(decrypted);
  if(!hasil.valid_until) return Response.json({ success: false, error: "Invalid token ??" }, { status: 401 })
  if (Math.floor(Date.now() / 1000) > hasil.valid_until){
    return Response.json({ success: false, error: "Expired token??" }, { status: 401 })
  }
  

  try {    
    let validasi = await authRepo.cek_dummy_user(token);
    if (!validasi.success){
         return Response.json({  validasi }, { status: 403 }) 
    }
    return Response.json({  validasi }, { status: 200 }) 

  } catch(e){
    console.error(e)
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
  
}

