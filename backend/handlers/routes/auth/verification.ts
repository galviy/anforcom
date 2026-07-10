import {TeamRepository} from "../../../DB/repositories"
import path from 'path';

const authRepo = new TeamRepository()
let folder_upload = path.join(import.meta.dir, "../../../../data_ktm");


export async function handler(req: Request, json?: any): Promise<Response> {
 
  if (req.method != 'GET')  return new Response(null, {status:404});
  let url = new URL(req.url);
  const token = url.searchParams.get("token");
  if(!token) return new Response(null, {status:404});


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

